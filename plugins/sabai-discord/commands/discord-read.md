# /discord-read Command

Read recent messages from a Discord channel.

## Usage

```
/discord-read [channel] [count]
```

## Parameters

- `channel` - Channel name or ID (optional, will prompt if not provided)
- `count` - Number of messages to retrieve (optional, default 10)

## Behavior

When this command is invoked:

1. If channel provided, fetch messages
2. If not provided, ask which channel to read from

3. Use Discord MCP tools:
   - `read_messages` to retrieve message history

4. Present messages in a readable format:
   - Author name
   - Timestamp
   - Message content
   - Reactions if any

5. Offer to:
   - Read more messages
   - Reply to a specific message
   - Summarize the conversation

## Examples

```
/discord-read general
/discord-read announcements 20
/discord-read #dev-chat 5
```

## Quick Flags

- `--summary` - Provide a summary instead of full messages
- `--since [time]` - Read messages since a specific time

## Output

Provide:
1. List of messages with metadata
2. Summary of activity if requested
3. Option to interact with messages
