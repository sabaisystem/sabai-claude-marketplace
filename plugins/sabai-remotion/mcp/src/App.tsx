/**
 * Sabai Remotion MCP App - Interactive video preview and generation
 */
import type { McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

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

interface TemplatesResult {
  templates: Template[];
}

function extractResult<T>(result: CallToolResult): T | null {
  const textContents = result.content?.filter((c) => c.type === "text") || [];
  for (const content of textContents) {
    if ("text" in content) {
      try {
        return JSON.parse(content.text) as T;
      } catch {
        // Not valid JSON, try next content
      }
    }
  }
  return null;
}

function extractImage(result: CallToolResult): string | null {
  const imageContent = result.content?.find((c) => c.type === "image");
  if (imageContent && "data" in imageContent) {
    return `data:image/png;base64,${imageContent.data}`;
  }
  return null;
}

// Sabai System Logo Icon
function SabaiLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg" style={{ width: 24, height: 24 }}>
      <defs>
        <linearGradient id="sabaiGradient" x1="125" y1="2" x2="125" y2="248" gradientUnits="userSpaceOnUse">
          <stop offset=".458" stopColor="#F26A2C"/>
          <stop offset=".77" stopColor="#E95A19"/>
          <stop offset="1" stopColor="#E55310"/>
        </linearGradient>
      </defs>
      <circle cx="125" cy="125" r="124" fill="url(#sabaiGradient)"/>
      <path fill="#fff" d="M213.7 162l-9.5-31.7c-.1-.3-.2-.7-.4-1-1.6-3.2-5.5-4.6-8.8-3L165.3 141c-4.7 2.4-1.9 9.4 3.2 8l16-4.8c-.3.5-.6 1-.8 1.6C173.1 178 136.5 198 104 186.4c-10.6-3.6-20.2-10.2-28.3-18.4-2-2.1-5.3-2.2-7.5-.3-2.2 2-2.4 5.4-.4 7.6 4.4 4.8 9.2 9.2 14.6 13.1 41.2 30.2 98.7 9.9 116.4-36.9 3.5 7 6.8 13.7 6.8 13.7C208.1 169.8 215.1 167.1 213.7 162z"/>
    </svg>
  );
}

function RemotionApp() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [props, setProps] = useState<Record<string, unknown>>({});
  const [previewFrame, setPreviewFrame] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();

  const { app, error: appError } = useApp({
    appInfo: { name: "Sabai Remotion", version: "0.1.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.onteardown = async () => ({});
      app.ontoolinput = async (input) => {
        console.info("Tool input:", input);
      };
      app.ontoolresult = async (result) => {
        console.info("Tool result:", result);
        // Check if it's a templates result
        const data = extractResult<TemplatesResult>(result);
        if (data?.templates) {
          setTemplates(data.templates);
          if (data.templates.length > 0 && !selectedTemplate) {
            selectTemplate(data.templates[0]);
          }
        }
      };
      app.ontoolcancelled = () => {
        console.info("Tool cancelled");
      };
      app.onerror = console.error;
      app.onhostcontextchanged = (params) => {
        setHostContext((prev) => ({ ...prev, ...params }));
      };
    },
  });

  useHostStyles(app);

  useEffect(() => {
    if (app) {
      setHostContext(app.getHostContext());
    }
  }, [app]);

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      if (!app) return;
      try {
        const result = await app.callServerTool({
          name: "list_templates",
          arguments: {},
        });
        const data = extractResult<TemplatesResult>(result);
        if (data?.templates) {
          setTemplates(data.templates);
          if (data.templates.length > 0) {
            selectTemplate(data.templates[0]);
          }
        }
      } catch (err) {
        setError("Failed to load templates");
        console.error(err);
      }
    };
    loadTemplates();
  }, [app]);

  const selectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
    setProps(template.defaultProps);
    setPreviewImage(null);
    setPreviewFrame(0);
  }, []);

  const handlePreview = useCallback(async () => {
    if (!app || !selectedTemplate) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await app.callServerTool({
        name: "preview_frame",
        arguments: {
          template_id: selectedTemplate.id,
          props,
          frame: previewFrame,
        },
      });

      const image = extractImage(result);
      if (image) {
        setPreviewImage(image);
      } else {
        setError("Failed to generate preview");
      }
    } catch (err) {
      setError("Failed to generate preview");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [app, selectedTemplate, props, previewFrame]);

  const updateProp = useCallback((key: string, value: unknown) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  }, []);

  if (appError) return <div style={styles.error}>Error: {appError.message}</div>;
  if (!app) return <div style={styles.loading}>Connecting...</div>;

  return (
    <main
      style={{
        ...styles.container,
        paddingTop: hostContext?.safeAreaInsets?.top,
        paddingRight: hostContext?.safeAreaInsets?.right,
        paddingBottom: hostContext?.safeAreaInsets?.bottom,
        paddingLeft: hostContext?.safeAreaInsets?.left,
      }}
    >
      <div style={styles.header}>
        <h1 style={styles.title}>Sabai Remotion</h1>
        <p style={styles.subtitle}>Create videos programmatically</p>
      </div>

      <div style={styles.content}>
        {/* Template Selector */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Templates</h2>
          <div style={styles.templateGrid}>
            {templates.map((template) => (
              <button
                key={template.id}
                style={{
                  ...styles.templateCard,
                  ...(selectedTemplate?.id === template.id ? styles.templateCardSelected : {}),
                }}
                onClick={() => selectTemplate(template)}
              >
                <div style={styles.templateName}>{template.name}</div>
                <div style={styles.templateMeta}>{template.aspectRatio}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedTemplate && (
          <>
            {/* Props Editor */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Properties</h2>
              <div style={styles.propsGrid}>
                {Object.entries(props).map(([key, value]) => (
                  <div key={key} style={styles.propRow}>
                    <label style={styles.propLabel}>{key}</label>
                    {typeof value === "string" ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateProp(key, e.target.value)}
                        style={styles.input}
                      />
                    ) : typeof value === "number" ? (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => updateProp(key, Number(e.target.value))}
                        style={styles.input}
                      />
                    ) : (
                      <input
                        type="text"
                        value={JSON.stringify(value)}
                        onChange={(e) => {
                          try {
                            updateProp(key, JSON.parse(e.target.value));
                          } catch {
                            // Invalid JSON, ignore
                          }
                        }}
                        style={styles.input}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Frame Slider */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Preview Frame</h2>
              <div style={styles.sliderContainer}>
                <input
                  type="range"
                  min={0}
                  max={selectedTemplate.durationInFrames - 1}
                  value={previewFrame}
                  onChange={(e) => setPreviewFrame(Number(e.target.value))}
                  style={styles.slider}
                />
                <span style={styles.frameLabel}>
                  Frame {previewFrame} / {selectedTemplate.durationInFrames - 1}
                </span>
              </div>
              <button
                onClick={handlePreview}
                disabled={isLoading}
                style={{
                  ...styles.button,
                  ...(isLoading ? styles.buttonDisabled : {}),
                }}
              >
                {isLoading ? "Generating..." : "Generate Preview"}
              </button>
            </div>

            {/* Preview Image */}
            {previewImage && (
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Preview</h2>
                <div style={styles.previewContainer}>
                  <img
                    src={previewImage}
                    alt="Video preview"
                    style={{
                      ...styles.previewImage,
                      aspectRatio: selectedTemplate.aspectRatio.replace(":", "/"),
                    }}
                  />
                </div>
              </div>
            )}

            {error && <div style={styles.errorBox}>{error}</div>}
          </>
        )}
      </div>

      <footer style={styles.footer}>
        <a href="https://sabaisystem.com" target="_blank" rel="noopener noreferrer" style={styles.footerLink}>
          <SabaiLogo />
          <span style={{ marginLeft: 8 }}>Sabai System</span>
        </a>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    maxWidth: 800,
    margin: "0 auto",
    padding: 20,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f26a2c",
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    margin: "8px 0 0",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 12,
    marginTop: 0,
    color: "#333",
  },
  templateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 12,
  },
  templateCard: {
    padding: 12,
    border: "2px solid #e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left" as const,
  },
  templateCardSelected: {
    borderColor: "#f26a2c",
    backgroundColor: "#fff5f0",
  },
  templateName: {
    fontWeight: 600,
    fontSize: 14,
  },
  templateMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  propsGrid: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
  },
  propRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  propLabel: {
    width: 120,
    fontSize: 13,
    fontWeight: 500,
    color: "#555",
  },
  input: {
    flex: 1,
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: 4,
    fontSize: 14,
  },
  sliderContainer: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  slider: {
    flex: 1,
  },
  frameLabel: {
    fontSize: 13,
    color: "#666",
    minWidth: 100,
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#f26a2c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  previewContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: 400,
    objectFit: "contain" as const,
  },
  errorBox: {
    padding: 12,
    backgroundColor: "#fee",
    color: "#c00",
    borderRadius: 6,
    fontSize: 14,
  },
  error: {
    padding: 20,
    textAlign: "center" as const,
    color: "#c00",
  },
  loading: {
    padding: 20,
    textAlign: "center" as const,
    color: "#666",
  },
  footer: {
    textAlign: "center" as const,
    padding: 20,
    borderTop: "1px solid #eee",
    marginTop: 20,
  },
  footerLink: {
    color: "#f26a2c",
    textDecoration: "none",
    fontSize: 13,
    display: "inline-flex",
    alignItems: "center",
  },
};

// Global error handler
window.onerror = (msg, _url, _line, _col, error) => {
  console.error("Global error:", msg, error);
  return true;
};

window.onunhandledrejection = (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RemotionApp />
  </StrictMode>
);
