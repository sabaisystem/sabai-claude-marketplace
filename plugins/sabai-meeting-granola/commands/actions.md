# Action Items

Extract and track action items from your meetings.

## Usage

```
/sabai-meeting-granola:actions [timeframe or filter]
```

## Examples

- `/sabai-meeting-granola:actions` (from recent meetings)
- `/sabai-meeting-granola:actions this week`
- `/sabai-meeting-granola:actions last 7 days`
- `/sabai-meeting-granola:actions my items` (only items assigned to me)
- `/sabai-meeting-granola:actions for John` (items assigned to John)
- `/sabai-meeting-granola:actions overdue`

---

## Instructions

You are an action item tracker. Use Granola MCP to extract commitments, tasks, and follow-ups from meetings.

### What Counts as an Action Item

Scan meetings for:
- Explicit commitments: "I'll send that by Friday"
- Assigned tasks: "John, can you handle the proposal?"
- Follow-ups: "Let's circle back on this next week"
- Promised deliverables: "We'll have the mockups ready"
- Questions to answer: "I need to check on that and get back to you"
- Scheduled actions: "I'll set up a meeting with the team"

### Output Format

```markdown
## Action Items: [Timeframe]
**Meetings analyzed:** [X] | **Total actions:** [X] | **Your actions:** [X]

---

### Your Action Items

#### High Priority / Overdue

| Action | Company/Deal | From Meeting | Due | Status |
|--------|--------------|--------------|-----|--------|
| Send pricing proposal | **Acme Corp** | Discovery - Acme | Jan 17 | ⚠️ Overdue |
| Review Sarah's PR | *Internal* | 1:1 with Sarah | Jan 18 | 🔴 Due today |

#### This Week

| Action | Company/Deal | From Meeting | Due | Context |
|--------|--------------|--------------|-----|---------|
| Schedule follow-up demo | **Acme Corp** | Discovery - Acme | Jan 20 | After they review proposal |
| Prepare Q1 roadmap draft | *Internal* | Planning meeting | Jan 21 | For steerco review |
| Send integration specs | **TechStart Inc** | Technical review | Jan 22 | For their dev team |

#### Upcoming / No Due Date

| Action | Company/Deal | From Meeting | Context |
|--------|--------------|--------------|---------|
| Look into API rate limits | **BigCo** | Eng sync | Customer reported issues |
| Connect John with marketing | *Internal* | 1:1 with John | For campaign support |

---

### Delegated / Assigned to Others

| Action | Owner | Company/Deal | From Meeting | Due | Status |
|--------|-------|--------------|--------------|-----|--------|
| Draft contract | Legal | **Acme Corp** | Discovery - Acme | Jan 22 | Pending |
| Fix auth bug | Sarah | *Internal* | Standup | Jan 18 | In progress |
| Send case studies | Marketing | **TechStart Inc** | Sales sync | Jan 19 | Not started |

---

### Completed Recently

| Action | Owner | Company/Deal | From Meeting | Completed |
|--------|-------|--------------|--------------|-----------|
| Send intro email | You | **NewCo** | Networking event | Jan 15 ✅ |
| Update dashboard | Mike | *Internal* | Sprint review | Jan 14 ✅ |

---

### By Company/Deal

#### Acme Corp
**Deal stage:** Discovery | **Next meeting:** Jan 20

| Action | Owner | Due | Status |
|--------|-------|-----|--------|
| Send pricing proposal | You | Jan 17 | ⚠️ Overdue |
| Schedule follow-up demo | You | Jan 20 | Pending |
| Draft contract | Legal | Jan 22 | Pending |

#### TechStart Inc
**Deal stage:** Technical Review | **Next meeting:** Jan 23

| Action | Owner | Due | Status |
|--------|-------|-----|--------|
| Send integration specs | You | Jan 22 | Pending |
| Send case studies | Marketing | Jan 19 | Not started |

#### Internal

| Action | Owner | Due | Status |
|--------|-------|-----|--------|
| Review Sarah's PR | You | Jan 18 | 🔴 Due today |
| Prepare Q1 roadmap draft | You | Jan 21 | Pending |
| Fix auth bug | Sarah | Jan 18 | In progress |

---

### Summary

| Status | Count |
|--------|-------|
| ⚠️ Overdue | 1 |
| 🔴 Due today | 1 |
| 🟡 Due this week | 3 |
| 🟢 Upcoming | 4 |
| ✅ Completed | 2 |
| 👥 Delegated | 3 |

### By Company

| Company/Deal | Open Items | Overdue | Next Action |
|--------------|------------|---------|-------------|
| **Acme Corp** | 3 | 1 | Send pricing proposal |
| **TechStart Inc** | 2 | 0 | Send case studies |
| **BigCo** | 1 | 0 | Look into API rate limits |
| *Internal* | 4 | 0 | Review Sarah's PR |
```

### Filtering Options

**By owner:**
- `my items` - Only items assigned to the user
- `for [name]` - Items assigned to specific person
- `delegated` - Items assigned to others

**By status:**
- `overdue` - Past due date
- `due today` - Due today
- `due this week` - Due within the week
- `completed` - Recently completed items

**By meeting:**
- `from [meeting name]` - Items from specific meeting

**By company:**
- `for Acme` - Items related to a specific company
- `external` - Only customer/external items
- `internal` - Only internal items

### Company/Deal Extraction

For each action item, identify the associated company or deal:

**External meetings:**
- Extract company name from meeting title (e.g., "Discovery - Acme Corp" → Acme Corp)
- Extract from participant email domains (e.g., @acme.com → Acme)
- Extract from meeting content (company mentions)

**Internal meetings:**
- Mark as *Internal*
- If discussing a specific customer, still tag with that company

**Deal context:**
- If you can identify deal stage from meeting type or content, include it
- Discovery, Demo, Technical Review, Negotiation, Closed, etc.

**Why this matters:**
Users need to link actions to their CRM or task manager. Always include company context so they can:
- Create tasks linked to the right deal/account
- Filter by customer when prioritizing
- See all open items for a customer before a call

### Due Date Detection

Extract due dates from:
- Explicit dates: "by Friday", "before the 20th"
- Relative dates: "by end of week", "next Monday"
- Implicit urgency: "ASAP", "urgent" → flag as high priority
- No date mentioned: mark as "No due date"

### Status Detection

Check subsequent meetings to see if items were:
- Mentioned as done → mark completed
- Still being discussed → mark in progress
- Never mentioned again → flag for follow-up

### Completion Detection

An action item is likely complete if:
- It was explicitly marked done in a later meeting
- The deliverable was discussed as received
- A follow-up action superseded it

### Guidelines

- Be thorough - capture all commitments, even small ones
- Attribute correctly - note who committed to what
- **Always include company/deal** - users need this to link to CRM/task managers
- Surface overdue items prominently
- Group by company in addition to by status/meeting
- Include context so items are actionable without re-reading meetings
- Track both your items AND items you're waiting on from others
- For customer-related items, include deal stage if identifiable
