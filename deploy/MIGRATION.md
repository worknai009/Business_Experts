# Move the existing website to a new VPS

Confirmed destination VPS: **76.13.185.120**.
The source code contains a MongoDB Atlas connection. If this is also the current production database, keep the exact connection and database name; only the application server and its local files need to move.

## 1. Capture the old installation

Privately retain its production environment, database snapshot/export, reverse proxy configuration and media files. Do not replace the live signing key with the random key generated locally for a fresh installation.

If the old backend runs in Docker, inspect its mounts and note the real container name:

```bash
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'
docker inspect OLD_BACKEND_CONTAINER --format '{{json .Mounts}}'
```

Transfer all current uploads into backend/uploads on the destination. If Cloudinary hosts the media, preserve the same Cloudinary credentials as well.

Export the current BusinessAI site_content.json too. Depending on the old version, it may be /app/data/site_content.json or /app/src/ai/site_content.json. Use the path actually used by the running backend, not an old source checkout. For PM2, inspect the configured working directory and the actual content/upload directories.

Keep the old VPS available during migration. Pause local file uploads and CMS edits during the final file synchronization and DNS transition to prevent changes being split across the servers.

## 2. Prepare the destination

Install Docker Engine, Compose 2.24.4+ and curl. Upload source to /var/www/Business_Experts, excluding node_modules, dist, .git, .npm-cache and .deployment-tools.

Create the root .env using the **verified old production settings**:

- Exact MONGODB_URI, including any database name and query options.
- Existing JWT_SECRET, email, Cloudinary and AI provider credentials.
- Existing administrator email as appropriate. Existing-database mode does not create/reset users.

The local root .env was generated as a fresh-install template and has not been verified against the old VPS. Do not use its random secrets as replacements for existing production values.

If reusing Atlas, add the new VPS's outbound public IP to the project's database IP access list. Keep the old server's entry during the transition. See [Atlas IP access documentation](https://www.mongodb.com/docs/atlas/security/ip-access-list/). If outbound NAT uses a different public IP, allow that actual egress IP.

Use mode **existing** on a new server where this project will own ports 80/443. Use **existing-shared** only if the destination already has a shared Caddy proxy and its network/routes have been configured. The old VPS's proxy setup does not establish what is installed on the new VPS.

## 3. Restore local media and AI content before starting the backend

Copy old uploads into /var/www/Business_Experts/backend/uploads. Copy the exported AI JSON to /var/www/Business_Experts/migration/site_content.json if the old installation had customized BusinessAI content. The migration directory is ignored by Git.

For a destination using mode existing:

```bash
cd /var/www/Business_Experts
chmod 600 .env
DC=(docker compose -f docker-compose.yml -f docker-compose.live.yml --profile standalone)
# Shared proxy alternative:
# DC=(docker compose -f docker-compose.yml -f docker-compose.shared.yml -f docker-compose.live.yml)
"${DC[@]}" config --quiet
"${DC[@]}" build be-backend
```

If an old AI content file was exported, validate and import it into the destination data volume before the backend starts:

```bash
docker run --rm --network none -v "$PWD/migration:/migration:ro" node:24-alpine \
  node -e 'const fs=require("node:fs"); const data=JSON.parse(fs.readFileSync("/migration/site_content.json","utf8")); if(!data || typeof data!=="object" || Array.isArray(data)) process.exit(1); console.log("AI content JSON is valid.")'
"${DC[@]}" run --rm --no-deps --user root \
  -v "$PWD/migration:/migration:ro" --entrypoint sh be-backend -c \
  'set -eu; if [ -e /app/data/site_content.json ]; then echo "Destination AI content already exists; reconcile it before importing." >&2; exit 1; fi; cp /migration/site_content.json /app/data/site_content.json; chown 1000:1000 /app/data/site_content.json'
```

The import refuses to overwrite an existing destination AI file. If there was no customized BusinessAI content, skip the import and the shipped AI content initializes its persistent volume on first startup.

## 4. Stage the application before changing DNS

```bash
bash deploy/server-deploy.sh existing --prepare
# Or: bash deploy/server-deploy.sh existing-shared --prepare
```

This validates configuration, builds the applications and starts only the backend and three frontend services. It checks their health and the existing database connection. It does not start the public proxy or change DNS. There is no new MongoDB service, demo seeding or administrator bootstrap in this mode.

Review the destination logs and migrated files before the switch:

```bash
"${DC[@]}" ps
"${DC[@]}" logs --tail=100 be-backend
"${DC[@]}" exec -T be-backend ls -la /app/uploads /app/data
```

## 5. Switch DNS and verify HTTPS

Point the @, admin, analytics and api A records to the new VPS. Check whether other active records, such as www or an old ai subdomain, also need to be retained or redirected before changing them.

On the new VPS, allow inbound TCP 80/443, then run:

```bash
bash deploy/server-deploy.sh existing
# Or the configured destination shared-proxy mode:
# bash deploy/server-deploy.sh existing-shared
```

The full run starts/reloads the project proxy in mode existing and verifies HTTPS and API response types on all four domains. New TLS certificates can be issued once DNS reaches the new server. Shared mode relies on the destination's existing proxy configuration.

Verify public pages and uploaded images, administrator login, BusinessAI content, content saving and email verification. Automated health checks do not replace these migration checks.

Retain the old VPS until DNS has settled and the new site has been verified. If a routing/application issue requires rollback, point the relevant DNS records back to the old VPS and reconcile any file changes. Atlas remains the same database; do not restore an older snapshot over ongoing production data as part of a routing rollback.
