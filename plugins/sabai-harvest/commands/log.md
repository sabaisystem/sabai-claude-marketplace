# /log - Quick Time Entry

Log hours to Harvest quickly.

## Usage

```
/log [hours] [project/alias]
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| hours | Optional | Number of hours (e.g., 2, 1.5, 0.5) |
| project | Optional | Alias name or project description |

## Examples

```
/log 2 client-dev
/log 1.5 meetings
/log 8 development
/log
```

## Behavior

### If hours and alias provided:
Run directly:
```bash
hrvst log <hours> <alias>
```

### If only hours provided:
1. List available aliases: `hrvst alias list`
2. Ask which project/alias to use
3. Run: `hrvst log <hours> <alias>`

### If nothing provided:
1. Ask: "How many hours?"
2. List available aliases: `hrvst alias list`
3. Ask: "Which project?"
4. Run: `hrvst log <hours> <alias>`

### If alias doesn't exist:
1. Show available aliases
2. Suggest creating a new alias or picking an existing one
3. Offer to run `hrvst alias create <name>` if needed

## Output

After logging, confirm:
```
Logged 2.0 hours to client-dev
```

## Quick Variations

Support natural language:
- `/log 2h on client work` - Parse as 2 hours, find matching alias
- `/log half hour admin` - Parse as 0.5 hours
- `/log 90 minutes meetings` - Parse as 1.5 hours

## Notes

- Hours can be decimal (1.5) or fractions expressed naturally (half hour, 90 minutes)
- If the alias doesn't exist, show available options from `hrvst alias list`
- Time is logged to today's date by default
