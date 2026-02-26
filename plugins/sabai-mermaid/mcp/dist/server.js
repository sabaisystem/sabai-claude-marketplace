import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
// Works both from source (server.ts) and compiled (dist/server.js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
    ? path.join(import.meta.dirname, "dist")
    : import.meta.dirname;
// In-memory diagram storage
const diagrams = new Map();
// Current active diagram ID
let currentDiagramId = null;
function generateId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
// Validate basic Mermaid syntax
function validateMermaidSyntax(code) {
    const trimmed = code.trim();
    // Check for empty code
    if (!trimmed) {
        return { valid: false, error: "Diagram code cannot be empty" };
    }
    // List of valid Mermaid diagram types
    const validTypes = [
        'flowchart', 'graph', 'sequenceDiagram', 'classDiagram',
        'stateDiagram', 'stateDiagram-v2', 'erDiagram', 'journey',
        'gantt', 'pie', 'quadrantChart', 'requirementDiagram',
        'gitGraph', 'mindmap', 'timeline', 'zenuml', 'sankey',
        'xychart-beta', 'block-beta'
    ];
    // Check if the code starts with a valid diagram type
    const firstLine = trimmed.split('\n')[0].trim().toLowerCase();
    const hasValidType = validTypes.some(type => firstLine.startsWith(type.toLowerCase()) ||
        firstLine.startsWith(`%%{init:`) // Config directive
    );
    if (!hasValidType && !trimmed.startsWith('%%')) {
        return {
            valid: false,
            error: `Invalid diagram type. Code should start with one of: ${validTypes.slice(0, 5).join(', ')}...`
        };
    }
    return { valid: true };
}
// ============ MCP SERVER ============
export function createServer() {
    const server = new McpServer({
        name: "Sabai Mermaid",
        version: "1.0.0",
    });
    const resourceUri = "ui://mermaid/mcp-app.html";
    // Main tool to render/display a Mermaid diagram
    registerAppTool(server, "render_mermaid", {
        title: "Render Mermaid Diagram",
        description: "Render a Mermaid diagram and display it in the interactive viewer. Supports flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, and more.",
        inputSchema: {
            code: z.string().describe("The Mermaid diagram code to render"),
            title: z.string().optional().describe("Optional title for the diagram"),
        },
        _meta: { ui: { resourceUri } },
    }, async (args) => {
        const { code, title } = args;
        // Validate syntax
        const validation = validateMermaidSyntax(code);
        if (!validation.valid) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ error: validation.error })
                    }],
                isError: true
            };
        }
        // Create or update diagram
        let diagram;
        if (currentDiagramId && diagrams.has(currentDiagramId)) {
            // Update existing diagram
            diagram = diagrams.get(currentDiagramId);
            diagram.history.push(diagram.code); // Save previous version
            if (diagram.history.length > 20)
                diagram.history.shift(); // Limit history
            diagram.code = code;
            diagram.title = title || diagram.title;
            diagram.updatedAt = Date.now();
        }
        else {
            // Create new diagram
            diagram = {
                id: generateId(),
                code,
                title,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                history: []
            };
            diagrams.set(diagram.id, diagram);
            currentDiagramId = diagram.id;
        }
        return {
            content: [
                {
                    type: "text",
                    text: `Diagram${title ? ` "${title}"` : ""} rendered successfully. The interactive viewer is displayed above.`
                },
                {
                    type: "text",
                    text: JSON.stringify({
                        diagram_id: diagram.id,
                        code: diagram.code,
                        title: diagram.title,
                        can_undo: diagram.history.length > 0
                    })
                }
            ]
        };
    });
    // Tool to update the current diagram
    registerAppTool(server, "update_diagram", {
        title: "Update Diagram",
        description: "Update the current Mermaid diagram with new code",
        inputSchema: {
            code: z.string().describe("The updated Mermaid diagram code"),
            title: z.string().optional().describe("Optional new title for the diagram"),
        },
        _meta: { ui: { resourceUri, visibility: ["app"] } },
    }, async (args) => {
        const { code, title } = args;
        if (!currentDiagramId || !diagrams.has(currentDiagramId)) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: "No active diagram. Use render_mermaid first." }) }],
                isError: true
            };
        }
        // Validate syntax
        const validation = validateMermaidSyntax(code);
        if (!validation.valid) {
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify({ error: validation.error })
                    }],
                isError: true
            };
        }
        const diagram = diagrams.get(currentDiagramId);
        diagram.history.push(diagram.code);
        if (diagram.history.length > 20)
            diagram.history.shift();
        diagram.code = code;
        if (title)
            diagram.title = title;
        diagram.updatedAt = Date.now();
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        diagram_id: diagram.id,
                        code: diagram.code,
                        title: diagram.title,
                        can_undo: diagram.history.length > 0,
                        message: "Diagram updated successfully"
                    })
                }]
        };
    });
    // Tool to undo last change
    registerAppTool(server, "undo_diagram", {
        title: "Undo Change",
        description: "Undo the last change to the diagram",
        inputSchema: {},
        _meta: { ui: { resourceUri, visibility: ["app"] } },
    }, async () => {
        if (!currentDiagramId || !diagrams.has(currentDiagramId)) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: "No active diagram" }) }],
                isError: true
            };
        }
        const diagram = diagrams.get(currentDiagramId);
        if (diagram.history.length === 0) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: "No history to undo" }) }],
                isError: true
            };
        }
        const previousCode = diagram.history.pop();
        diagram.code = previousCode;
        diagram.updatedAt = Date.now();
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        diagram_id: diagram.id,
                        code: diagram.code,
                        title: diagram.title,
                        can_undo: diagram.history.length > 0,
                        message: "Undid last change"
                    })
                }]
        };
    });
    // Tool to get the current diagram code
    registerAppTool(server, "get_diagram", {
        title: "Get Current Diagram",
        description: "Get the current diagram code and state",
        inputSchema: {},
        _meta: { ui: { resourceUri, visibility: ["app"] } },
    }, async () => {
        if (!currentDiagramId || !diagrams.has(currentDiagramId)) {
            return {
                content: [{ type: "text", text: JSON.stringify({ error: "No active diagram" }) }],
                isError: true
            };
        }
        const diagram = diagrams.get(currentDiagramId);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        diagram_id: diagram.id,
                        code: diagram.code,
                        title: diagram.title,
                        can_undo: diagram.history.length > 0
                    })
                }]
        };
    });
    // Tool to create a new diagram (clears the current one)
    registerAppTool(server, "new_diagram", {
        title: "New Diagram",
        description: "Start a fresh diagram, clearing the current one",
        inputSchema: {},
        _meta: { ui: { resourceUri, visibility: ["app"] } },
    }, async () => {
        currentDiagramId = null;
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        message: "Ready for new diagram. Use render_mermaid to create one."
                    })
                }]
        };
    });
    // Register the HTML resource
    registerAppResource(server, resourceUri, resourceUri, { mimeType: RESOURCE_MIME_TYPE }, async () => {
        const html = await fs.readFile(path.join(DIST_DIR, "mcp-app.html"), "utf-8");
        return {
            contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
        };
    });
    return server;
}
//# sourceMappingURL=server.js.map