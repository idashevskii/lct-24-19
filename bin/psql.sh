#!/bin/bash
set -e
cd "$(dirname "${BASH_SOURCE[0]}")/../"

source .env

docker compose exec --env PGPASSWORD="$POSTGRES_PASSWORD" \
  postgres psql --host=postgres --dbname=$POSTGRES_DB --username=$POSTGRES_DB
