# Recent Meetings

Display the user's recent Granola meetings in a clean, scannable format.

## How it works

Use the `list_meetings` MCP tool to retrieve meetings within a time range. The tool supports these `time_range` values:

- `this_week` — current week
- `last_week` — previous week
- `last_30_days` — last 30 days (default)
- `custom` — requires `custom_start` and `custom_end` as ISO date strings (e.g., `2026-01-01`)

## Workflow

0. **Login Check (Mandatory — Run First Every Chat).** **First command in this chat session** (no Granola call has been made yet in this conversation): inform the user ("Let me refresh your Granola connection to start this session."), then execute the `/sabai-granola:connect` flow to force a fresh login — even if already logged in. Do NOT proceed until authentication is confirmed. **Subsequent commands in the same chat** (a successful Granola call already happened earlier): call `list_meetings` with `time_range: "this_week"` as a quick auth check. If it succeeds → proceed. If it fails → re-run `/sabai-granola:connect`.

1. **Determine the time range** from the user's request. If they say "this week", use `this_week`. If they say "last week", use `last_week`. If they give specific dates, use `custom`. If ambiguous, default to `this_week` and mention you can look further back if needed.

2. **Call `list_meetings`** with the appropriate `time_range` (and `custom_start`/`custom_end` if custom).

3. **Format the results** as a clean list. For each meeting, show:
   - Meeting title
   - Date and time
   - Attendees (if available)
   - A link to the meeting notes (if available)

4. **Handle empty states** gracefully. If no meetings are found, say so clearly and suggest trying a different time range (e.g., "No meetings found this week. Want me to check last week or the last 30 days?").

## Output format

Present meetings grouped by day, most recent first. Keep it concise — the user wants a quick overview, not a wall of text.

**Example:**

```
### Thursday, March 5

- **Acme Q1 Review** — 2:00 PM · with Sarah, John, Lisa
- **Team Standup** — 9:30 AM · with Dev Team

### Wednesday, March 4

- **Investor Update Call** — 4:00 PM · with Mark, Emily
```

## Follow-up Actions

After displaying the meeting list, use `AskUserQuestion` to offer contextual next steps. Adapt the options based on what meetings were found. For example:

- "Get a summary" → triggers `sabai-granola:summary` for a selected meeting
- "See action items" → triggers `sabai-granola:actions` for meetings shown
- "Search for something specific" → triggers `sabai-granola:search`
- "Check upcoming follow-ups" → triggers `sabai-granola:next`

Frame the question around the actual results. For example, if 3 meetings with Acme appeared:
> "What would you like to do next with these meetings?"
> Options: "Summarize the Acme Q1 Review", "See action items from this week", "Search for a specific topic", "Check upcoming follow-ups"
