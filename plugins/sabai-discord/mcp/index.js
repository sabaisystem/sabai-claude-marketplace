import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { REST } from "@discordjs/rest";
import {
  Routes,
  ChannelType,
} from "discord-api-types/v10";

// Initialize REST client (no WebSocket, no gateway)
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("ERROR: DISCORD_TOKEN environment variable is required");
  process.exit(1);
}

const rest = new REST({ version: "10" }).setToken(token);

// Encode emoji for URL (handle custom emoji like <:name:id>)
function encodeEmoji(emoji) {
  // Custom emoji format: <:name:id> or <a:name:id>
  const customMatch = emoji.match(/<a?:(\w+):(\d+)>/);
  if (customMatch) {
    return `${customMatch[1]}:${customMatch[2]}`;
  }
  // Unicode emoji — URL-encode it
  return encodeURIComponent(emoji);
}

// Tool definitions (from mcp-discord, minus discord_login)
const tools = [
  {
    name: "discord_send",
    description: "Sends a message to a specified Discord text channel",
    inputSchema: {
      type: "object",
      properties: {
        channelId: { type: "string" },
        message: { type: "string" },
      },
      required: ["channelId", "message"],
    },
  },
  {
    name: "discord_read_messages",
    description: "Retrieves messages from a Discord text channel with a configurable limit",
    inputSchema: {
      type: "object",
      properties: {
        channelId: { type: "string" },
        limit: { type: "number", minimum: 1, maximum: 100, default: 50 },
      },
      required: ["channelId"],
    },
  },
  {
    name: "discord_get_server_info",
    description: "Retrieves detailed information about a Discord server including channels and member count",
    inputSchema: {
      type: "object",
      properties: {
        guildId: { type: "string" },
      },
      required: ["guildId"],
    },
  },
  {
    name: "discord_create_text_channel",
    description: "Creates a new text channel in a Discord server with an optional topic",
    inputSchema: {
      type: "object",
      properties: {
        guildId: { type: "string" },
        channelName: { type: "string" },
        topic: { type: "string" },
      },
      required: ["guildId", "channelName"],
    },
  },
  {
    name: "discord_delete_channel",
    description: "Deletes a Discord channel with an optional reason",
    inputSchema: {
      type: "object",
      properties: {
        channelId: { type: "string" },
        reason: { type: "string" },
      },
      required: ["channelId"],
    },
  },
  {
    name: "discord_create_category",
    description: "Creates a new category in a Discord server.",
    inputSchema: {
      type: "object",
      properties: {
        guildId: { type: "string" },
        name: { type: "string" },
        position: { type: "number" },
        reason: { type: "string" },
      },
      required: ["guildId", "name"],
    },
  },
  {
    name: "discord_edit_category",
    description: "Edits an existing Discord category (name and position).",
    inputSchema: {
      type: "object",
      properties: {
        categoryId: { type: "string" },
        name: { type: "string" },
        position: { type: "number" },
        reason: { type: "string" },
      },
      required: ["categoryId"],
    },
  },
  {
    name: "discord_delete_category",
    description: "Deletes a Discord category by ID.",
    inputSchema: {
      type: "object",
      properties: {
        categoryId: { type: "string" },
        reason: { type: "string" },
      },
      required: ["categoryId"],
    },
  },
  {
    name: "discord_add_reaction",
    description: "Adds an emoji reaction to a specific Discord message",
    inputSchema: {
      type: "object",
      properties: {
        channelId: { type: "string" },
        messageId: { type: "string" },
        emoji: { type: "string" },
      },
      required: ["channelId", "messageId", "emoji"],
    },
  },
  {
    name: "discord_add_multiple_reactions",
    description: "Adds multiple emoji reactions to a Discord message at once",
    inputSchema: {
      type: "object",
      properties: {
        channelId: { type: "string" },
        messageId: { type: "string" },
        emojis: { type: "array", items: { type: "string" } },
      },
      required: ["channelId", "messageId", "emojis"],
    },
  },
  {
    name: "discord_remove_reaction",
    description: "Removes a specific emoji reaction from a Discord message",
    inputSchema: {
      type: "object",
      properties: {
        channelId: { type: "string" },
        messageId: { type: "string" },
        emoji: { type: "string" },
        userId: { type: "string" },
      },
      required: ["channelId", "messageId", "emoji"],
    },
  },
  {
    name: "discord_delete_message",
    description: "Deletes a specific message from a Discord text channel",
    inputSchema: {
      type: "object",
      properties: {
        channelId: { type: "string" },
        messageId: { type: "string" },
        reason: { type: "string" },
      },
      required: ["channelId", "messageId"],
    },
  },
  {
    name: "discord_edit_message",
    description: "Edits the content of an existing message. The bot can only edit its own messages. Works for both channel and DM messages.",
    inputSchema: {
      type: "object",
      properties: {
        channelId: { type: "string", description: "The channel or DM channel ID" },
        messageId: { type: "string", description: "The message ID to edit" },
        content: { type: "string", description: "The new message content" },
      },
      required: ["channelId", "messageId", "content"],
    },
  },
  // --- Direct Messages ---

  {
    name: "discord_search_members",
    description: "Searches guild members by username or display name. Use this to find a user's ID before sending a DM or assigning a role.",
    inputSchema: {
      type: "object",
      properties: {
        guildId: { type: "string", description: "The guild (server) ID to search in" },
        query: { type: "string", description: "Search query (username or display name), minimum 1 character" },
        limit: { type: "number", minimum: 1, maximum: 100, default: 5, description: "Max results to return (default 5)" },
      },
      required: ["guildId", "query"],
    },
  },
  {
    name: "discord_send_dm",
    description: "Sends a direct message to a Discord user by their user ID. The bot must share a server with the user.",
    inputSchema: {
      type: "object",
      properties: {
        userId: { type: "string", description: "The user ID to send a DM to" },
        message: { type: "string", description: "The message content to send" },
      },
      required: ["userId", "message"],
    },
  },
  {
    name: "discord_read_dm",
    description: "Reads DM conversation history with a Discord user by their user ID.",
    inputSchema: {
      type: "object",
      properties: {
        userId: { type: "string", description: "The user ID to read DM history with" },
        limit: { type: "number", minimum: 1, maximum: 100, default: 50, description: "Number of messages to retrieve (default 50)" },
      },
      required: ["userId"],
    },
  },
];

// Tool handler
async function handleTool(name, args) {
  switch (name) {
    // --- Messaging ---

    case "discord_send": {
      const { channelId, message } = args;
      const result = await rest.post(Routes.channelMessages(channelId), {
        body: { content: message },
      });
      return { id: result.id, channelId: result.channel_id, content: result.content };
    }

    case "discord_read_messages": {
      const { channelId, limit = 50 } = args;
      const messages = await rest.get(Routes.channelMessages(channelId), {
        query: new URLSearchParams({ limit: String(Math.min(limit, 100)) }),
      });
      // Discord returns newest first; reverse to oldest first
      return messages.reverse().map((m) => ({
        id: m.id,
        author: m.author?.username || "Unknown",
        content: m.content,
        timestamp: m.timestamp,
        attachments: m.attachments?.length || 0,
      }));
    }

    case "discord_delete_message": {
      const { channelId, messageId, reason } = args;
      await rest.delete(Routes.channelMessage(channelId, messageId), {
        reason,
      });
      return { success: true, deletedMessageId: messageId };
    }

    // --- Server Info ---

    case "discord_get_server_info": {
      const { guildId } = args;
      const [guild, channels] = await Promise.all([
        rest.get(Routes.guild(guildId), {
          query: new URLSearchParams({ with_counts: "true" }),
        }),
        rest.get(Routes.guildChannels(guildId)),
      ]);
      return {
        name: guild.name,
        id: guild.id,
        description: guild.description,
        memberCount: guild.approximate_member_count,
        presenceCount: guild.approximate_presence_count,
        channels: channels.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          parentId: c.parent_id,
          topic: c.topic,
        })),
      };
    }

    // --- Channels ---

    case "discord_create_text_channel": {
      const { guildId, channelName, topic } = args;
      const body = {
        name: channelName,
        type: ChannelType.GuildText,
      };
      if (topic) body.topic = topic;
      const result = await rest.post(Routes.guildChannels(guildId), { body });
      return { id: result.id, name: result.name, topic: result.topic };
    }

    case "discord_delete_channel": {
      const { channelId, reason } = args;
      await rest.delete(Routes.channel(channelId), { reason });
      return { success: true, deletedChannelId: channelId };
    }

    // --- Categories ---

    case "discord_create_category": {
      const { guildId, name, position, reason } = args;
      const body = {
        name,
        type: ChannelType.GuildCategory,
      };
      if (position !== undefined) body.position = position;
      const result = await rest.post(Routes.guildChannels(guildId), {
        body,
        reason,
      });
      return { id: result.id, name: result.name, position: result.position };
    }

    case "discord_edit_category": {
      const { categoryId, name, position, reason } = args;
      const body = {};
      if (name !== undefined) body.name = name;
      if (position !== undefined) body.position = position;
      const result = await rest.patch(Routes.channel(categoryId), {
        body,
        reason,
      });
      return { id: result.id, name: result.name, position: result.position };
    }

    case "discord_delete_category": {
      const { categoryId, reason } = args;
      await rest.delete(Routes.channel(categoryId), { reason });
      return { success: true, deletedCategoryId: categoryId };
    }

    // --- Reactions ---

    case "discord_add_reaction": {
      const { channelId, messageId, emoji } = args;
      const encoded = encodeEmoji(emoji);
      await rest.put(
        Routes.channelMessageOwnReaction(channelId, messageId, encoded)
      );
      return { success: true, emoji };
    }

    case "discord_add_multiple_reactions": {
      const { channelId, messageId, emojis } = args;
      const results = [];
      for (const emoji of emojis) {
        const encoded = encodeEmoji(emoji);
        await rest.put(
          Routes.channelMessageOwnReaction(channelId, messageId, encoded)
        );
        results.push({ emoji, success: true });
      }
      return results;
    }

    case "discord_remove_reaction": {
      const { channelId, messageId, emoji, userId } = args;
      const encoded = encodeEmoji(emoji);
      if (userId) {
        await rest.delete(
          Routes.channelMessageUserReaction(channelId, messageId, encoded, userId)
        );
      } else {
        await rest.delete(
          Routes.channelMessageOwnReaction(channelId, messageId, encoded)
        );
      }
      return { success: true, emoji };
    }

    case "discord_edit_message": {
      const { channelId, messageId, content } = args;
      const result = await rest.patch(Routes.channelMessage(channelId, messageId), {
        body: { content },
      });
      return {
        id: result.id,
        channelId: result.channel_id,
        content: result.content,
        editedTimestamp: result.edited_timestamp,
      };
    }

    // --- Direct Messages ---

    case "discord_search_members": {
      const { guildId, query, limit = 5 } = args;
      const members = await rest.get(Routes.guildMembersSearch(guildId), {
        query: new URLSearchParams({
          query,
          limit: String(Math.min(limit, 100)),
        }),
      });
      if (!members || members.length === 0) {
        return { message: `No members found matching "${query}"`, results: [] };
      }
      return members.map((m) => ({
        userId: m.user.id,
        username: m.user.username,
        displayName: m.nick || m.user.global_name || m.user.username,
        avatar: m.user.avatar,
        joinedAt: m.joined_at,
        roles: m.roles,
      }));
    }

    case "discord_send_dm": {
      const { userId, message } = args;
      // Create (or get existing) DM channel — this is idempotent
      const dmChannel = await rest.post(Routes.userChannels(), {
        body: { recipient_id: userId },
      });
      const result = await rest.post(Routes.channelMessages(dmChannel.id), {
        body: { content: message },
      });
      return {
        id: result.id,
        dmChannelId: dmChannel.id,
        recipientId: userId,
        content: result.content,
      };
    }

    case "discord_read_dm": {
      const { userId, limit = 50 } = args;
      // Create (or get existing) DM channel
      const dmChannel = await rest.post(Routes.userChannels(), {
        body: { recipient_id: userId },
      });
      const messages = await rest.get(Routes.channelMessages(dmChannel.id), {
        query: new URLSearchParams({ limit: String(Math.min(limit, 100)) }),
      });
      return messages.reverse().map((m) => ({
        id: m.id,
        author: m.author?.username || "Unknown",
        content: m.content,
        timestamp: m.timestamp,
        attachments: m.attachments?.length || 0,
      }));
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Create MCP server
const server = new Server(
  { name: "sabai-discord", version: "1.5.0" },
  { capabilities: { tools: {} } }
);

// Register handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handleTool(name, args || {});
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    const message =
      error.status && error.message
        ? `Discord API error (${error.status}): ${error.message}`
        : error.message || String(error);
    return {
      content: [{ type: "text", text: JSON.stringify({ error: message }, null, 2) }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  // Validate token by fetching bot user
  try {
    const me = await rest.get(Routes.user());
    console.error(`Sabai Discord MCP server running as ${me.username}#${me.discriminator}`);
  } catch (err) {
    console.error(`WARNING: Token validation failed: ${err.message}`);
    console.error("Server will start but API calls may fail.");
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
