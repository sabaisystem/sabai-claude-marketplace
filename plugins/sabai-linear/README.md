# Sabai Linear

**Product Manager assistant with Linear integration for tickets, PRDs, backlog management, and reporting.**

| Field | Value |
|-------|-------|
| Type | MCP + Skills + Commands |
| Version | 1.0.0 |
| Status | Active |
| Command | `/prd`, `/ticket`, `/standup`, `/status`, `/backlog`, `/sprint` |
| Repo | `plugins/sabai-linear` |

---

## Overview

A Product Manager assistant plugin with Linear integration. Create tickets from templates, manage your backlog, generate PRDs, and much more. Supports prioritization frameworks (RICE, ICE, MoSCoW), sprint planning with capacity tracking, roadmap generation, risk assessment, daily standup summaries, weekly status reports, release notes, backlog health monitoring, and decision documentation.

## Key Features

- PRD creation with structured templates
- Ticket creation from templates (feature, bug, improvement, spike, epic)
- Backlog management and prioritization
- Sprint planning with capacity tracking
- Daily standup and weekly status report generation
- Release notes generation
- Stale ticket detection and duplicate checking
- Dependency analysis and refinement assistance
- Decision logging with ADR format

## Use Cases

- "Create a PRD for user authentication with SSO"
- "Generate my daily standup summary"
- "Show me stale tickets older than 14 days"
- "Help me prioritize these features using RICE"
- "Plan Sprint Q1-Sprint-3"

## Commands

### Creating Content
- `/prd [description]` - Create a Product Requirement Document
- `/ticket [type] [description]` - Create a ticket from template
- `/decision [title]` - Log a decision with ADR format

### Reporting
- `/standup [team] [date]` - Generate daily standup summary
- `/status [project] [period]` - Generate weekly status report
- `/release-notes [version] [since]` - Generate release notes
- `/roadmap [timeframe] [team]` - Generate roadmap summary

### Planning
- `/sprint [action] [name]` - Sprint planning/review/capacity
- `/risk [project|ticket]` - Risk assessment (multiple frameworks)

### Backlog Management
- `/backlog [options]` - View and manage backlog
- `/stale [days] [filter]` - Find stale tickets
- `/duplicate [ticket|text]` - Check for duplicates
- `/dependencies [ticket|project]` - Analyze dependencies
- `/refine [ticket|backlog]` - Refinement assistant

## Configuration

### MCP Server Setup

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

## Authentication

OAuth via Linear. On first use, you'll be prompted to authorize access to your Linear workspace. No API key needed.

## Dependencies

- **Required**: Linear account, Node.js 18+

## Limitations

- Requires Linear subscription
- Access depends on your Linear workspace permissions

## Tips

- Use `/prd` first to document features, then break down into tickets
- Run `/standup` at the start of each day
- Generate `/status` reports every Friday
- Check `/stale` tickets weekly as part of backlog hygiene
- Use `/refine` before sprint planning to ensure ticket quality
- Document important decisions with `/decision` immediately
- Set priorities based on user impact, not just urgency

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-linear)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-linear/CHANGELOG.md)
- [Linear](https://linear.app)
- [Linear MCP Documentation](https://linear.app/docs/mcp)
