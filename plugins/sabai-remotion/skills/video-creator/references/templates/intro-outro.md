# Intro / Outro Template

A classic logo reveal with tagline on a gradient background with spring animation.

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

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const minDim = Math.min(width, height);

  // Logo animation
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 180, overshootClamping: true } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Tagline animation (delayed)
  const taglineFrame = Math.max(0, frame - 25);
  const taglineOpacity = interpolate(taglineFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const taglineY = interpolate(taglineFrame, [0, 20], [minDim * 0.02, 0], { extrapolateRight: "clamp" });

  // Fade out at the end
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoSize = minDim * 0.12;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          width: logoSize,
          height: logoSize,
          borderRadius: logoSize * 0.23,
          backgroundColor: "#f26a2c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: minDim * 0.03,
          boxShadow: `0 ${minDim * 0.02}px ${minDim * 0.06}px rgba(242, 106, 44, 0.3)`,
        }}
      >
        <div style={{ fontSize: logoSize * 0.47, fontWeight: "bold", color: "white" }}>S</div>
      </div>

      {/* Company Name */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          fontSize: width * 0.035,
          fontWeight: "bold",
          color: "white",
          letterSpacing: width * 0.001,
          marginBottom: minDim * 0.012,
        }}
      >
        Your Brand
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontSize: width * 0.016,
          color: "rgba(255, 255, 255, 0.7)",
          letterSpacing: width * 0.002,
          textTransform: "uppercase",
        }}
      >
        Your tagline goes here
      </div>
    </AbsoluteFill>
  );
};
```

**Usage:** 150 frames at 30fps = 5 seconds. Good for video intros, outros, and brand reveals.
