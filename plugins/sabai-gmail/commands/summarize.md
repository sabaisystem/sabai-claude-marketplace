---
name: summarize
description: Summarize an email thread or conversation
---

# /summarize Command

Summarize an email thread or conversation.

## Usage

```
/summarize [thread reference or content]
```

## Parameters

- `thread reference` - Description of the thread, pasted content, or search query

## Behavior

When this command is invoked:

1. If thread content provided directly, summarize it
2. If reference/query provided, search for thread via Gmail MCP:
   - `gmail_search_messages` to find thread
   - `gmail_get_message` to get full content

3. If no input, ask:
   - Which conversation would you like summarized?
   - Paste the thread or describe it

4. Analyze the thread:
   - Identify participants
   - Extract key discussion points
   - Note decisions made
   - List action items
   - Highlight outstanding questions

5. Generate summary:
   - Brief overview (2-3 sentences)
   - Key points discussed
   - Decisions/outcomes
   - Action items with owners
   - Open questions

## Examples

```
/summarize the marketing campaign discussion
/summarize thread with John about the budget
/summarize [paste email thread]
/summarize
```

## Quick Flags

- `--brief` - One paragraph summary only
- `--actions` - Focus on action items
- `--decisions` - Focus on decisions made
- `--timeline` - Include chronological breakdown

## Summary Format

```
## Thread Summary: [Topic]

**Participants:** [Names]
**Date Range:** [Start] to [End]
**Messages:** [Count]

### Overview
[2-3 sentence summary of the conversation]

### Key Points
- [Point 1]
- [Point 2]
- [Point 3]

### Decisions Made
- [Decision 1]
- [Decision 2]

### Action Items
- [ ] [Action] - [Owner] - [Deadline if mentioned]
- [ ] [Action] - [Owner]

### Open Questions
- [Question 1]
- [Question 2]

### Next Steps
[What happens next based on the conversation]
```

## Analysis Features

The summary identifies:
1. **Participants** - Who's involved and their roles
2. **Timeline** - How the conversation evolved
3. **Decisions** - What was agreed upon
4. **Actions** - Tasks assigned to people
5. **Questions** - Unresolved items
6. **Tone** - General sentiment (if relevant)

## Output

Provide:
1. Structured summary (format above)
2. Option to focus on specific aspects
3. Option to draft a reply based on summary
4. Action items formatted for task tracking
