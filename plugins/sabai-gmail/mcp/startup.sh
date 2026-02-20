#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

LOCKFILE="$SCRIPT_DIR/.npm-install.lock"

# Function to install dependencies with lock
install_deps() {
  # Check if another process is installing
  if [ -f "$LOCKFILE" ]; then
    # Wait for other process to finish (max 60 seconds)
    for i in {1..60}; do
      if [ ! -f "$LOCKFILE" ]; then
        break
      fi
      sleep 1
    done
    # If still locked, remove stale lock
    if [ -f "$LOCKFILE" ]; then
      rm -f "$LOCKFILE"
    fi
  fi

  # Create lock
  echo $$ > "$LOCKFILE"
  trap "rm -f $LOCKFILE" EXIT

  echo "Installing dependencies..." >&2
  rm -rf node_modules package-lock.json 2>/dev/null
  npm install --no-audit --no-fund 2>&1 | while read line; do echo "[npm] $line" >&2; done

  rm -f "$LOCKFILE"
}

# Install if node_modules doesn't exist or is incomplete
if [ ! -d "node_modules" ] || [ ! -f "node_modules/@modelcontextprotocol/sdk/dist/server/index.js" ] || [ ! -f "node_modules/googleapis/build/src/index.js" ]; then
  install_deps
fi

# Final verification
if [ ! -f "node_modules/@modelcontextprotocol/sdk/dist/server/index.js" ]; then
  echo "ERROR: Dependencies not installed correctly" >&2
  exit 1
fi

# Check for token - warn if not authenticated
if [ ! -f "$SCRIPT_DIR/config/token.json" ]; then
  echo "WARNING: Not authenticated. Run 'cd $SCRIPT_DIR && npm run auth' to set up Gmail access." >&2
fi

# Run the MCP server
exec node index.js
