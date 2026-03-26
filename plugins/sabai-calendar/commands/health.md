# /health - Calendar Health Check

Analyze your calendar patterns and get recommendations.

## Usage

```
/health [period]
```

- `period`: Optional, defaults to "this week"

## Examples

```
/health
/health last week
/health this month
```

## What It Does

1. Analyzes meeting patterns and load
2. Identifies calendar health issues
3. Calculates focus time metrics
4. Detects back-to-back meeting chains
5. Provides actionable recommendations

## Output Format

```markdown
# Calendar Health Report

**Period:** This Week (Jan 15-19)

## Health Score: 72/100

### Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Meeting Hours | 24 hrs | <20 hrs | Over |
| Focus Blocks | 6 hrs | 10 hrs | Low |
| Longest Focus | 90 min | 120 min | Good |
| Back-to-Back | 8 | 0 | High |
| Lunch Protected | 3/5 days | 5/5 | Needs Work |

## Meeting Load Distribution

```
Mon: ████████░░ 80%
Tue: ██████████ 100%
Wed: ████░░░░░░ 40%
Thu: ███████░░░ 70%
Fri: ██░░░░░░░░ 20%
```

## Issues Found

### Critical
- Tuesday has no breaks between 9 AM and 4 PM
- Only 6 hours of focus time this week

### Warnings
- 3 meetings scheduled during lunch
- Friday afternoon has 2 low-priority meetings

## Recommendations

1. **Add buffer time** - Insert 15-min breaks between Tuesday meetings
2. **Protect lunch** - Block 12-1 PM on all days
3. **Consolidate meetings** - Move Thursday meetings to morning
4. **Decline or delegate** - Review Friday afternoon meetings

## Quick Actions
- Block 2-hour focus time Wednesday morning?
- Reschedule lunch conflicts?
- Add recurring lunch blocks?
```

## Metrics Explained

- **Meeting Hours**: Total time in meetings
- **Focus Blocks**: Uninterrupted work time (90+ min)
- **Back-to-Back**: Consecutive meetings with no break
- **Lunch Protected**: Days with 12-1 PM free

## Options

- `--compare [period]`: Compare to previous period
- `--team`: Include team calendar analysis
- `--export`: Export report to markdown file

## Tips

- Run weekly to track calendar health trends
- Address "critical" issues immediately
- Aim for health score above 80
- Share with manager if chronically overloaded
