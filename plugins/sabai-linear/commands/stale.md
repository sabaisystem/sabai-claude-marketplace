---
name: stale
description: Identify tickets that haven't been updated recently
---

# /stale - Find Stale Tickets

Identify tickets that haven't been updated recently.

## Usage

```
/stale [days] [project|team]
```

- `days`: Days since last update (default: 14)
- `project|team`: Optional filter

## What It Does

1. Finds tickets without recent activity
2. Categorizes by staleness severity
3. Identifies patterns (owner, type, etc.)
4. Suggests actions

## Output Format

```markdown
## Stale Tickets Report
**Generated:** [Date]
**Threshold:** No updates in [X] days

### Summary
| Category | Count |
|----------|-------|
| Critical (30+ days) | 5 |
| Warning (14-30 days) | 12 |
| Watch (7-14 days) | 8 |

### Critical - Immediate Attention 🔴
| Ticket | Days Stale | Owner | Status | Last Activity |
|--------|------------|-------|--------|---------------|
| TICKET-100 | 45 | Name | In Progress | Comment on [date] |
| TICKET-101 | 32 | Name | Review | Status change |

### Warning - Needs Review 🟡
| Ticket | Days Stale | Owner | Status |
|--------|------------|-------|--------|
| TICKET-110 | 21 | Name | Todo |

### Patterns Identified
- **Owner with most stale:** Name (5 tickets)
- **Common status:** In Review (40%)
- **Common label:** backend (30%)

### Recommended Actions
1. **TICKET-100** - Close as won't fix or reassign
2. **TICKET-101** - Stuck in review, escalate
3. **TICKET-110** - Needs refinement, add to next sprint

### Quick Actions
- Close abandoned tickets: TICKET-102, TICKET-103
- Reassign blocked tickets: TICKET-104
- Add to current sprint: TICKET-105
```

## Staleness Thresholds

| Level | Days | Action |
|-------|------|--------|
| Watch | 7-14 | Monitor |
| Warning | 14-30 | Review status |
| Critical | 30+ | Immediate action |
| Abandoned | 60+ | Consider closing |

## Linear Queries

- `linear_search_issues` with `updatedBefore:[date]`
- Filter out completed/cancelled statuses
- Check `updatedAt` field

## Common Causes & Solutions

| Cause | Solution |
|-------|----------|
| Blocked by external | Add blocker label, set reminder |
| Unclear requirements | Send back to refinement |
| Owner overloaded | Reassign or reprioritize |
| No longer relevant | Close with reason |
| Waiting on review | Escalate to reviewer |

## Tips

- Run weekly as part of backlog hygiene
- Set up alerts for tickets approaching staleness
- Review stale tickets in sprint retrospectives
- Consider auto-closing very old low-priority tickets
