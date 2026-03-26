# /timesheet - View Timesheet

View and review your Harvest timesheet.

## Usage

```
/timesheet [day|week]
```

## Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| period | Optional | `day` (default) or `week` |

## Examples

```
/timesheet
/timesheet day
/timesheet week
```

## Behavior

### /timesheet or /timesheet day

Show today's entries:
```bash
hrvst time-entries list --from=$(date +%Y-%m-%d) --to=$(date +%Y-%m-%d)
```

Output format:
```
## Today's Timesheet

| Project     | Hours | Notes                    |
|-------------|-------|--------------------------|
| client-dev  | 4.0   | Feature implementation   |
| meetings    | 1.5   | Sprint planning          |
| admin       | 0.5   | Timesheet & emails       |

**Total: 6.0 hours**
```

### /timesheet week

Show the current week:
```bash
hrvst time-entries list --from=$(date -v-monday +%Y-%m-%d) --to=$(date +%Y-%m-%d)
```

Output format:
```
## Week of Jan 15-19

| Day       | Hours | Status |
|-----------|-------|--------|
| Monday    | 8.0   | OK     |
| Tuesday   | 7.5   | -0.5h  |
| Wednesday | 8.0   | OK     |
| Thursday  | 6.0   | -2.0h  |
| Friday    | 4.0   | In progress |

**Total: 33.5 hours**
**Target: 40 hours**
**Remaining: 6.5 hours**
```

## Gap Detection

When showing week view, highlight:
- Days with less than 8 hours (assuming full-time)
- Calculate remaining hours to reach weekly target
- Suggest: "Need to fill 2.5 hours. Use /log to add missing time."

## Follow-up Actions

After showing timesheet, offer:
- `/log` to add missing time
- Review entries for accuracy
- Identify any entries that need notes

## Notes

- Date calculations use local system date
- Hours target (40/week, 8/day) is typical but may vary
- Use the Weekly Review skill for more detailed gap analysis
