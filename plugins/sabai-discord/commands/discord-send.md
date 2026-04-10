---
name: discord-send
description: Send a message to a Discord channel
---

# /discord-send Command

Send a message to a Discord channel.

## Usage

```
/discord-send [channel] [message]
```

## Parameters

- `channel` - Channel name or ID (optional, will prompt if not provided)
- `message` - Message content (optional, will prompt if not provided)

## Behavior

When this command is invoked:

1. If channel and message provided, proceed to send
2. If partial info provided, ask for missing details
3. If nothing provided, ask:
   - Which channel should I send to?
   - What message do you want to send?

4. Use the discord-messaging skill for message composition

5. Use Discord MCP tools:
   - `send_message` to post the message

6. Confirm the message was sent with a link if available

## Examples

```
/discord-send general Hello everyone!
/discord-send announcements The server will be down for maintenance tomorrow.
/discord-send #help-desk Can someone assist with this issue?
```

## Quick Flags

- `--format [plain|code|quote]` - Apply formatting to message
- `--embed` - Send as rich embed (if supported)

## Output

Provide:
1. Confirmation of message sent
2. Channel name and message preview
3. Any errors encountered
