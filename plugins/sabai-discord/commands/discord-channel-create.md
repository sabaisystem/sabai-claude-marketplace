# /discord-channel-create Command

Create a new Discord channel.

## Usage

```
/discord-channel-create [name] [category]
```

## Parameters

- `name` - Channel name (optional, will prompt if not provided)
- `category` - Category to place channel in (optional)

## Behavior

When this command is invoked:

1. If name provided, proceed with creation
2. If not provided, ask:
   - What should the channel be named?
   - What category should it be in?
   - What is the channel's purpose?

3. Use Discord MCP tools:
   - Create text channel

4. Confirm channel creation with:
   - Channel name
   - Category
   - Link to channel

5. Offer to:
   - Set channel topic
   - Configure permissions
   - Send initial message

## Examples

```
/discord-channel-create project-updates
/discord-channel-create help-desk Support
/discord-channel-create announcements
```

## Quick Flags

- `--topic [description]` - Set channel topic
- `--private` - Create as private channel

## Output

Provide:
1. Confirmation of channel creation
2. Channel details
3. Options for further configuration
