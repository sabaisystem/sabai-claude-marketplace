# Next — Future Commitments from Past Meetings

Extract mentions of upcoming meetings, follow-ups, and scheduled commitments from past meeting transcripts.

## Why this skill exists

Granola records past meetings, not future ones. But people constantly make plans during meetings — "let's sync next Tuesday", "I'll schedule a follow-up for after the launch", "next quarterly review is April 15th". This skill surfaces those commitments so nothing falls through the cracks.

## How it works

Use `query_granola_meetings` with carefully crafted prompts that target future-looking language in transcripts.

## Workflow

1. **Understand the scope.** Is the user asking broadly ("what's coming up?") or specifically ("did we schedule a follow-up with Acme?")? This determines how you craft the query.

2. **Query for future commitments.** Call `query_granola_meetings` with a prompt that targets future-oriented language. Tailor the query to what the user asked.

   For broad requests, use something like:
   > "What upcoming meetings, follow-ups, or scheduled commitments were mentioned in recent meetings? Look for phrases like 'next meeting', 'follow-up', 'let's schedule', 'we'll meet again', 'next call', 'sync next week', or any specific future dates mentioned."

   For specific requests (e.g., about a company or person), narrow it:
   > "What follow-up meetings or next steps were discussed regarding [Acme]? Look for any scheduled dates, planned calls, or commitments to meet again."

3. **If helpful, scope by time range.** You can first call `list_meetings` with a time range to identify relevant meeting IDs, then pass those as `document_ids` to `query_granola_meetings` to narrow the search.

4. **Present the results** clearly, grouped by certainty:
   - **Confirmed** — specific date/time mentioned (e.g., "Follow-up with Acme on March 12 at 3 PM")
   - **Planned but unscheduled** — commitment made but no date set (e.g., "Agreed to reconnect after the launch")
   - **Vague** — loose mentions (e.g., "Let's catch up sometime next quarter")

5. **Preserve citation links.** The `query_granola_meetings` tool returns inline citations like `[[0]](url)`. Always include these in your response so the user can trace each commitment back to the source meeting.

6. **Handle empty results.** If nothing is found, say so and suggest the user check their calendar directly, or try `/sabai-granola:search` with specific keywords.

## Important caveats

Results are best-effort. These commitments are extracted from unstructured conversation, so:
- Dates may be relative ("next Tuesday") and could be ambiguous depending on when the meeting occurred
- Some commitments may already have happened or been cancelled
- Not every "let's meet" turns into an actual meeting

Frame your output accordingly — present findings as "commitments mentioned in meetings" rather than as a definitive schedule.
