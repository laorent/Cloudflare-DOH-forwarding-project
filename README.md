# 🚀 Cloudflare D1 Database DoH Forwarding Project 🚀

## ⚠ Disclaimer ⚠

🔹 **This project is an open-source initiative that leverages Cloudflare's Worker functionality to build a DNS over HTTPS (DoH) forwarding service.**

🔹 **The goal is to enhance network privacy and security, providing users with more secure and privacy-protected DNS resolution services.**

📌 However, users must acknowledge the following disclaimers:

1️⃣ **This project is intended for technical research and personal use only.** It must not be used for any activities that violate laws, regulations, or infringe on the rights of others.

2️⃣ **This project uses Cloudflare's Worker functionality as infrastructure but is NOT officially maintained or endorsed by Cloudflare.** Cloudflare bears no responsibility for any damages resulting from its use.

3️⃣ **The authors and contributors disclaim liability for any losses or issues arising from this project,** including but not limited to:
   - Data loss
   - Service interruptions
   - Network security vulnerabilities

4️⃣ **Users must comply with all applicable internet-related laws and regulations** and take full responsibility for their actions.

5️⃣ **If any individual or organization misuses this project to harm Cloudflare's interests or violate its terms of service,** the authors and contributors bear no responsibility. All legal liabilities rest solely on the perpetrators.

📢 **Users should carefully read and understand this disclaimer before using the project. By proceeding, you agree to abide by all its provisions.**

📌 Remember to ⭐ Star the project on GitHub if you find it useful!
---

## 🌐 Project Features

✅ **Supports custom domain + `/dns-query` path access**  
✅ **Uses built-in `crypto.subtle` for encryption**  
✅ **Utilizes a D1 SQL database for caching**  
✅ **Supports both GET and POST request methods**  
✅ **Allows upstream DoH server configuration via environment variables**  
✅ **Fully compatible with mainstream browsers**  
✅ **Includes error handling and exception capture**  
✅ **Supports cache expiration control**

---

## 🔧 How to Deploy

### 1️⃣ **Create a new Worker in Cloudflare Workers**

### 2️⃣ **Create a D1 database and initialize the schema**

### 3️⃣ **Configure environment variables in Worker settings**

```txt
DB: D1 database binding
UPSTREAM_DOH: (Optional) Custom upstream DoH server address
```

---

## 🛠 D1 Database Table Setup

Before using the project, initialize the database with the following SQL commands:

```sql
CREATE TABLE IF NOT EXISTS dns_cache (
    query_hash TEXT PRIMARY KEY,
    response TEXT NOT NULL,
    timestamp INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_timestamp ON dns_cache(timestamp);
```

---

✅ **Now you're ready to deploy and use your own Cloudflare-powered DoH forwarding service!** 🚀

