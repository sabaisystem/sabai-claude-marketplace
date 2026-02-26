import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { z } from "zod";

export const dataVizSchema = z.object({
  title: z.string(),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    })
  ),
  chartColor: z.string(),
  backgroundColor: z.string(),
});

type DataVizProps = z.infer<typeof dataVizSchema>;

const Bar: React.FC<{
  label: string;
  value: number;
  maxValue: number;
  index: number;
  color: string;
}> = ({ label, value, maxValue, index, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered animation
  const progress = spring({
    frame: frame - index * 8,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const barHeight = interpolate(progress, [0, 1], [0, (value / maxValue) * 300]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
      }}
    >
      {/* Value label */}
      <div
        style={{
          color: "#fff",
          fontSize: 28,
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          marginBottom: 10,
          opacity: progress,
        }}
      >
        {Math.round(value * progress)}
      </div>

      {/* Bar */}
      <div
        style={{
          width: 80,
          height: 300,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 10,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: barHeight,
            backgroundColor: color,
            borderRadius: 10,
            boxShadow: `0 0 20px ${color}50`,
          }}
        />
      </div>

      {/* Label */}
      <div
        style={{
          color: "#fff",
          fontSize: 24,
          fontFamily: "Arial, sans-serif",
          marginTop: 15,
          opacity: 0.8,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const DataViz: React.FC<DataVizProps> = ({
  title,
  data,
  chartColor,
  backgroundColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const maxValue = Math.max(...data.map((d) => d.value));

  // Title animation
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleY = interpolate(titleProgress, [0, 1], [-30, 0]);

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
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Title */}
      <h1
        style={{
          position: "absolute",
          top: 80,
          color: "#fff",
          fontSize: 64,
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </h1>

      {/* Chart */}
      <div
        style={{
          display: "flex",
          gap: 60,
          marginTop: 80,
        }}
      >
        {data.map((item, index) => (
          <Bar
            key={item.label}
            label={item.label}
            value={item.value}
            maxValue={maxValue}
            index={index}
            color={chartColor}
          />
        ))}
      </div>

      {/* Sabai branding */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          fontSize: 24,
          color: "#fff",
          opacity: 0.4,
          fontFamily: "Arial, sans-serif",
        }}
      >
        sabaisystem.com
      </div>
    </AbsoluteFill>
  );
};
