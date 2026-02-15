import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

// Import the video as a module (Vite will handle this)
import sabaiVideo from "./sabai_compressed.mp4";

const SABAI_URL = "https://sabaisystem.com";

// Google Drive video ID (you need to upload and get a shareable link)
const GDRIVE_VIDEO_ID = "1BQnJY_example_id"; // Replace with actual ID

function SabaiApp() {
  const [activeTab, setActiveTab] = useState<"youtube" | "gdrive" | "local">("local");

  const { app, error } = useApp({
    appInfo: { name: "Sabai Sabai", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.ontoolresult = async () => {};
      app.onerror = console.error;
    },
  });

  useHostStyles(app);

  const openSabai = () => {
    window.open(SABAI_URL, "_blank");
  };

  if (error) return <div style={{ color: "red", padding: 20 }}>Error: {error.message}</div>;
  if (!app) return <div style={{ padding: 20 }}>Connecting...</div>;

  const tabStyle = (isActive: boolean) => ({
    padding: "10px 20px",
    border: "none",
    background: isActive ? "#f26a2c" : "rgba(255,255,255,0.1)",
    color: "white",
    cursor: "pointer",
    borderRadius: "8px 8px 0 0",
    fontWeight: isActive ? 600 : 400,
    fontSize: "0.9rem",
  });

  return (
    <main style={{
      margin: 0,
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
      background: "linear-gradient(135deg, #013b2d 0%, #025a44 100%)",
      color: "white",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      {/* Main content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}>
        <h1 style={{
          color: "#f26a2c",
          fontSize: "2rem",
          marginBottom: "0.5rem",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
        }}>
          Sabai Sabai 🌴
        </h1>
        <p style={{ fontSize: "1rem", marginBottom: "1.5rem", opacity: 0.8 }}>
          Testing 3 video approaches
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", marginBottom: 0 }}>
          <button style={tabStyle(activeTab === "youtube")} onClick={() => setActiveTab("youtube")}>
            1. YouTube Iframe
          </button>
          <button style={tabStyle(activeTab === "gdrive")} onClick={() => setActiveTab("gdrive")}>
            2. Google Drive
          </button>
          <button style={tabStyle(activeTab === "local")} onClick={() => setActiveTab("local")}>
            3. Local Video
          </button>
        </div>

        {/* Video Container */}
        <div style={{
          width: "100%",
          maxWidth: "640px",
          aspectRatio: "16/9",
          borderRadius: "0 0 12px 12px",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          overflow: "hidden",
        }}>
          {/* YouTube Iframe */}
          {activeTab === "youtube" && (
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/3nlwg6Bku7I?si=CX9HSq5dtaKfezj1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ border: "none" }}
            />
          )}

          {/* Google Drive Embed */}
          {activeTab === "gdrive" && (
            <iframe
              src={`https://drive.google.com/file/d/${GDRIVE_VIDEO_ID}/preview`}
              width="100%"
              height="100%"
              allow="autoplay"
              style={{ border: "none" }}
            />
          )}

          {/* Local Video */}
          {activeTab === "local" && (
            <video
              src={sabaiVideo}
              controls
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Status indicator */}
        <div style={{
          marginTop: "1rem",
          padding: "10px 20px",
          background: "rgba(0,0,0,0.3)",
          borderRadius: "8px",
          fontSize: "0.85rem",
        }}>
          {activeTab === "youtube" && "Testing: YouTube iframe embed"}
          {activeTab === "gdrive" && "Testing: Google Drive iframe (needs valid ID)"}
          {activeTab === "local" && "Testing: Local video file (sabai_compressed.mp4)"}
        </div>
      </div>

      {/* Footer with Sabai System logo - bottom right */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        opacity: 0.8,
        transition: "opacity 0.2s",
      }} onClick={openSabai}>
        <span style={{ fontSize: "0.85rem" }}>Made by</span>
        <svg width="24" height="24" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
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
        <span style={{ fontSize: "0.85rem", color: "#f26a2c", fontWeight: 600 }}>Sabai System</span>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SabaiApp />
  </StrictMode>
);
