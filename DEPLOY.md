# Deployment Guide — realtyxpert.online

Architecture (single VPS, Docker Compose):

| Domain | Serves |
| --- | --- |
| `realtyxpert.online` (+ `www` redirect) | Public website (frontend) |
| `admin.realtyxpert.online` | Admin panel |
| `api.realtyxpert.online` | Backend API |

All three run behind one nginx reverse proxy with free Let's Encrypt SSL (auto-renewed).
The website and admin call the API via `/api` on their own domain (proxied internally — no CORS issues).

---

## 1. DNS setup (at your domain registrar)

Create these records, all pointing to your VPS public IP:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | YOUR_VPS_IP |
| A | `www` | YOUR_VPS_IP |
| A | `admin` | YOUR_VPS_IP |
| A | `api` | YOUR_VPS_IP |

Wait until `ping realtyxpert.online` resolves to your VPS IP before running the SSL step.

## 2. VPS one-time setup (Ubuntu 22.04/24.04)

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone the repo
sudo mkdir -p /opt/business-experts
sudo chown $USER /opt/business-experts
git clone https://github.com/punarmilan/Business_Experts.git /opt/business-experts
cd /opt/business-experts

# Create the production env file
cp .env.example .env
nano .env   # fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
```

Notes for `.env`:
- `MONGODB_URI` — your MongoDB Atlas connection string. In Atlas → Network Access, allow the VPS IP (or 0.0.0.0/0).
- `JWT_SECRET` — generate one: `openssl rand -hex 32`

## 3. Upload existing media (one time)

Uploaded images (logo etc.) live in `backend/uploads`, which is not in git.
From your Windows machine:

```powershell
scp -r "c:\Worknai Projects\BusinessExperts\backend\uploads\*" user@YOUR_VPS_IP:/opt/business-experts/backend/uploads/
```

## 4. First launch + SSL certificate

```bash
cd /opt/business-experts
docker compose build
docker compose up -d backend frontend admin
bash deploy/init-letsencrypt.sh    # issues the SSL cert for all 4 domains
docker compose up -d               # start everything
```

Check: https://realtyxpert.online , https://admin.realtyxpert.online , https://api.realtyxpert.online/api/health

## 5. CI/CD (auto-deploy on every push to main)

The workflow in `.github/workflows/deploy.yml` SSHes into the VPS, pulls the latest
code and rebuilds the containers.

On the VPS, create a deploy SSH key and allow it:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy    # copy the PRIVATE key
```

Then in GitHub → repo → Settings → Secrets and variables → Actions, add:

| Secret | Value |
| --- | --- |
| `VPS_HOST` | your VPS IP |
| `VPS_USER` | your SSH username (e.g. `root` or `ubuntu`) |
| `VPS_SSH_KEY` | the private key you copied above |

From then on: `git push` to `main` → site updates automatically in ~2–3 minutes.

## 6. Useful commands (on the VPS)

```bash
docker compose ps                  # status
docker compose logs -f backend     # backend logs
docker compose restart proxy       # reload nginx
docker compose up -d --build       # manual redeploy
```

---

## ⚠️ Security checklist (do these once)

1. **Rotate MongoDB Atlas password** — the old `backend/.env` was committed to git history,
   so the current Atlas password should be considered exposed. In Atlas → Database Access,
   edit the user and set a new password, then update `.env` on the VPS.
2. Keep the GitHub repo **private** (Settings → General → Danger Zone) if it isn't already.
3. Use a strong `JWT_SECRET` in production (not the dev default).
4. The admin panel is public at `admin.realtyxpert.online` — use a strong admin password.
