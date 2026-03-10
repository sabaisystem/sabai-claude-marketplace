# Sabai Linear

**Product Manager assistant with Linear integration for tickets, PRDs, backlog management, and reporting.**

| Field | Value |
|-------|-------|
| Type | MCP + Skills + Commands |
| Version | 1.1.0 |
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

## MCP Tools

- `linear_create_issue` - Create a new issue with title, description, team, priority, labels
- `linear_get_issue` - Get full issue details by ID or identifier (e.g. SCM-123)
- `linear_search_issues` - Search issues with text query and filters
- `linear_list_issues` - List issues by team, project, state, or assignee
- `linear_update_issue` - Update issue fields (status, priority, assignee, etc.)
- `linear_get_teams` - List all teams in the workspace
- `linear_get_team` - Get team details including members, states, and labels
- `linear_list_projects` - List projects, optionally filtered by team
- `linear_get_project` - Get project details with progress and members
- `linear_update_project` - Update project name, description, or status
- `linear_get_cycles` - List cycles (sprints) for a team with progress data

## Authentication

Token-based auth using a Linear Personal API Key. No browser popup required — works in both Claude Code CLI and CoWork sandboxed environments.

### Setup

1. Go to [Linear Settings > Account > Security & Access](https://linear.app/settings/account/security)
2. Under "Personal API keys", click **New API key**
3. Give it a name (e.g. "Claude Plugin") and select permissions
4. Copy the key and set it as the `LINEAR_API_KEY` environment variable

## Dependencies

- **Required**: Linear account, Node.js 18+, `LINEAR_API_KEY` environment variable

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
