---
name: search
description: Search across meeting history by keywords, participants, or topics
---

# Meeting Search

Search across meeting history by keywords, participants, or topics.

## How it works

This skill combines two tools:

- **`query_granola_meetings`** — Searches meeting content using natural language. Returns answers with inline citation links. This is the primary search engine.
- **`list_meetings`** — Filters meetings by time range. Useful for narrowing scope before searching content.

## Workflow

0. **Login Check (Mandatory — Run First Every Chat).** **First command in this chat session** (no Granola call has been made yet in this conversation): inform the user ("Let me refresh your Granola connection to start this session."), then execute the `/sabai-granola:connect` flow to force a fresh login — even if already logged in. Do NOT proceed until authentication is confirmed. **Subsequent commands in the same chat** (a successful Granola call already happened earlier): call `list_meetings` with `time_range: "this_week"` as a quick auth check. If it succeeds → proceed. If it fails → re-run `/sabai-granola:connect`.

1. **Parse the user's search intent.** Identify:
   - **Keywords or topics** — What they're looking for (e.g., "budget", "API redesign")
   - **People** — Specific attendees or participants mentioned (e.g., "Sarah", "the Acme team")
   - **Date range** — If they specify a time window (e.g., "last month", "in January")

2. **Execute the search.**

   **If no date range specified:** Call `query_granola_meetings` directly with a well-crafted query. For example, if the user says "find meetings where we discussed the API redesign":
   > Query: "Which meetings discussed the API redesign? List each meeting with what was said about it."

   **If a date range is specified:** First call `list_meetings` with the appropriate `time_range` (or `custom` with `custom_start`/`custom_end`) to get meeting IDs within that window. Then call `query_granola_meetings` with those IDs as `document_ids` to search within that subset.

   **If searching for a person:** Include the person's name in the query. For example:
   > Query: "Which meetings included Sarah or discussed topics involving Sarah?"

3. **Present results** as a scannable list. For each match:
   - Meeting title
   - Date
   - Relevant snippet or context showing why it matched
   - Citation link to the meeting notes

4. **Preserve citation links.** Always include the `[[0]](url)` style citations from `query_granola_meetings` so users can click through to the source.

5. **Handle no results.** If nothing is found:
   - Suggest broadening the search (different keywords, wider date range)
   - Check if the user might be thinking of a meeting that predates their Granola usage

## Tips for effective queries

The `query_granola_meetings` tool works best with natural language, so craft your queries conversationally rather than as bare keywords. For example:
- Instead of: "budget Acme"
- Prefer: "What was discussed about the budget in meetings with Acme?"

This gives Granola's search more context to work with and returns better results.

## Follow-up Actions

After displaying search results, use `AskUserQuestion` to offer contextual next steps based on what was found. For example, if 3 meetings with Acme were found:

> "What would you like to do with these results?"
> Options: "Summarize the Acme Q1 Review", "Ask a question about these meetings", "See action items from Acme meetings", "Analyze the most recent Acme call"

Always reference the specific meetings or topics that appeared in results. If only one meeting was found, offer deep-dive options for that specific meeting.
