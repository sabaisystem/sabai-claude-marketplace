# Team Commands

Manager-specific commands for team timesheet management, approvals, and reporting.

> **Note:** These commands require Manager or Admin access in Harvest. See the `user-roles` skill for role detection details.

---

## /team-timesheet

View team member timesheets in a consolidated grid.

### Usage

```
/team-timesheet [week]
/team-timesheet [member-name]
/team-timesheet [week] [member-name]
```

### Examples

```
/team-timesheet
/team-timesheet last week
/team-timesheet Alice
/team-timesheet 2026-02-10 Bob
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `week` | string | Week to view: "this week", "last week", or date (default: this week) |
| `member-name` | string | Filter to specific team member (optional) |

### Output

```
Team: Engineering (Week of Feb 17, 2026)

Member      Mon  Tue  Wed  Thu  Fri  Total  Status
-----------------------------------------------------
Alice Chen   8    8    8    8    8    40h   Submitted
Bob Smith    8    8    -    -    -    16h   Incomplete
Carol Davis  8    8    8    8    -    32h   In Progress
-----------------------------------------------------
Team Total: 88h / 120h expected (73%)

Incomplete timesheets: 2
  - Bob Smith (16h / 40h)
  - Carol Davis (32h / 40h)
```

### Implementation

```bash
# Get team members
hrvst users

# Get entries for each user
for user_id in TEAM_USERS; do
  hrvst entries --user-id=$user_id --from=WEEK_START --to=WEEK_END
done

# Calculate totals and status
```

---

## /approve

Approve or reject team member timesheets.

### Usage

```
/approve [member-name]
/approve [member-name] [week]
/approve --reject [member-name] --reason "feedback"
```

### Examples

```
/approve Alice
/approve Bob last week
/approve --reject Carol --reason "Missing project notes on Wednesday"
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `member-name` | string | Team member to approve (required) |
| `week` | string | Week to approve (default: last submitted) |
| `--reject` | flag | Reject instead of approve |
| `--reason` | string | Feedback message (required for rejection) |

### Workflow

1. **Show timesheet summary:**
   ```
   Approving: Alice Chen - Week of Feb 17

   Day       Hours  Project           Notes
   --------------------------------------------------------
   Monday      8h   Client X Dev      Completed auth module
   Tuesday     8h   Client X Dev      API integration
   Wednesday   8h   Client X Dev      Testing
   Thursday    8h   Internal          Team meeting, training
   Friday      8h   Client X Dev      Bug fixes
   --------------------------------------------------------
   Total:     40h   (38h billable, 2h internal)

   Approve this timesheet? [y/n]
   ```

2. **On approval:**
   ```
   Approved Alice Chen's timesheet for week of Feb 17.
   Notification sent.
   ```

3. **On rejection:**
   ```
   Rejected Carol Davis's timesheet for week of Feb 17.
   Reason: "Missing project notes on Wednesday"
   Notification sent - Carol will need to update and resubmit.
   ```

### Notes

- Approval status is tracked in Harvest (if supported) or locally
- Notifications sent via configured channel (email/Slack)
- Rejected timesheets require updates before resubmission

---

## /project-budget

View project financial data including budget, spend, and runway.

### Usage

```
/project-budget [project-name]
/project-budget [project-name] --detailed
```

### Examples

```
/project-budget
/project-budget "Client X Development"
/project-budget Client-X --detailed
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `project-name` | string | Project to view (default: all managed projects) |
| `--detailed` | flag | Show team member breakdown |

### Output - Summary

```
Project: Client X Development

Budget Overview
---------------
Total Budget:    $50,000
Spent to Date:   $32,450 (65%)
Remaining:       $17,550

Burn Rate:       $8,100/week (avg last 4 weeks)
Projected Runway: ~2.2 weeks

Current Week (Feb 17-21)
------------------------
Hours Logged:    45h
  - Billable:    40h ($4,000)
  - Non-billable: 5h

Status: On Track
```

### Output - Detailed

```
Project: Client X Development

Budget Overview
---------------
Total Budget:    $50,000
Spent to Date:   $32,450 (65%)
Remaining:       $17,550

Team Breakdown (This Week)
--------------------------
Member        Hours  Billable  Cost      Rate
----------------------------------------------
Alice Chen      20h      20h   $2,000    $100/hr
Bob Smith       15h      15h   $1,875    $125/hr
Carol Davis     10h       5h     $500     $50/hr
----------------------------------------------
Total:          45h      40h   $4,375

Weekly Burn History
-------------------
Week of Feb 10:  $8,200 (42h)
Week of Feb 03:  $7,900 (41h)
Week of Jan 27:  $8,300 (43h)
Week of Jan 20:  $7,800 (40h)
Avg:             $8,050/week
```

### Implementation

```bash
# Get project info with budget
hrvst projects --id=PROJECT_ID

# Get hours by user
hrvst reports time --project-id=PROJECT_ID --from=DATE --to=DATE --by=user

# Calculate costs (hours * rates)
```

---

## /team-report

Generate comprehensive team reports for a time period.

### Usage

```
/team-report [period]
/team-report [period] --format [format]
/team-report [period] --project [project-name]
```

### Examples

```
/team-report this week
/team-report last month --format markdown
/team-report Q1 --project "Client X"
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | string | Time period: "this week", "last week", "this month", "last month", "Q1", etc. |
| `--format` | string | Output format: "text", "markdown", "csv" (default: text) |
| `--project` | string | Filter to specific project |

### Output

```
Team Report: Engineering
Period: February 2026

Summary
-------
Total Hours:      640h
Billable Hours:   580h (91%)
Non-billable:      60h (9%)

Team Utilization
----------------
Member        Expected  Actual  Utilization  Billable%
--------------------------------------------------------
Alice Chen       160h    158h      99%         95%
Bob Smith        160h    155h      97%         92%
Carol Davis      160h    162h     101%         88%
David Lee        160h    165h     103%         90%
--------------------------------------------------------
Team Avg:        160h    160h     100%         91%

Project Distribution
--------------------
Client X Development:    280h (44%)  $28,000
Client Y Maintenance:    180h (28%)  $18,000
Internal Projects:       120h (19%)      N/A
Training/PTO:             60h (9%)       N/A

Highlights
----------
- Team exceeded utilization targets
- Client X on track for March delivery
- Bob Smith had 2 PTO days

Action Items
------------
- Carol Davis overtime - discuss workload
- Review Client Y scope (hours increasing)
```

### Implementation

```bash
# Get all entries for period
hrvst entries --from=PERIOD_START --to=PERIOD_END

# Get by user
hrvst reports time --from=PERIOD_START --to=PERIOD_END --by=user

# Get by project
hrvst reports time --from=PERIOD_START --to=PERIOD_END --by=project
```

---

## /remind

Send reminders to team members with incomplete timesheets.

### Usage

```
/remind [member-name]
/remind --all
/remind [member-name] --message "custom message"
```

### Examples

```
/remind Bob
/remind --all
/remind Carol --message "Please complete by 3pm for billing"
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `member-name` | string | Team member to remind |
| `--all` | flag | Remind all members with incomplete timesheets |
| `--message` | string | Custom reminder message |

### Workflow

1. **Identify incomplete timesheets:**
   ```
   Checking timesheets for week of Feb 17...

   Incomplete:
   - Bob Smith: 16h / 40h (missing Wed, Thu, Fri)
   - Carol Davis: 32h / 40h (missing Fri)

   Send reminders? [y/n/select]
   ```

2. **Generate reminder:**
   ```
   Reminder prepared for Bob Smith:

   Subject: Timesheet Reminder - Week of Feb 17

   Hi Bob,

   Your timesheet for the week of February 17 appears incomplete:
   - Current hours: 16h
   - Expected hours: 40h
   - Missing days: Wednesday, Thursday, Friday

   Please complete your timesheet by end of day Friday.

   Thanks,
   [Manager Name]

   Send this reminder? [y/n/edit]
   ```

3. **Send confirmation:**
   ```
   Reminder sent to Bob Smith via Slack.
   Reminder sent to Carol Davis via email.

   2 reminders sent successfully.
   ```

### Implementation

```bash
# Check each user's hours
for user_id in TEAM_USERS; do
  hours=$(hrvst entries --user-id=$user_id --from=WEEK_START --to=WEEK_END | calculate_total)
  if [ $hours -lt 40 ]; then
    # Add to reminder list
  fi
done

# Send via configured channel
```

### Configuration

Reminder delivery method configured in `~/.sabai/harvest.json`:

```json
{
  "reminder_channel": "slack",  // or "email", "both"
  "reminder_template": "default",
  "cc_on_reminders": false,
  "reminder_frequency": "once"  // or "daily"
}
```

---

## Access Control

All commands in this file require Manager or Admin access:

```
Before executing:
1. Check user role via Harvest API
2. Verify is_admin or is_project_manager
3. If not authorized:

   Error: Access Denied

   /team-timesheet requires Manager access.
   Your account has Employee-level permissions.

   Available commands:
   - /timesheet (personal)
   - /duplicate-week
   - /log

   Contact your Harvest admin for elevated access.
```

## Related

- `/timesheet` - Personal timesheet view (all users)
- `/duplicate-week` - Duplicate entries (all users)
- `user-roles` skill - Role detection and permissions
