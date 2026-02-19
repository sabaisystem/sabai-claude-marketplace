#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

TELLA_URL="https://api.tella.com/mcp"

echo "🔗 Starting Tella MCP server..." >&2
echo "If this is your first time, a browser will open for authentication." >&2

# Run the MCP server - mcp-remote handles OAuth automatically
exec npx -y mcp-remote@latest "$TELLA_URL"
