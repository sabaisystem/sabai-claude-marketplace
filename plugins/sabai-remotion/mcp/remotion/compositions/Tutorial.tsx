import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";
import { z } from "zod";

export const tutorialSchema = z.object({
  title: z.string(),
  steps: z.array(z.string()),
  backgroundColor: z.string(),
  textColor: z.string(),
});

type TutorialProps = z.infer<typeof tutorialSchema>;

const Step: React.FC<{ text: string; index: number; textColor: string }> = ({
  text,
  index,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const x = interpolate(progress, [0, 1], [-100, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30,
        transform: `translateX(${x}px)`,
        opacity,
        marginBottom: 40,
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "#f26a2c",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 28,
          fontWeight: "bold",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {index + 1}
      </div>
      <span
        style={{
          color: textColor,
          fontSize: 48,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Tutorial: React.FC<TutorialProps> = ({
  title,
  steps,
  backgroundColor,
  textColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleY = interpolate(titleProgress, [0, 1], [-50, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Calculate frame duration per step
  const titleDuration = 60; // 2 seconds for title
  const stepDuration = Math.floor((durationInFrames - titleDuration) / steps.length);

  // Fade out
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
        padding: 80,
        opacity: fadeOut,
      }}
    >
      {/* Title */}
      <h1
        style={{
          color: textColor,
          fontSize: 72,
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          marginBottom: 60,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        {title}
      </h1>

      {/* Steps */}
      <div style={{ marginLeft: 40 }}>
        {steps.map((step, index) => (
          <Sequence
            key={index}
            from={titleDuration + index * stepDuration}
            durationInFrames={stepDuration + 30}
          >
            <Step text={step} index={index} textColor={textColor} />
          </Sequence>
        ))}
      </div>

      {/* Sabai branding */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
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
