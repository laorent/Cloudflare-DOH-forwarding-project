export default {
  async fetch(request, env) {
    try {
      // 1. 基本请求验证
      if (request.method !== 'GET' && request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
      }

      const url = new URL(request.url);
      if (url.pathname !== '/dns-query') {
        return new Response('Not found', { status: 404 });
      }

      // 2. 获取DNS查询数据
      let dnsQuery;
      if (request.method === 'GET') {
        dnsQuery = url.searchParams.get('dns');
        if (!dnsQuery) {
          return new Response('Missing dns parameter', { status: 400 });
        }
      } else {
        dnsQuery = await request.arrayBuffer();
      }

      // 3. 生成缓存键
      const queryBuffer = typeof dnsQuery === 'string' 
        ? new TextEncoder().encode(dnsQuery) 
        : new Uint8Array(dnsQuery);
      const hashBuffer = await crypto.subtle.digest('SHA-256', queryBuffer);
      const cacheKey = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // 4. 检查缓存
      const cached = await env.DB
        .prepare('SELECT response, timestamp FROM dns_cache WHERE query_hash = ?')
        .bind(cacheKey)
        .first();

      const now = Math.floor(Date.now() / 1000);
      if (cached && (now - cached.timestamp) < 300) {
        return new Response(base64ToArrayBuffer(cached.response), {
          headers: {
            'Content-Type': 'application/dns-message'
          }
        });
      }

      // 5. 查询上游服务器
      const upstream = env.UPSTREAM_DOH || 'https://cloudflare-dns.com/dns-query';
      const upstreamResponse = await fetch(`${upstream}${url.search}`, {
        method: request.method,
        headers: {
          'Accept': 'application/dns-message',
          'Content-Type': 'application/dns-message'
        },
        body: request.method === 'POST' ? dnsQuery : undefined
      });

      if (!upstreamResponse.ok) {
        return new Response('Upstream server error', { status: 502 });
      }

      // 6. 获取响应并缓存
      const responseData = await upstreamResponse.arrayBuffer();
      
      await env.DB
        .prepare('INSERT OR REPLACE INTO dns_cache (query_hash, response, timestamp) VALUES (?, ?, ?)')
        .bind(cacheKey, arrayBufferToBase64(responseData), now)
        .run();

      // 7. 返回响应
      return new Response(responseData, {
        headers: {
          'Content-Type': 'application/dns-message',
          'Cache-Control': 'public, max-age=300'
        }
      });

    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal server error', { status: 500 });
    }
  }
};

// 辅助函数
function arrayBufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
