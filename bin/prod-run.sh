#!/bin/bash
set -e
cd "$(dirname "${BASH_SOURCE[0]}")/../"

docker compose -f ./docker-compose.yml up -d --build
