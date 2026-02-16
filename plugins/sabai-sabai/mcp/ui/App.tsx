import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

import sabaiVideo from "./sabai.mp4";

const SABAI_URL = "https://sabaisystem.com";

// Target dimensions for the video player
const APP_WIDTH = 640;
const APP_HEIGHT = 420; // 16:9 ratio + space for attribution

function SabaiApp() {
  const { app, error } = useApp({
    appInfo: { name: "Sabai Sabai", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.ontoolresult = async () => {};
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
      {/* Video - full width */}
      <div style={{
        flex: 1,
        minHeight: 0,
        borderRadius: "8px",
        overflow: "hidden",
        background: "#000",
      }}>
        <video
          src={sabaiVideo}
          controls
          autoPlay
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Attribution - bottom right */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingTop: "8px",
        flexShrink: 0,
      }}>
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
          <svg width="20" height="20" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
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
          <span style={{ fontSize: "0.75rem", color: "#f26a2c", fontWeight: 600 }}>Sabai System</span>
        </a>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SabaiApp />
  </StrictMode>
);
