# /inbox Command

View and triage your inbox with assistance.

## Usage

```
/inbox [filter]
```

## Parameters

- `filter` - Optional filter for inbox view (unread, priority, today, etc.)

## Behavior

When this command is invoked:

1. Use Gmail MCP to fetch inbox:
   - `gmail_search_messages` with appropriate query
   - `gmail_get_message` for details

2. Present inbox summary:
   - Total emails
   - Unread count
   - Priority breakdown

3. Offer triage assistance using inbox-management skill:
   - Apply 4 D's framework (Delete, Do, Delegate, Defer)
   - Suggest labels and actions
   - Identify urgent items

4. For each email or batch, offer to:
   - Read full content
   - Archive/delete
   - Apply labels
   - Draft response

## Filters

| Filter | Query | Description |
|--------|-------|-------------|
| `unread` | `is:unread` | Unread emails only |
| `priority` | `is:important` | Priority inbox |
| `today` | `newer_than:1d` | Received today |
| `week` | `newer_than:7d` | This week |
| `starred` | `is:starred` | Starred emails |
| `action` | `label:action-needed` | Needs action |
| `waiting` | `label:waiting-response` | Awaiting reply |

## Examples

```
/inbox
/inbox unread
/inbox priority
/inbox today
```

## Quick Flags

- `--count [n]` - Limit to n emails
- `--from [email]` - Filter by sender
- `--sort [date|sender]` - Sort order

## Triage Actions

For each email, suggest:
1. **Quick action** - Reply, archive, delete
2. **Label** - Priority, project, status
3. **Defer** - Schedule for later
4. **Delegate** - Forward to someone

## Output

Provide:
1. Inbox summary with counts
2. List of emails with sender, subject, preview
3. Recommended actions for priority items
4. Offer to process emails individually or in batch
