# Cloudflare-s-D1-database-DOH-forwarding-project

Disclaimer

This project is an open source project that aims to build a DNS over HTTPS (DoH) forwarding service using Cloudflare's Worker functionality.
The purpose of this project is to promote network privacy and security, and provide users with more secure and privacy-protected DNS resolution services. However, users of this project are subject to the following disclaimers:

1.This project is for technical research and personal use only, and shall not be used for any purpose that violates laws and regulations or infringes on the rights and interests of others.

2.This project uses Cloudflare's Worker functionality as infrastructure, but is not officially maintained or endorsed by Cloudflare, and Cloudflare is not responsible for any damages caused by this project.

3.the authors and contributors to this project are not responsible for any losses or problems resulting from the use of this project, including but not limited to data loss, service interruptions, network security issues, etc.

4.Any individual or organization should comply with the Internet-related laws and regulations when using this project and take full responsibility for their own actions.

5.If any person or organization uses this project to harm Cloudflare's interests or violates its terms of service, it has nothing to do with the authors and contributors of this project, and all legal responsibilities shall be borne by the perpetrators themselves.

Users are requested to read and understand the above disclaimer carefully before using this program, and if there is no objection, they are deemed to agree to and comply with all the provisions of this statement.

This project supports custom domain + /dns-query path access, uses the built-in crypto.subtle for encryption, utilizes a D1 SQL database for caching, and supports both GET and POST request methods. It allows configuration of upstream DoH servers via environment variables, is fully compatible with mainstream browsers, includes error handling and exception capture, and supports cache expiration control.

To use this Worker, you need to:

Create a new Worker in Cloudflare Workers.

Create a D1 database and run the schema to create the table.

Configure environment variables in the Worker settings:

DB: D1 database binding.

UPSTREAM_DOH: (Optional) Custom upstream DoH server address.

Before using it, you need to create the table in the D1 database:
CREATE TABLE IF NOT EXISTS dns_cache (
  query_hash TEXT PRIMARY KEY,
  response TEXT NOT NULL,
  timestamp INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_timestamp ON dns_cache(timestamp);
