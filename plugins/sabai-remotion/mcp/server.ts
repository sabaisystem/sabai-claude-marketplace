import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { bundle } from "@remotion/bundler";
import { renderStill, renderMedia, selectComposition, getCompositions } from "@remotion/renderer";

// Works both from source (server.ts) and compiled (dist/server.js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
  ? path.join(import.meta.dirname, "dist")
  : import.meta.dirname;

const REMOTION_ENTRY = path.join(import.meta.dirname, "remotion", "index.ts");

// ============ VIDEO SERVICE ============

interface Template {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  aspectRatio: string;
  defaultProps: Record<string, unknown>;
}

// Template registry - matches Remotion compositions
const TEMPLATES: Template[] = [
  {
    id: "social-clip",
    name: "Social Clip",
    description: "Vertical video for TikTok, Instagram Reels, YouTube Shorts",
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 150, // 5 seconds
    aspectRatio: "9:16",
    defaultProps: {
      title: "Your Title Here",
      subtitle: "Add a subtitle",
      backgroundColor: "#f26a2c",
      textColor: "#ffffff",
    },
  },
  {
    id: "tutorial",
    name: "Tutorial",
    description: "Horizontal video for YouTube, presentations, demos",
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 300, // 10 seconds
    aspectRatio: "16:9",
    defaultProps: {
      title: "Tutorial Title",
      steps: ["Step 1", "Step 2", "Step 3"],
      backgroundColor: "#013b2d",
      textColor: "#fef2ec",
    },
  },
  {
    id: "data-viz",
    name: "Data Visualization",
    description: "Animated charts and data visualizations",
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 180, // 6 seconds
    aspectRatio: "16:9",
    defaultProps: {
      title: "Data Overview",
      data: [
        { label: "Jan", value: 100 },
        { label: "Feb", value: 150 },
        { label: "Mar", value: 120 },
        { label: "Apr", value: 200 },
      ],
      chartColor: "#f26a2c",
      backgroundColor: "#1a1a2e",
    },
  },
  {
    id: "text-animation",
    name: "Text Animation",
    description: "Animated text reveals and effects",
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 90, // 3 seconds
    aspectRatio: "16:9",
    defaultProps: {
      text: "Hello World",
      fontSize: 120,
      fontFamily: "Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
      effect: "fade-in",
    },
  },
];

// Cache for the Remotion bundle
let bundleLocation: string | null = null;

async function ensureBundle(): Promise<string> {
  if (bundleLocation) {
    return bundleLocation;
  }

  console.error("Bundling Remotion project...");
  bundleLocation = await bundle({
    entryPoint: REMOTION_ENTRY,
    onProgress: (progress) => {
      if (progress % 20 === 0) {
        console.error(`Bundle progress: ${progress}%`);
      }
    },
  });
  console.error("Bundle complete:", bundleLocation);
  return bundleLocation;
}

// ============ MCP SERVER ============

export function createServer(): McpServer {
  const server = new McpServer({
    name: "Sabai Remotion",
    version: "0.1.0",
  });

  const resourceUri = "ui://remotion/mcp-app.html";

  // Tool to list available templates
  registerAppTool(
    server,
    "list_templates",
    {
      title: "List Video Templates",
      description: "List all available video templates with their metadata",
      inputSchema: {},
      _meta: { ui: { resourceUri } },
    },
    async (): Promise<CallToolResult> => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ templates: TEMPLATES }, null, 2),
          },
        ],
      };
    }
  );

  // Tool to get composition info
  registerAppTool(
    server,
    "get_composition_info",
    {
      title: "Get Composition Info",
      description: "Get detailed information about a specific video template",
      inputSchema: {
        template_id: z.string().describe("The template ID (e.g., 'social-clip', 'tutorial')"),
      },
      _meta: { ui: { resourceUri } },
    },
    async (args): Promise<CallToolResult> => {
      const template = TEMPLATES.find((t) => t.id === args.template_id);
      if (!template) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: `Template '${args.template_id}' not found`,
                available: TEMPLATES.map((t) => t.id),
              }),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(template, null, 2),
          },
        ],
      };
    }
  );

  // Tool to preview a frame
  registerAppTool(
    server,
    "preview_frame",
    {
      title: "Preview Frame",
      description: "Generate a single frame preview from a video template. Returns a base64 PNG image.",
      inputSchema: {
        template_id: z.string().describe("The template ID"),
        props: z.record(z.unknown()).optional().describe("Custom props to override defaults"),
        frame: z.number().optional().describe("Frame number to render (default: 0)"),
      },
      _meta: { ui: { resourceUri } },
    },
    async (args): Promise<CallToolResult> => {
      const template = TEMPLATES.find((t) => t.id === args.template_id);
      if (!template) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "Template not found" }) }],
          isError: true,
        };
      }

      try {
        const serveUrl = await ensureBundle();
        const inputProps = { ...template.defaultProps, ...args.props };
        const frame = args.frame ?? 0;

        const composition = await selectComposition({
          serveUrl,
          id: args.template_id,
          inputProps,
        });

        const outputPath = path.join(DIST_DIR, `preview-${Date.now()}.png`);

        await renderStill({
          composition,
          serveUrl,
          output: outputPath,
          frame: Math.min(frame, composition.durationInFrames - 1),
          imageFormat: "png",
          inputProps,
        });

        // Read the file and convert to base64
        const imageBuffer = await fs.readFile(outputPath);
        const base64 = imageBuffer.toString("base64");

        // Clean up temp file
        await fs.unlink(outputPath).catch(() => {});

        return {
          content: [
            {
              type: "image",
              data: base64,
              mimeType: "image/png",
            },
            {
              type: "text",
              text: JSON.stringify({
                template_id: args.template_id,
                frame,
                width: composition.width,
                height: composition.height,
              }),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "Failed to render preview",
                message: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Tool to render a full video
  registerAppTool(
    server,
    "render_video",
    {
      title: "Render Video",
      description: "Render a full video from a template. This may take some time depending on duration.",
      inputSchema: {
        template_id: z.string().describe("The template ID"),
        props: z.record(z.unknown()).optional().describe("Custom props to override defaults"),
        output_path: z.string().describe("Output file path (e.g., '/tmp/video.mp4')"),
        codec: z.enum(["h264", "vp9", "gif"]).optional().describe("Video codec (default: h264)"),
      },
      _meta: { ui: { resourceUri } },
    },
    async (args): Promise<CallToolResult> => {
      const template = TEMPLATES.find((t) => t.id === args.template_id);
      if (!template) {
        return {
          content: [{ type: "text", text: JSON.stringify({ error: "Template not found" }) }],
          isError: true,
        };
      }

      try {
        const serveUrl = await ensureBundle();
        const inputProps = { ...template.defaultProps, ...args.props };
        const codec = args.codec ?? "h264";

        const composition = await selectComposition({
          serveUrl,
          id: args.template_id,
          inputProps,
        });

        console.error(`Starting render: ${args.template_id} -> ${args.output_path}`);

        await renderMedia({
          composition,
          serveUrl,
          codec,
          outputLocation: args.output_path,
          inputProps,
          onProgress: ({ progress }) => {
            const percent = Math.round(progress * 100);
            if (percent % 10 === 0) {
              console.error(`Render progress: ${percent}%`);
            }
          },
        });

        // Get file stats
        const stats = await fs.stat(args.output_path);
        const duration = composition.durationInFrames / composition.fps;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                output_path: args.output_path,
                duration_seconds: duration,
                file_size_bytes: stats.size,
                file_size_mb: (stats.size / (1024 * 1024)).toFixed(2),
                codec,
                resolution: `${composition.width}x${composition.height}`,
                fps: composition.fps,
              }),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "Failed to render video",
                message: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Register the HTML resource for MCP App
  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      const html = await fs.readFile(path.join(DIST_DIR, "mcp-app.html"), "utf-8");
      return {
        contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
      };
    }
  );

  return server;
}
