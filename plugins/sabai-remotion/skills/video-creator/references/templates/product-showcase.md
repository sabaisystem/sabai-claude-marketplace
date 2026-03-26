# Product Showcase Template

Multi-slide showcase with slide transitions, feature highlights, and CTA.

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

const Slide: React.FC<{
  title: string;
  subtitle: string;
  accentColor: string;
  icon: string;
}> = ({ title, subtitle, accentColor, icon }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const minDim = Math.min(width, height);

  const scale = spring({ frame, fps, config: { damping: 14, overshootClamping: true } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(frame, [10, 25], [minDim * 0.02, 0], { extrapolateRight: "clamp" });
  const iconSize = minDim * 0.09;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0f0f0f 0%, ${accentColor}22 100%)`,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          transform: `scale(${scale})`,
          width: iconSize,
          height: iconSize,
          borderRadius: "50%",
          backgroundColor: accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: iconSize * 0.48,
          marginBottom: minDim * 0.03,
          boxShadow: `0 ${minDim * 0.015}px ${minDim * 0.045}px ${accentColor}44`,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontSize: width * 0.03,
          fontWeight: "bold",
          color: "white",
          marginBottom: minDim * 0.012,
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontSize: width * 0.015,
          color: "rgba(255, 255, 255, 0.6)",
          maxWidth: width * 0.4,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={90}>
        <Slide
          icon="⚡"
          title="Lightning Fast"
          subtitle="Built for speed with optimized rendering and minimal overhead"
          accentColor="#f26a2c"
        />
      </Sequence>

      <Sequence from={90} durationInFrames={90}>
        <Slide
          icon="🔒"
          title="Secure by Default"
          subtitle="Enterprise-grade security with end-to-end encryption"
          accentColor="#013b2d"
        />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <Slide
          icon="🚀"
          title="Scale Effortlessly"
          subtitle="From startup to enterprise, grow without limits"
          accentColor="#4a90d9"
        />
      </Sequence>

      {/* CTA slide */}
      <Sequence from={270} durationInFrames={90}>
        <Slide
          icon="→"
          title="Get Started Today"
          subtitle="Try it free for 14 days. No credit card required."
          accentColor="#f26a2c"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
```

**Usage:** 360 frames at 30fps = 12 seconds. Each slide is 3 seconds. Good for product launches, feature tours, and social ads.
