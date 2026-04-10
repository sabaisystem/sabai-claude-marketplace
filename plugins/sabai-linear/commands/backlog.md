---
name: backlog
description: View and manage Linear backlog
---

# /backlog Command

View and manage Linear backlog.

## Usage

```
/backlog [action] [options]
```

## Actions

### View Backlog
```
/backlog                    # Show all open tickets
/backlog --team [name]      # Filter by team
/backlog --project [name]   # Filter by project
/backlog --priority high    # Filter by priority
/backlog --assignee me      # My tickets
```

### Prioritize
```
/backlog prioritize         # Redirects to /prioritize (RICE, ICE, MoSCoW, Rank)
```

> **Tip:** Use `/prioritize` directly for full framework selection and scoring. See `/prioritize --help`.

### Groom
```
/backlog groom              # Review tickets needing refinement
```

## Behavior

When this command is invoked:

1. Use Linear MCP to fetch issues:
   - `linear_get_issues` with appropriate filters

2. Display tickets in a clear format:
   - ID, Title, Priority, Status, Assignee

3. For `prioritize`:
   - Delegate to `/prioritize` command for full interactive scoring
   - Supports RICE, ICE, MoSCoW frameworks and ranked views

4. For `groom`:
   - Find tickets missing description, acceptance criteria, or estimates
   - Help complete them one by one

## Examples

```
/backlog
/backlog --team Engineering --priority high
/backlog prioritize
/backlog groom
```
