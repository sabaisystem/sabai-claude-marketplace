# /search Command

Search emails with advanced filters.

## Usage

```
/search [query]
```

## Parameters

- `query` - Search query (natural language or Gmail operators)

## Behavior

When this command is invoked:

1. If query provided:
   - Parse natural language into Gmail search operators
   - Execute search via Gmail MCP
   - Present results

2. If no query provided, ask:
   - What are you looking for?
   - Any filters? (sender, date range, attachments, etc.)

3. Build Gmail search query:
   - Convert natural language to operators
   - Combine multiple conditions

4. Execute search using Gmail MCP:
   - `gmail_search_messages` with constructed query

5. Present results:
   - Count of matches
   - List of relevant emails
   - Option to view individual emails

## Natural Language to Query

| Natural Language | Gmail Query |
|-----------------|-------------|
| "emails from John" | `from:john` |
| "attachments from last month" | `has:attachment newer_than:30d` |
| "unread about project" | `is:unread subject:project` |
| "emails to sarah with PDFs" | `to:sarah filename:pdf` |
| "large attachments" | `larger:10M` |
| "old newsletters" | `older_than:1y from:newsletter` |

## Examples

```
/search from:jane@company.com about budget
/search attachments from last week
/search unread emails about the marketing campaign
/search emails I sent to John in January
/search large files older than 6 months
```

## Quick Flags

- `--count [n]` - Limit results
- `--save` - Save as a filter/label
- `--export` - Export search results

## Common Search Patterns

```
# Unread from specific person
from:john@example.com is:unread

# PDFs from this year
filename:pdf after:2024/01/01

# Starred emails needing action
is:starred label:action-needed

# Emails where I'm CC'd
cc:me

# Large attachments to clean up
larger:5M older_than:3m
```

## Output

Provide:
1. Search query used (show Gmail operator format)
2. Number of results found
3. List of matching emails (sender, subject, date)
4. Option to:
   - View specific email
   - Refine search
   - Save as filter
