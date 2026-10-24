#!/usr/bin/env bash
set -Eeuo pipefail
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"
MODE="${1:-standalone}"
case "$MODE" in
  existing|existing-shared) echo "Existing database: use its current backup process (for Atlas, a provider snapshot/export). This fresh-stack backup script will not operate on the live database." >&2; exit 1 ;;
  standalone) COMPOSE=(docker compose --profile standalone) ;;
  shared) COMPOSE=(docker compose -f docker-compose.yml -f docker-compose.shared.yml) ;;
  *) echo "Usage: bash deploy/backup.sh [standalone|shared]" >&2; exit 1 ;;
esac
umask 077
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DEST="$PROJECT_DIR/backups/$STAMP"
mkdir -p "$DEST"
# Quiesce application writes during the database/files snapshot.
"${COMPOSE[@]}" stop be-backend
trap '"${COMPOSE[@]}" start be-backend >/dev/null' EXIT
"${COMPOSE[@]}" exec -T be-mongo sh -c \
  'exec mongodump --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin --db business_experts --archive --gzip' \
  > "$DEST/mongodb.archive.gz"
"${COMPOSE[@]}" run --rm --no-deps -T --user root --entrypoint tar be-backend \
  -czf - -C /app uploads data > "$DEST/files.tar.gz"
cp .env "$DEST/production.env"
echo "Backup saved to $DEST. Copy it to private storage outside this VPS."
