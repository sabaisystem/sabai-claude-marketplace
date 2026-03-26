import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const SABAI_URL = "https://sabaisystem.com";

// Target dimensions for the video player
const APP_WIDTH = 720;
const APP_HEIGHT = 480;

interface RecordingData {
  bot_id: string;
  bot_name?: string;
  meeting_url?: string;
  video_url?: string;
  audio_url?: string;
  transcript_url?: string;
  started_at?: string;
  completed_at?: string;
  error?: string;
}

function RecallApp() {
  const [recording, setRecording] = useState<RecordingData | null>(null);
  const [loading, setLoading] = useState(true);

  const { app, error } = useApp({
    appInfo: { name: "Recall Recording", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.ontoolresult = async (result) => {
        setLoading(false);
        try {
          // Parse the tool result to get recording data
          const content = result.content;
          if (content && content.length > 0) {
            for (const item of content) {
              if (item.type === "text") {
                try {
                  const data = JSON.parse(item.text);
                  if (data.video_url || data.media_urls?.video) {
                    setRecording({
                      bot_id: data.bot_id,
                      bot_name: data.bot_name,
                      meeting_url: data.meeting_url,
                      video_url: data.video_url || data.media_urls?.video,
                      audio_url: data.audio_url || data.media_urls?.audio,
                      transcript_url: data.transcript_url || data.media_urls?.transcript,
                      started_at: data.started_at || data.recording_started_at,
                      completed_at: data.completed_at || data.recording_completed_at,
                    });
                    return;
                  }
                  if (data.error || data.message) {
                    setRecording({
                      bot_id: data.bot_id || "unknown",
                      error: data.error || data.message,
                    });
                    return;
                  }
                } catch {
                  // Not JSON, skip
                }
              }
            }
          }
        } catch (e) {
          console.error("Error parsing tool result:", e);
        }
      };
      app.onerror = console.error;
    },
  });

  useHostStyles(app);

  // Request the size we need from the host
  useEffect(() => {
    if (app) {
      app.sendSizeChanged({ width: APP_WIDTH, height: APP_HEIGHT });
    }
  }, [app]);

  if (error || !app) return null;

  return (
    <main style={{
      margin: 0,
      padding: "12px",
      background: "transparent",
      fontFamily: "system-ui, -apple-system, sans-serif",
      width: APP_WIDTH,
      height: APP_HEIGHT,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {loading ? (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>Loading recording...</div>
            <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>Fetching video from Recall.ai</div>
          </div>
        </div>
      ) : recording?.error ? (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#e55310",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.25rem", marginBottom: "8px" }}>Recording Not Available</div>
            <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>{recording.error}</div>
          </div>
        </div>
      ) : recording?.video_url ? (
        <>
          {/* Video player */}
          <div style={{
            flex: 1,
            minHeight: 0,
            borderRadius: "8px",
            overflow: "hidden",
            background: "#000",
          }}>
            <video
              src={recording.video_url}
              controls
              autoPlay={false}
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Meeting info */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "8px",
            flexShrink: 0,
            fontSize: "0.75rem",
            opacity: 0.7,
          }}>
            <div>
              {recording.bot_name && <span style={{ marginRight: "12px" }}>{recording.bot_name}</span>}
              {recording.started_at && (
                <span>Recorded: {new Date(recording.started_at).toLocaleString()}</span>
              )}
            </div>
            <a
              href={SABAI_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
                opacity: 0.7,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
              onMouseLeave={(e) => e.currentTarget.style.opacity = "0.7"}
            >
              <svg width="16" height="16" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
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
              <span style={{ color: "#f26a2c", fontWeight: 600 }}>Sabai System</span>
            </a>
          </div>
        </>
      ) : (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.25rem", marginBottom: "8px" }}>No Recording Available</div>
            <div style={{ fontSize: "0.875rem", opacity: 0.7 }}>The recording may still be processing</div>
          </div>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecallApp />
  </StrictMode>
);
