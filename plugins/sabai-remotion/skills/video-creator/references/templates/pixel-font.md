# 3D Retro Pixel Font Template

Pixel-building animation where colored cursors fly in and collaboratively "build" text made of 3D pixel blocks. Includes a typewriter subtitle reveal.

```tsx
// Video.tsx
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// --- Color Scheme Presets ---
const COLOR_SCHEMES: Record<
  string,
  { block: string; bg: string; subtitle: string; cursors: string[] }
> = {
  classic: {
    block: "#ffffff",
    bg: "#000000",
    subtitle: "#ffffff",
    cursors: ["#8b5cf6", "#3b82f6", "#ec4899", "#6366f1"],
  },
  retro: {
    block: "#e63b2e",
    bg: "#000000",
    subtitle: "#ffffff",
    cursors: ["#8b5cf6", "#3b82f6", "#ec4899", "#6366f1"],
  },
  neon: {
    block: "#00ff88",
    bg: "#0a0a0a",
    subtitle: "#00ff88",
    cursors: ["#ff006e", "#00bbff", "#ffbe0b", "#8338ec"],
  },
  ocean: {
    block: "#06b6d4",
    bg: "#0c1222",
    subtitle: "#94a3b8",
    cursors: ["#3b82f6", "#6366f1", "#8b5cf6", "#06b6d4"],
  },
  sunset: {
    block: "#f97316",
    bg: "#1c1017",
    subtitle: "#fbbf24",
    cursors: ["#ef4444", "#f97316", "#eab308", "#ec4899"],
  },
  sabai: {
    block: "#f26a2c",
    bg: "#013b2d",
    subtitle: "#fef2ec",
    cursors: ["#f26a2c", "#e55310", "#fef2ec", "#f26a2c"],
  },
};

// --- CONFIG -- edit these values to customize ---
const CONFIG = {
  lines: ["HELLO", "WORLD"],
  subtitle: "coming soon",
  scheme: "classic", // Pick a preset: classic, retro, neon, ocean, sunset, sabai
  // Override individual colors (takes priority over scheme):
  // blockColor: "#ff0000",
  // bgColor: "#000000",
  // subtitleColor: "#ffffff",
  // cursorColors: ["#8b5cf6", "#3b82f6", "#ec4899", "#6366f1"],
};

// --- Resolve colors from config ---
function resolveColors(cfg: typeof CONFIG) {
  const scheme = COLOR_SCHEMES[cfg.scheme] || COLOR_SCHEMES.classic;
  return {
    block: (cfg as any).blockColor || scheme.block,
    bg: (cfg as any).bgColor || scheme.bg,
    subtitle: (cfg as any).subtitleColor || scheme.subtitle,
    cursors: (cfg as any).cursorColors || scheme.cursors,
  };
}

// --- 5x7 Pixel Font Data ---
// Each character: 7 rows of 5-char binary strings (1=filled, 0=empty)
// See references/pixel-font-data.md for visual grids and extension guide
const FONT: Record<string, string[]> = {
  A: ["01110","10001","10001","11111","10001","10001","10001"],
  B: ["11110","10001","10001","11110","10001","10001","11110"],
  C: ["01110","10001","10000","10000","10000","10001","01110"],
  D: ["11110","10001","10001","10001","10001","10001","11110"],
  E: ["11111","10000","10000","11110","10000","10000","11111"],
  F: ["11111","10000","10000","11110","10000","10000","10000"],
  G: ["01110","10001","10000","10111","10001","10001","01110"],
  H: ["10001","10001","10001","11111","10001","10001","10001"],
  I: ["11111","00100","00100","00100","00100","00100","11111"],
  J: ["00111","00001","00001","00001","10001","10001","01110"],
  K: ["10001","10010","10100","11000","10100","10010","10001"],
  L: ["10000","10000","10000","10000","10000","10000","11111"],
  M: ["10001","11011","10101","10001","10001","10001","10001"],
  N: ["10001","11001","10101","10011","10001","10001","10001"],
  O: ["01110","10001","10001","10001","10001","10001","01110"],
  P: ["11110","10001","10001","11110","10000","10000","10000"],
  Q: ["01110","10001","10001","10001","10101","10010","01101"],
  R: ["11110","10001","10001","11110","10100","10010","10001"],
  S: ["01110","10001","10000","01110","00001","10001","01110"],
  T: ["11111","00100","00100","00100","00100","00100","00100"],
  U: ["10001","10001","10001","10001","10001","10001","01110"],
  V: ["10001","10001","10001","10001","01010","01010","00100"],
  W: ["10001","10001","10001","10001","10101","11011","01010"],
  X: ["10001","10001","01010","00100","01010","10001","10001"],
  Y: ["10001","10001","01010","00100","00100","00100","00100"],
  Z: ["11111","00001","00010","00100","01000","10000","11111"],
  "0": ["01110","10001","10011","10101","11001","10001","01110"],
  "1": ["00100","01100","00100","00100","00100","00100","01110"],
  "2": ["01110","10001","00001","00110","01000","10000","11111"],
  "3": ["01110","10001","00001","00110","00001","10001","01110"],
  "4": ["00010","00110","01010","10010","11111","00010","00010"],
  "5": ["11111","10000","11110","00001","00001","10001","01110"],
  "6": ["01110","10001","10000","11110","10001","10001","01110"],
  "7": ["11111","00001","00010","00100","01000","01000","01000"],
  "8": ["01110","10001","10001","01110","10001","10001","01110"],
  "9": ["01110","10001","10001","01111","00001","10001","01110"],
  " ": ["00000","00000","00000","00000","00000","00000","00000"],
  ".": ["00000","00000","00000","00000","00000","00000","00100"],
  "!": ["00100","00100","00100","00100","00100","00000","00100"],
  "?": ["01110","10001","00001","00010","00100","00000","00100"],
  "-": ["00000","00000","00000","11111","00000","00000","00000"],
  ":": ["00000","00100","00100","00000","00100","00100","00000"],
};

// --- Font Helpers ---
interface Pixel {
  x: number;
  y: number;
}

function getPixels(
  lines: string[]
): { pixels: Pixel[]; gridW: number; gridH: number } {
  const CW = 5, CH = 7, CGAP = 1, LGAP = 2;
  const lineWidths = lines.map((l) => l.length * (CW + CGAP) - CGAP);
  const gridW = Math.max(...lineWidths);
  const gridH = lines.length * (CH + LGAP) - LGAP;
  const pixels: Pixel[] = [];

  lines.forEach((line, li) => {
    const lineW = line.length * (CW + CGAP) - CGAP;
    const offsetX = Math.floor((gridW - lineW) / 2);
    const offsetY = li * (CH + LGAP);

    [...line].forEach((ch, ci) => {
      const rows = FONT[ch] || FONT[" "];
      const cx = offsetX + ci * (CW + CGAP);
      rows.forEach((row, ry) => {
        [...row].forEach((bit, rx) => {
          if (bit === "1") {
            pixels.push({ x: cx + rx, y: offsetY + ry });
          }
        });
      });
    });
  });

  return { pixels, gridW, gridH };
}

// --- PixelBlock: single 3D pixel with beveled depth ---
const PixelBlock: React.FC<{
  px: number;
  py: number;
  size: number;
  color: string;
  opacity: number;
}> = ({ px, py, size, color, opacity }) => {
  const gap = size * 0.08;
  const s = size - gap;
  const bw = Math.max(1, size * 0.08);
  return (
    <div
      style={{
        position: "absolute",
        left: px * size + gap / 2,
        top: py * size + gap / 2,
        width: s,
        height: s,
        opacity,
        backgroundColor: color,
        borderRadius: size * 0.06,
        borderTop: `${bw}px solid rgba(255,255,255,0.3)`,
        borderLeft: `${bw}px solid rgba(255,255,255,0.2)`,
        borderBottom: `${bw}px solid rgba(0,0,0,0.3)`,
        borderRight: `${bw}px solid rgba(0,0,0,0.2)`,
        boxSizing: "border-box" as const,
      }}
    />
  );
};

// --- CursorArrow: triangle pointer cursor ---
const CursorArrow: React.FC<{
  x: number;
  y: number;
  color: string;
  size: number;
  opacity: number;
}> = ({ x, y, color, size, opacity }) => {
  const s = size * 2.5;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s,
        height: s,
        opacity,
        filter: `drop-shadow(0 ${size * 0.2}px ${size * 0.4}px rgba(0,0,0,0.5))`,
        pointerEvents: "none" as const,
      }}
    >
      <svg viewBox="0 0 24 24" width={s} height={s}>
        <path
          d="M4 2L4 20L9 15L14 22L17 20L12 13L20 13Z"
          fill={color}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
};

// --- Main Video Component ---
export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const colors = resolveColors(CONFIG);

  // Uppercase all lines (font only supports uppercase)
  const lines = CONFIG.lines.map((l) => l.toUpperCase());
  const { pixels, gridW, gridH } = getPixels(lines);

  // Auto-scale block size to fit viewport
  let blockSize = minDim * 0.02;
  if (gridW * blockSize > width * 0.8) blockSize = (width * 0.8) / gridW;
  if (gridH * blockSize > height * 0.55) blockSize = (height * 0.55) / gridH;

  // Center grid (offset upward to leave room for subtitle)
  const totalW = gridW * blockSize;
  const totalH = gridH * blockSize;
  const originX = (width - totalW) / 2;
  const originY = (height - totalH) / 2 - height * 0.05;

  // --- Assign pixels to 4 cursors by column strips ---
  const CURSOR_COUNT = 4;
  const allCols = [...new Set(pixels.map((p) => p.x))].sort((a, b) => a - b);
  const colsPerCursor = Math.ceil(allCols.length / CURSOR_COUNT);
  const colMap = new Map(allCols.map((c, i) => [c, i]));
  const cursorPixels: Pixel[][] = Array.from(
    { length: CURSOR_COUNT },
    () => []
  );

  pixels.forEach((p) => {
    const ci = Math.min(
      Math.floor((colMap.get(p.x) ?? 0) / colsPerCursor),
      CURSOR_COUNT - 1
    );
    cursorPixels[ci].push(p);
  });
  cursorPixels.forEach((arr) =>
    arr.sort((a, b) => a.y - b.y || a.x - b.x)
  );

  // --- Timeline (240 frames, 30fps, 8 seconds) ---
  const BUILD_START = 48;
  const BUILD_END = 150;
  const SUB_START = 150;
  const SUB_END = 174;
  const EXIT_START = 165;

  // --- Pre-compute pixel placement frame for each pixel ---
  const placeFrames = new Map<string, number>();
  cursorPixels.forEach((arr) => {
    arr.forEach((p, idx) => {
      const t = arr.length > 1 ? idx / (arr.length - 1) : 0;
      placeFrames.set(
        `${p.x},${p.y}`,
        BUILD_START + t * (BUILD_END - BUILD_START)
      );
    });
  });

  function pixelOpacity(p: Pixel): number {
    if (frame < BUILD_START) return 0;
    const pf = placeFrames.get(`${p.x},${p.y}`) ?? BUILD_END;
    return interpolate(frame, [pf, pf + 3], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // --- Cursor animation positions ---
  const entryPos = [
    { x: -width * 0.05, y: -height * 0.05 },
    { x: width * 1.05, y: -height * 0.05 },
    { x: -width * 0.05, y: height * 1.05 },
    { x: width * 1.05, y: height * 1.05 },
  ];
  const scatterPos = [
    { x: width * 0.25, y: height * 0.2 },
    { x: width * 0.7, y: height * 0.25 },
    { x: width * 0.2, y: height * 0.65 },
    { x: width * 0.72, y: height * 0.6 },
  ];
  const exitPos = [
    { x: -width * 0.15, y: -height * 0.15 },
    { x: width * 1.15, y: -height * 0.2 },
    { x: -width * 0.1, y: height * 1.15 },
    { x: width * 1.2, y: height * 1.1 },
  ];

  function cursorState(ci: number) {
    const myPixels = cursorPixels[ci];
    if (myPixels.length === 0) return { x: 0, y: 0, opacity: 0 };

    const entryDelay = ci === 0 ? 0 : 10 + ci * 5;
    const enterProg = spring({
      frame: Math.max(0, frame - entryDelay),
      fps,
      config: { damping: 14, stiffness: 100, overshootClamping: true },
    });
    const alignProg = interpolate(frame, [27, 48], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const buildProg = interpolate(frame, [BUILD_START, BUILD_END], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const exitProg = interpolate(frame, [EXIT_START, 240], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const firstPx = myPixels[0];
    const startX = originX + firstPx.x * blockSize;
    const startY = originY - blockSize * 2;

    let x: number, y: number, opacity: number;

    if (frame < 27) {
      // Enter & scatter
      x = interpolate(enterProg, [0, 1], [entryPos[ci].x, scatterPos[ci].x]);
      y = interpolate(enterProg, [0, 1], [entryPos[ci].y, scatterPos[ci].y]);
      opacity = enterProg;
    } else if (frame < BUILD_START) {
      // Align to start position
      x = interpolate(alignProg, [0, 1], [scatterPos[ci].x, startX]);
      y = interpolate(alignProg, [0, 1], [scatterPos[ci].y, startY]);
      opacity = 1;
    } else if (frame < EXIT_START) {
      // Build -- scan through pixel positions
      const idx = buildProg * (myPixels.length - 1);
      const fi = Math.floor(idx);
      const ti = Math.min(fi + 1, myPixels.length - 1);
      const t = idx - fi;
      x =
        originX +
        (myPixels[fi].x + (myPixels[ti].x - myPixels[fi].x) * t) * blockSize;
      y =
        originY +
        (myPixels[fi].y + (myPixels[ti].y - myPixels[fi].y) * t) * blockSize;
      opacity = 1;
    } else {
      // Exit -- float away
      const lastPx = myPixels[myPixels.length - 1];
      const lastX = originX + lastPx.x * blockSize;
      const lastY = originY + lastPx.y * blockSize;
      x = interpolate(exitProg, [0, 1], [lastX, exitPos[ci].x]);
      y = interpolate(exitProg, [0, 1], [lastY, exitPos[ci].y]);
      opacity = interpolate(exitProg, [0, 1], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }

    return { x, y, opacity };
  }

  // --- Subtitle typewriter ---
  const subProgress = interpolate(frame, [SUB_START, SUB_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subText = CONFIG.subtitle;
  const subVisible = Math.floor(subProgress * subText.length);
  const subBlink = Math.floor(frame / 4) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      {/* Pixel grid */}
      <div
        style={{
          position: "absolute",
          left: originX,
          top: originY,
          width: totalW,
          height: totalH,
        }}
      >
        {pixels.map((p, i) => (
          <PixelBlock
            key={i}
            px={p.x}
            py={p.y}
            size={blockSize}
            color={colors.block}
            opacity={pixelOpacity(p)}
          />
        ))}
      </div>

      {/* Cursors */}
      {colors.cursors.map((color, ci) => {
        const s = cursorState(ci);
        return (
          <CursorArrow
            key={ci}
            x={s.x}
            y={s.y}
            color={color}
            size={blockSize}
            opacity={s.opacity}
          />
        );
      })}

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: originY + totalH + height * 0.04,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: width * 0.02,
            color: colors.subtitle,
            letterSpacing: width * 0.002,
            opacity: subProgress > 0 ? 1 : 0,
          }}
        >
          {subText.slice(0, subVisible)}
          {subProgress > 0 && subProgress < 1 && (
            <span style={{ opacity: subBlink ? 1 : 0 }}>_</span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

**Root.tsx for pixel font:**
```tsx
import { Composition } from "remotion";
import { Video } from "./Video";

export const Root: React.FC = () => {
  return (
    <Composition
      id="main"
      component={Video}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

**Timeline (8 seconds at 30fps = 240 frames):**
- 0-0.9s (0-27f): Cursors enter from corners and scatter across the canvas
- 0.9-1.6s (27-48f): Cursors align to their starting positions above the text
- 1.6-5.0s (48-150f): Cursors scan through their column strips, placing pixel blocks
- 5.0-5.8s (150-174f): Subtitle types in below the pixel text
- 5.5-8.0s (165-240f): Cursors float away off-screen

**Customization:**
- `CONFIG.lines` -- array of text strings (auto-uppercased)
- `CONFIG.subtitle` -- typewriter text below the pixel art
- `CONFIG.scheme` -- color preset name: `classic` (white/black), `retro` (red/black), `neon` (green/dark), `ocean` (cyan/navy), `sunset` (orange/dark), `sabai` (Sabai brand colors)
- Override individual colors with `blockColor`, `bgColor`, `subtitleColor`, `cursorColors`
- Font supports A-Z, 0-9, space, and `.!?-:`
- Block size auto-scales when text exceeds 80% viewport width
- See `references/pixel-font-data.md` for the full character map and how to add new characters

**Usage:** 240 frames at 30fps = 8 seconds. Great for pixel text building animations, retro gaming announcements, tech product reveals, and "coming soon" teasers.
