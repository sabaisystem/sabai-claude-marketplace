#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  listAccounts,
  getActiveAccount,
  switchAccount,
  addAccount,
  removeAccount,
} from "./account-manager.js";
import { getConsentUrl } from "./auth.js";
import {
  getUserInfo,
  listEnvelopes,
  getEnvelope,
  getEnvelopeDocuments,
  getEnvelopeRecipients,
} from "./docusign-client.js";

const server = new Server(
  { name: "sabai-docusign", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

// ============ TOOL DEFINITIONS ============

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "docusign_list_accounts",
      description: "List all configured DocuSign account profiles and show which one is active",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "docusign_switch_account",
      description: "Switch the active DocuSign account profile",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: { type: "string", description: "Account profile name to switch to" },
        },
        required: ["name"],
      },
    },
    {
      name: "docusign_add_account",
      description:
        "Add a new DocuSign account profile for JWT authentication. Requires Integration Key, User ID, Account ID, and either the RSA private key content (PEM) or a file path to the key.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: { type: "string", description: "Profile name (e.g. 'acme-corp', 'personal')" },
          integrationKey: { type: "string", description: "DocuSign Integration Key (Client ID)" },
          userId: { type: "string", description: "DocuSign User ID (GUID) to impersonate" },
          accountId: { type: "string", description: "DocuSign Account ID" },
          privateKey: { type: "string", description: "RSA private key PEM content (paste the full key including BEGIN/END lines). Preferred for CoWork." },
          privateKeyPath: { type: "string", description: "Absolute path to RSA private key .pem file. Use for Claude Code / local dev." },
          environment: {
            type: "string",
            enum: ["demo", "production"],
            description: "DocuSign environment (default: demo)",
          },
        },
        required: ["name", "integrationKey", "userId", "accountId"],
      },
    },
    {
      name: "docusign_remove_account",
      description: "Remove a saved DocuSign account profile",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: { type: "string", description: "Account profile name to remove" },
        },
        required: ["name"],
      },
    },
    {
      name: "docusign_get_user_info",
      description: "Get the authenticated user's information from the active DocuSign account",
      inputSchema: { type: "object" as const, properties: {} },
    },
    {
      name: "docusign_list_envelopes",
      description:
        "List DocuSign envelopes (agreements) with optional filters. Returns envelope ID, subject, status, and recipient info.",
      inputSchema: {
        type: "object" as const,
        properties: {
          status: {
            type: "string",
            description:
              "Filter by status: created, sent, delivered, signed, completed, declined, voided, deleted. Comma-separate for multiple.",
          },
          fromDate: {
            type: "string",
            description: "Start date in ISO 8601 format (default: 30 days ago)",
          },
          toDate: {
            type: "string",
            description: "End date in ISO 8601 format",
          },
          searchText: {
            type: "string",
            description: "Search envelopes by subject or recipient name/email",
          },
          count: {
            type: "number",
            description: "Maximum number of results to return (default: 25)",
          },
        },
      },
    },
    {
      name: "docusign_get_envelope",
      description:
        "Get detailed information about a specific DocuSign envelope including recipients, documents, and status",
      inputSchema: {
        type: "object" as const,
        properties: {
          envelopeId: { type: "string", description: "The envelope ID (GUID)" },
        },
        required: ["envelopeId"],
      },
    },
    {
      name: "docusign_get_documents",
      description: "List all documents within a DocuSign envelope",
      inputSchema: {
        type: "object" as const,
        properties: {
          envelopeId: { type: "string", description: "The envelope ID (GUID)" },
        },
        required: ["envelopeId"],
      },
    },
    {
      name: "docusign_get_recipients",
      description: "Get recipient details and signing status for a DocuSign envelope",
      inputSchema: {
        type: "object" as const,
        properties: {
          envelopeId: { type: "string", description: "The envelope ID (GUID)" },
        },
        required: ["envelopeId"],
      },
    },
  ],
}));

// ============ TOOL HANDLERS ============

function requireActiveAccount() {
  const account = getActiveAccount();
  if (!account) {
    throw new Error(
      "No DocuSign account configured.\n\n" +
      "To get started, use docusign_add_account with:\n" +
      "- name: a profile name (e.g. 'my-company')\n" +
      "- integrationKey: from DocuSign Admin > Integrations > Apps and Keys\n" +
      "- userId: your DocuSign User ID (GUID)\n" +
      "- accountId: your DocuSign Account ID\n" +
      "- privateKey: paste your RSA private key PEM content (preferred)\n" +
      "- environment: 'demo' or 'production'"
    );
  }
  return account;
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "docusign_list_accounts": {
        const accounts = listAccounts();
        if (accounts.length === 0) {
          // Check if env vars are set
          const envAccount = getActiveAccount();
          if (envAccount) {
            return {
              content: [{
                type: "text",
                text: JSON.stringify({
                  accounts: [{ name: "default (from env vars)", environment: envAccount.environment, isActive: true }],
                }, null, 2),
              }],
            };
          }
          return {
            content: [{ type: "text", text: "No accounts configured. Use docusign_add_account to add one." }],
          };
        }
        return {
          content: [{ type: "text", text: JSON.stringify({ accounts }, null, 2) }],
        };
      }

      case "docusign_switch_account": {
        const account = switchAccount(args?.name as string);
        return {
          content: [{
            type: "text",
            text: `Switched to account "${account.name}" (${account.environment})`,
          }],
        };
      }

      case "docusign_add_account": {
        addAccount({
          name: args?.name as string,
          integrationKey: args?.integrationKey as string,
          userId: args?.userId as string,
          accountId: args?.accountId as string,
          privateKey: args?.privateKey as string | undefined,
          privateKeyPath: args?.privateKeyPath as string | undefined,
          environment: (args?.environment as "demo" | "production") || "demo",
        });

        const account = getActiveAccount()!;
        const consentUrl = getConsentUrl(account);

        return {
          content: [{
            type: "text",
            text:
              `Account "${args?.name}" added successfully.\n\n` +
              `If this is the first time using this Integration Key, you need to grant consent.\n` +
              `Visit this URL in your browser (one-time):\n${consentUrl}\n\n` +
              `After granting consent, you can use all DocuSign commands.`,
          }],
        };
      }

      case "docusign_remove_account": {
        removeAccount(args?.name as string);
        return {
          content: [{ type: "text", text: `Account "${args?.name}" removed.` }],
        };
      }

      case "docusign_get_user_info": {
        const account = requireActiveAccount();
        const info = await getUserInfo(account);
        return {
          content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
        };
      }

      case "docusign_list_envelopes": {
        const account = requireActiveAccount();
        const result = await listEnvelopes(account, {
          status: args?.status as string | undefined,
          fromDate: args?.fromDate as string | undefined,
          toDate: args?.toDate as string | undefined,
          searchText: args?.searchText as string | undefined,
          count: args?.count as number | undefined,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "docusign_get_envelope": {
        const account = requireActiveAccount();
        const envelope = await getEnvelope(account, args?.envelopeId as string);
        return {
          content: [{ type: "text", text: JSON.stringify(envelope, null, 2) }],
        };
      }

      case "docusign_get_documents": {
        const account = requireActiveAccount();
        const docs = await getEnvelopeDocuments(account, args?.envelopeId as string);
        return {
          content: [{ type: "text", text: JSON.stringify(docs, null, 2) }],
        };
      }

      case "docusign_get_recipients": {
        const account = requireActiveAccount();
        const recipients = await getEnvelopeRecipients(account, args?.envelopeId as string);
        return {
          content: [{ type: "text", text: JSON.stringify(recipients, null, 2) }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// ============ START SERVER ============

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DocuSign MCP server running");
}

main().catch((err) => {
  console.error("Failed to start DocuSign MCP server:", err);
  process.exit(1);
});
