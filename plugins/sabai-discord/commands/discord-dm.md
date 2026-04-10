---
name: discord-dm
description: Send a direct message to a Discord user
---

# /discord-dm Command

Send a direct message to a Discord user.

## Usage

```
/discord-dm [user] [message]
```

## Parameters

- `user` - Username, display name, or user ID (optional, will prompt if not provided)
- `message` - Message content (optional, will prompt if not provided)

## Behavior

When this command is invoked:

1. If user and message provided, proceed to send
2. If partial info provided, ask for missing details
3. If nothing provided, ask:
   - Who do you want to message?
   - What message do you want to send?

4. Look up user ID if username provided:
   - Use `discord_search_members` tool with the guild ID and username as query
   - If multiple results, show matches and ask user to confirm

5. Send the direct message using `discord_send_dm` with the resolved user ID

6. Optionally read conversation history with `discord_read_dm`

7. Confirm the message was sent

## Examples

```
/discord-dm @john Hey, wanted to follow up on our conversation
/discord-dm sarah Can you review my PR when you get a chance?
/discord-dm 123456789 Thanks for your help earlier!
```

## Quick Flags

- `--tone [formal|casual]` - Set message tone

## Output

Provide:
1. Confirmation of DM sent
2. Recipient name
3. Message preview
4. Any errors (user not found, DMs disabled, etc.)
