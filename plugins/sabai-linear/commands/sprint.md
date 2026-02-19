# /sprint - Sprint Planning Assistant

Help plan and analyze sprints using Linear data.

## Usage

```
/sprint [action] [sprint-name]
```

Actions:
- `plan` - Help plan upcoming sprint
- `review` - Review current/past sprint
- `capacity` - Analyze team capacity

## Sprint Planning

### Capacity Calculation

```markdown
## Team Capacity - Sprint [X]

| Team Member | Available Days | Capacity (pts) |
|-------------|----------------|----------------|
| Name 1 | 10 | 20 |
| Name 2 | 8 (PTO 2 days) | 16 |
| **Total** | **18** | **36** |

## Recommended Load
- Target: 80% of capacity = 29 points
- Buffer for bugs/interrupts: 20%
```

### Sprint Scope

```markdown
## Proposed Sprint Scope

### Committed
| Ticket | Points | Owner | Priority |
|--------|--------|-------|----------|
| TICKET-123 | 5 | Name | P1 |
| TICKET-124 | 3 | Name | P1 |

**Total Committed:** 20 points

### Stretch Goals
| Ticket | Points | Owner |
|--------|--------|-------|
| TICKET-125 | 5 | Name |

### Carry-over from Last Sprint
- TICKET-100 (3 pts) - 50% complete
```

## Sprint Review

```markdown
## Sprint Review - Sprint [X]

### Metrics
| Metric | Planned | Actual | % |
|--------|---------|--------|---|
| Points | 30 | 25 | 83% |
| Issues | 12 | 10 | 83% |

### Completed
- [TICKET-123] Feature A
- [TICKET-124] Bug fix B

### Not Completed
| Ticket | Reason | Action |
|--------|--------|--------|
| TICKET-125 | Blocked | Carry to next sprint |
| TICKET-126 | Descoped | Move to backlog |

### Velocity Trend
Sprint N-2: 25 pts
Sprint N-1: 28 pts
Sprint N: 25 pts
Average: 26 pts
```

## Linear Queries

- `linear_get_cycles` for sprint/cycle data
- `linear_search_issues` with cycle filter
- `linear_get_team` for team members

## Tips

- Plan to 80% capacity
- Account for meetings and context switching
- Include buffer for production issues
- Review velocity trends before committing
