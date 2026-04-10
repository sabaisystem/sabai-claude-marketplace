#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

# Load env vars from config if exists
if [ -f "$SCRIPT_DIR/config/.env" ]; then
  set -a
  source "$SCRIPT_DIR/config/.env"
  set +a
fi

# Validate token
if [ -z "$DISCORD_TOKEN" ]; then
  echo "ERROR: DISCORD_TOKEN is not set." >&2
  exit 1
fi

# Use bundled server (CoWork compatible, no npm install needed)
exec node dist/server.cjs
