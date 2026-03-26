# Text Announcement Template

Bold text reveal for announcements, launches, and social posts.

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

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const minDim = Math.min(width, height);
  const slideDistance = minDim * 0.04;

  const lines = ["We just", "launched", "something new."];

  // Background pulse
  const bgHue = interpolate(frame, [0, durationInFrames], [220, 250]);

  // Fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${bgHue}, 50%, 8%) 0%, hsl(${bgHue + 30}, 40%, 5%) 100%)`,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        overflow: "hidden",
      }}
    >
      {lines.map((line, i) => {
        const delay = i * 15;
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 13, stiffness: 160, overshootClamping: true },
        });
        const y = interpolate(progress, [0, 1], [slideDistance, 0]);

        return (
          <div
            key={i}
            style={{
              opacity: progress,
              transform: `translateY(${y}px)`,
              fontSize: i === 1 ? width * 0.06 : width * 0.04,
              fontWeight: i === 1 ? 900 : 600,
              color: i === 1 ? "#f26a2c" : "white",
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
```

**Usage:** 120 frames at 30fps = 4 seconds. Quick and punchy for social media.
