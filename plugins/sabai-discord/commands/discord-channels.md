---
name: discord-channels
description: List all channels in the Discord server
---

# /discord-channels Command

List all channels in the Discord server.

## Usage

```
/discord-channels [category]
```

## Parameters

- `category` - Filter by category name (optional, shows all if not provided)

## Behavior

When this command is invoked:

1. Use Discord MCP tools:
   - List channels in the server

2. Present channels organized by category:
   - Category name
   - Text channels
   - Voice channels
   - Forum channels

3. Include for each channel:
   - Name
   - Type
   - Topic/description if set
   - Permission overview

4. Offer to:
   - Create a new channel
   - Get details on a specific channel
   - Delete a channel

## Examples

```
/discord-channels
/discord-channels General
/discord-channels "Development"
```

## Quick Flags

- `--type [text|voice|forum]` - Filter by channel type
- `--empty` - Show only empty channels

## Output

Provide:
1. Organized list of channels
2. Channel counts by type
3. Options for channel management
