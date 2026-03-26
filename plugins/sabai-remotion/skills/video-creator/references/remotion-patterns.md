# Remotion Animation Patterns

Ready-to-use animation patterns for composing video scenes. Mix and match these in your compositions.

## Safe Layout Helpers

**Always start your Video component with these responsive sizing utilities.** Never hardcode pixel values for layout — derive everything from the viewport.

```tsx
const { width, height, fps } = useVideoConfig();

// 10% safe margin — keep all content inside this boundary
const safeMargin = Math.min(width, height) * 0.1;

// Responsive font sizes (scale with viewport width)
const titleSize = width * 0.04;       // ~77px at 1920w, ~43px at 1080w
const subtitleSize = width * 0.03;    // ~58px at 1920w, ~32px at 1080w
const bodySize = width * 0.024;       // ~46px at 1920w, ~26px at 1080w
const captionSize = width * 0.016;    // ~31px at 1920w, ~17px at 1080w

// Responsive spacing
const padding = Math.min(width, height) * 0.08;
const gap = width * 0.012;

// Bounded animation distances — element entry animations stay within safe zone
const slideDistance = Math.min(width, height) * 0.04;
const logoSize = Math.min(width, height) * 0.1;
```

**Rules:**
- Root `<AbsoluteFill>` must always include `overflow: "hidden"`
- Springs should include `overshootClamping: true` to prevent elements overshooting viewport
- Translate values for element entry animations should stay within `safeMargin`
- Scene transitions (sliding whole scenes in/out) may use full `width`/`height`

---

## Text Reveals

### Fade In
```tsx
const frame = useCurrentFrame();
const { width } = useVideoConfig();
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateRight: "clamp",
});

<div style={{ opacity, fontSize: width * 0.04, color: "white", fontWeight: "bold" }}>
  Your Text Here
</div>
```

### Slide Up + Fade
```tsx
const frame = useCurrentFrame();
const { width, height } = useVideoConfig();
const slideDistance = Math.min(width, height) * 0.04;
const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
const translateY = interpolate(frame, [0, 20], [slideDistance, 0], { extrapolateRight: "clamp" });

<div style={{
  opacity,
  transform: `translateY(${translateY}px)`,
  fontSize: width * 0.04,
  color: "white",
  fontWeight: "bold",
}}>
  Your Text Here
</div>
```

### Scale Bounce (Spring)
```tsx
const frame = useCurrentFrame();
const { fps, width } = useVideoConfig();
const scale = spring({ frame, fps, config: { damping: 12, stiffness: 200, overshootClamping: true } });

<div style={{
  transform: `scale(${scale})`,
  fontSize: width * 0.04,
  color: "white",
  fontWeight: "bold",
}}>
  Your Text Here
</div>
```

### Typewriter
```tsx
const frame = useCurrentFrame();
const { width } = useVideoConfig();
const text = "Your Text Here";
const charsVisible = Math.floor(interpolate(frame, [0, 60], [0, text.length], {
  extrapolateRight: "clamp",
}));

<div style={{ fontSize: width * 0.03, color: "white", fontFamily: "monospace" }}>
  {text.slice(0, charsVisible)}
  <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>
</div>
```

### Word-by-Word Reveal
```tsx
const frame = useCurrentFrame();
const { width, height } = useVideoConfig();
const words = ["Build", "Something", "Amazing"];
const slideDistance = Math.min(width, height) * 0.03;

<div style={{ display: "flex", gap: width * 0.01, justifyContent: "center" }}>
  {words.map((word, i) => {
    const delay = i * 10;
    const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const y = interpolate(frame, [delay, delay + 15], [slideDistance, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <span key={i} style={{ opacity, transform: `translateY(${y}px)`, fontSize: width * 0.04, color: "white", fontWeight: "bold" }}>
        {word}
      </span>
    );
  })}
</div>
```

## Logo / Shape Animations

### Fade + Scale with Spring
```tsx
const frame = useCurrentFrame();
const { fps, width, height } = useVideoConfig();
const scale = spring({ frame, fps, config: { damping: 15, stiffness: 150, overshootClamping: true } });
const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
const logoSize = Math.min(width, height) * 0.1;

<div style={{
  opacity,
  transform: `scale(${scale})`,
  width: logoSize,
  height: logoSize,
  borderRadius: logoSize * 0.2,
  backgroundColor: "#f26a2c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}}>
  {/* Logo content */}
</div>
```

### Rotate In
```tsx
const frame = useCurrentFrame();
const { fps, width, height } = useVideoConfig();
const progress = spring({ frame, fps, config: { damping: 20, overshootClamping: true } });
const rotate = interpolate(progress, [0, 1], [-180, 0]);
const scale = interpolate(progress, [0, 1], [0.3, 1]);
const shapeSize = Math.min(width, height) * 0.08;

<div style={{
  transform: `rotate(${rotate}deg) scale(${scale})`,
  width: shapeSize,
  height: shapeSize,
  backgroundColor: "#013b2d",
  borderRadius: "50%",
}} />
```

### Draw Circle (SVG)
```tsx
const frame = useCurrentFrame();
const { width, height } = useVideoConfig();
const size = Math.min(width, height) * 0.1;
const radius = size * 0.375;
const circumference = 2 * Math.PI * radius;
const progress = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });

<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
  <circle
    cx={size / 2} cy={size / 2} r={radius}
    fill="none"
    stroke="#f26a2c"
    strokeWidth={size * 0.033}
    strokeDasharray={circumference}
    strokeDashoffset={circumference * (1 - progress)}
    strokeLinecap="round"
    transform={`rotate(-90 ${size / 2} ${size / 2})`}
  />
</svg>
```

## Scene Transitions

### Cross-Dissolve
```tsx
// Use inside a Sequence to transition between scenes
const frame = useCurrentFrame();
const { durationInFrames } = useVideoConfig();
const fadeOutStart = durationInFrames - 15;
const opacity = interpolate(frame, [fadeOutStart, durationInFrames], [1, 0], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

<AbsoluteFill style={{ opacity, overflow: "hidden" }}>
  {/* Scene content */}
</AbsoluteFill>
```

### Slide Transition
```tsx
const frame = useCurrentFrame();
const { width } = useVideoConfig();
const translateX = interpolate(frame, [0, 20], [width, 0], {
  extrapolateRight: "clamp",
});

<AbsoluteFill style={{ transform: `translateX(${translateX}px)`, overflow: "hidden" }}>
  {/* Incoming scene */}
</AbsoluteFill>
```

### Zoom In Transition
```tsx
const frame = useCurrentFrame();
const scale = interpolate(frame, [0, 20], [1.5, 1], { extrapolateRight: "clamp" });
const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

<AbsoluteFill style={{ transform: `scale(${scale})`, opacity, overflow: "hidden" }}>
  {/* Scene content */}
</AbsoluteFill>
```

## Data Animations

### Animated Bar Chart
```tsx
const frame = useCurrentFrame();
const { fps, width, height } = useVideoConfig();
const data = [
  { label: "Q1", value: 65, color: "#f26a2c" },
  { label: "Q2", value: 80, color: "#e55310" },
  { label: "Q3", value: 45, color: "#013b2d" },
  { label: "Q4", value: 90, color: "#f26a2c" },
];
const maxValue = Math.max(...data.map(d => d.value));
const chartHeight = height * 0.35;
const barWidth = width * 0.04;
const barGap = width * 0.02;

<div style={{ display: "flex", alignItems: "flex-end", gap: barGap, height: chartHeight }}>
  {data.map((d, i) => {
    const delay = i * 8;
    const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 15, overshootClamping: true } });
    const barHeight = (d.value / maxValue) * chartHeight * 0.85 * progress;
    return (
      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: height * 0.01 }}>
        <div style={{ width: barWidth, height: barHeight, backgroundColor: d.color, borderRadius: `${barWidth * 0.13}px ${barWidth * 0.13}px 0 0` }} />
        <span style={{ color: "white", fontSize: width * 0.012 }}>{d.label}</span>
      </div>
    );
  })}
</div>
```

### Counter Roll-Up
```tsx
const frame = useCurrentFrame();
const { width } = useVideoConfig();
const targetNumber = 1247;
const currentNumber = Math.floor(interpolate(frame, [0, 45], [0, targetNumber], {
  extrapolateRight: "clamp",
}));

<div style={{ fontSize: width * 0.06, fontWeight: "bold", color: "white", fontFamily: "monospace" }}>
  {currentNumber.toLocaleString()}
</div>
```

### Progress Ring
```tsx
const frame = useCurrentFrame();
const { width, height } = useVideoConfig();
const percentage = 73;
const size = Math.min(width, height) * 0.2;
const radius = size * 0.4;
const strokeWidth = size * 0.06;
const circumference = 2 * Math.PI * radius;
const progress = interpolate(frame, [0, 50], [0, percentage / 100], {
  extrapolateRight: "clamp",
});

<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
  <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1a1a2e" strokeWidth={strokeWidth} />
  <circle
    cx={size / 2} cy={size / 2} r={radius}
    fill="none"
    stroke="#f26a2c"
    strokeWidth={strokeWidth}
    strokeDasharray={circumference}
    strokeDashoffset={circumference * (1 - progress)}
    strokeLinecap="round"
    transform={`rotate(-90 ${size / 2} ${size / 2})`}
  />
  <text x={size / 2} y={size * 0.525} textAnchor="middle" fill="white" fontSize={size * 0.18} fontWeight="bold">
    {Math.floor(progress * 100)}%
  </text>
</svg>
```

## Background Effects

### Gradient Shift
```tsx
const frame = useCurrentFrame();
const hue = interpolate(frame, [0, 150], [220, 280]);

<AbsoluteFill style={{
  background: `linear-gradient(135deg, hsl(${hue}, 60%, 12%) 0%, hsl(${hue + 40}, 50%, 8%) 100%)`,
  overflow: "hidden",
}} />
```

### Animated Grid
```tsx
const frame = useCurrentFrame();
const { width, height } = useVideoConfig();
const opacity = interpolate(frame, [0, 30], [0, 0.15], { extrapolateRight: "clamp" });
const cellSize = Math.min(width, height) * 0.055;
const cols = Math.ceil(width / cellSize);
const rows = Math.ceil(height / cellSize);

<AbsoluteFill style={{ overflow: "hidden" }}>
  <svg width="100%" height="100%" style={{ opacity }}>
    {Array.from({ length: rows + 1 }).map((_, i) => (
      <line key={`h${i}`} x1="0" y1={i * cellSize} x2="100%" y2={i * cellSize} stroke="white" strokeWidth="1" />
    ))}
    {Array.from({ length: cols + 1 }).map((_, i) => (
      <line key={`v${i}`} x1={i * cellSize} y1="0" x2={i * cellSize} y2="100%" stroke="white" strokeWidth="1" />
    ))}
  </svg>
</AbsoluteFill>
```

### Floating Particles
```tsx
const frame = useCurrentFrame();
const { width, height } = useVideoConfig();
const particleMaxSize = Math.min(width, height) * 0.008;
const particles = Array.from({ length: 15 }).map((_, i) => {
  const seed = i * 137.5;
  const x = ((seed * 7) % 100);
  const baseY = ((seed * 13) % 100);
  const y = baseY - (frame * (0.3 + (i % 3) * 0.2)) % 120;
  const size = particleMaxSize * (0.5 + (i % 4) * 0.35);
  const opacity = interpolate(y, [-20, 0, 80, 100], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { x, y: y < -20 ? y + 120 : y, size, opacity };
});

<AbsoluteFill style={{ overflow: "hidden" }}>
  {particles.map((p, i) => (
    <div key={i} style={{
      position: "absolute",
      left: `${p.x}%`,
      top: `${p.y}%`,
      width: p.size,
      height: p.size,
      borderRadius: "50%",
      backgroundColor: "white",
      opacity: p.opacity,
    }} />
  ))}
</AbsoluteFill>
```

## Utility: Staggered Children

Use this pattern to animate a list of elements with delay between each:

```tsx
const frame = useCurrentFrame();
const { fps, width, height } = useVideoConfig();
const items = ["First", "Second", "Third"];
const slideDistance = Math.min(width, height) * 0.03;

{items.map((item, i) => {
  const delay = i * 10; // 10 frames between each
  const entryProgress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, overshootClamping: true },
  });

  return (
    <div key={i} style={{
      opacity: entryProgress,
      transform: `translateY(${(1 - entryProgress) * slideDistance}px)`,
      fontSize: width * 0.024,
      color: "white",
    }}>
      {item}
    </div>
  );
})}
```

## Caption Overlay

Reusable timed caption component with optional karaoke-style word highlighting. Render this **outside** all `<Sequence>` blocks so `useCurrentFrame()` returns the composition's absolute frame.

### Caption Data Structure
```tsx
// Define in CONFIG alongside other template data
interface CaptionSegment {
  startFrame: number;        // Frame when caption appears
  endFrame: number;          // Frame when caption disappears
  text: string;              // Full caption text
  words?: {                  // Optional: per-word timing for karaoke highlight
    word: string;
    activeFrame: number;     // Frame when this word becomes highlighted
  }[];
}
```

### Caption Overlay Component
```tsx
const CaptionOverlay: React.FC<{
  segments: { startFrame: number; endFrame: number; text: string; words?: { word: string; activeFrame: number }[] }[];
  position?: "bottom" | "top";
  bgColor?: string;
  textColor?: string;
  activeWordColor?: string;
  fadeFrames?: number;
}> = ({
  segments,
  position = "bottom",
  bgColor = "rgba(0,0,0,0.75)",
  textColor = "white",
  activeWordColor = "#f26a2c",
  fadeFrames = 8,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const safeMargin = Math.min(width, height) * 0.1;

  // Find active caption segment
  const seg = segments.find(s => frame >= s.startFrame && frame <= s.endFrame);
  if (!seg) return null;

  // Fade in/out
  const fadeIn = interpolate(frame, [seg.startFrame, seg.startFrame + fadeFrames], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [seg.endFrame - fadeFrames, seg.endFrame], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  // Find the currently active word index (last word whose activeFrame <= frame)
  let activeIdx = -1;
  if (seg.words) {
    for (let i = seg.words.length - 1; i >= 0; i--) {
      if (frame >= seg.words[i].activeFrame) { activeIdx = i; break; }
    }
  }

  return (
    <div style={{
      position: "absolute",
      ...(position === "bottom"
        ? { bottom: safeMargin, left: safeMargin, right: safeMargin }
        : { top: safeMargin, left: safeMargin, right: safeMargin }),
      display: "flex",
      justifyContent: "center",
      opacity,
      zIndex: 100,
    }}>
      <div style={{
        backgroundColor: bgColor,
        padding: `${height * 0.015}px ${width * 0.025}px`,
        borderRadius: Math.min(width, height) * 0.012,
        maxWidth: width * 0.8,
        textAlign: "center" as const,
      }}>
        {seg.words ? (
          <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: width * 0.006 }}>
            {seg.words.map((w, i) => (
              <span key={i} style={{
                fontSize: width * 0.024,
                fontFamily: "Arial, sans-serif",
                fontWeight: i === activeIdx ? "bold" : "normal",
                color: i === activeIdx ? activeWordColor : textColor,
                transform: i === activeIdx ? "scale(1.05)" : "scale(1)",
                transition: "none",
              }}>
                {w.word}
              </span>
            ))}
          </div>
        ) : (
          <span style={{
            fontSize: width * 0.024,
            fontFamily: "Arial, sans-serif",
            color: textColor,
          }}>
            {seg.text}
          </span>
        )}
      </div>
    </div>
  );
};
```

**Usage notes:**
- Place `<CaptionOverlay>` **outside** all `<Sequence>` blocks (directly under the root `<AbsoluteFill>`) so it reads the absolute composition frame
- Keep captions to ~8-12 words per segment for readability
- For karaoke timing, distribute words evenly: `activeFrame = startFrame + (i / words.length) * (endFrame - startFrame)`
- Use `position="top"` when bottom content would overlap (e.g., CTA buttons)
