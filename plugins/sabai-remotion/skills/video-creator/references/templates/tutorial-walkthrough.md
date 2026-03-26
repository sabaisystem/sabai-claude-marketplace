# Tutorial / Walkthrough Template

Numbered step-by-step tutorial with chapter progress bar, highlight/focus overlays, screen recording frame, and synced captions with karaoke-style word highlighting.

```tsx
// Video.tsx
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// --- CONFIG -- edit these values to customize ---
const CONFIG = {
  title: "Getting Started Guide",
  steps: [
    {
      number: 1,
      title: "Create Your Project",
      description: "Open the dashboard and click New Project",
      highlight: { x: 0.22, y: 0.32, w: 0.56, h: 0.18 },
    },
    {
      number: 2,
      title: "Configure Settings",
      description: "Set your preferences in the settings panel",
      highlight: { x: 0.6, y: 0.25, w: 0.3, h: 0.35 },
    },
    {
      number: 3,
      title: "Launch and Share",
      description: "Hit the publish button and share the link",
      highlight: { x: 0.35, y: 0.55, w: 0.3, h: 0.12 },
    },
  ],
  captions: [
    { startFrame: 0, endFrame: 85, text: "Welcome to this quick start guide" },
    {
      startFrame: 90, endFrame: 205, text: "First, create your project from the dashboard",
      words: [
        { word: "First,", activeFrame: 90 },
        { word: "create", activeFrame: 109 },
        { word: "your", activeFrame: 128 },
        { word: "project", activeFrame: 147 },
        { word: "from", activeFrame: 157 },
        { word: "the", activeFrame: 167 },
        { word: "dashboard", activeFrame: 177 },
      ],
    },
    {
      startFrame: 210, endFrame: 325, text: "Next, configure your settings in the panel",
      words: [
        { word: "Next,", activeFrame: 210 },
        { word: "configure", activeFrame: 229 },
        { word: "your", activeFrame: 248 },
        { word: "settings", activeFrame: 258 },
        { word: "in", activeFrame: 277 },
        { word: "the", activeFrame: 287 },
        { word: "panel", activeFrame: 297 },
      ],
    },
    {
      startFrame: 330, endFrame: 445, text: "Finally, publish and share your link",
      words: [
        { word: "Finally,", activeFrame: 330 },
        { word: "publish", activeFrame: 353 },
        { word: "and", activeFrame: 376 },
        { word: "share", activeFrame: 399 },
        { word: "your", activeFrame: 415 },
        { word: "link", activeFrame: 430 },
      ],
    },
    { startFrame: 455, endFrame: 530, text: "You're all set — go build something great!" },
  ],
  accentColor: "#f26a2c",
  bgGradient: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
  screenBg: "#1e1e2e",
};

// --- Timing constants ---
const INTRO_START = 0;
const INTRO_DURATION = 90;
const STEP_DURATION = 120;
const OUTRO_DURATION = 90;
const STEP_START = (i: number) => INTRO_DURATION + i * STEP_DURATION;
const TOTAL_FRAMES =
  INTRO_DURATION + CONFIG.steps.length * STEP_DURATION + OUTRO_DURATION;

// --- ChapterProgress: segmented progress bar at the top ---
const ChapterProgress: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const safeMargin = Math.min(width, height) * 0.1;
  const barHeight = height * 0.005;
  const gap = width * 0.003;
  const totalSegments = CONFIG.steps.length + 2; // intro + steps + outro
  const barWidth = width - safeMargin * 2;

  const segments = [
    { start: INTRO_START, duration: INTRO_DURATION },
    ...CONFIG.steps.map((_, i) => ({ start: STEP_START(i), duration: STEP_DURATION })),
    { start: STEP_START(CONFIG.steps.length), duration: OUTRO_DURATION },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: safeMargin * 0.5,
        left: safeMargin,
        display: "flex",
        gap,
        zIndex: 50,
      }}
    >
      {segments.map((seg, i) => {
        const segWidth =
          (seg.duration / TOTAL_FRAMES) * (barWidth - gap * (totalSegments - 1));
        const progress = interpolate(
          frame,
          [seg.start, seg.start + seg.duration],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              width: segWidth,
              height: barHeight,
              borderRadius: barHeight / 2,
              backgroundColor: "rgba(255,255,255,0.12)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                backgroundColor:
                  frame >= seg.start ? CONFIG.accentColor : "rgba(255,255,255,0.3)",
                borderRadius: barHeight / 2,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// --- ScreenFrame: browser-like window frame ---
const ScreenFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  const safeMargin = Math.min(width, height) * 0.1;
  const frameW = width - safeMargin * 2;
  const frameH = height * 0.55;
  const titleBarH = height * 0.03;
  const dotSize = titleBarH * 0.3;
  const borderRadius = Math.min(width, height) * 0.012;

  return (
    <div
      style={{
        position: "absolute",
        left: safeMargin,
        top: safeMargin * 1.5,
        width: frameW,
        height: frameH,
        borderRadius,
        overflow: "hidden",
        border: `${Math.min(width, height) * 0.002}px solid rgba(255,255,255,0.08)`,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: titleBarH,
          backgroundColor: "rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          paddingLeft: width * 0.01,
          gap: dotSize * 0.8,
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <div
            key={i}
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              backgroundColor: c,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
      {/* Content area */}
      <div
        style={{
          height: frameH - titleBarH,
          backgroundColor: CONFIG.screenBg,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// --- HighlightOverlay: spotlight cutout over the screen frame ---
const HighlightOverlay: React.FC<{
  highlight: { x: number; y: number; w: number; h: number };
  opacity: number;
}> = ({ highlight, opacity }) => {
  const { width, height } = useVideoConfig();
  const safeMargin = Math.min(width, height) * 0.1;
  const frameW = width - safeMargin * 2;
  const frameH = height * 0.55;
  const titleBarH = height * 0.03;

  // Convert relative coords to absolute within the screen frame content area
  const absX = safeMargin + highlight.x * frameW;
  const absY = safeMargin * 1.5 + titleBarH + highlight.y * (frameH - titleBarH);
  const absW = highlight.w * frameW;
  const absH = highlight.h * (frameH - titleBarH);
  const borderRadius = Math.min(width, height) * 0.008;
  const borderWidth = Math.min(width, height) * 0.003;

  return (
    <div
      style={{
        position: "absolute",
        left: absX,
        top: absY,
        width: absW,
        height: absH,
        borderRadius,
        boxShadow: `0 0 0 ${Math.max(width, height)}px rgba(0,0,0,${0.55 * opacity})`,
        border: `${borderWidth}px solid rgba(242, 106, 44, ${0.85 * opacity})`,
        zIndex: 40,
      }}
    />
  );
};

// --- StepIndicator: numbered badge + title + description ---
const StepIndicator: React.FC<{
  step: { number: number; title: string; description: string };
}> = ({ step }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const safeMargin = minDim * 0.1;

  const badgeSize = minDim * 0.045;
  const badgeScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200, overshootClamping: true },
  });
  const titleOpacity = interpolate(frame, [8, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [8, 22], [minDim * 0.02, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descOpacity = interpolate(frame, [16, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descY = interpolate(frame, [16, 30], [minDim * 0.015, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: safeMargin,
        bottom: safeMargin * 1.8,
        display: "flex",
        alignItems: "flex-start",
        gap: width * 0.015,
        zIndex: 30,
      }}
    >
      {/* Number badge */}
      <div
        style={{
          width: badgeSize,
          height: badgeSize,
          borderRadius: "50%",
          backgroundColor: CONFIG.accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${badgeScale})`,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: badgeSize * 0.5,
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {step.number}
        </span>
      </div>
      {/* Text */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: height * 0.006 }}>
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontSize: width * 0.028,
            fontWeight: "bold",
            color: "white",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {step.title}
        </div>
        <div
          style={{
            opacity: descOpacity,
            transform: `translateY(${descY}px)`,
            fontSize: width * 0.018,
            color: "rgba(255,255,255,0.65)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {step.description}
        </div>
      </div>
    </div>
  );
};

// --- CaptionOverlay: timed captions with karaoke word highlighting ---
const CaptionOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const safeMargin = Math.min(width, height) * 0.1;
  const fadeFrames = 8;

  const seg = CONFIG.captions.find(
    (s) => frame >= s.startFrame && frame <= s.endFrame
  );
  if (!seg) return null;

  const fadeIn = interpolate(
    frame,
    [seg.startFrame, seg.startFrame + fadeFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeOut = interpolate(
    frame,
    [seg.endFrame - fadeFrames, seg.endFrame],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  let activeIdx = -1;
  if (seg.words) {
    for (let i = seg.words.length - 1; i >= 0; i--) {
      if (frame >= seg.words[i].activeFrame) {
        activeIdx = i;
        break;
      }
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        bottom: safeMargin * 0.4,
        left: safeMargin,
        right: safeMargin,
        display: "flex",
        justifyContent: "center",
        opacity,
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.75)",
          padding: `${height * 0.012}px ${width * 0.025}px`,
          borderRadius: Math.min(width, height) * 0.012,
          maxWidth: width * 0.8,
          textAlign: "center" as const,
        }}
      >
        {seg.words ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap" as const,
              justifyContent: "center",
              gap: width * 0.006,
            }}
          >
            {seg.words.map((w, i) => (
              <span
                key={i}
                style={{
                  fontSize: width * 0.022,
                  fontFamily: "Arial, sans-serif",
                  fontWeight: i === activeIdx ? "bold" : "normal",
                  color: i === activeIdx ? CONFIG.accentColor : "white",
                  transform: i === activeIdx ? "scale(1.05)" : "scale(1)",
                }}
              >
                {w.word}
              </span>
            ))}
          </div>
        ) : (
          <span
            style={{
              fontSize: width * 0.022,
              fontFamily: "Arial, sans-serif",
              color: "white",
            }}
          >
            {seg.text}
          </span>
        )}
      </div>
    </div>
  );
};

// --- IntroScene ---
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const minDim = Math.min(width, height);

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 14, overshootClamping: true },
  });
  const subtitleOpacity = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [20, 38], [minDim * 0.02, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          gap: height * 0.02,
        }}
      >
        <div
          style={{
            transform: `scale(${titleScale})`,
            fontSize: width * 0.04,
            fontWeight: "bold",
            color: "white",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {CONFIG.title}
        </div>
        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontSize: width * 0.02,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {CONFIG.steps.length} steps to get started
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- StepScene: screen frame + highlight + step indicator ---
const StepScene: React.FC<{
  step: { number: number; title: string; description: string; highlight: { x: number; y: number; w: number; h: number } };
}> = ({ step }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const minDim = Math.min(width, height);

  const highlightDelay = 15;
  const highlightOpacity = interpolate(
    frame,
    [highlightDelay, highlightDelay + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Simulated screen content: placeholder UI elements
  const barH = height * 0.04;
  const sidebarW = (width - minDim * 0.2) * 0.2;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <ScreenFrame>
        {/* Simulated UI: sidebar + content area */}
        <div style={{ display: "flex", height: "100%" }}>
          {/* Sidebar */}
          <div
            style={{
              width: sidebarW,
              backgroundColor: "rgba(255,255,255,0.03)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              padding: height * 0.015,
              display: "flex",
              flexDirection: "column" as const,
              gap: height * 0.012,
            }}
          >
            {["Dashboard", "Projects", "Settings", "Help"].map((label, i) => (
              <div
                key={i}
                style={{
                  fontSize: width * 0.011,
                  color: i === step.number - 1 ? CONFIG.accentColor : "rgba(255,255,255,0.4)",
                  fontFamily: "Arial, sans-serif",
                  padding: `${height * 0.006}px ${width * 0.005}px`,
                  borderRadius: Math.min(width, height) * 0.004,
                  backgroundColor:
                    i === step.number - 1 ? "rgba(242,106,44,0.1)" : "transparent",
                }}
              >
                {label}
              </div>
            ))}
          </div>
          {/* Main content area */}
          <div
            style={{
              flex: 1,
              padding: height * 0.02,
              display: "flex",
              flexDirection: "column" as const,
              gap: height * 0.015,
            }}
          >
            {/* Top bar */}
            <div
              style={{
                height: barH,
                backgroundColor: "rgba(255,255,255,0.04)",
                borderRadius: Math.min(width, height) * 0.005,
                display: "flex",
                alignItems: "center",
                padding: `0 ${width * 0.01}px`,
              }}
            >
              <div
                style={{
                  fontSize: width * 0.013,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Search...
              </div>
            </div>
            {/* Content placeholders */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap" as const,
                gap: height * 0.012,
                flex: 1,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: `calc(50% - ${height * 0.006}px)`,
                    height: height * 0.08,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: Math.min(width, height) * 0.006,
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                />
              ))}
            </div>
            {/* Action button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  backgroundColor: CONFIG.accentColor,
                  padding: `${height * 0.008}px ${width * 0.015}px`,
                  borderRadius: Math.min(width, height) * 0.005,
                  fontSize: width * 0.012,
                  color: "white",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                }}
              >
                {step.number === 1 ? "+ New Project" : step.number === 2 ? "Save Settings" : "Publish"}
              </div>
            </div>
          </div>
        </div>
      </ScreenFrame>

      {/* Highlight overlay */}
      <HighlightOverlay highlight={step.highlight} opacity={highlightOpacity} />

      {/* Step indicator */}
      <StepIndicator step={step} />
    </AbsoluteFill>
  );
};

// --- OutroScene: completion summary ---
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const safeMargin = minDim * 0.1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column" as const,
          alignItems: "center",
          gap: height * 0.035,
        }}
      >
        {/* Completed steps */}
        <div
          style={{
            display: "flex",
            gap: width * 0.025,
          }}
        >
          {CONFIG.steps.map((step, i) => {
            const delay = i * 8;
            const scale = spring({
              frame: Math.max(0, frame - delay),
              fps,
              config: { damping: 14, overshootClamping: true },
            });
            const badgeSize = minDim * 0.05;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  alignItems: "center",
                  gap: height * 0.01,
                  transform: `scale(${scale})`,
                }}
              >
                <div
                  style={{
                    width: badgeSize,
                    height: badgeSize,
                    borderRadius: "50%",
                    backgroundColor: CONFIG.accentColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      fontSize: badgeSize * 0.45,
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    &#10003;
                  </span>
                </div>
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: width * 0.012,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Step {step.number}
                </span>
              </div>
            );
          })}
        </div>
        {/* CTA */}
        <div
          style={{
            opacity: interpolate(frame, [25, 40], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontSize: width * 0.03,
            fontWeight: "bold",
            color: "white",
            fontFamily: "Arial, sans-serif",
          }}
        >
          You're ready to go!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Main Video Component ---
export const Video: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: CONFIG.bgGradient,
        overflow: "hidden",
      }}
    >
      {/* Chapter progress bar (reads absolute frame) */}
      <ChapterProgress />

      {/* Scenes */}
      <Sequence from={INTRO_START} durationInFrames={INTRO_DURATION}>
        <IntroScene />
      </Sequence>

      {CONFIG.steps.map((step, i) => (
        <Sequence key={i} from={STEP_START(i)} durationInFrames={STEP_DURATION}>
          <StepScene step={step} />
        </Sequence>
      ))}

      <Sequence
        from={STEP_START(CONFIG.steps.length)}
        durationInFrames={OUTRO_DURATION}
      >
        <OutroScene />
      </Sequence>

      {/* Caption overlay (reads absolute frame, outside all Sequences) */}
      <CaptionOverlay />
    </AbsoluteFill>
  );
};
```

**Root.tsx for tutorial walkthrough:**
```tsx
import { Composition } from "remotion";
import { Video } from "./Video";

export const Root: React.FC = () => {
  return (
    <Composition
      id="main"
      component={Video}
      durationInFrames={540}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

**Timeline (18 seconds at 30fps = 540 frames):**
- 0-2.9s (0-89f): Intro — title scale-in, subtitle fade, chapter bar starts
- 3.0-6.9s (90-209f): Step 1 — screen frame, highlight overlay, step badge, synced captions with word highlighting
- 7.0-10.9s (210-329f): Step 2 — same structure, different highlight area
- 11.0-14.9s (330-449f): Step 3 — same structure, different highlight area
- 15.0-17.9s (450-539f): Outro — completed checkmarks, CTA text

**Customization:**
- `CONFIG.title` — tutorial title shown in the intro scene
- `CONFIG.steps` — array of steps with number, title, description, and highlight region (relative 0-1 coords within the screen frame)
- `CONFIG.captions` — array of timed caption segments; add `words` array for karaoke-style word highlighting
- `CONFIG.accentColor` — accent color for badges, highlights, active sidebar items (default: Sabai orange `#f26a2c`)
- `CONFIG.bgGradient` — background gradient behind all scenes
- `CONFIG.screenBg` — background color inside the simulated screen frame
- Add or remove steps by editing the `steps` and `captions` arrays — the template auto-calculates total duration
- Adjust `STEP_DURATION` for longer/shorter per-step timing
- For karaoke word timing, distribute evenly: `activeFrame = startFrame + (wordIndex / totalWords) * (endFrame - startFrame)`

**Components included:**
- **ChapterProgress** — segmented progress bar showing current chapter
- **ScreenFrame** — browser-like window with traffic light dots and dark content area
- **HighlightOverlay** — spotlight cutout with accent-colored border, darkens the rest of the screen
- **StepIndicator** — numbered circle badge with spring animation + title/description text
- **CaptionOverlay** — timed captions with fade transitions and optional karaoke word highlighting

**Usage:** 540 frames at 30fps = 18 seconds (3 steps). Great for product walkthroughs, onboarding tutorials, how-to guides, feature tours, and getting-started videos. Scale up by adding more steps — each step adds 4 seconds.
