import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { z } from "zod";

export const socialClipSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
});

type SocialClipProps = z.infer<typeof socialClipSchema>;

export const SocialClip: React.FC<SocialClipProps> = ({
  title,
  subtitle,
  backgroundColor,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Title animation - slide up and fade in
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleY = interpolate(titleProgress, [0, 1], [100, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Subtitle animation - delayed
  const subtitleProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const subtitleY = interpolate(subtitleProgress, [0, 1], [50, 0]);
  const subtitleOpacity = interpolate(subtitleProgress, [0, 1], [0, 1]);

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.1)",
          top: -100,
          right: -100,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.1)",
          bottom: -50,
          left: -50,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 60,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: textColor,
            fontSize: 80,
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif",
            margin: 0,
            marginBottom: 30,
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            color: textColor,
            fontSize: 40,
            fontFamily: "Arial, sans-serif",
            margin: 0,
            opacity: subtitleOpacity * 0.8,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Sabai branding */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 24,
          color: textColor,
          opacity: 0.6,
          fontFamily: "Arial, sans-serif",
        }}
      >
        sabaisystem.com
      </div>
    </AbsoluteFill>
  );
};
