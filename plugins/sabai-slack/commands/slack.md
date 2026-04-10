---
name: slack
description: Send messages, read conversations, and manage Slack channels
---

# /slack

Send messages, read conversations, and manage Slack channels.

## Usage

```
/slack [action] [target] [message]
```

## Actions

| Action | Description |
|--------|-------------|
| `send` | Send a message to a channel or DM |
| `read` | Read recent messages from a channel |
| `channels` | List available channels |
| `reply` | Reply to a thread |

## Parameters

- `action` - The operation to perform (send, read, channels, reply)
- `target` - Channel name (#general) or DM (@username)
- `message` - The message content (for send/reply actions)

## Behavior

When this command is invoked:

1. **For `send`**: Uses `conversations_add_message` to post a message
   - Supports markdown formatting
   - Can target channels (#channel) or DMs (@user)

2. **For `read`**: Uses `conversations_history` to fetch messages
   - Returns recent messages from the specified channel
   - Shows sender, timestamp, and message content

3. **For `channels`**: Uses `channels_list` to show available channels
   - Lists public channels, private channels, and DMs
   - Shows channel name and member count

4. **For `reply`**: Uses `conversations_add_message` with thread_ts
   - Replies within an existing thread
   - Requires the thread timestamp

## Examples

```
/slack send #general Hello team!
/slack read #engineering
/slack channels
/slack reply #general "Thanks for the update!" (in thread context)
```

## Message Formatting

Slack supports markdown-style formatting:
- `*bold*` for **bold**
- `_italic_` for _italic_
- `` `code` `` for inline code
- ```code blocks``` for multi-line code
- `>` for blockquotes

## Tips

- Use threads for follow-up discussions to keep channels organized
- Check channel history before sending to maintain context
- Use DMs for private conversations
- Prefer channels over DMs for team visibility
