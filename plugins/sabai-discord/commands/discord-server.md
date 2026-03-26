# /discord-server Command

Get information about the Discord server.

## Usage

```
/discord-server [server-id]
```

## Parameters

- `server-id` - Server/guild ID (optional, uses default if configured)

## Behavior

When this command is invoked:

1. Use Discord MCP tools:
   - `get_server_info` to retrieve server details

2. Present server information:
   - Server name and description
   - Member count
   - Channel count
   - Role count
   - Created date
   - Owner information
   - Verification level
   - Boost status

3. Offer to:
   - List channels
   - List roles
   - Show server settings

## Examples

```
/discord-server
/discord-server 123456789012345678
```

## Output

Provide:
1. Formatted server information
2. Key statistics
3. Current settings
4. Options for further actions
