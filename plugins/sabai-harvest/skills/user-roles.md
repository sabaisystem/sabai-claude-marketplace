# User Roles Skill

This skill enables role-based access control in Sabai Harvest, differentiating between Employee and Manager capabilities.

## Trigger Conditions

Use this skill when:
- User asks about team timesheets or approvals
- User requests project budget or financial information
- User wants to send reminders to team members
- User asks about their role or permissions
- Detecting user capabilities from Harvest API

## User Roles

### Employee Role (Time Submitter)

Employees are individual contributors who track their own time.

**Capabilities:**
- Submit their own time entries
- View their own timesheet
- Duplicate their previous weeks
- See projects they're assigned to
- Create and manage their own aliases

**What they can see:**
- Their time entries only
- Project names (no financial data)
- Their personal totals and hours

**Available Commands:**
- `/timesheet` - View personal timesheet
- `/duplicate-week` - Copy last week's entries
- `/log` - Quick time entry
- `/setup-harvest` - Initial setup

### Manager Role (Time Validator)

Managers have administrative access to review and approve team time.

**Capabilities:**
- All Employee capabilities, plus:
- Review and approve team timesheets
- Access project financials (budgets, rates, costs)
- View team member time entries
- Generate reports across team/projects
- Identify missing or incomplete timesheets
- Send reminders to team members

**What they can see:**
- Team members' time entries
- Project budgets and burn rates
- Billable vs non-billable breakdown
- Cost and revenue data
- Approval status

**Additional Commands:**
- `/team-timesheet` - View team member timesheets
- `/approve` - Approve/reject timesheets
- `/project-budget` - View project financial data
- `/team-report` - Generate team reports
- `/remind` - Send reminders for incomplete timesheets

## Role Detection

### Automatic Detection from Harvest API

The plugin detects user role based on Harvest API permissions:

```bash
# Check user permissions
hrvst me

# Response includes:
# - is_admin: true/false
# - is_project_manager: true/false
# - can_see_rates: true/false
# - can_create_projects: true/false
```

**Detection Logic:**
1. If `is_admin` is true -> Manager role
2. If `is_project_manager` is true -> Manager role
3. If `can_see_rates` is true -> Manager role (limited)
4. Otherwise -> Employee role

### Manual Configuration

Users can also set their role in plugin configuration:

```json
// ~/.sabai/harvest.json
{
  "role": "manager",  // or "employee"
  "team_id": "12345",
  "default_view": "team"
}
```

## Context-Aware Commands

Commands adapt based on detected role:

| Command | Employee Behavior | Manager Behavior |
|---------|-------------------|------------------|
| `/timesheet` | Shows own timesheet | Shows own timesheet (use `/team-timesheet` for team) |
| `/duplicate-week` | Duplicates own week | Duplicates own week |
| `/team-timesheet` | Error: No access | Shows team timesheet grid |
| `/approve` | Error: No access | Opens approval workflow |
| `/project-budget` | Error: No access | Shows project financials |
| `/team-report` | Error: No access | Generates team report |
| `/remind` | Error: No access | Sends reminder to team member |

## Team Timesheet View (Managers)

Managers see a consolidated team view:

```
Team: Engineering (Week of Feb 17)

Member      Mon  Tue  Wed  Thu  Fri  Total  Status
-----------------------------------------------------
Alice        8    8    8    8    8    40h   Submitted
Bob          8    8    -    -    -    16h   Incomplete
Carol        8    8    8    8    -    32h   In Progress
David        8    8    8    8    8    40h   Approved
-----------------------------------------------------
Team Total: 128h / 160h expected (80%)

Legend:
  Submitted  - Ready for approval
  Incomplete - Missing entries (action needed)
  In Progress - Still being filled
  Approved   - Manager approved
```

### Filtering Team View

```bash
# View specific team member
hrvst entries --user-id=12345 --from=2026-02-17 --to=2026-02-21

# View by project
hrvst entries --project-id=67890 --from=2026-02-17 --to=2026-02-21

# View incomplete only
# (Filter locally for status != approved)
```

## Project Budget Dashboard (Managers)

Financial overview for project managers:

```
Project: Client X Development

Budget:     $50,000
Spent:      $32,450 (65%)
Remaining:  $17,550
Burn Rate:  $8,100/week
Runway:     ~2 weeks

Hours This Week: 45h
  - Billable:    40h ($4,000)
  - Non-billable: 5h

Team Breakdown:
  Alice:  20h ($2,000)
  Bob:    15h ($1,500)
  Carol:  10h ($500 - junior rate)
```

### Budget Commands

```bash
# Get project budget info
hrvst projects --id=PROJECT_ID

# Get project hours
hrvst reports projects --from=2026-01-01 --to=2026-02-20 --project-id=PROJECT_ID

# Get billable breakdown
hrvst reports time --billable=true --project-id=PROJECT_ID
```

## Approval Workflow

### Viewing Pending Approvals

```
Pending Approvals (3)

1. Alice Chen - Week of Feb 17
   40h total | 38h billable | 2h internal
   Projects: Client X (32h), Internal (8h)
   [Approve] [Reject] [View Details]

2. Bob Smith - Week of Feb 17
   38h total | 35h billable | 3h internal
   Projects: Client Y (38h)
   [Approve] [Reject] [View Details]

3. Carol Davis - Week of Feb 10 (late)
   40h total | 40h billable
   Projects: Client X (40h)
   [Approve] [Reject] [View Details]
```

### Approval Actions

```bash
# Approve timesheet (via Harvest API)
# Note: Actual approval requires Harvest admin access

# Add comment on approval
hrvst note "Approved - good work on Client X milestone"

# Reject with feedback
hrvst note "Please add notes to the 8h entry on Tuesday"
```

### Reminder Workflow

```bash
# Identify incomplete timesheets
hrvst entries --user-id=USER_ID --from=WEEK_START --to=WEEK_END

# Send reminder (via email/slack integration)
# Plugin can generate reminder message for manual sending
```

**Example Reminder:**
```
Subject: Timesheet Reminder - Week of Feb 17

Hi Bob,

Your timesheet for the week of February 17 appears incomplete:
- Current hours: 16h
- Expected hours: 40h
- Missing days: Wed, Thu, Fri

Please complete your timesheet by end of day Friday.

Thanks,
[Manager Name]
```

## Privacy Considerations

### Data Access Rules

1. **Employees cannot see:**
   - Other team members' time entries
   - Hourly rates or costs
   - Project budgets
   - Approval status of others

2. **Managers can see:**
   - Only their direct reports (based on Harvest permissions)
   - Only projects they manage
   - Financial data for their projects only

3. **Never expose:**
   - Individual hourly rates to other employees
   - Personal notes without consent
   - Data outside Harvest permission scope

### Permission Enforcement

```
Before executing manager commands:

1. Check user role via Harvest API
2. Verify access to requested resource
3. If denied, show helpful error:

   "You don't have permission to view team timesheets.
   This feature requires Manager or Admin access in Harvest.
   Contact your Harvest admin if you believe this is an error."
```

### Audit Trail

All manager actions should be logged:
- Who approved/rejected
- Timestamp of action
- Any comments or feedback

## Error Handling

### No Access Errors

```
Error: Access Denied

You attempted to use a manager-only command (/team-timesheet)
but your Harvest account has Employee-level access.

Available commands for your role:
  /timesheet      - View your personal timesheet
  /duplicate-week - Copy last week's entries
  /log            - Quick time entry

To get manager access, contact your Harvest administrator.
```

### Partial Access

Some users may have limited manager access:

```
Note: Limited Manager Access

You can view team timesheets but cannot:
- Access project financials (requires admin)
- Approve/reject timesheets (requires admin)

Available manager features:
  /team-timesheet - View team hours
  /team-report    - Generate basic reports
```

## Implementation Notes

### Role Caching

Cache detected role to avoid repeated API calls:

```json
// ~/.sabai/harvest-cache.json
{
  "user_id": 12345,
  "role": "manager",
  "permissions": {
    "is_admin": false,
    "is_project_manager": true,
    "can_see_rates": true,
    "managed_project_ids": [111, 222, 333]
  },
  "cached_at": "2026-02-20T12:00:00Z",
  "expires_at": "2026-02-21T12:00:00Z"
}
```

### Graceful Degradation

If role detection fails:
1. Default to Employee role (most restrictive)
2. Show message: "Could not detect your role. Using default permissions."
3. Allow user to manually configure if needed

### Testing Role Access

```bash
# Test employee access
hrvst entries --user-id=OTHER_USER
# Should fail for employees

# Test manager access
hrvst entries --user-id=OTHER_USER
# Should succeed for managers with correct permissions
```
