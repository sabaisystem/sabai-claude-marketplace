---
name: focus
description: Block protected focus time on your calendar
---

# /focus - Block Focus Time

Block protected focus time on your calendar.

## Usage

```
/focus [duration] [when]
```

## Examples

```
/focus 2h tomorrow morning
/focus 90m today afternoon
/focus 3h daily 9am
```

## What It Does

1. Checks for conflicts in requested time
2. Creates focus time block marked as "busy"
3. Optionally makes it recurring
4. Color-codes for visibility

## Focus Block Options

```markdown
## Creating Focus Block

**Requested:** 2 hours tomorrow morning

### Available Morning Slots
| # | Time | Conflicts |
|---|------|-----------|
| 1 | 8:00 AM - 10:00 AM | None |
| 2 | 9:00 AM - 11:00 AM | None |
| 3 | 10:00 AM - 12:00 PM | 11:00 AM standup |

Which slot? (Or specify a custom time)
```

## After Creation

```markdown
## Focus Time Blocked

**Focus Time - Deep Work**
- When: Tuesday, Jan 16, 9:00 AM - 11:00 AM
- Duration: 2 hours
- Status: Busy (blocks scheduling)

Others will see this time as unavailable.

Make this a recurring block? (daily/weekly/no)
```

## Focus Time Best Practices

- **Morning blocks** (9-11 AM): Peak cognitive hours for most people
- **90-minute minimum**: Effective deep work sessions
- **Mark as busy**: Prevents others from scheduling over it
- **Add description**: "Focus time - no meetings please"

## Options

- `--recurring daily`: Create daily focus block
- `--recurring weekly`: Create weekly focus block
- `--label [text]`: Custom label (default: "Focus Time")
- `--color [color]`: Set calendar color

## Tips

- Block focus time at your most productive hours
- Start with 90 minutes and build up
- Make it recurring for consistency
- Share your focus schedule with your team
- Don't schedule focus time over existing commitments
