/**
 * Email Editor MCP App - Compose emails in Claude
 */
import type { McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
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

// ============ TYPES ============

interface DraftData {
  draft_id: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  signature: string;
  is_reply: boolean;
  reply_to_thread_id?: string;
  reply_to_message_id?: string;
}

// ============ HELPERS ============

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

// ============ EMAIL CHIPS COMPONENT ============

interface EmailChipsProps {
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder: string;
  disabled?: boolean;
}

function EmailChips({ emails, onChange, placeholder, disabled }: EmailChipsProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed && !emails.includes(trimmed) && trimmed.includes("@")) {
      onChange([...emails, trimmed]);
    }
    setInputValue("");
  };

  const removeEmail = (index: number) => {
    onChange(emails.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      if (inputValue.trim()) {
        addEmail(inputValue);
      }
    } else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
      removeEmail(emails.length - 1);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmail(inputValue);
    }
  };

  return (
    <div
      className={styles.emailChips}
      onClick={() => inputRef.current?.focus()}
    >
      {emails.map((email, index) => (
        <span key={index} className={styles.chip}>
          {email}
          {!disabled && (
            <button
              type="button"
              className={styles.chipRemove}
              onClick={(e) => {
                e.stopPropagation();
                removeEmail(index);
              }}
            >
              ×
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        type="email"
        className={styles.chipInput}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={emails.length === 0 ? placeholder : ""}
        disabled={disabled}
      />
    </div>
  );
}

// ============ MAIN APP COMPONENT ============

function EmailEditorApp() {
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { app, error } = useApp({
    appInfo: { name: "Sabai Gmail Editor", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.onteardown = async () => ({});

      app.ontoolinput = async (input) => {
        console.info("Tool input:", input);
      };

      app.ontoolresult = async (result) => {
        console.info("Tool result:", result);
        const data = extractResult<DraftData>(result);
        if (data && data.draft_id) {
          setDraft(data);
          // Show CC/BCC if they have values
          if ((data.cc?.length || 0) > 0 || (data.bcc?.length || 0) > 0) {
            setShowCcBcc(true);
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

  // Debounced update to server
  const updateDraft = useCallback((updates: Partial<DraftData>) => {
    if (!app || !draft) return;

    // Update local state immediately
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });

    // Debounce server update
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        await app.callServerTool({
          name: "update_draft",
          arguments: {
            draft_id: draft.draft_id,
            ...updates,
          },
        });
      } catch (e) {
        console.error("Failed to update draft:", e);
      }
    }, 500);
  }, [app, draft]);

  // Send email
  const handleSend = useCallback(async () => {
    if (!app || !draft) return;

    // Validate
    if (draft.to.length === 0) {
      setStatus({ type: "error", message: "Please add at least one recipient" });
      return;
    }
    if (!draft.subject.trim()) {
      setStatus({ type: "error", message: "Please add a subject" });
      return;
    }

    setSending(true);
    setStatus(null);

    try {
      await app.callServerTool({
        name: "send_email",
        arguments: { draft_id: draft.draft_id },
      });
      setStatus({ type: "success", message: "Email ready to send! Claude will complete the send." });
    } catch (e) {
      setStatus({ type: "error", message: `Failed to send: ${e}` });
    } finally {
      setSending(false);
    }
  }, [app, draft]);

  // Save draft
  const handleSaveDraft = useCallback(async () => {
    if (!app || !draft) return;

    try {
      await app.callServerTool({
        name: "save_draft",
        arguments: { draft_id: draft.draft_id },
      });
      setStatus({ type: "success", message: "Draft saved" });
    } catch (e) {
      setStatus({ type: "error", message: `Failed to save: ${e}` });
    }
  }, [app, draft]);

  // Discard draft
  const handleDiscard = useCallback(async () => {
    if (!app || !draft) return;

    try {
      await app.callServerTool({
        name: "discard_draft",
        arguments: { draft_id: draft.draft_id },
      });
      setStatus({ type: "success", message: "Draft discarded" });
    } catch (e) {
      setStatus({ type: "error", message: `Failed to discard: ${e}` });
    }
  }, [app, draft]);

  if (error) {
    return (
      <main className={styles.main}>
        <div className={styles.error}>Error: {error.message}</div>
      </main>
    );
  }

  if (!app) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>Connecting...</div>
      </main>
    );
  }

  if (!draft) {
    return (
      <main className={styles.main}>
        <div className={styles.loading}>Loading email editor...</div>
      </main>
    );
  }

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
      <header className={styles.header}>
        <h1 className={styles.title}>
          {draft.is_reply ? "Reply" : "Compose Email"}
        </h1>
        {!showCcBcc && (
          <button
            type="button"
            className={styles.toggleLink}
            onClick={() => setShowCcBcc(true)}
          >
            Add Cc/Bcc
          </button>
        )}
      </header>

      {draft.is_reply && (
        <div className={styles.replyIndicator}>
          <span className={styles.replyIcon}>↩</span>
          Replying to thread
        </div>
      )}

      <form className={styles.emailForm} onSubmit={(e) => e.preventDefault()}>
        {/* To field */}
        <div className={styles.fieldGroup}>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>To</label>
            <EmailChips
              emails={draft.to}
              onChange={(to) => updateDraft({ to })}
              placeholder="Add recipients..."
              disabled={sending}
            />
          </div>
        </div>

        {/* CC field */}
        {showCcBcc && (
          <div className={styles.fieldGroup}>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Cc</label>
              <EmailChips
                emails={draft.cc}
                onChange={(cc) => updateDraft({ cc })}
                placeholder="Add Cc recipients..."
                disabled={sending}
              />
            </div>
          </div>
        )}

        {/* BCC field */}
        {showCcBcc && (
          <div className={styles.fieldGroup}>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Bcc</label>
              <EmailChips
                emails={draft.bcc}
                onChange={(bcc) => updateDraft({ bcc })}
                placeholder="Add Bcc recipients..."
                disabled={sending}
              />
            </div>
          </div>
        )}

        {/* Subject field */}
        <div className={styles.fieldGroup}>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>Subject</label>
            <input
              type="text"
              className={`${styles.input} ${styles.subjectInput}`}
              value={draft.subject}
              onChange={(e) => updateDraft({ subject: e.target.value })}
              placeholder="Enter subject..."
              disabled={sending}
            />
          </div>
        </div>

        {/* Body */}
        <textarea
          className={styles.bodyTextarea}
          value={draft.body}
          onChange={(e) => updateDraft({ body: e.target.value })}
          placeholder="Write your email..."
          disabled={sending}
        />

        {/* Signature */}
        {draft.signature && (
          <div className={styles.signatureSection}>
            <div className={styles.signatureLabel}>Signature</div>
            <div className={styles.signatureText}>{draft.signature}</div>
          </div>
        )}

        {/* Status message */}
        {status && (
          <div
            className={`${styles.statusMessage} ${
              status.type === "success" ? styles.statusSuccess : styles.statusError
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.dangerButton}`}
            onClick={handleDiscard}
            disabled={sending}
          >
            Discard
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={handleSaveDraft}
            disabled={sending}
          >
            Save Draft
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>

      <footer className={styles.footer}>
        <a
          href="https://sabaisystem.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          <SabaiLogo className={styles.footerLogo} />
          <span>Sabai System</span>
        </a>
      </footer>
    </main>
  );
}

// Global error handler to prevent crashes
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
    <EmailEditorApp />
  </StrictMode>,
);
