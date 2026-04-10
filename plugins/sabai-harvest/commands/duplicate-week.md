---
name: duplicate-week
description: Copy last week's time entries to this week with review and adjustment
---

# /duplicate-week - Duplicate Last Week's Timesheet

Copy last week's time entries to this week with review and adjustment before submitting.

## Usage

```
/duplicate-week
```

## Workflow

### Step 1: Fetch Last Week's Entries

Get last week's time entries:
```bash
hrvst time-entries list --from=$(date -v-monday -v-7d +%Y-%m-%d) --to=$(date -v-friday -v-7d +%Y-%m-%d)
```

### Step 2: Present Summary for Review

Show the user what was logged last week in an editable format:

```
## Last Week's Timesheet (Jan 8-12)

I found these entries from last week:

| Day       | Project     | Hours | Notes                  |
|-----------|-------------|-------|------------------------|
| Monday    | client-dev  | 6.0   | Feature development    |
| Monday    | meetings    | 2.0   | Sprint planning        |
| Tuesday   | client-dev  | 7.0   | Bug fixes              |
| Tuesday   | admin       | 1.0   | Emails, timesheet      |
| Wednesday | client-dev  | 8.0   | API integration        |
| Thursday  | client-dev  | 6.5   | Testing                |
| Thursday  | meetings    | 1.5   | Client call            |
| Friday    | client-dev  | 7.0   | Documentation          |
| Friday    | admin       | 1.0   | Weekly review          |

**Total: 40 hours**

## This Week (Jan 15-19)

Would you like me to duplicate these entries to this week?

Please review and tell me:
1. Any days that should be different?
2. Any hours to adjust?
3. Any projects to change?
4. Any notes to update?

Or say "looks good" to proceed with these entries.
```

### Step 3: Collect Adjustments

Wait for user feedback. Common adjustments:
- "Tuesday was a holiday, skip it"
- "Change Wednesday to 6 hours client-dev, 2 hours support"
- "Friday I have PTO, only 4 hours"
- "Update Monday notes to 'Q1 planning'"

### Step 4: Show Final Plan

After adjustments, show the final entries that will be created:

```
## Entries to Create for This Week (Jan 15-19)

| Day       | Project     | Hours | Notes                  |
|-----------|-------------|-------|------------------------|
| Monday    | client-dev  | 6.0   | Feature development    |
| Monday    | meetings    | 2.0   | Sprint planning        |
| Wednesday | client-dev  | 8.0   | API integration        |
| Thursday  | client-dev  | 6.5   | Testing                |
| Thursday  | meetings    | 1.5   | Client call            |
| Friday    | client-dev  | 4.0   | Documentation          |

**Total: 30 hours** (Tuesday holiday, Friday half-day)

Type "submit" to create these entries, or tell me what else to change.
```

### Step 5: Submit Only After Confirmation

**IMPORTANT**: Do NOT run any `hrvst log` commands until the user explicitly confirms with "submit", "yes", "confirm", "do it", or similar affirmative response.

Once confirmed, create each entry:
```bash
hrvst log 6 client-dev --notes "Feature development"
hrvst log 2 meetings --notes "Sprint planning"
# ... etc for each entry
```

Report results:
```
Created 6 time entries for this week:
- Monday: 8.0 hours
- Wednesday: 8.0 hours
- Thursday: 8.0 hours
- Friday: 4.0 hours

Total: 28 hours logged
```

## Key Behaviors

1. **Never auto-submit** - Always wait for explicit user confirmation
2. **Show before/after** - Make it clear what will be created
3. **Allow iterations** - User can make multiple rounds of adjustments
4. **Batch at the end** - Collect all changes, then submit once confirmed
5. **Handle notes** - Preserve or update notes from last week

## Date Handling

- Last week: Monday to Friday of the previous week
- This week: Monday to Friday of the current week
- Entries are created for the corresponding day this week

## Error Handling

- If last week has no entries: "No entries found for last week. Would you like to create a fresh timesheet instead?"
- If an entry fails: Report which ones succeeded and which failed
