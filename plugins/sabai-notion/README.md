# Sabai Notion

**Documentation workflow plugin with Notion integration for creating, updating, and syncing documentation.**

| Field | Value |
|-------|-------|
| Type | MCP + Skills + Commands |
| Version | 1.0.0 |
| Status | Active |
| Command | `/docs`, `/publish`, `/import`, `/sync`, `/notion-search` |
| Repo | `plugins/sabai-notion` |

---

## Overview

A documentation workflow plugin with Notion integration. Create, update, and sync documentation between your codebase and Notion pages. Supports auto-generating docs from code (functions, classes, APIs), publishing markdown to Notion, importing Notion content to local files, and bidirectional sync.

## Key Features

- Generate documentation from code (functions, classes, APIs)
- Publish markdown documentation to Notion pages
- Import Notion content to local files
- Bidirectional sync between local docs and Notion
- Search pages and databases in your workspace

## Use Cases

- "Generate documentation for src/api/ and publish it to Notion"
- "Import my API docs from Notion to docs/api.md"
- "Sync my project docs to Notion"
- "Search for project documentation in Notion"

## Commands

- `/docs [file]` - Generate documentation from code
- `/publish [file]` - Publish documentation to Notion
- `/import [url]` - Import content from Notion
- `/sync [path]` - Sync docs between local and Notion
- `/notion-search [query]` - Search your Notion workspace

## MCP Tools

- `notion_search` - Search pages and databases
- `notion_get_page` - Get page content as markdown
- `notion_create_page` - Create a new page
- `notion_update_page` - Update page content
- `notion_append_content` - Append to existing page
- `notion_list_databases` - List all databases
- `notion_query_database` - Query database entries
- `generate_docs_from_code` - Generate docs from code

## Configuration

### Environment Variables

- `NOTION_API_KEY` - Your Notion integration token (required)

### MCP Server Setup

```json
{
  "mcpServers": {
    "sabai-notion": {
      "command": "bash",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp/startup.sh"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

## Authentication

Notion Integration Token required. Create one at [Notion Integrations](https://www.notion.so/my-integrations).

### Notion Setup

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the integration token
4. Share the Notion pages/databases you want to access with your integration

## Dependencies

- **Required**: Node.js 18+, Notion Integration Token

## Limitations

- Pages must be explicitly shared with your integration
- API rate limits apply per Notion guidelines

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-notion)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-notion/CHANGELOG.md)
- [Notion API Documentation](https://developers.notion.com)
