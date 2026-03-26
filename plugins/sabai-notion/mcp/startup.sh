#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..." >&2
  npm install >&2
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
  echo "Building server..." >&2
  npm run build >&2
fi

# Run the server using tsx
exec npx tsx main.ts
