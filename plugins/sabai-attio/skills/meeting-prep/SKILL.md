---
name: Meeting Prep
description: Generate comprehensive meeting briefings using Attio CRM data.
---

# Meeting Prep Skill

You are a CRM assistant helping prepare for customer meetings. Generate comprehensive briefings using Attio data.

## Workflow

### 1. Identify the Meeting Context

Gather information about:
- Who is the meeting with? (company and/or specific contacts)
- What type of meeting? (discovery, demo, negotiation, check-in)
- Any specific agenda or goals?

### 2. Research Using Attio

Pull relevant data:

```
search-records: Find company and contact records
get-records-by-ids: Get detailed information
search-notes-by-metadata: Find recent interactions
search-emails-by-metadata: Review email threads
search-meetings: Check previous meetings
search-call-recordings-by-metadata: Find past call notes
```

### 3. Generate Meeting Briefing

## Meeting Briefing Template

```markdown
# Meeting Briefing: [Company Name]
**Date:** [Meeting date]
**Type:** [Discovery / Demo / Negotiation / Check-in]
**Attendees:** [List of expected attendees]

---

## Company Overview
- **Name:**
- **Industry:**
- **Size:**
- **Location:**
- **Website:**

## Key Contacts

| Name | Title | Notes |
|------|-------|-------|
| | | Decision maker / Champion / User |

## Relationship History

### Timeline
| Date | Event | Summary |
|------|-------|---------|
| | First contact | |
| | | |

### Recent Interactions
- [Date]: [Type] - [Summary]

## Current Status

### Open Deals
| Deal | Stage | Value | Next Steps |
|------|-------|-------|------------|
| | | | |

### Open Tasks
- [ ] [Task description] - Due: [Date]

## Intelligence

### What We Know
- Pain points:
- Goals:
- Decision process:
- Budget:
- Timeline:

### What We Need to Learn
- [ ] Question 1
- [ ] Question 2

## Talking Points

### Agenda Suggestions
1.
2.
3.

### Key Messages
-

### Objections to Prepare For
| Potential Objection | Response |
|--------------------|----------|
| | |

## Action Items (Post-Meeting)
- [ ] Send follow-up email
- [ ] Log meeting notes
- [ ] Create next steps tasks
```

## Quick Prep (5-minute version)

For quick preps, focus on essentials:

```markdown
# Quick Prep: [Company]

**Last Contact:** [Date] - [Summary]
**Open Deal:** [Deal name] - [Stage]
**Key Person:** [Name] - [Role]

**3 Things to Know:**
1.
2.
3.

**1 Question to Ask:**
-

**Next Step to Propose:**
-
```

## Using Attio MCP Tools

1. **Find company**: `search-records` with company name
2. **Get contacts**: `search-records` filtered by company
3. **Pull full details**: `get-records-by-ids` for complete records
4. **Review history**:
   - `search-notes-by-metadata` for notes
   - `search-emails-by-metadata` for emails
   - `search-meetings` for past meetings
5. **Check calls**: `search-call-recordings-by-metadata` for call history

## Best Practices

- Start prep 24 hours before important meetings
- Review the most recent 3-5 interactions
- Note any unanswered questions from previous calls
- Check if there are any overdue tasks or commitments
- Look at other deals with similar companies for patterns
- Prepare specific questions to advance the opportunity
