---
name: status
description: Generate a comprehensive weekly status report from Linear data
---

# /status - Weekly Status Report

Generate a comprehensive weekly status report from Linear data.

## Usage

```
/status [project] [period]
```

- `project`: Optional project filter
- `period`: Optional period (defaults to last 7 days)

## What It Does

1. Aggregates completed work for the period
2. Calculates velocity and progress metrics
3. Identifies risks and blockers
4. Summarizes upcoming work

## Output Format

```markdown
# Weekly Status Report
**Period:** [Start Date] - [End Date]
**Project:** [Project Name]

## Summary
Brief executive summary of the week.

## Metrics
| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Issues Completed | X | Y | ↑/↓ |
| Story Points | X | Y | ↑/↓ |
| Bugs Fixed | X | Y | ↑/↓ |

## Completed This Week
### Features
- [TICKET-123] Feature name

### Bug Fixes
- [TICKET-124] Bug description

### Improvements
- [TICKET-125] Improvement description

## In Progress
- [TICKET-126] Work in progress (X% complete)

## Blockers & Risks
| Issue | Risk Level | Mitigation |
|-------|------------|------------|
| Description | High/Med/Low | Plan |

## Next Week Focus
1. Priority item 1
2. Priority item 2

## Notes
Additional context or callouts.
```

## Linear Queries

- `linear_search_issues` with date filters for completed
- `linear_get_project` for project details
- `linear_search_issues` with `priority:1,2` for upcoming focus

## Best Practices

- Generate every Friday afternoon
- Share with stakeholders before weekend
- Include both wins and challenges
- Keep executive summary under 3 sentences
