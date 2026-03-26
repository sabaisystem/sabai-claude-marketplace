# /slack-search

Search Slack messages with powerful filters.

## Usage

```
/slack-search [query] [filters]
```

## Parameters

- `query` - Search terms or keywords (required)
- `--channel` - Filter to specific channel (#general or C1234567890)
- `--from` - Filter by sender (@username or U1234567890)
- `--before` - Messages before date (YYYY-MM-DD or "yesterday")
- `--after` - Messages after date (YYYY-MM-DD or "last week")
- `--threads` - Only search in threads

## Behavior

When this command is invoked:

1. Uses `conversations_search_messages` to find matching messages
2. Applies specified filters to narrow results
3. Returns messages with context (sender, channel, timestamp)
4. Supports pagination for large result sets

## Examples

```
/slack-search project update
/slack-search budget --channel #finance
/slack-search deployment --from @devops --after 2024-01-01
/slack-search bug report --threads
/slack-search meeting notes --before yesterday
```

## Search Tips

### Finding Specific Conversations
- Use exact phrases in quotes: `"quarterly review"`
- Combine with channel filter: `--channel #leadership`

### Date Filters
- Exact date: `--after 2024-01-15`
- Relative: `--after "last week"` or `--before yesterday`
- Range: `--after 2024-01-01 --before 2024-01-31`

### User Filters
- By username: `--from @john`
- By user ID: `--from U1234567890`

## Output

Search results include:
- Message text
- Sender name
- Channel/DM name
- Timestamp
- Thread indicator (if in thread)
- Link to original message

## Advanced Usage

Find a specific message by URL:
```
/slack-search https://slack.com/archives/C1234567890/p1234567890123456
```

This returns the exact message matching the Slack URL.
