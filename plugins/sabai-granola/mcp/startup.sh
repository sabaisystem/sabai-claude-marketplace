#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

GRANOLA_URL="https://mcp.granola.ai/mcp"

echo "🔗 Starting Granola MCP server..." >&2
echo "If this is your first time, a browser will open for authentication." >&2

# Run the MCP server - mcp-remote handles OAuth automatically
exec npx -y mcp-remote@latest "$GRANOLA_URL"
