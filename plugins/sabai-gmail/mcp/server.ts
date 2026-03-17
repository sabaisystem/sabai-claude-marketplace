import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { z } from "zod";
import { google, gmail_v1 } from "googleapis";

// Works both from source (server.ts) and compiled (dist/server.js)
// Must run with tsx for MCP Apps path resolution to work correctly
const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

const MCP_DIR = import.meta.filename.endsWith(".ts")
  ? import.meta.dirname
  : path.dirname(import.meta.dirname);

// Configuration from environment
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS || path.join(MCP_DIR, "config", "credentials.json");
const TOKEN_PATH = process.env.GOOGLE_TOKEN || path.join(MCP_DIR, "config", "token.json");

// ============ GMAIL API CLIENT ============

let gmail: gmail_v1.Gmail | null = null;

/**
 * Load OAuth2 client with credentials
 */
async function getAuthClient() {
  if (!fsSync.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`Credentials file not found at ${CREDENTIALS_PATH}. Run 'npm run auth' to set up.`);
  }

  const credentialsRaw = await fs.readFile(CREDENTIALS_PATH, "utf8");
  const credentials = JSON.parse(credentialsRaw);
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fsSync.existsSync(TOKEN_PATH)) {
    const tokenRaw = await fs.readFile(TOKEN_PATH, "utf8");
    const token = JSON.parse(tokenRaw);
    oauth2Client.setCredentials(token);

    // Check if token needs refresh
    if (token.expiry_date && Date.now() >= token.expiry_date - 60000) {
      try {
        const { credentials: newCredentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(newCredentials);
        await fs.writeFile(TOKEN_PATH, JSON.stringify(newCredentials, null, 2));
      } catch (err: any) {
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
async function initGmail(): Promise<gmail_v1.Gmail> {
  if (!gmail) {
    const auth = await getAuthClient();
    gmail = google.gmail({ version: "v1", auth });
  }
  return gmail;
}

/**
 * Decode base64url encoded string
 */
function decodeBase64Url(data: string | undefined | null): string {
  if (!data) return "";
  const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf8");
}

/**
 * Encode string to base64url
 */
function encodeBase64Url(str: string): string {
  return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Extract email body from message parts
 */
function extractBody(payload: gmail_v1.Schema$MessagePart): string {
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
function getHeader(headers: gmail_v1.Schema$MessagePartHeader[] | undefined, name: string): string {
  const header = headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase());
  return header?.value || "";
}

/**
 * Format message for response
 */
function formatMessage(msg: gmail_v1.Schema$Message, includeBody = false) {
  const headers = msg.payload?.headers || [];
  const result: Record<string, any> = {
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

  if (includeBody && msg.payload) {
    result.body = extractBody(msg.payload);
  }

  return result;
}

// ============ EMAIL EDITOR STATE ============

interface EmailDraft {
  id: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  signature: string;
  replyToThreadId?: string;
  replyToMessageId?: string;
  createdAt: number;
  updatedAt: number;
}

// In-memory draft storage
const drafts = new Map<string, EmailDraft>();

function generateId(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// ============ MCP SERVER ============

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Sabai Gmail",
    version: "1.3.0",
  });

  const resourceUri = "ui://gmail-editor/mcp-app.html";

  // ============ GMAIL API TOOLS ============

  // gmail_search
  server.tool(
    "gmail_search",
    "Search emails using Gmail query syntax. Supports operators like from:, to:, subject:, is:unread, has:attachment, newer_than:, older_than:, etc.",
    {
      query: z.string().describe("Gmail search query (e.g., 'from:john@example.com is:unread')"),
      maxResults: z.number().optional().default(10).describe("Maximum number of results to return (default: 10, max: 50)"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        const { query, maxResults = 10 } = args;
        const res = await api.users.messages.list({
          userId: "me",
          q: query,
          maxResults: Math.min(maxResults, 50),
        });

        if (!res.data.messages?.length) {
          return { content: [{ type: "text", text: JSON.stringify({ results: [], total: 0 }, null, 2) }] };
        }

        const messages = await Promise.all(
          res.data.messages.map(async (m) => {
            const msg = await api.users.messages.get({
              userId: "me",
              id: m.id!,
              format: "metadata",
              metadataHeaders: ["From", "To", "Subject", "Date", "Cc"],
            });
            return formatMessage(msg.data);
          })
        );

        return { content: [{ type: "text", text: JSON.stringify({ results: messages, total: res.data.resultSizeEstimate || messages.length }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_get_message
  server.tool(
    "gmail_get_message",
    "Get full details of an email message including body content",
    {
      messageId: z.string().describe("The ID of the message to retrieve"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        const res = await api.users.messages.get({
          userId: "me",
          id: args.messageId,
          format: "full",
        });
        return { content: [{ type: "text", text: JSON.stringify(formatMessage(res.data, true), null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_list_inbox
  server.tool(
    "gmail_list_inbox",
    "List recent emails from inbox",
    {
      maxResults: z.number().optional().default(10).describe("Maximum number of results (default: 10, max: 50)"),
      unreadOnly: z.boolean().optional().default(false).describe("Only return unread emails"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        const { maxResults = 10, unreadOnly = false } = args;
        const query = unreadOnly ? "in:inbox is:unread" : "in:inbox";

        const res = await api.users.messages.list({
          userId: "me",
          q: query,
          maxResults: Math.min(maxResults, 50),
        });

        if (!res.data.messages?.length) {
          return { content: [{ type: "text", text: JSON.stringify({ results: [], total: 0 }, null, 2) }] };
        }

        const messages = await Promise.all(
          res.data.messages.map(async (m) => {
            const msg = await api.users.messages.get({
              userId: "me",
              id: m.id!,
              format: "metadata",
              metadataHeaders: ["From", "To", "Subject", "Date", "Cc"],
            });
            return formatMessage(msg.data);
          })
        );

        return { content: [{ type: "text", text: JSON.stringify({ results: messages, total: res.data.resultSizeEstimate || messages.length }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_send_email
  server.tool(
    "gmail_send_email",
    "Send an email",
    {
      to: z.string().describe("Recipient email address(es), comma-separated for multiple"),
      subject: z.string().describe("Email subject line"),
      body: z.string().describe("Email body content (plain text)"),
      cc: z.string().optional().describe("CC recipients (comma-separated)"),
      bcc: z.string().optional().describe("BCC recipients (comma-separated)"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
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

        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: res.data.id, threadId: res.data.threadId }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_create_draft
  server.tool(
    "gmail_create_draft",
    "Create an email draft",
    {
      to: z.string().describe("Recipient email address(es)"),
      subject: z.string().describe("Email subject line"),
      body: z.string().describe("Email body content (plain text)"),
      cc: z.string().optional().describe("CC recipients"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
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

        return { content: [{ type: "text", text: JSON.stringify({ success: true, draftId: res.data.id, messageId: res.data.message?.id }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_reply
  server.tool(
    "gmail_reply",
    "Reply to an email thread",
    {
      messageId: z.string().describe("ID of the message to reply to"),
      body: z.string().describe("Reply body content"),
      replyAll: z.boolean().optional().default(false).describe("Reply to all recipients"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        const { messageId, body, replyAll = false } = args;

        // Get original message
        const original = await api.users.messages.get({
          userId: "me",
          id: messageId,
          format: "metadata",
          metadataHeaders: ["From", "To", "Cc", "Subject", "Message-ID", "References", "In-Reply-To"],
        });

        const headers = original.data.payload?.headers;
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
            threadId: original.data.threadId!,
          },
        });

        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: res.data.id, threadId: res.data.threadId }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_list_labels
  server.tool(
    "gmail_list_labels",
    "List all Gmail labels",
    {},
    async (): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        const res = await api.users.labels.list({ userId: "me" });
        const labels = res.data.labels?.map((l) => ({
          id: l.id,
          name: l.name,
          type: l.type,
          messageCount: l.messagesTotal,
          unreadCount: l.messagesUnread,
        })) || [];
        return { content: [{ type: "text", text: JSON.stringify(labels, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_add_labels
  server.tool(
    "gmail_add_labels",
    "Add labels to a message",
    {
      messageId: z.string().describe("Message ID"),
      labelIds: z.array(z.string()).describe("Label IDs to add"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        await api.users.messages.modify({
          userId: "me",
          id: args.messageId,
          requestBody: { addLabelIds: args.labelIds },
        });
        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: args.messageId, addedLabels: args.labelIds }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_remove_labels
  server.tool(
    "gmail_remove_labels",
    "Remove labels from a message",
    {
      messageId: z.string().describe("Message ID"),
      labelIds: z.array(z.string()).describe("Label IDs to remove"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        await api.users.messages.modify({
          userId: "me",
          id: args.messageId,
          requestBody: { removeLabelIds: args.labelIds },
        });
        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: args.messageId, removedLabels: args.labelIds }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_archive
  server.tool(
    "gmail_archive",
    "Archive a message (remove from inbox)",
    {
      messageId: z.string().describe("Message ID to archive"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        await api.users.messages.modify({
          userId: "me",
          id: args.messageId,
          requestBody: { removeLabelIds: ["INBOX"] },
        });
        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: args.messageId, action: "archived" }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_trash
  server.tool(
    "gmail_trash",
    "Move a message to trash",
    {
      messageId: z.string().describe("Message ID to trash"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        await api.users.messages.trash({ userId: "me", id: args.messageId });
        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: args.messageId, action: "trashed" }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_mark_read
  server.tool(
    "gmail_mark_read",
    "Mark a message as read",
    {
      messageId: z.string().describe("Message ID"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        await api.users.messages.modify({
          userId: "me",
          id: args.messageId,
          requestBody: { removeLabelIds: ["UNREAD"] },
        });
        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: args.messageId, action: "marked_read" }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_mark_unread
  server.tool(
    "gmail_mark_unread",
    "Mark a message as unread",
    {
      messageId: z.string().describe("Message ID"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        await api.users.messages.modify({
          userId: "me",
          id: args.messageId,
          requestBody: { addLabelIds: ["UNREAD"] },
        });
        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: args.messageId, action: "marked_unread" }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_star
  server.tool(
    "gmail_star",
    "Star a message",
    {
      messageId: z.string().describe("Message ID"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        await api.users.messages.modify({
          userId: "me",
          id: args.messageId,
          requestBody: { addLabelIds: ["STARRED"] },
        });
        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: args.messageId, action: "starred" }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // gmail_unstar
  server.tool(
    "gmail_unstar",
    "Remove star from a message",
    {
      messageId: z.string().describe("Message ID"),
    },
    async (args): Promise<CallToolResult> => {
      try {
        const api = await initGmail();
        await api.users.messages.modify({
          userId: "me",
          id: args.messageId,
          requestBody: { removeLabelIds: ["STARRED"] },
        });
        return { content: [{ type: "text", text: JSON.stringify({ success: true, messageId: args.messageId, action: "unstarred" }, null, 2) }] };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    }
  );

  // ============ MCP APP EMAIL EDITOR TOOLS ============

  // Main tool to open the email editor
  registerAppTool(server,
    "compose_email",
    {
      title: "Compose Email",
      description: "Open the email editor to compose or edit an email. Use this when the user wants to write, reply to, or edit an email.",
      inputSchema: {
        to: z.array(z.string()).optional().describe("Pre-filled recipients"),
        cc: z.array(z.string()).optional().describe("Pre-filled CC recipients"),
        bcc: z.array(z.string()).optional().describe("Pre-filled BCC recipients"),
        subject: z.string().optional().describe("Pre-filled subject line"),
        body: z.string().optional().describe("Pre-filled email body (can include draft content)"),
        signature: z.string().optional().describe("Email signature to append"),
        reply_to_thread_id: z.string().optional().describe("Thread ID if this is a reply"),
        reply_to_message_id: z.string().optional().describe("Message ID if this is a reply"),
        draft_id: z.string().optional().describe("Resume editing an existing draft"),
      },
      _meta: { ui: { resourceUri } },
    },
    async (args): Promise<CallToolResult> => {
      const {
        to = [],
        cc = [],
        bcc = [],
        subject = "",
        body = "",
        signature = "",
        reply_to_thread_id,
        reply_to_message_id,
        draft_id
      } = args;

      let draft: EmailDraft;

      if (draft_id && drafts.has(draft_id)) {
        // Resume existing draft
        draft = drafts.get(draft_id)!;
      } else {
        // Create new draft
        draft = {
          id: generateId(),
          to: Array.isArray(to) ? to : [],
          cc: Array.isArray(cc) ? cc : [],
          bcc: Array.isArray(bcc) ? bcc : [],
          subject: subject || "",
          body: body || "",
          signature: signature || "",
          replyToThreadId: reply_to_thread_id,
          replyToMessageId: reply_to_message_id,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        drafts.set(draft.id, draft);
      }

      const draftData = {
        draft_id: draft.id,
        to: draft.to,
        cc: draft.cc,
        bcc: draft.bcc,
        subject: draft.subject,
        body: draft.body,
        signature: draft.signature,
        is_reply: !!(draft.replyToThreadId || draft.replyToMessageId),
        reply_to_thread_id: draft.replyToThreadId,
        reply_to_message_id: draft.replyToMessageId,
      };

      return {
        content: [
          {
            type: "text",
            text: `Email editor opened. The user can now compose their email in the editor above.`
          },
          {
            type: "text",
            text: JSON.stringify(draftData)
          }
        ]
      };
    },
  );

  // Tool to update the draft (called by UI as user types)
  registerAppTool(server,
    "update_draft",
    {
      title: "Update Draft",
      description: "Update the email draft content",
      inputSchema: {
        draft_id: z.string().describe("The draft ID"),
        to: z.array(z.string()).optional().describe("Updated recipients"),
        cc: z.array(z.string()).optional().describe("Updated CC recipients"),
        bcc: z.array(z.string()).optional().describe("Updated BCC recipients"),
        subject: z.string().optional().describe("Updated subject"),
        body: z.string().optional().describe("Updated body"),
      },
      _meta: { ui: { resourceUri, visibility: ["app"] } },
    },
    async (args): Promise<CallToolResult> => {
      const draft = drafts.get(args.draft_id);
      if (!draft) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "Draft not found" }) }], isError: true };
      }

      // Update fields if provided
      if (args.to !== undefined) draft.to = args.to;
      if (args.cc !== undefined) draft.cc = args.cc;
      if (args.bcc !== undefined) draft.bcc = args.bcc;
      if (args.subject !== undefined) draft.subject = args.subject;
      if (args.body !== undefined) draft.body = args.body;
      draft.updatedAt = Date.now();

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            draft_id: draft.id,
            updated: true,
            updated_at: draft.updatedAt
          })
        }]
      };
    },
  );

  // Tool to send the email (triggers actual send via Gmail API)
  registerAppTool(server,
    "editor_send_email",
    {
      title: "Send Email from Editor",
      description: "Send the composed email from the editor. This will send the email using the Gmail API.",
      inputSchema: {
        draft_id: z.string().describe("The draft ID to send"),
      },
      _meta: { ui: { resourceUri, visibility: ["app"] } },
    },
    async (args): Promise<CallToolResult> => {
      const draft = drafts.get(args.draft_id);
      if (!draft) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "Draft not found" }) }], isError: true };
      }

      // Validate required fields
      if (draft.to.length === 0) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "No recipients specified" }) }], isError: true };
      }
      if (!draft.subject.trim()) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "Subject is required" }) }], isError: true };
      }

      try {
        const api = await initGmail();

        const to = draft.to.join(", ");
        const cc = draft.cc.join(", ");
        const bcc = draft.bcc.join(", ");
        const body = draft.body + (draft.signature ? `\n\n${draft.signature}` : "");

        let email = `To: ${to}\n`;
        if (cc) email += `Cc: ${cc}\n`;
        if (bcc) email += `Bcc: ${bcc}\n`;
        email += `Subject: ${draft.subject}\n`;
        email += `Content-Type: text/plain; charset=utf-8\n\n`;
        email += body;

        const res = await api.users.messages.send({
          userId: "me",
          requestBody: {
            raw: encodeBase64Url(email),
            threadId: draft.replyToThreadId,
          },
        });

        // Remove from drafts after sending
        drafts.delete(args.draft_id);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: true,
              sent: true,
              messageId: res.data.id,
              threadId: res.data.threadId,
              to: draft.to,
              subject: draft.subject,
            })
          }]
        };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    },
  );

  // Tool to save as Gmail draft
  registerAppTool(server,
    "save_draft",
    {
      title: "Save Draft",
      description: "Save the email as a Gmail draft and close the editor",
      inputSchema: {
        draft_id: z.string().describe("The draft ID to save"),
      },
      _meta: { ui: { resourceUri, visibility: ["app"] } },
    },
    async (args): Promise<CallToolResult> => {
      const draft = drafts.get(args.draft_id);
      if (!draft) {
        return { content: [{ type: "text", text: JSON.stringify({ error: "Draft not found" }) }], isError: true };
      }

      try {
        const api = await initGmail();

        const to = draft.to.join(", ");
        const cc = draft.cc.join(", ");
        const body = draft.body + (draft.signature ? `\n\n${draft.signature}` : "");

        let email = `To: ${to}\n`;
        if (cc) email += `Cc: ${cc}\n`;
        email += `Subject: ${draft.subject}\n`;
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

        // Remove from in-memory drafts
        drafts.delete(args.draft_id);

        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              saved: true,
              gmail_draft_id: res.data.id,
              message: "Draft saved to Gmail. You can find it in your Drafts folder."
            })
          }]
        };
      } catch (error: any) {
        return { content: [{ type: "text", text: JSON.stringify({ error: error.message }) }], isError: true };
      }
    },
  );

  // Tool to discard the draft
  registerAppTool(server,
    "discard_draft",
    {
      title: "Discard Draft",
      description: "Discard the email draft and close the editor",
      inputSchema: {
        draft_id: z.string().describe("The draft ID to discard"),
      },
      _meta: { ui: { resourceUri, visibility: ["app"] } },
    },
    async (args): Promise<CallToolResult> => {
      const existed = drafts.delete(args.draft_id);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            discarded: true,
            existed,
            message: existed ? "Draft discarded." : "Draft was already discarded or did not exist."
          })
        }]
      };
    },
  );

  // Register the HTML resource
  registerAppResource(server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      const html = await fs.readFile(path.join(DIST_DIR, "mcp-app.html"), "utf-8");
      return {
        contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
      };
    },
  );

  return server;
}
