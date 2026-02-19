/**
 * Entry point for running the Sabai Doc Notion MCP server.
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
async function main() {
    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Sabai Doc Notion MCP server running");
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
