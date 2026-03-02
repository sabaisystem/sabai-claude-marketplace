# Sabai Harvest

**Efficient time tracking with Harvest CLI for employees and contractors.**

| Field | Value |
|-------|-------|
| Type | Skills + Commands |
| Version | 1.2.0 |
| Status | Active |
| Command | `/setup-harvest`, `/duplicate-week`, `/log`, `/timesheet` |
| Repo | `plugins/sabai-harvest` |

---

## Overview

An efficient Harvest time tracking plugin using the [hrvst-cli](https://github.com/kgajera/hrvst-cli). Supports duplicating last week's timesheet with review before submitting, quick time logging with aliases, weekly timesheet review with gap detection, auto-install of Harvest CLI, and natural language time entry.

## Key Features

- **Draft-based week duplication** - Copy last week's timesheet to an editable draft that doesn't touch Harvest until submitted
- Local draft storage with edit, remove, add, and validation commands
- Quick time logging with aliases
- Weekly timesheet review and gap detection
- Auto-install of Harvest CLI
- Natural language time entry

## Use Cases

- "Duplicate last week's timesheet"
- "Log 2 hours to client-dev project"
- "Show me my timesheet for this week"
- "Review my time entries for gaps"

## Commands

- `/setup-harvest` - Install CLI, authenticate, and create aliases
- `/duplicate-week` - Copy last week's entries to an editable draft with full edit/review workflow before submitting
- `/log [hours] [project]` - Quick time entry
- `/timesheet [day|week]` - View your timesheet

## Configuration

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

- **Required**: Node.js v14+, Harvest account

## Limitations

- Requires hrvst-cli to be installed globally
- Works only with Harvest time tracking (not other providers)

## Tips

1. **Create aliases** for all your regular projects
2. **Review weekly** to catch any gaps
3. **Log immediately** rather than waiting until end of week

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-harvest)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-harvest/CHANGELOG.md)
- [Harvest CLI Documentation](https://kgajera.github.io/hrvst-cli/)
- [Harvest](https://www.getharvest.com/)
