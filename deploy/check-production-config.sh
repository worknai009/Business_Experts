#!/usr/bin/env bash
set -Eeuo pipefail
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"
TEST_DIR="$(mktemp -d)"
cleanup() { rm -f "$TEST_DIR/.env" "$TEST_DIR/fullchain.pem" "$TEST_DIR/privkey.pem"; rmdir "$TEST_DIR"; }
trap cleanup EXIT
printf 'MONGODB_URI=mongodb://example.invalid/test\nJWT_SECRET=ci-placeholder-with-at-least-thirty-two-characters\n' > "$TEST_DIR/.env"
export IMAGE_PREFIX=ghcr.io/example/business_experts IMAGE_TAG=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa SHARED_DIR="$TEST_DIR"
docker compose --env-file "$TEST_DIR/.env" -f deploy/compose.production.yml config --quiet
openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj /CN=businessexperts.asia \
  -keyout "$TEST_DIR/privkey.pem" -out "$TEST_DIR/fullchain.pem" 2>/dev/null
docker run --rm --network none \
  -v "$PROJECT_DIR/deploy/nginx/production.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$PROJECT_DIR/deploy/nginx/snippets:/etc/nginx/snippets:ro" \
  -v "$TEST_DIR:/etc/letsencrypt/live/businessexperts.asia:ro" \
  nginx:stable-alpine nginx -t
docker run --rm --network none \
  -v "$PROJECT_DIR/deploy/nginx/bootstrap.conf:/etc/nginx/conf.d/default.conf:ro" \
  nginx:stable-alpine nginx -t
