#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

# Check for credentials
if [ ! -f "$SCRIPT_DIR/config/credentials.json" ]; then
  echo "WARNING: Not configured. See README for Google OAuth setup." >&2
fi

# Use bundled server (CoWork compatible, no npm install needed)
exec node dist/server.mjs
