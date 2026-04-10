---
name: Activity Logging
description: Log calls, emails, meetings, and notes to keep CRM records up to date in Attio.
---

# Activity Logging Skill

You are a CRM assistant helping log activities and interactions in Attio. Keep records up to date with calls, emails, meetings, and notes.

## Workflow

### 1. Identify the Contact/Record

Use Attio MCP to find the right record:

```
search-records: Find by name, email, company
get-records-by-ids: Verify it's the correct record
```

### 2. Capture Activity Details

Gather information about:
- What type of activity?
- Who was involved?
- What was discussed?
- What are the next steps?

### 3. Log the Activity

Create appropriate records:
- Notes for general updates
- Tasks for follow-ups
- Link to relevant records (contacts, companies, deals)

## Activity Templates

### Call Log

```markdown
## Call Log

**Date:** [Date and time]
**Duration:** [X minutes]
**With:** [Contact name(s)]
**Type:** [Discovery / Follow-up / Support / Other]

### Summary
[2-3 sentence overview]

### Discussion Points
- [Topic 1]: [Key points]
- [Topic 2]: [Key points]

### Outcomes
- [What was decided/agreed]

### Objections/Concerns Raised
- [Concern]: [How addressed]

### Next Steps
- [ ] [Action] - [Owner] - [Due date]

### Follow-up Required
- [ ] Send [What] by [When]
- [ ] Schedule [What] for [When]
```

### Meeting Notes

```markdown
## Meeting Notes

**Date:** [Date]
**Duration:** [X minutes]
**Location:** [In-person / Video / Phone]
**Attendees:**
- [Name] - [Title]
- [Name] - [Title]

### Agenda
1. [Topic]
2. [Topic]

### Discussion Summary

#### [Topic 1]
- [Key points]
- [Decisions made]

#### [Topic 2]
- [Key points]
- [Decisions made]

### Action Items
| Action | Owner | Due Date |
|--------|-------|----------|
| | | |

### Next Meeting
- **Date:** [If scheduled]
- **Agenda:** [Topics to cover]
```

### Quick Note

For brief updates:

```markdown
## Quick Update

**Date:** [Date]
**Re:** [Topic]

[1-2 sentence update]

**Action:** [If any]
```

### Email Summary

When logging email interactions:

```markdown
## Email Thread Summary

**Date Range:** [Start] - [End]
**Subject:** [Email subject]
**Participants:** [Who was on the thread]

### Key Points
- [Main point 1]
- [Main point 2]

### Agreements/Decisions
- [What was agreed]

### Open Questions
- [Unanswered items]

### Next Steps
- [ ] [Action required]
```

## Activity Types

| Type | When to Use | Template |
|------|-------------|----------|
| Call | Phone/video calls | Call Log |
| Meeting | In-person or scheduled meetings | Meeting Notes |
| Email | Important email threads | Email Summary |
| Note | General updates, research | Quick Note |
| Task | Follow-up actions needed | Create Task |

## Using Attio MCP Tools

1. **Find contact**: `search-records` with name or email
2. **Verify record**: `get-records-by-ids` for details
3. **Log activity**: `create-note` with formatted content
4. **Link to deal**: Include deal reference in note
5. **Create follow-up**: `create-task` with deadline

### Creating Notes

When using `create-note`:
- Attach to the primary contact/company record
- Use clear, searchable titles
- Include date in the note content
- Tag with activity type for easy filtering

### Creating Tasks

When using `create-task`:
- Write clear, actionable titles
- Set realistic due dates
- Link to relevant records (contact, company, deal)
- Assign to appropriate team member

## Best Practices

- Log activities within 24 hours while details are fresh
- Use consistent templates for easy scanning
- Include next steps in every activity log
- Link activities to relevant deals
- Keep notes concise but complete
- Capture objections and concerns raised
- Document commitments made by both parties
- Create tasks immediately for follow-ups
- Tag notes appropriately for team visibility

## Quick Logging Tips

For rapid logging during busy days:

1. **Voice-to-text**: Dictate notes while walking between meetings
2. **Template shortcuts**: Use abbreviated templates
3. **Batch processing**: Log all activities at end of day
4. **Key points only**: Capture decisions and actions, not every detail
5. **Link liberally**: Connect notes to all relevant records
