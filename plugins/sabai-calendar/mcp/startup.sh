#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

# Check for token - warn if not authenticated
if [ ! -f "$SCRIPT_DIR/config/token.json" ]; then
  echo "WARNING: Not authenticated. Run 'cd $SCRIPT_DIR && npm run auth' to set up Calendar access." >&2
fi

# Run the bundled MCP server
exec node dist/server.cjs
