/**
 * Mermaid MCP App - Interactive Mermaid diagram viewer in Claude
 */
import type { McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import styles from "./mcp-app.module.css";

// Sabai System Logo Icon
function SabaiLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
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

// Diagram icon
function DiagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="9" y="15" width="6" height="6" rx="1" />
      <path d="M6 9v3a3 3 0 003 3h6a3 3 0 003-3V9" />
      <path d="M12 15v-3" />
    </svg>
  );
}

interface DiagramState {
  diagram_id: string;
  code: string;
  title?: string;
  can_undo: boolean;
  error?: string;
  message?: string;
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

// Example diagram templates
const DIAGRAM_TEMPLATES: Record<string, string> = {
  flowchart: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,
  sequence: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob!
    B-->>A: Hi Alice!
    A->>B: How are you?
    B-->>A: Great, thanks!`,
  class: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Success: Complete
    Processing --> Error: Fail
    Success --> [*]
    Error --> Idle: Retry`,
  er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER {
        string name
        string email
    }
    ORDER {
        int orderNumber
        date created
    }
    LINE-ITEM {
        string product
        int quantity
    }`,
  pie: `pie title Project Time Distribution
    "Development" : 45
    "Testing" : 25
    "Documentation" : 15
    "Meetings" : 15`,
};

function MermaidApp() {
  const [diagramState, setDiagramState] = useState<DiagramState | null>(null);
  const [localCode, setLocalCode] = useState("");
  const [renderError, setRenderError] = useState<string | null>(null);
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();
  const [copied, setCopied] = useState(false);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);

  // Load Mermaid.js from CDN
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    script.async = true;
    script.onload = () => {
      // @ts-expect-error - mermaid is loaded globally
      window.mermaid.initialize({
        startOnLoad: false,
        theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "default",
        securityLevel: "loose",
      });
      setMermaidLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Re-initialize mermaid when color scheme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (mermaidLoaded) {
        // @ts-expect-error - mermaid is loaded globally
        window.mermaid.initialize({
          startOnLoad: false,
          theme: e.matches ? "dark" : "default",
          securityLevel: "loose",
        });
        // Re-render current diagram
        if (diagramState?.code) {
          renderDiagram(diagramState.code);
        }
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [mermaidLoaded, diagramState?.code]);

  // Render diagram function
  const renderDiagram = useCallback(async (code: string) => {
    if (!mermaidLoaded || !diagramRef.current) return;

    try {
      setRenderError(null);
      // @ts-expect-error - mermaid is loaded globally
      const { svg } = await window.mermaid.render("mermaid-diagram", code);
      if (diagramRef.current) {
        diagramRef.current.innerHTML = svg;
      }
    } catch (error) {
      console.error("Mermaid render error:", error);
      setRenderError(error instanceof Error ? error.message : "Failed to render diagram");
    }
  }, [mermaidLoaded]);

  // Render diagram when state changes
  useEffect(() => {
    if (diagramState?.code && mermaidLoaded) {
      renderDiagram(diagramState.code);
      setLocalCode(diagramState.code);
    }
  }, [diagramState?.code, mermaidLoaded, renderDiagram]);

  const { app, error } = useApp({
    appInfo: { name: "Sabai Mermaid", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.onteardown = async () => ({});

      app.ontoolinput = async (input) => {
        console.info("Tool input:", input);
      };

      app.ontoolresult = async (result) => {
        console.info("Tool result:", result);
        const data = extractResult<DiagramState>(result);
        if (data && data.diagram_id && data.code) {
          setDiagramState(data);
        } else if (data && data.error) {
          setRenderError(data.error);
        } else if (data && data.message) {
          // Handle messages like "Ready for new diagram"
          if (data.message.includes("new diagram")) {
            setDiagramState(null);
            setLocalCode("");
            setRenderError(null);
            if (diagramRef.current) {
              diagramRef.current.innerHTML = "";
            }
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

  // Handle undo
  const handleUndo = useCallback(async () => {
    if (!app || !diagramState?.can_undo) return;

    try {
      const result = await app.callServerTool({
        name: "undo_diagram",
        arguments: {},
      });

      const data = extractResult<DiagramState>(result);
      if (data) {
        setDiagramState(data);
      }
    } catch (e) {
      console.error("Undo failed:", e);
    }
  }, [app, diagramState?.can_undo]);

  // Handle new diagram
  const handleNewDiagram = useCallback(async () => {
    if (!app) return;

    try {
      await app.callServerTool({
        name: "new_diagram",
        arguments: {},
      });

      setDiagramState(null);
      setLocalCode("");
      setRenderError(null);
      if (diagramRef.current) {
        diagramRef.current.innerHTML = "";
      }
    } catch (e) {
      console.error("New diagram failed:", e);
    }
  }, [app]);

  // Handle update from local code editing
  const handleUpdateDiagram = useCallback(async () => {
    if (!app || !localCode.trim()) return;

    try {
      const result = await app.callServerTool({
        name: diagramState ? "update_diagram" : "render_mermaid",
        arguments: { code: localCode },
      });

      const data = extractResult<DiagramState>(result);
      if (data && data.error) {
        setRenderError(data.error);
      } else if (data) {
        setDiagramState(data);
      }
    } catch (e) {
      console.error("Update failed:", e);
    }
  }, [app, localCode, diagramState]);

  // Handle template selection
  const handleTemplateSelect = useCallback((templateCode: string) => {
    setLocalCode(templateCode);
    if (mermaidLoaded) {
      renderDiagram(templateCode);
    }
  }, [mermaidLoaded, renderDiagram]);

  // Copy code to clipboard
  const handleCopy = useCallback(async () => {
    const code = diagramState?.code || localCode;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  }, [diagramState?.code, localCode]);

  // Ask Claude to help
  const handleAskClaude = useCallback(async () => {
    if (!app) return;

    await app.sendMessage({
      role: "user",
      content: [{
        type: "text",
        text: "Help me create or modify a Mermaid diagram. What kind of diagram would you like to make? (flowchart, sequence, class, state, ER, etc.)",
      }],
    });
  }, [app]);

  if (error) return <div className={styles.error}>Error: {error.message}</div>;
  if (!app) return <div className={styles.loading}>Connecting...</div>;

  return (
    <main
      className={styles.main}
      style={{
        paddingTop: hostContext?.safeAreaInsets?.top,
        paddingRight: hostContext?.safeAreaInsets?.right,
        paddingBottom: hostContext?.safeAreaInsets?.bottom,
        paddingLeft: hostContext?.safeAreaInsets?.left,
      }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Sabai Mermaid</h1>
        {diagramState?.title && (
          <p className={styles.diagramTitle}>{diagramState.title}</p>
        )}
      </div>

      <div className={styles.content}>
        {/* Diagram Panel */}
        <div className={styles.diagramPanel}>
          {!diagramState && !localCode ? (
            <div className={styles.emptyState}>
              <DiagramIcon className={styles.emptyIcon} />
              <p className={styles.emptyText}>No diagram yet</p>
              <p className={styles.emptyHint}>
                Ask Claude to create a diagram, or select a template below to get started.
              </p>
              <div className={styles.typeSelector}>
                {Object.keys(DIAGRAM_TEMPLATES).map((type) => (
                  <button
                    key={type}
                    className={styles.typeButton}
                    onClick={() => handleTemplateSelect(DIAGRAM_TEMPLATES[type])}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <button className={`${styles.actionButton} ${styles.primaryButton}`} onClick={handleAskClaude}>
                Ask Claude to Create
              </button>
            </div>
          ) : renderError ? (
            <div className={styles.errorState}>
              <strong>Render Error:</strong> {renderError}
            </div>
          ) : (
            <div ref={diagramRef} className={styles.diagramContainer} />
          )}
        </div>

        {/* Code Panel */}
        <div className={styles.codePanel}>
          <div className={styles.codePanelHeader}>
            <h2 className={styles.codePanelTitle}>Mermaid Code</h2>
            <button
              className={`${styles.actionButton} ${styles.copyButton} ${copied ? styles.copySuccess : ""}`}
              onClick={handleCopy}
              disabled={!localCode}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <textarea
            className={styles.codeArea}
            value={localCode}
            onChange={(e) => setLocalCode(e.target.value)}
            placeholder="Enter Mermaid diagram code here..."
            spellCheck={false}
          />

          <div className={styles.actions}>
            <button
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={handleUpdateDiagram}
              disabled={!localCode.trim()}
            >
              {diagramState ? "Update" : "Render"}
            </button>
            {diagramState?.can_undo && (
              <button className={`${styles.actionButton} ${styles.undoButton}`} onClick={handleUndo}>
                Undo
              </button>
            )}
            {diagramState && (
              <button className={styles.actionButton} onClick={handleNewDiagram}>
                New
              </button>
            )}
          </div>

          {!diagramState && (
            <div className={styles.typeSelector}>
              {Object.keys(DIAGRAM_TEMPLATES).map((type) => (
                <button
                  key={type}
                  className={styles.typeButton}
                  onClick={() => handleTemplateSelect(DIAGRAM_TEMPLATES[type])}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className={styles.footer}>
        <a href="https://sabaisystem.com" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
          <SabaiLogo className={styles.footerLogo} />
          <span>Sabai System</span>
        </a>
      </footer>
    </main>
  );
}

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
    <MermaidApp />
  </StrictMode>,
);
