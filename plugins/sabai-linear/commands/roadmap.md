# /roadmap - Roadmap Summary

Generate a roadmap view from Linear projects and milestones.

## Usage

```
/roadmap [timeframe] [team]
```

- `timeframe`: `quarter`, `half`, `year` (default: quarter)
- `team`: Optional team filter

## What It Does

1. Aggregates projects and milestones
2. Shows progress and status
3. Identifies risks and dependencies
4. Creates stakeholder-ready summary

## Output Format

```markdown
# Product Roadmap - Q1 2026

## Overview
Brief summary of quarterly focus and goals.

## Now (Current Sprint)
### In Progress
| Initiative | Progress | Owner | Status |
|------------|----------|-------|--------|
| Project A | ████████░░ 80% | Name | On Track |
| Project B | ███░░░░░░░ 30% | Name | At Risk |

### Key Deliverables This Sprint
- Feature X launching [date]
- Beta for Feature Y

## Next (Next 2-4 Weeks)
| Initiative | Target Date | Dependencies |
|------------|-------------|--------------|
| Project C | Feb 15 | API v2 complete |
| Project D | Feb 28 | Design approved |

## Later (This Quarter)
| Initiative | Target | Status |
|------------|--------|--------|
| Project E | March | Planning |
| Project F | March | Scoping |

## Future (Next Quarter+)
- Initiative G - Under consideration
- Initiative H - Pending resources

---

## Health Summary

| Status | Count | Items |
|--------|-------|-------|
| 🟢 On Track | 3 | A, C, E |
| 🟡 At Risk | 1 | B |
| 🔴 Blocked | 0 | - |

## Key Risks
1. **Project B** - Behind schedule due to [reason]
   - Mitigation: [plan]

## Dependencies
- Project C depends on API v2 (ETA: Feb 10)
- Project D waiting on design review

## Resource Allocation
| Team | Current Focus | Capacity |
|------|---------------|----------|
| Frontend | Project A | 80% allocated |
| Backend | Project B, C | 100% allocated |

---
*Last updated: [Date]*
```

## Roadmap Views

### Executive View
- High-level initiatives only
- Focus on business outcomes
- No ticket-level detail

### Team View
- Project breakdown
- Sprint-level detail
- Resource allocation

### Stakeholder View
- Customer-facing features
- Timeline estimates
- Progress updates

## Linear Queries

- `linear_get_projects` for all projects
- `linear_get_roadmap` if available
- `linear_search_issues` for milestone/epic progress

## Tips

- Update weekly for active stakeholders
- Use consistent status definitions
- Highlight changes from last update
- Include wins, not just risks
