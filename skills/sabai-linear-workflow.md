# Sabai Linear Workflow

This skill provides guidance for working with Linear issues in the Sabai Claude Marketplace repository.

## Setup

Linear MCP is configured in `.mcp.json` using the hosted endpoint with OAuth:

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

On first use, a browser window will open for Linear OAuth authentication.

## Ticket-First Workflow (CRITICAL)

**NEVER start working on a plugin without a Linear ticket.**

1. When asked to implement/fix/change something → check for existing ticket
2. If no ticket → create one first, show to user
3. Ask: "Is this clear? Edit / Start working / Leave for later"
4. Only start work after user approval

### Project Commands

- `/todo <plugin> <description>` - Create a ticket and optionally start working
- `/work-on <ticket-id>` - Work on an existing ticket (e.g., `/work-on SCM-27`)
- `/work-on <plugin>` - List and work on tickets for a plugin

### Ticket Links

Always show both app and browser links:
```
[Open in app](linear://sabaisystem/issue/SCM-XX) | [Open in browser](https://linear.app/sabaisystem/issue/SCM-XX)
```

## When to Use

Use this skill when:
- Creating or updating issues for plugins in this marketplace
- Looking up existing issues or project status
- Linking commits and PRs to Linear issues
- Understanding the project structure in Linear

## Linear Structure

### Team

**Sabai Claude Marketplace** - The team tracking all plugin development

### Projects

Each plugin has a corresponding Linear project:

| Project | Plugin Folder | Description |
|---------|---------------|-------------|
| Sabai Plugins | - | General/cross-plugin issues |
| Sabai Attio | sabai-attio | Attio CRM integration |
| Sabai Calendar | sabai-calendar | Google Calendar integration |
| Sabai Conversion | sabai-conversion | Currency/timezone converter |
| Sabai Discord | sabai-discord | Discord assistant |
| Sabai Gmail | sabai-gmail | Gmail assistant |
| Sabai Granola | sabai-granola | Meeting intelligence (Granola) |
| Sabai Harvest | sabai-harvest | Harvest time tracking |
| Sabai Linear | sabai-linear | Linear PM assistant plugin |
| Sabai Notion | sabai-notion | Notion documentation sync |
| Sabai Recall | sabai-recall | Meeting bot automation |
| Sabai Sabai | sabai-sabai | Relaxation plugin |
| Sabai Slack | sabai-slack | Slack integration |
| Sabai Sudoku | sabai-sudoku | Sudoku game MCP App |
| Sabai Tella | sabai-tella | Tella video management |

### Workflow Statuses

Issues flow through these statuses:

1. **Triage** - New issues awaiting review
2. **Backlog** - Accepted but not scheduled
3. **Todo** - Ready to work on
4. **In Progress** - Currently being worked on
5. **In Review** - Code complete, awaiting review
6. **Done** - Completed
7. **Canceled** - Won't be done
8. **Duplicate** - Duplicate of another issue

### Issue Labels

- **Bug** - Something isn't working
- **Feature** - New functionality
- **Improvement** - Enhancement to existing feature
- **Documentation** - Docs updates
- **Design** - UI/UX work
- **Infrastructure** - Build, CI/CD, tooling
- **Security** - Security-related
- **Marketing** - Marketing/promotional
- **Investigate** - Research needed

## Project Descriptions

Each Linear project description must match the plugin's README.md. Use `/sync-linear <plugin-name>` to sync them.

### Template

Both README and Linear project description use this template:

```markdown
# [Plugin Name]

**[One-line description]**

| Field | Value |
|-------|-------|
| Type | MCP App / Skills / Commands |
| Version | 1.0.0 |
| Status | Backlog / In Progress / Active |
| Command | `/command-name` |
| Repo | `plugins/plugin-name` |

---

## Overview

[2-3 sentences describing what the plugin does and its main use case]

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Use Cases

- "Help me log 2 hours on Project X"
- "Show my calendar for tomorrow"

## MCP Tools

- `tool_name` - Description

## Commands

- `/command` - What it does

## Hooks

| Event | Matcher | Command | Description |
|-------|---------|---------|-------------|
| PostToolCall | `mcp__x__tool` | `command` | Why it's needed |

## Configuration

### Environment Variables
- `API_KEY` - Description

### Settings
- `~/.config/plugin/settings.json` - What it stores

## Authentication

- OAuth / API Key / None
- Setup steps if needed

## Permissions

Required Claude Code permissions:
- `Bash(command:*)` - Why needed
- `WebFetch(domain:api.example.com)` - Why needed

## Dependencies

- **Required**: What must be installed/configured
- **Optional**: Nice-to-have integrations

## Limitations

- Known issue 1
- Not yet supported: feature X

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/plugin-name)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/plugin-name/CHANGELOG.md)
```

Omit sections that don't apply to the plugin.

## Instructions

### Finding Issues

To find issues for a specific plugin:
```
List issues in the "Sabai sudoku" project
```

To find your assigned issues:
```
List issues assigned to me
```

To find bugs:
```
List issues with label "Bug" in team "Sabai Claude Marketplace"
```

### Creating Issues

When creating an issue:

1. **Select the correct project** - Match the plugin folder name
2. **Add appropriate labels** - At minimum, add an Issue Type label
3. **Write a clear title** - Be specific about what needs to be done
4. **Add description** - Include context, steps to reproduce (for bugs), or acceptance criteria

Example:
```
Create issue in project "Sabai sudoku":
- Title: "Add difficulty selection screen"
- Labels: Feature
- Description: "Add a screen before game start to select difficulty level (Easy, Medium, Hard, Expert)"
```

### Linking to Code

Reference Linear issues in commits:
```
feat: Add difficulty selector [SCM-123]
```

Or in PR descriptions:
```
Fixes SCM-123
Closes SCM-456
```

### Updating Issue Status

When starting work:
```
Update issue SCM-123 to "In Progress"
```

When creating a PR:
```
Update issue SCM-123 to "In Review"
```

## Examples

### Example: Bug Report

**User says:** "The timer in sudoku doesn't pause when the game is paused"

**Action:**
1. Check if issue already exists in "Sabai sudoku" project
2. If not, create issue:
   - Project: Sabai sudoku
   - Title: "Timer continues running when game is paused"
   - Labels: Bug
   - Description: Detailed reproduction steps

### Example: Feature Request

**User says:** "Add dark mode to the sudoku game"

**Action:**
1. Create issue in "Sabai sudoku" project
2. Title: "Add dark mode support"
3. Labels: Feature, Design
4. Description: Requirements and any design considerations

### Example: Cross-Plugin Issue

**User says:** "All plugins should have consistent footer styling"

**Action:**
1. Create issue in "Sabai Plugins" project (general issues)
2. Title: "Standardize footer styling across all MCP Apps"
3. Labels: Improvement, Design
4. Description: What needs to be consistent, which plugins affected
