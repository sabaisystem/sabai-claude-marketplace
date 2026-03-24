import { StrictMode, useState, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import type { McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import mermaid from "mermaid";

// --- Types ---
interface DiagramState {
  code: string;
  title: string;
  mode: "code" | "diagram" | "both";
}

// --- Helpers ---
function extractResult<T>(result: CallToolResult): T | null {
  const textContents = result.content?.filter((c) => c.type === "text") || [];
  for (const content of textContents) {
    if ("text" in content) {
      try {
        return JSON.parse(content.text) as T;
      } catch {
        // Not valid JSON, skip
      }
    }
  }
  return null;
}

// --- Mermaid initialization ---
let mermaidInitialized = false;
function initMermaid(dark: boolean) {
  mermaid.initialize({
    startOnLoad: false,
    theme: dark ? "dark" : "default",
    securityLevel: "strict",
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  });
  mermaidInitialized = true;
}

// --- Sabai Logo ---
function SabaiLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sabaiGradient" x1="125" y1="2" x2="125" y2="248" gradientUnits="userSpaceOnUse">
          <stop offset=".458" stopColor="#F26A2C" />
          <stop offset=".77" stopColor="#E95A19" />
          <stop offset="1" stopColor="#E55310" />
        </linearGradient>
      </defs>
      <circle cx="125" cy="125" r="124" fill="url(#sabaiGradient)" />
      <path fill="#fff" d="M213.7 162l-9.5-31.7c-.1-.3-.2-.7-.4-1-1.6-3.2-5.5-4.6-8.8-3L165.3 141c-4.7 2.4-1.9 9.4 3.2 8l16-4.8c-.3.5-.6 1-.8 1.6C173.1 178 136.5 198 104 186.4c-10.6-3.6-20.2-10.2-28.3-18.4-2-2.1-5.3-2.2-7.5-.3-2.2 2-2.4 5.4-.4 7.6 4.4 4.8 9.2 9.2 14.6 13.1 41.2 30.2 98.7 9.9 116.4-36.9 3.5 7 6.8 13.7 6.8 13.7C208.1 169.8 215.1 167.1 213.7 162z" />
    </svg>
  );
}

// --- Main App ---
function DiagramApp() {
  const [diagram, setDiagram] = useState<DiagramState | null>(null);
  const [renderedSvg, setRenderedSvg] = useState<string>("");
  const [renderError, setRenderError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();
  const renderCounter = useRef(0);

  const isDark =
    hostContext?.theme === "dark" ||
    (!hostContext?.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const { app, error } = useApp({
    appInfo: { name: "Sabai Diagrams", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.ontoolresult = async (result: CallToolResult) => {
        const data = extractResult<DiagramState>(result);
        if (data && data.code !== undefined) {
          setDiagram(data);
        }
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

  // Initialize mermaid with correct theme
  useEffect(() => {
    initMermaid(isDark);
  }, [isDark]);

  // Render diagram when code changes
  useEffect(() => {
    if (!diagram?.code) {
      setRenderedSvg("");
      setRenderError("");
      return;
    }

    const currentRender = ++renderCounter.current;

    (async () => {
      try {
        // Re-init mermaid to pick up theme changes
        if (!mermaidInitialized) initMermaid(isDark);

        const id = `diagram-${currentRender}`;
        const { svg } = await mermaid.render(id, diagram.code);

        if (currentRender === renderCounter.current) {
          setRenderedSvg(svg);
          setRenderError("");
        }
      } catch (e) {
        if (currentRender === renderCounter.current) {
          setRenderError(e instanceof Error ? e.message : "Failed to render diagram");
          setRenderedSvg("");
        }
      }
    })();
  }, [diagram?.code, isDark]);

  const handleModeChange = useCallback(
    async (mode: "code" | "diagram" | "both") => {
      if (!app || !diagram) return;
      setDiagram((prev) => (prev ? { ...prev, mode } : null));
      try {
        await app.callServerTool({
          name: "update_display_mode",
          arguments: { mode },
        });
      } catch (e) {
        console.error("Failed to update mode:", e);
      }
    },
    [app, diagram]
  );

  const handleCopy = useCallback(async () => {
    if (!diagram?.code) return;
    try {
      await navigator.clipboard.writeText(diagram.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = diagram.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [diagram?.code]);

  if (error) {
    return (
      <div style={{ padding: 20, color: "#ef4444" }}>Error: {error.message}</div>
    );
  }

  if (!app) {
    return (
      <div style={{ padding: 20, opacity: 0.6 }}>Connecting...</div>
    );
  }

  const mode = diagram?.mode || "both";
  const showDiagram = mode === "diagram" || mode === "both";
  const showCode = mode === "code" || mode === "both";

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        paddingTop: hostContext?.safeAreaInsets?.top,
        paddingRight: hostContext?.safeAreaInsets?.right,
        paddingBottom: hostContext?.safeAreaInsets?.bottom,
        paddingLeft: hostContext?.safeAreaInsets?.left,
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: 2 }}>
          {(["diagram", "code", "both"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              style={{
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: mode === m ? 600 : 400,
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                background: mode === m
                  ? (isDark ? "#f26a2c" : "#f26a2c")
                  : (isDark ? "#1f2937" : "#f3f4f6"),
                color: mode === m
                  ? "#ffffff"
                  : (isDark ? "#9ca3af" : "#6b7280"),
                transition: "all 0.15s",
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {diagram?.title && (
            <span style={{ fontSize: 12, opacity: 0.6 }}>{diagram.title}</span>
          )}
          <button
            onClick={handleCopy}
            disabled={!diagram?.code}
            style={{
              padding: "4px 10px",
              fontSize: 12,
              border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
              borderRadius: 4,
              cursor: diagram?.code ? "pointer" : "default",
              background: "transparent",
              color: copied ? "#10b981" : (isDark ? "#9ca3af" : "#6b7280"),
              opacity: diagram?.code ? 1 : 0.4,
              transition: "all 0.15s",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {!diagram?.code ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              opacity: 0.5,
              padding: 20,
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path d="M17.5 14v7M14 17.5h7" />
            </svg>
            <div style={{ fontSize: 14, textAlign: "center" }}>
              Ask Claude to create a diagram, or use<br />
              <code style={{ fontSize: 13, color: "var(--sabai-orange)" }}>/diagram</code> to get started
            </div>
          </div>
        ) : (
          <>
            {/* Rendered diagram */}
            {showDiagram && (
              <div
                style={{
                  flex: showCode ? "none" : 1,
                  padding: 16,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  overflow: "auto",
                  minHeight: showCode ? 200 : undefined,
                }}
              >
                {renderError ? (
                  <div
                    style={{
                      padding: 16,
                      background: isDark ? "#3b1111" : "#fef2f2",
                      color: isDark ? "#fca5a5" : "#dc2626",
                      borderRadius: 8,
                      fontSize: 13,
                      whiteSpace: "pre-wrap",
                      maxWidth: "100%",
                    }}
                  >
                    Syntax error: {renderError}
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{ __html: renderedSvg }}
                    style={{ maxWidth: "100%", overflow: "auto" }}
                  />
                )}
              </div>
            )}

            {/* Divider */}
            {showDiagram && showCode && (
              <div
                style={{
                  height: 1,
                  background: isDark ? "#374151" : "#e5e7eb",
                  flexShrink: 0,
                }}
              />
            )}

            {/* Code view */}
            {showCode && (
              <div
                style={{
                  flex: showDiagram ? "none" : 1,
                  padding: 12,
                  overflow: "auto",
                  minHeight: showDiagram ? 120 : undefined,
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    padding: 12,
                    background: isDark ? "#1f2937" : "#f9fafb",
                    border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                    borderRadius: 6,
                    fontSize: 13,
                    lineHeight: 1.5,
                    fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    color: isDark ? "#e5e7eb" : "#374151",
                  }}
                >
                  {diagram.code}
                </pre>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "fixed",
          bottom: 6,
          right: 10,
          display: "flex",
          alignItems: "center",
          gap: 4,
          opacity: 0.6,
          fontSize: 11,
          color: isDark ? "#6b7280" : "#9ca3af",
        }}
      >
        <SabaiLogo />
        <span style={{ color: "var(--sabai-orange)", fontWeight: 600 }}>
          Sabai System
        </span>
      </div>
    </main>
  );
}

// --- Global error handlers ---
window.onerror = (msg, _url, _line, _col, error) => {
  console.error("Global error:", msg, error);
  return true;
};

window.onunhandledrejection = (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  event.preventDefault();
};

// --- Mount ---
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DiagramApp />
  </StrictMode>
);
