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

# Use bundled server (CoWork compatible, no npm install needed)
exec node dist/server.cjs
