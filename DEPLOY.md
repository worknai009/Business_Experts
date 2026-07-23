# Deployment — realtyxpert.online

**Fully automatic pipeline:** `git push` to `main` → GitHub Actions does EVERYTHING on the VPS:
installs Docker (first run), syncs code, writes `.env` from GitHub Secrets, builds containers,
starts/reloads all services. The shared Caddy container manages SSL and routes traffic.

| Domain | Serves |
| --- | --- |
| `realtyxpert.online` (+ `www` redirect) | Public website |
| `admin.realtyxpert.online` | Admin panel |
| `api.realtyxpert.online` | Backend API |

---

## One-time setup (only these 3 things)

### 1. DNS (at your domain registrar)

All records point to your VPS IP:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | YOUR_VPS_IP |
| A | `www` | YOUR_VPS_IP |
| A | `admin` | YOUR_VPS_IP |
| A | `api` | YOUR_VPS_IP |

DNS must be live BEFORE the first deploy, otherwise the SSL step fails
(just re-run the workflow after DNS propagates).

### 2. SSH key on the VPS (one command block)

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy    # copy this PRIVATE key for the secret below
```

### 3. GitHub Secrets (repo → Settings → Secrets and variables → Actions)

| Secret | Value |
| --- | --- |
| `VPS_HOST` | VPS IP address |
| `VPS_USER` | SSH user (e.g. `root`) |
| `VPS_SSH_KEY` | private key from step 2 (BEGIN → END, full) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | long random string (`openssl rand -hex 32`) |
| `ADMIN_EMAIL` | admin panel login email |
| `ADMIN_PASSWORD` | admin panel login password |

---

## Deploy

```powershell
git add .
git commit -m "update"
git push
```

That's it. Watch progress in GitHub → Actions (~3–5 min; first run longer).

Then check:
- https://realtyxpert.online
- https://admin.realtyxpert.online
- https://api.realtyxpert.online/api/health
- https://realtyxpert.online/api/home should return JSON, not the frontend `index.html`.

## Shared Caddy config

This project uses the shared `giftme-caddy-1` container and the external
`giftme_app` Docker network. The Caddy site blocks for these domains live outside
this repo on the VPS. Use [deploy/Caddyfile.business-experts](deploy/Caddyfile.business-experts)
as the source of truth when updating the shared Caddyfile.

## Optional: copy existing uploaded media (logo etc.) once

Uploads are kept on the server (`backend/uploads`) and are never touched by deploys.
To copy your local uploads up once:

```powershell
scp -r "c:\Worknai Projects\BusinessExperts\backend\uploads\*" root@YOUR_VPS_IP:/var/www/Business_Experts/backend/uploads/
```

## How it works

1. **Sync** — code is rsynced to `/var/www/Business_Experts` (server-only data is protected:
   `backend/uploads`, `deploy/certbot`, `.env` are never deleted).
2. **Configure** — `.env` is regenerated from GitHub Secrets on every deploy
   (to change the DB password etc., just update the secret and re-run).
3. **Run** — `deploy/server-deploy.sh` installs Docker if missing, builds images,
   starts everything via `docker-compose.yml`, and verifies both the public page
   and the public `/api/home` route.

## Troubleshooting (SSH only needed if something breaks)

```bash
cd /var/www/Business_Experts
docker compose ps                  # container status
docker compose logs -f backend     # backend logs
bash deploy/server-deploy.sh       # manual full deploy
```

## Security notes

1. **Rotate the MongoDB Atlas password** — an old `backend/.env` existed in git history.
   Update it in Atlas, then update the `MONGODB_URI` secret and re-run the workflow.
2. Keep the GitHub repo **private**.
3. In Atlas → Network Access, allow the VPS IP.
