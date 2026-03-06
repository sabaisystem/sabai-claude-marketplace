# /discord-user Command

Look up a Discord user's information.

## Usage

```
/discord-user [username]
```

## Parameters

- `username` - Username or display name to look up (optional, will prompt if not provided)

## Behavior

When this command is invoked:

1. If username provided, search for user
2. If not provided, ask:
   - Which user do you want to look up?

3. Use Discord MCP tools:
   - `discord_search_members` with the guild ID and username as query

4. Present user information:
   - User ID
   - Username and display name
   - Roles (if available)
   - Join date (if available)

5. Offer to:
   - Send a DM to this user (via `discord_send_dm`)
   - Assign a role to this user
   - View user's recent messages

## Examples

```
/discord-user john
/discord-user Sarah Smith
/discord-user @moderator
```

## Output

Provide:
1. User ID for mentions
2. User details
3. Options for further actions
