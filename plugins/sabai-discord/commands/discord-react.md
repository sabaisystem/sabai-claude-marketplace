---
name: discord-react
description: Add a reaction to a Discord message
---

# /discord-react Command

Add a reaction to a Discord message.

## Usage

```
/discord-react [message-id] [emoji]
```

## Parameters

- `message-id` - Message ID to react to (optional, will prompt if not provided)
- `emoji` - Emoji to add as reaction (optional, will prompt if not provided)

## Behavior

When this command is invoked:

1. If message-id and emoji provided, proceed
2. If partial info provided, ask for missing details
3. If nothing provided, ask:
   - Which message should I react to?
   - Which emoji should I use?

4. Use Discord MCP tools:
   - `add_reaction` to add the emoji

5. Confirm the reaction was added

## Examples

```
/discord-react 123456789 :thumbsup:
/discord-react 987654321 :white_check_mark:
/discord-react 111222333 :eyes:
```

## Output

Provide:
1. Confirmation of reaction added
2. Message preview
3. Any errors encountered
