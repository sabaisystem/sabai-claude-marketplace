#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

# Check if mcp-remote auth cache exists for Granola
MCP_AUTH_DIR="$HOME/.mcp-auth"
GRANOLA_URL="https://mcp.granola.ai/mcp"

# Function to check if authenticated
check_auth() {
  # mcp-remote stores auth in ~/.mcp-auth
  # We check if there's a valid token by looking for the auth directory
  if [ -d "$MCP_AUTH_DIR" ]; then
    # Check if there are any granola-related tokens
    if ls "$MCP_AUTH_DIR"/*granola* 2>/dev/null | grep -q .; then
      return 0
    fi
  fi
  return 1
}

# If not authenticated, run the auth flow first
if ! check_auth; then
  echo "🔐 No Granola authentication found. Starting OAuth flow..." >&2
  echo "A browser window will open for you to sign in with Granola." >&2
  echo "" >&2

  # Run mcp-remote-client to trigger OAuth flow
  # This will open a browser and wait for authentication
  npx -y mcp-remote@latest mcp-remote-client "$GRANOLA_URL" --auth-timeout 300 2>&1 | head -20 >&2

  echo "" >&2
  echo "✅ Authentication complete! Starting MCP server..." >&2
fi

# Run the MCP server
exec npx -y mcp-remote@latest "$GRANOLA_URL"
