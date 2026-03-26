# /status

Show current development context and plugin status overview.

## Usage

```
/status                    # Full status overview
/status <plugin-name>      # Status for a specific plugin
```

## Examples

```
/status
/status sabai-gmail
```

## Behavior

### Full Status (`/status`)

#### 1. Current Context

Get git context using Bash:
```bash
git branch --show-current
git status --short
```

Display:
- **Branch**: Current git branch name
- **Worktree**: Clean or list of modified files
- **Active Ticket**: Extract ticket ID from branch name (e.g., `martin/scm-33-...` → SCM-33)

If on a feature branch with ticket ID, fetch ticket details from Linear.

#### 2. Plugin Status Overview

1. Fetch all projects using `mcp__linear__list_projects` with team "Sabai Claude Marketplace"
2. For each project, fetch issues using `mcp__linear__list_issues`
3. Count issues by status: In Progress, In Review, Todo, Backlog
4. Identify the next actionable ticket (highest priority in Todo or Backlog)

Display as table:

```
## Plugin Status

| Plugin | Status | In Progress | In Review | Next Up |
|--------|--------|-------------|-----------|---------|
| Sabai Gmail | Backlog | 2 | 3 | SCM-14: Signature management |
| Sabai Harvest | Backlog | 1 | 2 | SCM-23: Week duplication |
| Sabai Sudoku | Backlog | 0 | 0 | - |
```

### Single Plugin Status (`/status sabai-gmail`)

1. Find the Linear project for the plugin
2. List all open issues with full details
3. Group by status
4. Show each ticket with title, assignee, and priority

## Output Format

```
## Current Context

| Field | Value |
|-------|-------|
| Branch | main |
| Worktree | clean |
| Active Ticket | None |

## Plugin Status

| Plugin | Status | In Progress | In Review | Next Up |
|--------|--------|-------------|-----------|---------|
| Sabai Gmail | Backlog | 2 | 3 | SCM-14: Signature |
| Sabai Harvest | Backlog | 1 | 2 | SCM-23: Week dup |
| Sabai Mermaid | In Progress | 1 | 0 | SCM-30: Initial |
| Sabai Remotion | In Progress | 1 | 0 | SCM-30: Remotion |
| Sabai Sudoku | Backlog | 0 | 0 | - |
| Sabai Xero | Backlog | 1 | 0 | SCM-29: Create |
```

## Implementation Notes

- Skip projects with no issues (or show with all zeros)
- Project status comes from Linear project status field
- Truncate long ticket titles to keep table readable
- If branch matches pattern `*/scm-XX-*`, extract and link to ticket

### Determining "Next Up" Ticket

Priority order for "Next Up":
1. **Blocking tickets first** - Tickets that block other work (check `blocks` relations)
2. **Foundational sub-tasks** - For parent tickets with children, identify the foundational child (e.g., "Build X" before "Use X")
3. **High priority Todo** - Tickets in Todo state with high priority
4. **Bugs over features** - Bugs that block functionality
5. **Oldest Todo** - If tied, pick the oldest

For parent-child relationships:
- Check `parentId` to identify sub-tasks
- Foundational patterns: "Build", "Create", "Implement core", "Setup"
- Dependent patterns: "Add to", "Integrate with", "Use", "Connect"

## Post-Status Prompt

After showing the status table, if there are projects with "Next Up" tickets, ask the user which one to work on:

```
Which project would you like to work on?

1. Sabai Gmail → SCM-32: Gmail MCP connection bug
2. Sabai Calendar → SCM-16: Smart Meeting Slot Finder
3. Sabai Harvest → SCM-21: Visual Timesheet Editor
4. Sabai Plugins → SCM-5: CoWork no answer bug
5. Other (specify ticket or create new)
```

Wait for user response, then:
- If user picks a number → run `/work-on <ticket-id>` for that ticket
- If user says "other" → ask for ticket ID or plugin name
- If user declines → end command
