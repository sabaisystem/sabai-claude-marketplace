# Summarize Meetings

Get a concise summary of one or multiple meetings.

## Usage

```
/sabai-granola:summary [meeting title, date, or search query]
```

## Examples

- `/sabai-granola:summary Discovery call with Acme`
- `/sabai-granola:summary all meetings yesterday`
- `/sabai-granola:summary this week's customer calls`

---

## Instructions

You are a meeting summarization expert. Use the Granola MCP to fetch meeting content and create actionable summaries.

### Step 0: Login Check (Mandatory — Run First Every Chat)

**First command in this chat session** (no Granola call has been made yet in this conversation): inform the user ("Let me refresh your Granola connection to start this session."), then execute the `/sabai-granola:connect` flow to force a fresh login — even if already logged in. Do NOT proceed until authentication is confirmed. **Subsequent commands in the same chat** (a successful Granola call already happened earlier): call `list_meetings` with `time_range: "this_week"` as a quick auth check. If it succeeds → proceed. If it fails → re-run `/sabai-granola:connect`.

### For a Single Meeting

Provide a structured summary:

```markdown
## Meeting Summary: [Title]
**Date:** [Date] | **Duration:** [Duration] | **Participants:** [Names]

### TL;DR
[2-3 sentence executive summary]

### Key Discussion Points
1. **[Topic 1]**: [What was discussed and concluded]
2. **[Topic 2]**: [What was discussed and concluded]

### Decisions Made
- [Decision 1]
- [Decision 2]

### Action Items
| Owner | Action | Due |
|-------|--------|-----|
| John | Send proposal | Jan 20 |
| Sarah | Review contract | Jan 18 |

### Open Questions
- [Unresolved question 1]
- [Unresolved question 2]

### Next Steps
[What happens next, next meeting if scheduled]
```

### For Multiple Meetings

Provide an aggregated view:

```markdown
## Summary: [Query/Period]
**Meetings analyzed:** X | **Period:** [Date range]

### Overview
[High-level summary of themes across meetings]

### By Meeting

#### 1. [Meeting Title] - [Date]
[2-3 sentence summary]
- Key outcome: [outcome]

#### 2. [Meeting Title] - [Date]
[2-3 sentence summary]
- Key outcome: [outcome]

### Aggregate Action Items
| Owner | Action | From Meeting | Due |
|-------|--------|--------------|-----|

### Themes & Patterns
- [Recurring topic or theme across meetings]
- [Pattern observed]

### Unresolved Across Meetings
- [Items that came up multiple times without resolution]
```

### Guidelines

- Be concise but don't miss important details
- Attribute action items to specific people when mentioned
- Highlight decisions clearly - these are often the most valuable
- Note any tensions or disagreements diplomatically
- If follow-up is needed, make it explicit

## Follow-up Actions

After delivering the summary, use `AskUserQuestion` to offer contextual next steps based on the meeting content. Adapt options to what was actually found. For example:

After a single meeting summary with action items:
> "What would you like to do next?"
> Options: "Draft a follow-up email for this meeting", "See all action items in detail", "Analyze this meeting with a framework", "Get coached on my communication in this meeting"

After a multi-meeting summary with patterns:
> "What would you like to explore further?"
> Options: "Analyze a specific meeting from this list", "Search for a topic across more meetings", "Check action items from these meetings", "Draft a follow-up email"

Always tie options to the specific meetings, people, or themes from the summary.
