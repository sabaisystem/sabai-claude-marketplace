# Week Duplication with Draft State

You help users duplicate last week's timesheet to the current week using a draft-based workflow that doesn't touch Harvest until explicitly submitted.

## Overview

This skill implements a safe, editable draft system for duplicating timesheets. All changes are stored locally until the user confirms submission, preventing accidental entries in Harvest.

## Draft State Structure

Store draft state in a local JSON file at `~/.config/sabai-harvest/draft.json`:

```json
{
  "weekStart": "2026-02-17",
  "status": "draft",
  "source": "duplicated_from_2026-02-10",
  "createdAt": "2026-02-17T10:30:00Z",
  "modifiedAt": "2026-02-17T11:45:00Z",
  "entries": [
    {
      "id": "draft-1",
      "day": "monday",
      "date": "2026-02-17",
      "projectId": "123",
      "projectName": "Client Work",
      "taskId": "456",
      "taskName": "Development",
      "hours": 8,
      "notes": "Feature development",
      "status": "draft"
    }
  ]
}
```

### Status Values

- `draft` - Editable, not yet submitted to Harvest
- `submitted` - Successfully written to Harvest
- `partial` - Some entries submitted, some failed

## Workflow

### Step 1: Fetch Last Week's Entries

```bash
# Get Monday of last week
LAST_MONDAY=$(date -v-monday -v-7d +%Y-%m-%d)
LAST_FRIDAY=$(date -v-friday -v-7d +%Y-%m-%d)

# Fetch entries
hrvst time-entries list --from=$LAST_MONDAY --to=$LAST_FRIDAY --json
```

### Step 2: Create Draft

Transform last week's entries into a draft for the current week:

1. Calculate the current week's date range
2. Map each entry's day to the corresponding day this week
3. Preserve project, task, hours, and notes
4. Assign draft status to each entry
5. Save to `~/.config/sabai-harvest/draft.json`

```bash
# Ensure config directory exists
mkdir -p ~/.config/sabai-harvest
```

### Step 3: Present Draft for Review

Display the draft in an editable format:

```
## Draft Timesheet for Feb 17-21, 2026

Source: Copied from Feb 10-14, 2026

| # | Day       | Project     | Task        | Hours | Notes                  | Status |
|---|-----------|-------------|-------------|-------|------------------------|--------|
| 1 | Monday    | Client Work | Development | 8.0   | Feature development    | Draft  |
| 2 | Tuesday   | Client Work | Development | 6.0   | Bug fixes              | Draft  |
| 3 | Tuesday   | Internal    | Meetings    | 2.0   | Sprint planning        | Draft  |
| 4 | Wednesday | Client Work | Development | 8.0   | API integration        | Draft  |
| 5 | Thursday  | Client Work | Testing     | 6.5   | QA testing             | Draft  |
| 6 | Thursday  | Internal    | Meetings    | 1.5   | Client call            | Draft  |
| 7 | Friday    | Client Work | Development | 7.0   | Documentation          | Draft  |
| 8 | Friday    | Internal    | Admin       | 1.0   | Weekly review          | Draft  |

**Total: 40 hours**

Commands:
- "edit 2 hours 7" - Change entry #2 to 7 hours
- "edit 5 notes QA and testing" - Update notes for entry #5
- "remove 8" - Delete entry #8
- "add Wednesday Client Work Development 2 Code review" - Add new entry
- "skip Tuesday" - Remove all Tuesday entries (holiday/PTO)
- "submit" - Send all entries to Harvest
- "cancel" - Discard draft
```

### Step 4: Handle Edits

Process user edit commands and update the draft:

#### Edit Hours
```
User: edit 2 hours 7
```
Update entry #2 hours to 7, recalculate totals, save draft, show updated table.

#### Edit Notes
```
User: edit 5 notes Comprehensive QA testing
```
Update entry #5 notes, save draft, show updated table.

#### Remove Entry
```
User: remove 8
```
Remove entry #8 from draft, renumber remaining entries, save draft.

#### Add Entry
```
User: add Thursday Client Work Development 3 Code review
```
Add new entry with draft status, assign next ID, save draft.

#### Skip Day (Holiday/PTO)
```
User: skip Tuesday
```
Remove all entries for Tuesday, save draft, show confirmation.

### Step 5: Validate Before Submission

Before submitting, check for common issues:

1. **Missing days** - Warn if any weekday has no entries
2. **Low hours** - Warn if total is significantly below expected (e.g., < 35 hours)
3. **High hours** - Warn if any day exceeds reasonable limit (e.g., > 12 hours)
4. **Project availability** - Verify projects/tasks still exist in Harvest

```
## Pre-submission Review

Warnings:
- Tuesday has no entries. Is this intentional (holiday/PTO)?
- Thursday total is 10 hours. Please confirm.

Type "submit anyway" to proceed, or make adjustments.
```

### Step 6: Submit to Harvest

Only after explicit confirmation:

```bash
# For each entry in the draft
hrvst log <hours> --project-id <projectId> --task-id <taskId> --date <date> --notes "<notes>"
```

Update each entry's status as it's submitted:

```json
{
  "id": "draft-1",
  "status": "submitted",
  "harvestEntryId": "987654321",
  "submittedAt": "2026-02-17T14:30:00Z"
}
```

Report results:

```
## Submission Complete

Successfully created 8 time entries:

| Day       | Project     | Hours | Status    |
|-----------|-------------|-------|-----------|
| Monday    | Client Work | 8.0   | Submitted |
| Tuesday   | Client Work | 7.0   | Submitted |
| ...       | ...         | ...   | ...       |

Total: 40 hours logged for Feb 17-21, 2026

Draft file archived to ~/.config/sabai-harvest/drafts/2026-02-17.json
```

## Edge Case Handling

### Different Projects Available

If a project from last week is no longer available:

```
Project "Old Client" is not available this week.
Would you like to:
1. Map to a different project
2. Remove these entries
3. Keep in draft (will fail on submit)
```

### Holidays/PTO Days

When user indicates a day off:

```
User: Tuesday is a holiday
```

Response:
- Remove all Tuesday entries
- Update total hours
- Note in draft: `"exceptions": [{"day": "tuesday", "reason": "holiday"}]`

### Partial Weeks

Handle weeks where user only worked partial days:

```
User: I'm only working Mon-Wed this week

Response: Removing Thursday and Friday entries from draft.
New total: 24 hours
```

### Existing Entries This Week

Before creating draft, check for existing entries:

```bash
hrvst time-entries list --from=$(date -v-monday +%Y-%m-%d) --to=$(date +%Y-%m-%d)
```

If entries exist:
```
This week already has 16 hours logged (Mon-Tue).
Would you like to:
1. Add to existing entries (duplicate remaining days only)
2. View existing entries first
3. Cancel duplication
```

## File Management

### Draft Storage

```
~/.config/sabai-harvest/
  draft.json              # Current active draft
  drafts/                 # Archived drafts
    2026-02-17.json       # Completed draft
    2026-02-10.json       # Previous week
```

### Check for Existing Draft

On `/duplicate-week`, first check if a draft exists:

```
You have an existing draft for Feb 17-21 (created 2 hours ago).
Would you like to:
1. Continue editing this draft
2. Discard and start fresh
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `edit <#> hours <n>` | Change hours for entry # |
| `edit <#> notes <text>` | Update notes for entry # |
| `edit <#> project <name>` | Change project for entry # |
| `remove <#>` | Delete entry # |
| `add <day> <project> <task> <hours> <notes>` | Add new entry |
| `skip <day>` | Remove all entries for a day |
| `show` | Display current draft |
| `validate` | Check for issues before submit |
| `submit` | Send all entries to Harvest |
| `cancel` | Discard draft |

## Safety Rules

1. **Never auto-submit** - Always require explicit "submit" command
2. **Preserve drafts** - Save after every edit
3. **Confirm destructive actions** - Ask before canceling or replacing drafts
4. **Archive submitted drafts** - Keep history for reference
5. **Show changes** - Display updated table after each edit
