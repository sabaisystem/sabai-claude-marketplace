# Data Visualization Template

Animated bar chart with labels, values, and staggered entry.

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

interface BarData {
  label: string;
  value: number;
  color: string;
}

const data: BarData[] = [
  { label: "Product A", value: 85, color: "#f26a2c" },
  { label: "Product B", value: 62, color: "#e55310" },
  { label: "Product C", value: 94, color: "#013b2d" },
  { label: "Product D", value: 71, color: "#f26a2c" },
  { label: "Product E", value: 53, color: "#e55310" },
];

const Bar: React.FC<{ item: BarData; index: number; maxValue: number }> = ({
  item,
  index,
  maxValue,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const delay = index * 8;
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 15, stiffness: 120, overshootClamping: true },
  });
  const maxBarWidth = width * 0.4;
  const barWidth = (item.value / maxValue) * maxBarWidth * progress;
  const valueOpacity = interpolate(progress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barHeight = height * 0.04;
  const labelWidth = width * 0.08;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: width * 0.012, marginBottom: height * 0.015 }}>
      <div
        style={{
          width: labelWidth,
          fontSize: width * 0.013,
          color: "rgba(255,255,255,0.8)",
          textAlign: "right",
        }}
      >
        {item.label}
      </div>
      <div
        style={{
          height: barHeight,
          width: barWidth,
          backgroundColor: item.color,
          borderRadius: `0 ${barHeight * 0.2}px ${barHeight * 0.2}px 0`,
          minWidth: 4,
        }}
      />
      <div style={{ fontSize: width * 0.014, color: "white", fontWeight: "bold", opacity: valueOpacity }}>
        {Math.floor(item.value * progress)}
      </div>
    </div>
  );
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const maxValue = Math.max(...data.map((d) => d.value));
  const padding = Math.min(width, height) * 0.08;
  const slideDistance = Math.min(width, height) * 0.02;

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [slideDistance, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding,
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: width * 0.028,
          fontWeight: "bold",
          color: "white",
          marginBottom: height * 0.04,
        }}
      >
        Performance Overview
      </div>

      {/* Bars */}
      <div>
        {data.map((item, i) => (
          <Bar key={i} item={item} index={i} maxValue={maxValue} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
```

**Usage:** 180 frames at 30fps = 6 seconds. Great for dashboards, reports, and data stories.
