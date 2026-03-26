# /ticket Command

Create a Linear ticket using templates.

## Usage

```
/ticket [type] [description]
```

## Types

- `feature` - New feature ticket
- `bug` - Bug report ticket
- `improvement` - Enhancement ticket
- `spike` - Research/investigation ticket
- `epic` - Epic/initiative ticket

## Behavior

When this command is invoked:

1. If type and description provided, generate ticket immediately
2. If only type provided, ask for description
3. If nothing provided, ask:
   - What type of ticket?
   - Brief description

4. Generate the ticket content using the appropriate template

5. Ask which Linear team/project to create it in

6. Use Linear MCP to create the ticket:
   - `linear_get_teams` to list teams
   - `linear_create_issue` to create the ticket

7. Return the ticket URL

## Examples

```
/ticket feature Add dark mode support
/ticket bug Login button not working on mobile
/ticket spike Research payment provider options
/ticket
```

## Quick Flags

- `--team [name]` - Specify team directly
- `--priority [0-4]` - Set priority (4 = urgent)
- `--project [name]` - Assign to project
