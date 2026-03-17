import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// Configuration from environment
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS || path.join(process.cwd(), "config", "credentials.json");
const TOKEN_PATH = process.env.GOOGLE_TOKEN || path.join(process.cwd(), "config", "token.json");

// Gmail API scopes
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.labels",
];

let gmail = null;

/**
 * Load OAuth2 client with credentials
 */
async function getAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`Credentials file not found at ${CREDENTIALS_PATH}. Run 'npm run auth' to set up.`);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oauth2Client.setCredentials(token);

    // Check if token needs refresh
    if (token.expiry_date && Date.now() >= token.expiry_date - 60000) {
      try {
        const { credentials: newCredentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(newCredentials);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(newCredentials, null, 2));
      } catch (err) {
        console.error("Failed to refresh token:", err.message);
        throw new Error("Token expired. Run 'npm run auth' to re-authenticate.");
      }
    }
  } else {
    throw new Error(`Token file not found at ${TOKEN_PATH}. Run 'npm run auth' to authenticate.`);
  }

  return oauth2Client;
}

/**
 * Initialize Gmail API client
 */
async function initGmail() {
  if (!gmail) {
    const auth = await getAuthClient();
    gmail = google.gmail({ version: "v1", auth });
  }
  return gmail;
}

/**
 * Decode base64url encoded string
 */
function decodeBase64Url(data) {
  if (!data) return "";
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Encode string to base64url
 */
function encodeBase64Url(str) {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Extract email body from message parts
 */
function extractBody(payload) {
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
    }
    for (const part of payload.parts) {
      const nested = extractBody(part);
      if (nested) return nested;
    }
  }

  return "";
}

/**
 * Get header value from message headers
 */
function getHeader(headers, name) {
  const header = headers?.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header?.value || "";
}

/**
 * Format message for response
 */
function formatMessage(msg, includeBody = false) {
  const headers = msg.payload?.headers || [];
  const result = {
    id: msg.id,
    threadId: msg.threadId,
    labelIds: msg.labelIds || [],
    snippet: msg.snippet,
    from: getHeader(headers, "From"),
    to: getHeader(headers, "To"),
    cc: getHeader(headers, "Cc"),
    subject: getHeader(headers, "Subject"),
    date: getHeader(headers, "Date"),
    isUnread: msg.labelIds?.includes("UNREAD"),
    isStarred: msg.labelIds?.includes("STARRED"),
  };

  if (includeBody) {
    result.body = extractBody(msg.payload);
  }

  return result;
}

// Define tools
const tools = [
  {
    name: "gmail_search",
    description: "Search emails using Gmail query syntax. Supports operators like from:, to:, subject:, is:unread, has:attachment, newer_than:, older_than:, etc.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Gmail search query (e.g., 'from:john@example.com is:unread')",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of results to return (default: 10, max: 50)",
          default: 10,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "gmail_get_message",
    description: "Get full details of an email message including body content",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "The ID of the message to retrieve",
        },
      },
      required: ["messageId"],
    },
  },
  {
    name: "gmail_list_inbox",
    description: "List recent emails from inbox",
    inputSchema: {
      type: "object",
      properties: {
        maxResults: {
          type: "number",
          description: "Maximum number of results (default: 10, max: 50)",
          default: 10,
        },
        unreadOnly: {
          type: "boolean",
          description: "Only return unread emails",
          default: false,
        },
      },
    },
  },
  {
    name: "gmail_send_email",
    description: "Send an email",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description: "Recipient email address(es), comma-separated for multiple",
        },
        subject: {
          type: "string",
          description: "Email subject line",
        },
        body: {
          type: "string",
          description: "Email body content (plain text)",
        },
        cc: {
          type: "string",
          description: "CC recipients (comma-separated)",
        },
        bcc: {
          type: "string",
          description: "BCC recipients (comma-separated)",
        },
      },
      required: ["to", "subject", "body"],
    },
  },
  {
    name: "gmail_create_draft",
    description: "Create an email draft",
    inputSchema: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description: "Recipient email address(es)",
        },
        subject: {
          type: "string",
          description: "Email subject line",
        },
        body: {
          type: "string",
          description: "Email body content (plain text)",
        },
        cc: {
          type: "string",
          description: "CC recipients",
        },
      },
      required: ["to", "subject", "body"],
    },
  },
  {
    name: "gmail_reply",
    description: "Reply to an email thread",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "ID of the message to reply to",
        },
        body: {
          type: "string",
          description: "Reply body content",
        },
        replyAll: {
          type: "boolean",
          description: "Reply to all recipients",
          default: false,
        },
      },
      required: ["messageId", "body"],
    },
  },
  {
    name: "gmail_list_labels",
    description: "List all Gmail labels",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "gmail_add_labels",
    description: "Add labels to a message",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Message ID",
        },
        labelIds: {
          type: "array",
          items: { type: "string" },
          description: "Label IDs to add",
        },
      },
      required: ["messageId", "labelIds"],
    },
  },
  {
    name: "gmail_remove_labels",
    description: "Remove labels from a message",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Message ID",
        },
        labelIds: {
          type: "array",
          items: { type: "string" },
          description: "Label IDs to remove",
        },
      },
      required: ["messageId", "labelIds"],
    },
  },
  {
    name: "gmail_archive",
    description: "Archive a message (remove from inbox)",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Message ID to archive",
        },
      },
      required: ["messageId"],
    },
  },
  {
    name: "gmail_trash",
    description: "Move a message to trash",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Message ID to trash",
        },
      },
      required: ["messageId"],
    },
  },
  {
    name: "gmail_mark_read",
    description: "Mark a message as read",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Message ID",
        },
      },
      required: ["messageId"],
    },
  },
  {
    name: "gmail_mark_unread",
    description: "Mark a message as unread",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Message ID",
        },
      },
      required: ["messageId"],
    },
  },
  {
    name: "gmail_star",
    description: "Star a message",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Message ID",
        },
      },
      required: ["messageId"],
    },
  },
  {
    name: "gmail_unstar",
    description: "Remove star from a message",
    inputSchema: {
      type: "object",
      properties: {
        messageId: {
          type: "string",
          description: "Message ID",
        },
      },
      required: ["messageId"],
    },
  },
];

// Tool handlers
async function handleTool(name, args) {
  const api = await initGmail();

  switch (name) {
    case "gmail_search": {
      const { query, maxResults = 10 } = args;
      const res = await api.users.messages.list({
        userId: "me",
        q: query,
        maxResults: Math.min(maxResults, 50),
      });

      if (!res.data.messages?.length) {
        return { results: [], total: 0 };
      }

      const messages = await Promise.all(
        res.data.messages.map(async (m) => {
          const msg = await api.users.messages.get({
            userId: "me",
            id: m.id,
            format: "metadata",
            metadataHeaders: ["From", "To", "Subject", "Date", "Cc"],
          });
          return formatMessage(msg.data);
        })
      );

      return { results: messages, total: res.data.resultSizeEstimate || messages.length };
    }

    case "gmail_get_message": {
      const { messageId } = args;
      const res = await api.users.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
      });
      return formatMessage(res.data, true);
    }

    case "gmail_list_inbox": {
      const { maxResults = 10, unreadOnly = false } = args;
      const query = unreadOnly ? "in:inbox is:unread" : "in:inbox";
      return handleTool("gmail_search", { query, maxResults });
    }

    case "gmail_send_email": {
      const { to, subject, body, cc, bcc } = args;

      let email = `To: ${to}\n`;
      if (cc) email += `Cc: ${cc}\n`;
      if (bcc) email += `Bcc: ${bcc}\n`;
      email += `Subject: ${subject}\n`;
      email += `Content-Type: text/plain; charset=utf-8\n\n`;
      email += body;

      const res = await api.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodeBase64Url(email),
        },
      });

      return { success: true, messageId: res.data.id, threadId: res.data.threadId };
    }

    case "gmail_create_draft": {
      const { to, subject, body, cc } = args;

      let email = `To: ${to}\n`;
      if (cc) email += `Cc: ${cc}\n`;
      email += `Subject: ${subject}\n`;
      email += `Content-Type: text/plain; charset=utf-8\n\n`;
      email += body;

      const res = await api.users.drafts.create({
        userId: "me",
        requestBody: {
          message: {
            raw: encodeBase64Url(email),
          },
        },
      });

      return { success: true, draftId: res.data.id, messageId: res.data.message.id };
    }

    case "gmail_reply": {
      const { messageId, body, replyAll = false } = args;

      // Get original message
      const original = await api.users.messages.get({
        userId: "me",
        id: messageId,
        format: "metadata",
        metadataHeaders: ["From", "To", "Cc", "Subject", "Message-ID", "References", "In-Reply-To"],
      });

      const headers = original.data.payload.headers;
      const originalFrom = getHeader(headers, "From");
      const originalTo = getHeader(headers, "To");
      const originalCc = getHeader(headers, "Cc");
      const originalSubject = getHeader(headers, "Subject");
      const messageIdHeader = getHeader(headers, "Message-ID");
      const references = getHeader(headers, "References");

      let to = originalFrom;
      let cc = "";

      if (replyAll) {
        const allRecipients = [originalTo, originalCc].filter(Boolean).join(", ");
        cc = allRecipients;
      }

      const subject = originalSubject.startsWith("Re:") ? originalSubject : `Re: ${originalSubject}`;

      let email = `To: ${to}\n`;
      if (cc) email += `Cc: ${cc}\n`;
      email += `Subject: ${subject}\n`;
      email += `In-Reply-To: ${messageIdHeader}\n`;
      email += `References: ${references ? `${references} ${messageIdHeader}` : messageIdHeader}\n`;
      email += `Content-Type: text/plain; charset=utf-8\n\n`;
      email += body;

      const res = await api.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodeBase64Url(email),
          threadId: original.data.threadId,
        },
      });

      return { success: true, messageId: res.data.id, threadId: res.data.threadId };
    }

    case "gmail_list_labels": {
      const res = await api.users.labels.list({ userId: "me" });
      return res.data.labels.map((l) => ({
        id: l.id,
        name: l.name,
        type: l.type,
        messageCount: l.messagesTotal,
        unreadCount: l.messagesUnread,
      }));
    }

    case "gmail_add_labels": {
      const { messageId, labelIds } = args;
      await api.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: { addLabelIds: labelIds },
      });
      return { success: true, messageId, addedLabels: labelIds };
    }

    case "gmail_remove_labels": {
      const { messageId, labelIds } = args;
      await api.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: { removeLabelIds: labelIds },
      });
      return { success: true, messageId, removedLabels: labelIds };
    }

    case "gmail_archive": {
      const { messageId } = args;
      await api.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: { removeLabelIds: ["INBOX"] },
      });
      return { success: true, messageId, action: "archived" };
    }

    case "gmail_trash": {
      const { messageId } = args;
      await api.users.messages.trash({ userId: "me", id: messageId });
      return { success: true, messageId, action: "trashed" };
    }

    case "gmail_mark_read": {
      const { messageId } = args;
      await api.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: { removeLabelIds: ["UNREAD"] },
      });
      return { success: true, messageId, action: "marked_read" };
    }

    case "gmail_mark_unread": {
      const { messageId } = args;
      await api.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: { addLabelIds: ["UNREAD"] },
      });
      return { success: true, messageId, action: "marked_unread" };
    }

    case "gmail_star": {
      const { messageId } = args;
      await api.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: { addLabelIds: ["STARRED"] },
      });
      return { success: true, messageId, action: "starred" };
    }

    case "gmail_unstar": {
      const { messageId } = args;
      await api.users.messages.modify({
        userId: "me",
        id: messageId,
        requestBody: { removeLabelIds: ["STARRED"] },
      });
      return { success: true, messageId, action: "unstarred" };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Create MCP server
const server = new Server(
  {
    name: "sabai-gmail",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleTool(name, args || {});
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: error.message }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sabai Gmail MCP server running");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
