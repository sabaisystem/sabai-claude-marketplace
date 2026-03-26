#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..." >&2
  npm install >&2
fi

# Check if dist folder exists (built assets)
if [ ! -d "dist" ] || [ ! -f "dist/mcp-app.html" ]; then
  echo "Building MCP App..." >&2
  npm run build >&2
fi

# Run the server using tsx (ESM mode - required for MCP Apps path resolution)
exec npx tsx main.ts
