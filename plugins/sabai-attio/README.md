# Sabai Attio

**CRM assistant with Attio integration for lead management, meeting prep, and deal tracking.**

| Field | Value |
|-------|-------|
| Type | MCP + Skills + Commands |
| Version | 1.1.0 |
| Status | Active |
| Command | `/lead`, `/meeting-prep`, `/pipeline`, `/deal`, `/log` |
| Repo | `plugins/sabai-attio` |

---

## Overview

A CRM assistant plugin with Attio integration. Manage leads, prepare for meetings, track deals, and log activities in your Attio workspace using natural language. Supports lead qualification with BANT/CHAMP frameworks, comprehensive meeting briefings, pipeline health analysis, deal progression tracking, and activity logging to contact records.

## Key Features

- Lead search, qualification, and enrichment with BANT/CHAMP frameworks
- Comprehensive meeting briefings before customer calls
- Pipeline health analysis with at-risk opportunity identification
- Deal tracking and stage progression
- Activity logging (calls, emails, notes) to contact records

## Use Cases

- "Find and qualify john@acme.com"
- "Prepare me for my meeting with Acme Corp"
- "Show me my pipeline health"
- "Advance the Acme Enterprise deal"
- "Log a call with Sarah at TechCorp"

## Commands

- `/lead [name or email]` - Search and qualify a lead
- `/meeting-prep [company or contact]` - Generate meeting briefing
- `/pipeline [options]` - Analyze pipeline health
- `/deal [action] [deal]` - Manage a specific deal
- `/log [type] [contact]` - Log activity to a contact

## MCP Tools

- `search-records` - Find people, companies, deals
- `get-records-by-ids` - Get detailed record information
- `create-note` - Log activities and notes
- `create-task` - Create follow-up tasks
- `search-notes-by-metadata` - Find recent interactions
- `search-emails-by-metadata` - Review email history
- `search-meetings` - Find scheduled meetings

## Configuration

### MCP Server Setup (Official)

```json
{
  "mcpServers": {
    "attio": {
      "type": "url",
      "url": "https://mcp.attio.com/mcp"
    }
  }
}
```

### MCP Server Setup (Community)

Alternatively, use the [kesslerio/attio-mcp-server](https://github.com/kesslerio/attio-mcp-server):

```json
{
  "mcpServers": {
    "attio": {
      "command": "npx",
      "args": ["-y", "@kesslerio/attio-mcp-server"],
      "env": {
        "ATTIO_API_KEY": "${ATTIO_API_KEY}"
      }
    }
  }
}
```

## Authentication

OAuth via Attio. When you first connect with the official MCP server, you'll be prompted to authorize access. The community server requires an API key.

## Dependencies

- **Required**: Attio account with workspace access

## Limitations

- Requires Attio subscription
- Access depends on your Attio workspace permissions

## Tips

- Use specific identifiers (email, company name) for faster searches
- Meeting prep works best when you specify the company or main contact
- Pipeline analysis can be filtered by team or time period
- Always log important calls and meetings for team visibility
- Create tasks for follow-ups immediately after calls

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-attio)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-attio/CHANGELOG.md)
- [Attio](https://attio.com)
- [Attio MCP Documentation](https://docs.attio.com/mcp/overview)
