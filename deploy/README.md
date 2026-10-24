# VPS deployment

Target VPS: **76.13.185.120**. Run these commands on a Linux VPS from the uploaded repository root.

The current automated Docker + Nginx pipeline is documented in [CI_CD.md](CI_CD.md). This file retains the earlier manual Caddy deployment reference.

For the current move between VPS servers, start with [MIGRATION.md](MIGRATION.md). The destination can use a new proxy while retaining the existing Atlas database.

## Existing live website and database (current installation)

This is an update to an already live installation. Preserve its database, credentials, uploads, proxy and DNS settings. The generated local root .env is a fresh-install template, not a verified copy of the VPS environment.

The local backend/.env contains an Atlas connection. Verify it matches the live backend, then carry the exact live MONGODB_URI (including database name/query options), JWT_SECRET and provider credentials into the root .env privately. Do not generate replacement production secrets during this update. Retaining the signing key preserves compatible JWT sessions; production validation still rejects development/example secrets.

Before running an update, inspect the current VPS Compose project/process manager, reverse proxy, upload mount, AI content storage and backup process. Retain the existing project name and media locations. In particular, this stack mounts backend/uploads and the ai_data volume; reconcile these with the live mounts or migrate the files before switching containers. If the current server uses PM2/Nginx, plan that transition before starting Caddy. Do not run this stack against occupied ports or duplicate service aliases.

Take a backup/snapshot using the existing database's backup process. For Atlas, use an Atlas snapshot or database export. deploy/backup.sh is for the fresh managed-MongoDB stack only.

After matching the live environment and storage, use Docker Compose **2.24.4+** and one of:

```bash
# Existing database + existing shared Caddy (only after verifying its network/routes):
bash deploy/server-deploy.sh existing-shared
# Existing database + project-managed Caddy (only when its ports are available):
bash deploy/server-deploy.sh existing
```

These modes require an explicit MONGODB_URI, disable the new MongoDB service, and disable startup seed data and bootstrap admin creation. The deployment script requires an explicit mode and stops validation when the existing connection is missing. Existing credentials are checked against the existing user records; no admin reset is performed.

The standalone/shared modes documented below are for an intentional fresh managed-database installation. Do not use them for this live database update.

## Domain mapping and DNS

Create these **A records** at your DNS provider:

| DNS name | IPv4 address | Service |
| --- | --- | --- |
| @ | 76.13.185.120 | Public website: apps/business-experts |
| admin | 76.13.185.120 | Admin: apps/admin |
| analytics | 76.13.185.120 | BusinessAI: apps/business-ai |
| api | 76.13.185.120 | Unified Express backend |

Remove conflicting A records for these hosts. Only keep AAAA records if IPv6 also reaches this VPS.
For initial setup, use DNS-only records if your DNS provider offers a proxy.
There is no www host in the default configuration; add a DNS record and a Caddy redirect if you want it.

Caddy terminates HTTPS and routes /api and /ai-api requests from every frontend to the unified backend on port 5000. It preserves the path prefixes. Frontend calls use their own origin; api.businessexperts.asia also serves the backend directly. React navigation supports page refreshes through Nginx SPA fallback.

## VPS prerequisites

Install Docker Engine, Docker Compose plugin **2.20+** (Compose 5 is also supported), and curl.
Official Ubuntu installation: https://docs.docker.com/engine/install/ubuntu/

Allow inbound TCP 80 and 443 in the VPS firewall/provider panel; UDP 443 is optional for HTTP/3.
Keep your existing SSH port allowed. Only Caddy publishes ports; MongoDB, Node and frontend Nginx containers are private.
For standalone mode, TCP 80 and 443 must be available. Check existing listeners before choosing the mode:

```bash
sudo ss -ltnp | grep -E ':(80|443)\b' || true
docker ps --format 'table {{.Names}}\t{{.Ports}}'
```

The VPS needs no system Node or npm. Builds use Node 24 in Docker.

## Fresh installation reference: 1. Upload source

Upload this repository to, for example, /var/www/Business_Experts.
Include apps/, backend/ (including public/ and any existing uploads/), deploy/, package.json, compose files and all four package-lock.json files.

Do not upload node_modules, dist, .git, .npm-cache or .deployment-tools. Generate the root production .env on the VPS. The local backend/.env is used only for development and is excluded from the Docker image.

If you already have production MongoDB data, back it up first and either migrate it or configure MONGODB_URI for the existing database. The default stack starts a new database; it does not import old data automatically.

## 2. Prepare production secrets

```bash
cd /var/www/Business_Experts
docker run --rm --network none --user "$(id -u):$(id -g)" \
  -v "$PWD:/workspace" -w /workspace node:24-alpine node deploy/init-env.mjs
nano .env
chmod 600 .env
```

The helper creates .env with random JWT, MongoDB and admin passwords, and preserves an existing .env.
Review ADMIN_EMAIL and ADMIN_PASSWORD privately. The initial admin account uses these values.
Passwords must be 16 to 72 bytes; generated passwords satisfy this. MONGO_ROOT_PASSWORD must be 32 to 72 URL-safe characters.

Configure **GMAIL_USER and GMAIL_APP_PASSWORD** to deliver OTP emails for public enquiry forms. Without them, email verification fails explicitly in production; verification codes are never returned in API responses or logged.
GEMINI_API_KEY is optional; without it the existing built-in mentor fallback runs.
Cloudinary is optional; otherwise uploads are written to backend/uploads.
SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD are optional; supply both if you need the BusinessAI super administrator panel.

Existing admin passwords are preserved: changing ADMIN_PASSWORD in .env does not reset an existing database account. Use a new database only for an intentional fresh installation.
Do not change MONGO_ROOT_PASSWORD on an initialized volume without also changing the MongoDB user's password.
Changing JWT_SECRET invalidates all existing login sessions.

## 3A. Standalone deployment

Use this when this project will manage ports 80 and 443:

```bash
bash deploy/server-deploy.sh standalone
```

This builds the backend and all three frontends, starts authenticated MongoDB, checks readiness, starts Caddy, validates its configuration, reloads routing and verifies all four domains using HTTPS.
DNS must already point to this VPS for certificate issuance. Caddy stores certificate state in persistent volumes.
If DNS/certificates are still propagating, fix DNS and rerun the same command.

## 3B. Existing shared Caddy deployment

The repository previously referenced giftme-caddy-1 on giftme_app. If that proxy still handles this VPS, use this mode to share it.

1. Confirm the shared network name (default giftme_app); set EDGE_NETWORK_NAME in .env only if it differs.
2. Replace the old Business Experts site blocks in the shared Caddyfile with the blocks from deploy/Caddyfile.business-experts, or mount that file and import it. Avoid duplicate definitions for these hosts.
3. Ensure the existing Caddy container is connected to that network.
4. Validate and reload the **existing** proxy after adding these routes (use its actual Caddyfile path).

For the previously used proxy and default config path:

```bash
docker network inspect giftme_app >/dev/null
# After editing/mounting the shared proxy's Caddyfile:
docker exec giftme-caddy-1 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec giftme-caddy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
bash deploy/server-deploy.sh shared
```

Shared mode starts five app/database containers and leaves TLS/ports to the existing proxy. Do not start standalone mode while the shared proxy owns ports 80/443.

When migrating an older Business Experts Compose project, check its project name and volume locations first. Set COMPOSE_PROJECT_NAME in .env to reuse its project name where appropriate, or stop only that old app stack before starting this one. Two stacks must not advertise the same be-backend/be-frontend/be-admin aliases on the shared network. Reusing a project name does not automatically migrate differently named database volumes; back up and restore the intended data explicitly. Keep the shared Caddy and unrelated applications running.

## Verification and updates

Successful deployment serves:

- https://businessexperts.asia
- https://admin.businessexperts.asia
- https://analytics.businessexperts.asia
- https://api.businessexperts.asia/api/health

The readiness endpoint must return HTTP 200 with database connected. /health is process liveness only.
The deployment script also checks public CMS data and BusinessAI API paths.
Use the same deployment mode on every update; do not switch modes on an existing stack without planning the proxy/network change.

```bash
# Upload/pull the new source, then:
bash deploy/server-deploy.sh standalone
docker compose --profile standalone ps
docker compose --profile standalone logs --tail=100 be-backend be-caddy
```

For shared mode, replace the Compose prefix with:
`docker compose -f docker-compose.yml -f docker-compose.shared.yml`.

## Backups

```bash
bash deploy/backup.sh standalone
# Or: bash deploy/backup.sh shared
```

The backup briefly stops the backend to snapshot MongoDB and uploaded files/AI content consistently, then restarts it. It saves a compressed database archive, uploads/AI-content archive and private environment file under backups/UTC_TIMESTAMP/. Copy backups to private storage outside the VPS.

MongoDB and AI CMS data use named volumes; uploads remain in backend/uploads, so existing media is preserved. Caddy certificates also use persistent volumes.
Never use docker compose down -v during a normal update: it deletes named volumes.

Restore only to the intended stack; --drop replaces the database collections in the backup:

```bash
# Set this to the backup folder you are restoring.
BACKUP_DIR=/var/www/Business_Experts/backups/UTC_TIMESTAMP
# Set the Compose command for your deployment mode.
DC=(docker compose --profile standalone)
# Shared alternative:
# DC=(docker compose -f docker-compose.yml -f docker-compose.shared.yml)

# Restore the matching private production.env to .env before bringing up a fresh stack.
# Keep backend stopped during restore.
"${DC[@]}" stop be-backend
"${DC[@]}" up -d --wait be-mongo
"${DC[@]}" exec -T be-mongo sh -c \
  'exec mongorestore --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --archive --gzip --drop' \
  < "$BACKUP_DIR/mongodb.archive.gz"
"${DC[@]}" run --rm --no-deps -T --user root --entrypoint sh be-backend -c \
  'tar -xzf - -C /app && chown -R node:node /app/uploads /app/data' \
  < "$BACKUP_DIR/files.tar.gz"
"${DC[@]}" up -d --wait
```

## Application scope

The deployed BusinessAI keeps its existing calculator, business analysis and CMS features. Some dashboards still show sample metrics/users, and the unified backend does not implement the older password-reset, email-verification-link or payment/subscription integrations. These are separate application features; they are not created by deployment configuration.

## References

- Caddy automatic HTTPS: https://caddyserver.com/docs/automatic-https
- Docker Compose health and startup ordering: https://docs.docker.com/compose/how-tos/startup-order/
