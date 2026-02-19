# Role-Based Access Control

This skill documents the hook-based role validation system for Sabai Harvest commands.

## Overview

The plugin uses a `UserPromptSubmit` hook to validate user roles before executing manager-only commands. This prevents employees from accidentally triggering commands they don't have permissions to use.

## Architecture

### Hook Configuration

The hook is defined in `hooks/hooks.json`:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "type": "command",
        "command": "./hooks/validate-role.sh"
      }
    ]
  }
}
```

### Validation Script

The `hooks/validate-role.sh` script:

1. Reads the user's prompt from stdin (JSON format)
2. Extracts the command from the prompt
3. Reads the user's role from `~/.sabai/harvest.json`
4. Checks if the command requires manager access
5. Returns appropriate exit code

Exit codes:
- `0` - Allow the command to proceed
- `2` - Block the command with an error message

## Role Configuration

Roles are stored in `~/.sabai/harvest.json`:

```json
{
  "role": "manager",
  "harvestUserId": "12345",
  "configuredAt": "2026-02-20T12:00:00Z"
}
```

Supported roles:
- `employee` - Default role, limited command access
- `manager` - Full access to all commands
- `admin` - Full access to all commands

## Commands by Role

| Command | Employee | Manager | Description |
|---------|----------|---------|-------------|
| `/timesheet` | Yes | Yes | View your own timesheet |
| `/duplicate-week` | Yes | Yes | Copy last week's entries |
| `/log` | Yes | Yes | Log time entry |
| `/setup-harvest` | Yes | Yes | Configure CLI and role |
| `/team-timesheet` | No | Yes | View team timesheets |
| `/approve` | No | Yes | Approve time entries |
| `/project-budget` | No | Yes | View project budgets |
| `/team-report` | No | Yes | Generate team reports |
| `/remind` | No | Yes | Send reminder to team |

## Error UX

When an employee attempts a manager-only command, they see:

```
This command requires manager access.

Your current role: employee
Required role: manager

To configure manager access, run:
  /setup-harvest

If you believe you should have manager access, contact your Harvest administrator.
```

## Setup Flow

The `/setup-harvest` command:

1. **Detects permissions** - Attempts manager-only API calls to detect role
2. **Confirms with user** - Shows detected role and asks for confirmation
3. **Stores configuration** - Saves role to `~/.sabai/harvest.json`

Example detection output:

```
Detecting your Harvest permissions...

Your access level:
  - Your own time entries
  - Team member time entries
  - Project budgets and rates

This indicates you have Manager access.

Configure as Manager? (yes/no)
```

## Changing Roles

To change your configured role:

1. Run `/setup-harvest`
2. The role detection will run again
3. Confirm the new role when prompted

Or manually edit `~/.sabai/harvest.json`:

```bash
echo '{"role": "manager"}' > ~/.sabai/harvest.json
```

## Technical Details

### Hook Input Format

The hook receives JSON on stdin:

```json
{
  "prompt": "/team-timesheet this week",
  "timestamp": "2026-02-20T12:00:00Z"
}
```

### Manager Command Pattern

The validation script matches commands with this regex:

```bash
^/(team-timesheet|approve|project-budget|team-report|remind)
```

### Dependencies

The validation script requires:
- `jq` - For JSON parsing
- `bash` - Shell interpreter

## Troubleshooting

### "Command requires manager access" but I am a manager

1. Check your config file: `cat ~/.sabai/harvest.json`
2. Verify role is set correctly
3. Re-run `/setup-harvest` to reconfigure

### Config file not found

Run `/setup-harvest` to create the configuration.

### jq not installed

Install jq:
- macOS: `brew install jq`
- Ubuntu: `apt-get install jq`
- Windows: `choco install jq`
