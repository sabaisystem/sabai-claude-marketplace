# Sabai Harvest

**Efficient time tracking with Harvest CLI for employees and contractors.**

| Field | Value |
|-------|-------|
| Type | Skills + Commands + Hooks |
| Version | 1.6.0 |
| Status | Active |
| Command | `/setup-harvest`, `/duplicate-week`, `/log`, `/timesheet` |
| Repo | `plugins/sabai-harvest` |
| Updated | 2026-02-20 |

---

## Overview

An efficient Harvest time tracking plugin using the [hrvst-cli](https://github.com/kgajera/hrvst-cli). Supports duplicating last week's timesheet with review before submitting, quick time logging with aliases, weekly timesheet review with gap detection, auto-install of Harvest CLI, natural language time entry, and role-based access control for manager-only commands.

## Key Features

- Duplicate last week's timesheet with review before submitting
- Quick time logging with aliases
- Weekly timesheet review and gap detection
- Auto-install of Harvest CLI
- Natural language time entry
- Role-based access control (employee vs manager)

## Use Cases

- "Duplicate last week's timesheet"
- "Log 2 hours to client-dev project"
- "Show me my timesheet for this week"
- "Review my time entries for gaps"

## Commands

- `/setup-harvest` - Install CLI, authenticate, configure role, and create aliases
- `/duplicate-week` - Copy last week's entries with review before submitting
- `/log [hours] [project]` - Quick time entry
- `/timesheet [day|week]` - View your timesheet

## Hooks

| Event | Matcher | Command | Description |
|-------|---------|---------|-------------|
| UserPromptSubmit | `*` | `./hooks/validate-role.sh` | Blocks manager-only commands for employees |

### Manager-Only Commands

The following commands are blocked for employees:

- `/team-timesheet` - View team timesheets
- `/approve` - Approve time entries
- `/project-budget` - View project budgets
- `/team-report` - Generate team reports
- `/remind` - Send reminders to team

When blocked, users see a clear message directing them to `/setup-harvest` to configure manager access.

## Configuration

### Role Configuration

Role is stored in `~/.sabai/harvest.json`:

```json
{
  "role": "manager",
  "harvestUserId": "12345",
  "configuredAt": "2026-02-20T12:00:00Z"
}
```

Supported roles: `employee` (default), `manager`, `admin`

### CLI Commands Reference

| Action | Command |
|--------|---------|
| Install CLI | `npm install -g hrvst-cli` |
| Login | `hrvst login` |
| Start timer | `hrvst start [alias]` |
| Stop timer | `hrvst stop` |
| Log hours | `hrvst log <hours> [alias]` |
| Add notes | `hrvst note "description"` |
| List aliases | `hrvst alias list` |
| Create alias | `hrvst alias create <name>` |

## Authentication

Harvest account required. Run `/setup-harvest` to authenticate via `hrvst login`.

## Dependencies

- **Required**: Node.js v14+, Harvest account, jq (for role validation)

## Limitations

- Requires hrvst-cli to be installed globally
- Works only with Harvest time tracking (not other providers)
- Role validation requires jq to be installed

## Tips

1. **Create aliases** for all your regular projects
2. **Review weekly** to catch any gaps
3. **Log immediately** rather than waiting until end of week
4. **Configure your role** with `/setup-harvest` to access the right commands

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-harvest)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-harvest/CHANGELOG.md)
- [Harvest CLI Documentation](https://kgajera.github.io/hrvst-cli/)
- [Harvest](https://www.getharvest.com/)
