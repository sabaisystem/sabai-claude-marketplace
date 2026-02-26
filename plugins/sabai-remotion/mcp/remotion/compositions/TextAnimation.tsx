import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { z } from "zod";

export const textAnimationSchema = z.object({
  text: z.string(),
  fontSize: z.number(),
  fontFamily: z.string(),
  color: z.string(),
  backgroundColor: z.string(),
  effect: z.enum(["fade-in", "slide-up", "scale", "typewriter"]),
});

type TextAnimationProps = z.infer<typeof textAnimationSchema>;

export const TextAnimation: React.FC<TextAnimationProps> = ({
  text,
  fontSize,
  fontFamily,
  color,
  backgroundColor,
  effect,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation progress
  const progress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Effect-specific styles
  const getEffectStyles = () => {
    switch (effect) {
      case "fade-in":
        return {
          opacity: interpolate(progress, [0, 1], [0, 1]),
          transform: "none",
        };

      case "slide-up":
        return {
          opacity: interpolate(progress, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(progress, [0, 1], [100, 0])}px)`,
        };

      case "scale":
        return {
          opacity: interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(progress, [0, 1], [0.5, 1])})`,
        };

      case "typewriter":
        const visibleChars = Math.floor(interpolate(progress, [0, 1], [0, text.length]));
        return {
          opacity: 1,
          transform: "none",
          text: text.slice(0, visibleChars),
        };

      default:
        return { opacity: 1, transform: "none" };
    }
  };

  const effectStyles = getEffectStyles();
  const displayText = effect === "typewriter" ? effectStyles.text : text;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      <h1
        style={{
          color,
          fontSize,
          fontFamily,
          fontWeight: "bold",
          margin: 0,
          padding: "0 60px",
          textAlign: "center",
          opacity: effectStyles.opacity,
          transform: effectStyles.transform,
          textShadow: `0 4px 30px ${color}40`,
        }}
      >
        {displayText}
        {effect === "typewriter" && (
          <span
            style={{
              opacity: frame % 30 < 15 ? 1 : 0,
              marginLeft: 4,
            }}
          >
            |
          </span>
        )}
      </h1>

      {/* Sabai branding */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 24,
          color,
          opacity: 0.4,
          fontFamily: "Arial, sans-serif",
        }}
      >
        sabaisystem.com
      </div>
    </AbsoluteFill>
  );
};
