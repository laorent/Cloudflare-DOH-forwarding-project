# Cloudflare-s-D1-database-DOH-forwarding-project

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
