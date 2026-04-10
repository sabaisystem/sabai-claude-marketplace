---
name: standup
description: Generate a daily standup summary from Linear activity
---

# /standup - Daily Standup Summary

Generate a daily standup summary from Linear activity.

## Usage

```
/standup [team] [date]
```

- `team`: Optional team filter (defaults to all teams)
- `date`: Optional date (defaults to yesterday)

## What It Does

1. Fetches completed issues from the specified period
2. Fetches in-progress issues
3. Identifies blockers and high-priority items
4. Formats into standup format

## Output Format

```markdown
# Daily Standup - [Date]

## ✅ Completed Yesterday
- [TICKET-123] Feature description
- [TICKET-124] Bug fix description

## 🔄 In Progress Today
- [TICKET-125] Current work (Owner)
- [TICKET-126] Ongoing task (Owner)

## 🚧 Blockers
- [TICKET-127] Blocked by: dependency/review/etc.

## 📌 Notes
- Any additional context
```

## Linear Queries

Use these MCP calls:
- `linear_search_issues` with `status:completed, completedAfter:[date]`
- `linear_search_issues` with `status:in_progress`
- `linear_search_issues` with `priority:1` for urgent items

## Tips

- Run at the start of each day
- Share output in Slack/team channel
- Highlight blockers that need immediate attention
