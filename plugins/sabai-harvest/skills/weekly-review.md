# Weekly Timesheet Review

You help users review their weekly timesheet, identify gaps, and ensure accurate time tracking.

## Weekly Review Workflow

### Step 1: Get the Week's Entries

```bash
hrvst time-entries list --from=$(date -v-monday +%Y-%m-%d) --to=$(date -v+friday +%Y-%m-%d)
```

For a specific week:
```bash
hrvst time-entries list --from=2024-01-15 --to=2024-01-19
```

### Step 2: Calculate Daily Totals

Review output and calculate:
- Total hours per day
- Total hours for the week
- Expected hours (typically 40 for full-time)

### Step 3: Identify Gaps

Common gaps to look for:
- Days with less than 8 hours logged
- Missing days (no entries at all)
- Meetings that weren't logged
- Administrative time

### Step 4: Fill Missing Time

For each gap, ask the user:
- What were you working on?
- Approximately how long?
- Which project/alias should it go to?

Then log:
```bash
hrvst log <hours> <alias>
```

## Weekly Summary Template

When presenting the weekly review, use this format:

```
## Week of [Date Range]

| Day       | Hours | Status |
|-----------|-------|--------|
| Monday    | 8.0   | OK     |
| Tuesday   | 6.5   | -1.5h  |
| Wednesday | 8.0   | OK     |
| Thursday  | 7.0   | -1.0h  |
| Friday    | 8.0   | OK     |

**Total:** 37.5 / 40 hours
**Gap:** 2.5 hours to fill

### Gaps to Address
- Tuesday: 1.5 hours unaccounted
- Thursday: 1.0 hour unaccounted
```

## Common Gap Sources

Help users identify where missing time went:

1. **Meetings** - Check calendar for meetings not logged
2. **Email/Slack** - Communication time is often forgotten
3. **Context switching** - Time lost between tasks
4. **Administrative** - Timesheets, expenses, HR tasks
5. **Learning** - Training, reading documentation
6. **Breaks** - Lunch, short breaks (may or may not be logged)

## Quick Fill Strategies

### Distribute Untracked Time
If user has 2 hours unaccounted across the week:
- Add 30 min to each day's primary project
- Or log to an "admin" or "overhead" alias

### Batch Similar Work
Combine multiple small items:
- "Various client communications" - 1 hour
- "Code review and PR feedback" - 1.5 hours

## Submission Reminder

After filling gaps:
1. Verify total hours meet requirements
2. Check all entries have appropriate notes
3. Submit timesheet if required by organization

## Tips for Better Weekly Reviews

1. **Do it Friday afternoon** - While the week is fresh
2. **Set a calendar reminder** - Make it a habit
3. **Keep notes during the week** - Quick jots help recall
4. **Use timer more** - Real-time tracking is more accurate
