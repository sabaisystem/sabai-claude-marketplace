import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  CallToolResult,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Resolve dist directory (works from both source and compiled)
const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

// Current diagram state
let currentDiagram: {
  code: string;
  title: string;
  mode: "code" | "diagram" | "both";
} = { code: "", title: "", mode: "both" };

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Sabai Diagrams",
    version: "1.0.0",
  });

  const resourceUri = "ui://diagrams/mcp-app.html";

  // --- Resource: MCP App HTML ---
  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      const html = await fs.readFile(
        path.join(DIST_DIR, "mcp-app.html"),
        "utf-8"
      );
      return {
        contents: [
          { uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html },
        ],
      };
    }
  );

  // --- Tool: render_diagram (visible to Claude + App) ---
  registerAppTool(
    server,
    "render_diagram",
    {
      title: "Render Mermaid Diagram",
      description:
        "Render a Mermaid diagram in the visual panel. Supports flowcharts, sequence diagrams, state diagrams, Gantt charts, ER diagrams, and class diagrams.",
      inputSchema: {
        mermaid_code: z
          .string()
          .describe("The Mermaid diagram syntax to render"),
        title: z
          .string()
          .optional()
          .describe("Optional title for the diagram"),
        display_mode: z
          .enum(["code", "diagram", "both"])
          .default("both")
          .describe("Display mode: code only, diagram only, or both"),
      },
      _meta: { ui: { resourceUri } },
    },
    async (args: {
      mermaid_code: string;
      title?: string;
      display_mode?: "code" | "diagram" | "both";
    }): Promise<CallToolResult> => {
      currentDiagram = {
        code: args.mermaid_code,
        title: args.title || "",
        mode: args.display_mode || "both",
      };

      return {
        content: [
          {
            type: "text",
            text: `Diagram rendered: ${args.title || "Untitled diagram"}`,
          },
          { type: "text", text: JSON.stringify(currentDiagram) },
        ],
      };
    }
  );

  // --- Tool: update_display_mode (app-only) ---
  registerAppTool(
    server,
    "update_display_mode",
    {
      title: "Update Display Mode",
      description: "Toggle between code, diagram, or both views",
      _meta: { ui: { resourceUri: "ui://diagrams/mcp-app.html", visibility: ["app"] } },
      inputSchema: {
        mode: z.enum(["code", "diagram", "both"]),
      },
    },
    async (args: {
      mode: "code" | "diagram" | "both";
    }): Promise<CallToolResult> => {
      currentDiagram.mode = args.mode;
      return {
        content: [{ type: "text", text: JSON.stringify(currentDiagram) }],
      };
    }
  );

  // --- Tool: get_current_diagram (app-only) ---
  registerAppTool(
    server,
    "get_current_diagram",
    {
      title: "Get Current Diagram",
      description: "Retrieve the current diagram state",
      _meta: { ui: { resourceUri: "ui://diagrams/mcp-app.html", visibility: ["app"] } },
      inputSchema: {},
    },
    async (): Promise<CallToolResult> => {
      return {
        content: [{ type: "text", text: JSON.stringify(currentDiagram) }],
      };
    }
  );

  return server;
}
