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
/backlog prioritize         # Interactive prioritization session
```

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
   - Show unprioritized tickets
   - Help assign priorities based on impact/effort

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
