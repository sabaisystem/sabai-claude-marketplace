---
name: roadmap
description: Generate a timeline-based roadmap view from Linear projects and milestones
---

# /roadmap - Roadmap Summary

Generate a timeline-based roadmap view from Linear projects and milestones, organized by month with status indicators.

## Usage

```
/roadmap [timeframe] [--team name]
```

- `timeframe`: `q1`-`q4`, `h1`-`h2`, `2026`, `next-3-months` (default: current quarter)
- `--team`: Optional team name filter

**Examples:**
- `/roadmap` — Current quarter roadmap
- `/roadmap q2` — Q2 of the current year
- `/roadmap h1 --team SCM` — First half, filtered to one team
- `/roadmap 2026` — Full year view
- `/roadmap next-3-months` — Rolling 3-month window

## Instructions

### Step 1: Resolve Timeframe to Date Range (Client-Side)

Parse the timeframe argument into `startDate` and `endDate` (ISO 8601 date strings, e.g., `2026-01-01`):

| Input | Start | End |
|-------|-------|-----|
| `q1` | Jan 1 | Mar 31 |
| `q2` | Apr 1 | Jun 30 |
| `q3` | Jul 1 | Sep 30 |
| `q4` | Oct 1 | Dec 31 |
| `h1` | Jan 1 | Jun 30 |
| `h2` | Jul 1 | Dec 31 |
| `2026` | Jan 1 2026 | Dec 31 2026 |
| `next-3-months` | Today | Today + 3 months |
| *(none)* | Current quarter start | Current quarter end |

Generate a list of **month labels** for the timeline sections (e.g., `["January 2026", "February 2026", "March 2026"]`).

### Step 2: Resolve Team Context

1. Call `mcp__sabai-linear__linear_get_teams` to list available teams
2. Note the team list for later filtering
3. If `--team` is specified:
   - Fuzzy-match the provided name against team `name` or `key` (e.g., "SCM" matches the team with key "SCM")
   - Note the matched `teamId`
4. If no `--team` specified, roadmap covers all teams

### Step 3: Fetch All Projects

Call `mcp__sabai-linear__linear_list_projects` with:
- `teamId`: from Step 2 (only if `--team` was specified)
- `includeArchived`: `false`

This returns a list of projects with `id`, `name`, `description`, `state`, `progress`, `targetDate`.

#### Handling No Match (Team or Project)

If `--team` was specified but no fuzzy match was found for the team name:
1. List all available teams from the `linear_get_teams` response
2. Display: "No team matching '[input]' found. Available teams: [list of team names with keys]"
3. Ask the user to choose a team or retry with a corrected name

If a project name is referenced later (e.g., in a follow-up filter) but no fuzzy match is found:
1. List all available projects from the `linear_list_projects` response
2. Display: "No project matching '[input]' found. Available projects: [list of project names]"
3. Ask the user to choose or retry

### Step 4: Enrich Projects with Full Details

For each project from Step 3, call `mcp__sabai-linear__linear_get_project` with:
- `projectId`: the project's `id`

This returns additional fields needed for the roadmap: `startDate`, `startedAt`, `completedAt`, `lead`, `members`, `teams`.

**Optimization:** If Step 3 returned more than 15 projects, pre-filter before enriching. Skip projects where:
- `state` is `"canceled"` (they'll be counted but not displayed)
- `targetDate` exists AND is before `startDate` from Step 1 AND `state` is `"completed"` (already finished before timeframe)

### Step 5: Fetch Project Milestones

For each project (after filtering), call `mcp__sabai-linear__linear_get_project_milestones` with:
- `projectId`: the project's `id`

This returns milestones with `name`, `description`, `targetDate`, `status`, `progress`, `sortOrder`.

Milestone `status` values: `done`, `next`, `overdue`, `unstarted`

### Step 6: Determine Display Status (Client-Side)

For each project, assign a display status based on its `state` and `progress`:

| Condition | Display Status | Icon |
|-----------|---------------|------|
| `state` is `"completed"` or `progress` = 1 | `SHIPPED` | `[check]` |
| `state` is `"started"` and on track (has `targetDate` in the future or no `targetDate`) | `IN PROGRESS` | `[arrow]` |
| `state` is `"started"` and overdue (`targetDate` is past) | `DELAYED` | `[warning]` |
| `state` is `"paused"` | `DELAYED` | `[warning]` |
| `state` is `"planned"` or `"backlog"` | `PLANNED` | `[circle]` |
| `state` is `"canceled"` | *(skip from timeline, count in summary)* | — |

For `IN PROGRESS` projects, append the progress percentage: `IN PROGRESS - 45%`

### Step 7: Assign Projects to Months (Client-Side)

Place each project into a month section based on these rules:

1. **Completed projects** (`SHIPPED`): Use `completedAt` month. If `completedAt` is outside the timeframe, place in the closest boundary month.
2. **In Progress projects**: Place in the current month. If `targetDate` exists and is in a different month within the timeframe, also note it as "(target: [Month])".
3. **Planned projects**: Use `startDate` month if available, otherwise `targetDate` month.
4. **No dates at all**: Place in an "Unscheduled" section at the end.

Only include months that fall within the `startDate`–`endDate` range from Step 1.

### Step 8: Build Key Milestones

From all project milestones collected in Step 5, filter to those with a `targetDate` within the timeframe. Sort by `targetDate` ascending.

Format each as: `[targetDate]: [milestone name] ([project name])`

Include milestone status if not `done`:
- `overdue` → append `(OVERDUE)`
- `next` → append `(next up)`

### Step 9: Identify Dependencies & Risks (Client-Side)

Flag the following as risks:

1. **Overdue projects**: `state` is `"started"` and `targetDate` is in the past → "[warning] [Project Name] is past its target date of [date]"
2. **Paused projects**: `state` is `"paused"` → "[warning] [Project Name] is paused"
3. **Overdue milestones**: Any milestone with `status` = `"overdue"` → "[warning] Milestone '[name]' in [Project Name] is overdue"
4. **No lead assigned**: Project has no `lead` and is `IN PROGRESS` → "[info] [Project Name] has no lead assigned"
5. **Stale in-progress projects**: `state` is `"started"` and `progress` has not changed (or project `updatedAt` > 14 days ago) → "[warning] [Project Name] may be stalled — no progress in 14+ days"

> **Dependency data:** The roadmap shows project-level status only. For ticket-level dependency graphs (blocks/blocked-by), use `/dependencies [project-name]`.

### Step 10: Compute Summary Statistics (Client-Side)

Count projects by display status (excluding canceled):

| Status | Count | Percentage |
|--------|-------|------------|
| Shipped | N | (N / total * 100)% |
| In Progress | N | (N / total * 100)% |
| Planned | N | (N / total * 100)% |
| Delayed | N | (N / total * 100)% |

Also note how many were canceled (mentioned as a footnote if > 0).

### Step 11: Format Output

Present the final output in this format. **Omit any sections that have zero items.**

## Output Format

```markdown
# Roadmap: [Timeframe Label]
   Team: [Team Name or "All Teams"]

---

## Timeline View

### [Month Year]
[icon] [Project Name]  [STATUS - progress%]
   [Short description from project description, first sentence or 80 chars]
   Lead: [lead name or "Unassigned"]

[icon] [Project Name]  [STATUS]
   [Short description]

### [Next Month Year]
...

### Unscheduled
[circle] [Project Name]  [PLANNED]
   No target date set

---

## Summary
| Status | Count | % |
|--------|-------|---|
| Shipped | N | N% |
| In Progress | N | N% |
| Planned | N | N% |
| Delayed | N | N% |

*N canceled projects excluded*

## Key Milestones
- [Date]: [Milestone] ([Project])
- [Date]: [Milestone] ([Project]) (OVERDUE)

## Dependencies & Risks
- [warning] [Description]
- [info] [Description]

---
*Generated from Linear on [today's date]*
```

## Notes

- The timeframe argument is parsed client-side — no Linear API supports date-range filtering on projects
- `linear_list_projects` returns all non-archived projects; date filtering happens client-side after enrichment
- `linear_get_project` provides `startDate`, `completedAt`, and `lead` which `list_projects` does not
- `linear_get_project_milestones` is a dedicated tool for fetching project milestones
- Canceled projects are excluded from the timeline but counted in the summary footnote
- Progress percentage is only shown for `IN PROGRESS` projects
- If no projects match the timeframe, show a message: "No projects found for [timeframe]. Try a broader range."
- Month sections with no projects are omitted
- The "Unscheduled" section only appears if there are projects with no dates
