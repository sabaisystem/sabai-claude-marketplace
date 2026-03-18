# Remotion Animation Patterns

Ready-to-use animation patterns for composing video scenes. Mix and match these in your compositions.

## Text Reveals

### Fade In
```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 20], [0, 1], {
  extrapolateRight: "clamp",
});

<div style={{ opacity, fontSize: 64, color: "white", fontWeight: "bold" }}>
  Your Text Here
</div>
```

### Slide Up + Fade
```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
const translateY = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: "clamp" });

<div style={{
  opacity,
  transform: `translateY(${translateY}px)`,
  fontSize: 64,
  color: "white",
  fontWeight: "bold",
}}>
  Your Text Here
</div>
```

### Scale Bounce (Spring)
```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const scale = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });

<div style={{
  transform: `scale(${scale})`,
  fontSize: 64,
  color: "white",
  fontWeight: "bold",
}}>
  Your Text Here
</div>
```

### Typewriter
```tsx
const frame = useCurrentFrame();
const text = "Your Text Here";
const charsVisible = Math.floor(interpolate(frame, [0, 60], [0, text.length], {
  extrapolateRight: "clamp",
}));

<div style={{ fontSize: 48, color: "white", fontFamily: "monospace" }}>
  {text.slice(0, charsVisible)}
  <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>|</span>
</div>
```

### Word-by-Word Reveal
```tsx
const frame = useCurrentFrame();
const words = ["Build", "Something", "Amazing"];

<div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
  {words.map((word, i) => {
    const delay = i * 10;
    const opacity = interpolate(frame, [delay, delay + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const y = interpolate(frame, [delay, delay + 15], [30, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <span key={i} style={{ opacity, transform: `translateY(${y}px)`, fontSize: 64, color: "white", fontWeight: "bold" }}>
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
const { fps } = useVideoConfig();
const scale = spring({ frame, fps, config: { damping: 15, stiffness: 150 } });
const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

<div style={{
  opacity,
  transform: `scale(${scale})`,
  width: 120,
  height: 120,
  borderRadius: 24,
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
const { fps } = useVideoConfig();
const progress = spring({ frame, fps, config: { damping: 20 } });
const rotate = interpolate(progress, [0, 1], [-180, 0]);
const scale = interpolate(progress, [0, 1], [0.3, 1]);

<div style={{
  transform: `rotate(${rotate}deg) scale(${scale})`,
  width: 100,
  height: 100,
  backgroundColor: "#013b2d",
  borderRadius: "50%",
}} />
```

### Draw Circle (SVG)
```tsx
const frame = useCurrentFrame();
const circumference = 2 * Math.PI * 45;
const progress = interpolate(frame, [0, 40], [0, 1], { extrapolateRight: "clamp" });

<svg width="120" height="120" viewBox="0 0 120 120">
  <circle
    cx="60" cy="60" r="45"
    fill="none"
    stroke="#f26a2c"
    strokeWidth="4"
    strokeDasharray={circumference}
    strokeDashoffset={circumference * (1 - progress)}
    strokeLinecap="round"
    transform="rotate(-90 60 60)"
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

<AbsoluteFill style={{ opacity }}>
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

<AbsoluteFill style={{ transform: `translateX(${translateX}px)` }}>
  {/* Incoming scene */}
</AbsoluteFill>
```

### Zoom In Transition
```tsx
const frame = useCurrentFrame();
const scale = interpolate(frame, [0, 20], [1.5, 1], { extrapolateRight: "clamp" });
const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

<AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>
  {/* Scene content */}
</AbsoluteFill>
```

## Data Animations

### Animated Bar Chart
```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const data = [
  { label: "Q1", value: 65, color: "#f26a2c" },
  { label: "Q2", value: 80, color: "#e55310" },
  { label: "Q3", value: 45, color: "#013b2d" },
  { label: "Q4", value: 90, color: "#f26a2c" },
];
const maxValue = Math.max(...data.map(d => d.value));

<div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 300 }}>
  {data.map((d, i) => {
    const delay = i * 8;
    const progress = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 15 } });
    const height = (d.value / maxValue) * 250 * progress;
    return (
      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ width: 60, height, backgroundColor: d.color, borderRadius: "8px 8px 0 0" }} />
        <span style={{ color: "white", fontSize: 16 }}>{d.label}</span>
      </div>
    );
  })}
</div>
```

### Counter Roll-Up
```tsx
const frame = useCurrentFrame();
const targetNumber = 1247;
const currentNumber = Math.floor(interpolate(frame, [0, 45], [0, targetNumber], {
  extrapolateRight: "clamp",
}));

<div style={{ fontSize: 96, fontWeight: "bold", color: "white", fontFamily: "monospace" }}>
  {currentNumber.toLocaleString()}
</div>
```

### Progress Ring
```tsx
const frame = useCurrentFrame();
const percentage = 73;
const circumference = 2 * Math.PI * 80;
const progress = interpolate(frame, [0, 50], [0, percentage / 100], {
  extrapolateRight: "clamp",
});

<svg width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="80" fill="none" stroke="#1a1a2e" strokeWidth="12" />
  <circle
    cx="100" cy="100" r="80"
    fill="none"
    stroke="#f26a2c"
    strokeWidth="12"
    strokeDasharray={circumference}
    strokeDashoffset={circumference * (1 - progress)}
    strokeLinecap="round"
    transform="rotate(-90 100 100)"
  />
  <text x="100" y="105" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold">
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
}} />
```

### Animated Grid
```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 0.15], { extrapolateRight: "clamp" });

<AbsoluteFill>
  <svg width="100%" height="100%" style={{ opacity }}>
    {Array.from({ length: 20 }).map((_, i) => (
      <line key={`h${i}`} x1="0" y1={i * 60} x2="100%" y2={i * 60} stroke="white" strokeWidth="1" />
    ))}
    {Array.from({ length: 35 }).map((_, i) => (
      <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="100%" stroke="white" strokeWidth="1" />
    ))}
  </svg>
</AbsoluteFill>
```

### Floating Particles
```tsx
const frame = useCurrentFrame();
const particles = Array.from({ length: 15 }).map((_, i) => {
  const seed = i * 137.5;
  const x = ((seed * 7) % 100);
  const baseY = ((seed * 13) % 100);
  const y = baseY - (frame * (0.3 + (i % 3) * 0.2)) % 120;
  const size = 3 + (i % 4) * 2;
  const opacity = interpolate(y, [-20, 0, 80, 100], [0, 0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { x, y: y < -20 ? y + 120 : y, size, opacity };
});

<AbsoluteFill>
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
const { fps } = useVideoConfig();
const items = ["First", "Second", "Third"];

{items.map((item, i) => {
  const delay = i * 10; // 10 frames between each
  const entryProgress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14 },
  });

  return (
    <div key={i} style={{
      opacity: entryProgress,
      transform: `translateY(${(1 - entryProgress) * 30}px)`,
      fontSize: 36,
      color: "white",
    }}>
      {item}
    </div>
  );
})}
```
