import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Client } from "@notionhq/client";
import { z } from "zod";
// Notion client - initialized when API key is provided
let notionClient = null;
function getNotionClient() {
    if (!notionClient) {
        const apiKey = process.env.NOTION_API_KEY;
        if (!apiKey) {
            throw new Error("NOTION_API_KEY environment variable is required. " +
                "Get your API key from https://www.notion.so/my-integrations");
        }
        notionClient = new Client({ auth: apiKey });
    }
    return notionClient;
}
function markdownToNotionBlocks(markdown) {
    const blocks = [];
    const lines = markdown.split("\n");
    let inCodeBlock = false;
    let codeContent = [];
    let codeLanguage = "";
    for (const line of lines) {
        // Handle code blocks
        if (line.startsWith("```")) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                codeLanguage = line.slice(3).trim() || "plain text";
                codeContent = [];
            }
            else {
                blocks.push({
                    type: "code",
                    code: {
                        rich_text: [{ type: "text", text: { content: codeContent.join("\n") } }],
                        language: codeLanguage,
                    },
                });
                inCodeBlock = false;
            }
            continue;
        }
        if (inCodeBlock) {
            codeContent.push(line);
            continue;
        }
        // Skip empty lines
        if (!line.trim()) {
            continue;
        }
        // Handle headings
        if (line.startsWith("### ")) {
            blocks.push({
                type: "heading_3",
                heading_3: {
                    rich_text: [{ type: "text", text: { content: line.slice(4) } }],
                },
            });
        }
        else if (line.startsWith("## ")) {
            blocks.push({
                type: "heading_2",
                heading_2: {
                    rich_text: [{ type: "text", text: { content: line.slice(3) } }],
                },
            });
        }
        else if (line.startsWith("# ")) {
            blocks.push({
                type: "heading_1",
                heading_1: {
                    rich_text: [{ type: "text", text: { content: line.slice(2) } }],
                },
            });
        }
        // Handle bullet lists
        else if (line.startsWith("- ") || line.startsWith("* ")) {
            blocks.push({
                type: "bulleted_list_item",
                bulleted_list_item: {
                    rich_text: [{ type: "text", text: { content: line.slice(2) } }],
                },
            });
        }
        // Handle numbered lists
        else if (/^\d+\.\s/.test(line)) {
            const content = line.replace(/^\d+\.\s/, "");
            blocks.push({
                type: "numbered_list_item",
                numbered_list_item: {
                    rich_text: [{ type: "text", text: { content } }],
                },
            });
        }
        // Handle blockquotes
        else if (line.startsWith("> ")) {
            blocks.push({
                type: "quote",
                quote: {
                    rich_text: [{ type: "text", text: { content: line.slice(2) } }],
                },
            });
        }
        // Handle horizontal rules
        else if (line === "---" || line === "***" || line === "___") {
            blocks.push({ type: "divider", divider: {} });
        }
        // Default to paragraph
        else {
            blocks.push({
                type: "paragraph",
                paragraph: {
                    rich_text: [{ type: "text", text: { content: line } }],
                },
            });
        }
    }
    return blocks;
}
function notionBlocksToMarkdown(blocks) {
    const lines = [];
    for (const block of blocks) {
        const type = block.type;
        const content = block[type];
        if (!content)
            continue;
        const text = content.rich_text?.map((rt) => rt.plain_text).join("") || "";
        switch (type) {
            case "heading_1":
                lines.push(`# ${text}`);
                break;
            case "heading_2":
                lines.push(`## ${text}`);
                break;
            case "heading_3":
                lines.push(`### ${text}`);
                break;
            case "paragraph":
                lines.push(text);
                break;
            case "bulleted_list_item":
                lines.push(`- ${text}`);
                break;
            case "numbered_list_item":
                lines.push(`1. ${text}`);
                break;
            case "code":
                lines.push(`\`\`\`${content.language || ""}`);
                lines.push(text);
                lines.push("```");
                break;
            case "quote":
                lines.push(`> ${text}`);
                break;
            case "divider":
                lines.push("---");
                break;
            default:
                if (text)
                    lines.push(text);
        }
        lines.push("");
    }
    return lines.join("\n").trim();
}
// ============ MCP SERVER ============
export function createServer() {
    const server = new McpServer({
        name: "Sabai Doc Notion",
        version: "1.0.0",
    });
    // Tool: Search Notion pages
    server.tool("notion_search", "Search for pages in Notion workspace", {
        query: z.string().describe("Search query"),
        filter: z.enum(["page", "database"]).optional().describe("Filter by object type"),
    }, async (args) => {
        const notion = getNotionClient();
        const response = await notion.search({
            query: args.query,
            filter: args.filter ? { property: "object", value: args.filter } : undefined,
            page_size: 10,
        });
        const results = response.results.map((result) => {
            let title = "Untitled";
            if (result.object === "page" && result.properties) {
                const titleProp = result.properties.title || result.properties.Name;
                if (titleProp?.title?.[0]) {
                    title = titleProp.title[0].plain_text;
                }
            }
            else if (result.object === "database" && result.title) {
                title = result.title[0]?.plain_text || "Untitled";
            }
            return {
                id: result.id,
                type: result.object,
                title,
                url: result.url,
            };
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(results, null, 2),
                },
            ],
        };
    });
    // Tool: Get page content
    server.tool("notion_get_page", "Get the content of a Notion page as markdown", {
        page_id: z.string().describe("Notion page ID or URL"),
    }, async (args) => {
        const notion = getNotionClient();
        // Extract page ID from URL if needed
        let pageId = args.page_id;
        if (pageId.includes("notion.so")) {
            const match = pageId.match(/([a-f0-9]{32}|[a-f0-9-]{36})/);
            if (match)
                pageId = match[1];
        }
        // Get page metadata
        const page = await notion.pages.retrieve({ page_id: pageId });
        // Get page blocks
        const blocks = await notion.blocks.children.list({ block_id: pageId });
        const markdown = notionBlocksToMarkdown(blocks.results);
        // Extract title
        let title = "Untitled";
        const pageWithProps = page;
        if (pageWithProps.properties) {
            const titleProp = pageWithProps.properties.title || pageWithProps.properties.Name;
            if (titleProp?.title?.[0]) {
                title = titleProp.title[0].plain_text;
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: `# ${title}\n\n${markdown}`,
                },
            ],
        };
    });
    // Tool: Create a new page
    server.tool("notion_create_page", "Create a new page in Notion with markdown content", {
        parent_id: z.string().describe("Parent page or database ID"),
        title: z.string().describe("Page title"),
        content: z.string().describe("Page content in markdown format"),
        is_database: z.boolean().optional().describe("Whether parent is a database (default: false)"),
    }, async (args) => {
        const notion = getNotionClient();
        const blocks = markdownToNotionBlocks(args.content);
        const createParams = {
            parent: args.is_database
                ? { database_id: args.parent_id }
                : { page_id: args.parent_id },
            properties: args.is_database
                ? { Name: { title: [{ text: { content: args.title } }] } }
                : { title: { title: [{ text: { content: args.title } }] } },
            children: blocks,
        };
        const page = await notion.pages.create(createParams);
        const pageWithUrl = page;
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        id: pageWithUrl.id,
                        url: pageWithUrl.url,
                        message: `Page "${args.title}" created successfully`,
                    }),
                },
            ],
        };
    });
    // Tool: Update page content
    server.tool("notion_update_page", "Update a Notion page with new markdown content (replaces existing content)", {
        page_id: z.string().describe("Notion page ID"),
        content: z.string().describe("New content in markdown format"),
    }, async (args) => {
        const notion = getNotionClient();
        // First, get existing blocks and delete them
        const existingBlocks = await notion.blocks.children.list({ block_id: args.page_id });
        for (const block of existingBlocks.results) {
            const blockWithId = block;
            await notion.blocks.delete({ block_id: blockWithId.id });
        }
        // Add new blocks
        const newBlocks = markdownToNotionBlocks(args.content);
        await notion.blocks.children.append({
            block_id: args.page_id,
            children: newBlocks,
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        page_id: args.page_id,
                        message: "Page updated successfully",
                    }),
                },
            ],
        };
    });
    // Tool: Append content to page
    server.tool("notion_append_content", "Append markdown content to an existing Notion page", {
        page_id: z.string().describe("Notion page ID"),
        content: z.string().describe("Content to append in markdown format"),
    }, async (args) => {
        const notion = getNotionClient();
        const blocks = markdownToNotionBlocks(args.content);
        await notion.blocks.children.append({
            block_id: args.page_id,
            children: blocks,
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        page_id: args.page_id,
                        message: "Content appended successfully",
                    }),
                },
            ],
        };
    });
    // Tool: List databases
    server.tool("notion_list_databases", "List all databases in the Notion workspace", {}, async () => {
        const notion = getNotionClient();
        const response = await notion.search({
            filter: { property: "object", value: "database" },
            page_size: 50,
        });
        const databases = response.results.map((db) => ({
            id: db.id,
            title: db.title?.[0]?.plain_text || "Untitled",
            url: db.url,
        }));
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(databases, null, 2),
                },
            ],
        };
    });
    // Tool: Query database
    server.tool("notion_query_database", "Query a Notion database to get its pages", {
        database_id: z.string().describe("Database ID"),
        filter_property: z.string().optional().describe("Property name to filter by"),
        filter_value: z.string().optional().describe("Value to filter for"),
    }, async (args) => {
        const notion = getNotionClient();
        const queryParams = {
            database_id: args.database_id,
            page_size: 50,
        };
        if (args.filter_property && args.filter_value) {
            queryParams.filter = {
                property: args.filter_property,
                rich_text: { contains: args.filter_value },
            };
        }
        const response = await notion.databases.query(queryParams);
        const pages = response.results.map((page) => {
            const properties = {};
            for (const [key, value] of Object.entries(page.properties)) {
                if (value.title) {
                    properties[key] = value.title[0]?.plain_text || "";
                }
                else if (value.rich_text) {
                    properties[key] = value.rich_text[0]?.plain_text || "";
                }
                else if (value.number !== undefined) {
                    properties[key] = value.number;
                }
                else if (value.select) {
                    properties[key] = value.select.name;
                }
                else if (value.multi_select) {
                    properties[key] = value.multi_select.map((s) => s.name);
                }
                else if (value.date) {
                    properties[key] = value.date.start;
                }
                else if (value.checkbox !== undefined) {
                    properties[key] = value.checkbox;
                }
                else if (value.url) {
                    properties[key] = value.url;
                }
                else if (value.email) {
                    properties[key] = value.email;
                }
            }
            return {
                id: page.id,
                url: page.url,
                properties,
            };
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(pages, null, 2),
                },
            ],
        };
    });
    // Tool: Generate docs from code
    server.tool("generate_docs_from_code", "Generate documentation from code files (analyzes functions, classes, exports)", {
        code: z.string().describe("Source code to analyze"),
        language: z.string().describe("Programming language (e.g., typescript, python, javascript)"),
        style: z.enum(["markdown", "jsdoc", "docstring"]).optional().describe("Documentation style (default: markdown)"),
    }, async (args) => {
        // This is a helper tool that provides structured prompts
        // The actual generation is done by Claude
        const style = args.style || "markdown";
        const instructions = {
            markdown: `Generate markdown documentation for this ${args.language} code. Include:
- Overview section
- Function/method signatures with parameters and return types
- Usage examples
- Any important notes or caveats`,
            jsdoc: `Generate JSDoc comments for all functions and classes in this code.`,
            docstring: `Generate docstrings for all functions and classes in this code.`,
        };
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        instruction: instructions[style],
                        code: args.code,
                        language: args.language,
                        note: "Claude should generate the documentation based on these instructions",
                    }),
                },
            ],
        };
    });
    return server;
}
