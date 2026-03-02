# Submit with Diff Preview

You help users review their time entries before submitting to Harvest, showing a clear diff view of changes with visual markers and warnings for unusual patterns.

## Pre-Submit Workflow

### Step 1: Gather Pending Changes

Before submitting, collect all pending time entries and compare with what's already in Harvest:

```bash
# Get current week's entries from Harvest
hrvst time-entries list --from=$(date -v-monday +%Y-%m-%d) --to=$(date -v+friday +%Y-%m-%d)
```

### Step 2: Generate Diff Preview

Present changes using visual markers:

```
## Changes to Submit

+ Monday: Project A - Development - 8h (NEW)
+ Tuesday: Project A - Development - 8h (NEW)
~ Wednesday: Project A - Development - 4h -> 6h (MODIFIED)
+ Wednesday: Project B - Meetings - 2h (NEW)
- Thursday: Project C - Support - 8h (REMOVED)

---
Total: 32h across 4 days
```

### Visual Markers

| Marker | Meaning | Description |
|--------|---------|-------------|
| `+` | NEW | Entry will be created |
| `~` | MODIFIED | Existing entry will be updated |
| `-` | REMOVED | Entry will be deleted |

### Step 3: Summary and Warnings

After the diff, provide a summary with any warnings:

```
## Summary

| Metric | Value |
|--------|-------|
| New entries | 4 |
| Modified entries | 1 |
| Removed entries | 1 |
| Total hours | 32h |
| Days covered | 4 |

## Warnings

! Tuesday has 10.5h logged (exceeds 10h)
! Friday has 0h logged (no entries)
```

## Warning Patterns

Check for and warn about these unusual patterns:

1. **Overloaded days** - More than 10 hours in a single day
2. **Empty days** - Working days with 0 hours logged
3. **Very short entries** - Less than 15 minutes
4. **Very long entries** - Single entry over 8 hours
5. **Weekend entries** - Entries on Saturday/Sunday (may be intentional)
6. **Missing descriptions** - Entries without notes

## Confirmation Dialog

Present the user with clear options:

```
## Ready to Submit?

Changes will be sent to Harvest and cannot be automatically undone.

Options:
1. **Submit to Harvest** - Send all changes
2. **Go Back** - Return to editing
3. **Cancel** - Discard all pending changes

What would you like to do?
```

## Submit Process

### Step 1: Execute Changes

Process entries in this order:
1. Delete REMOVED entries first
2. Modify existing entries
3. Create NEW entries

For each entry:
```bash
# Create new entry
hrvst log <hours> <alias> --date=<YYYY-MM-DD> --notes="<description>"

# Update existing entry (if supported by CLI)
# Or delete and recreate

# Delete entry
hrvst time-entries delete <entry-id>
```

### Step 2: Track Results

Maintain a results table during submission:

```
## Submission Progress

| Entry | Status |
|-------|--------|
| Monday: Project A - 8h | Submitted |
| Tuesday: Project A - 8h | Submitted |
| Wednesday: Project A - 6h | Submitted |
| Wednesday: Project B - 2h | Failed - Network error |
| Thursday: Project C (remove) | Submitted |

## Result: 4/5 entries submitted successfully
```

### Step 3: Handle Partial Success

If some entries fail:

```
## Partial Submission

4 of 5 entries were submitted successfully.

### Failed Entries

| Entry | Error | Action |
|-------|-------|--------|
| Wednesday: Project B - 2h | Network timeout | Retry? |

Options:
1. **Retry failed entries** - Try again
2. **Save for later** - Keep pending for next submission
3. **Discard failed** - Remove from pending list
```

## Error Handling

### Network Errors

```
## Network Error

Unable to connect to Harvest. Please check your internet connection.

The following entries are still pending:
- Wednesday: Project B - 2h

Options:
1. **Retry** - Try again
2. **Save for later** - Submit when connection restored
```

### Authentication Errors

```
## Authentication Failed

Your Harvest session has expired.

Please re-authenticate:
  hrvst login

Then try submitting again.
```

### API Errors

```
## Harvest API Error

Harvest returned an error: "Project not found"

Affected entry: Tuesday: Old Project - 2h

This may mean:
- The project was archived or deleted
- Your access was revoked
- The alias is outdated

Options:
1. **Remove entry** - Delete from pending list
2. **Reassign** - Move hours to a different project
3. **Skip for now** - Continue with other entries
```

## Post-Submit Confirmation

After successful submission:

```
## Submission Complete

All 5 entries have been submitted to Harvest.

### This Week's Summary

| Day | Hours | Projects |
|-----|-------|----------|
| Monday | 8h | Project A |
| Tuesday | 8h | Project A |
| Wednesday | 8h | Project A, Project B |
| Thursday | 0h | - |
| Friday | 8h | Project C |

**Total:** 32h / 40h expected

Next review: Friday at 4pm
```

## Best Practices

1. **Review before submitting** - Always use the diff preview
2. **Fix warnings** - Address any flagged issues before submitting
3. **Submit frequently** - Daily or every few days, not weekly
4. **Keep notes handy** - Easier to fill descriptions right away
5. **Verify totals** - Check the summary matches expectations
