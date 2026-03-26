import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new McpServer({
  name: "sabai-sabai",
  version: "1.0.0",
});

const resourceUri = "ui://sabai/video-player.html";

// Register the video player tool
registerAppTool(server,
  "sabai_video_player",
  {
    title: "Sabai Sabai",
    description: "Take a break and relax with some chill Thai vibes. Displays a video player with relaxing music.",
    inputSchema: {},
    _meta: { ui: { resourceUri } },
  },
  async (): Promise<CallToolResult> => {
    return {
      content: [
        {
          type: "text",
          text: "Sabai sabai! Take a moment to relax and enjoy the vibes."
        }
      ]
    };
  },
);

// Register the HTML resource
registerAppResource(server,
  resourceUri,
  resourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async (): Promise<ReadResourceResult> => {
    const html = readFileSync(join(__dirname, "dist", "index.html"), "utf-8");
    return {
      contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
    };
  },
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sabai Sabai MCP server running");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
