# Remotion Templates

Complete, working Remotion compositions. Use these as starting points and customize for the user's request.

## Intro / Outro Template

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
  const { fps, durationInFrames } = useVideoConfig();

  // Logo animation
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Tagline animation (delayed)
  const taglineFrame = Math.max(0, frame - 25);
  const taglineOpacity = interpolate(taglineFrame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const taglineY = interpolate(taglineFrame, [0, 20], [20, 0], { extrapolateRight: "clamp" });

  // Fade out at the end
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          width: 120,
          height: 120,
          borderRadius: 28,
          backgroundColor: "#f26a2c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
          boxShadow: "0 20px 60px rgba(242, 106, 44, 0.3)",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: "bold", color: "white" }}>S</div>
      </div>

      {/* Company Name */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          fontSize: 56,
          fontWeight: "bold",
          color: "white",
          letterSpacing: 2,
          marginBottom: 12,
        }}
      >
        Your Brand
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontSize: 24,
          color: "rgba(255, 255, 255, 0.7)",
          letterSpacing: 4,
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

---

## Data Visualization Template

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
  const { fps } = useVideoConfig();
  const delay = index * 8;
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  const barWidth = (item.value / maxValue) * 600 * progress;
  const valueOpacity = interpolate(progress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
      <div
        style={{
          width: 100,
          fontSize: 18,
          color: "rgba(255,255,255,0.8)",
          textAlign: "right",
        }}
      >
        {item.label}
      </div>
      <div
        style={{
          height: 40,
          width: barWidth,
          backgroundColor: item.color,
          borderRadius: "0 8px 8px 0",
          minWidth: 4,
        }}
      />
      <div style={{ fontSize: 20, color: "white", fontWeight: "bold", opacity: valueOpacity }}>
        {Math.floor(item.value * progress)}
      </div>
    </div>
  );
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const maxValue = Math.max(...data.map((d) => d.value));

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 42,
          fontWeight: "bold",
          color: "white",
          marginBottom: 48,
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

---

## Product Showcase Template

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
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 14 } });
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(frame, [10, 25], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0f0f0f 0%, ${accentColor}22 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          transform: `scale(${scale})`,
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
          marginBottom: 32,
          boxShadow: `0 16px 48px ${accentColor}44`,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontSize: 48,
          fontWeight: "bold",
          color: "white",
          marginBottom: 12,
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontSize: 22,
          color: "rgba(255, 255, 255, 0.6)",
          maxWidth: 600,
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
    <AbsoluteFill>
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

---

## Text Announcement Template

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
  const { fps, durationInFrames } = useVideoConfig();

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
      }}
    >
      {lines.map((line, i) => {
        const delay = i * 15;
        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: { damping: 13, stiffness: 160 },
        });
        const y = interpolate(progress, [0, 1], [40, 0]);

        return (
          <div
            key={i}
            style={{
              opacity: progress,
              transform: `translateY(${y}px)`,
              fontSize: i === 1 ? 96 : 64,
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

---

## LinkedIn Carousel Template

Multi-slide carousel at 1200×1500. Each frame is one slide. Renders as individual PNGs then stitched into a single PDF for LinkedIn upload.

```tsx
// Video.tsx
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const slides = [
  {
    title: "5 Tips for Better\nProductivity",
    subtitle: "Swipe to learn more →",
    bg: "linear-gradient(160deg, #0f0f0f 0%, #1a1a2e 100%)",
    accent: "#f26a2c",
    type: "cover" as const,
  },
  {
    number: "01",
    title: "Start with the\nhardest task",
    body: "Tackle your most challenging work first thing in the morning when your energy is highest.",
    accent: "#f26a2c",
    type: "tip" as const,
  },
  {
    number: "02",
    title: "Time-box\neverything",
    body: "Set a fixed window for each task. Constraints create focus and prevent perfectionism.",
    accent: "#e55310",
    type: "tip" as const,
  },
  {
    number: "03",
    title: "Batch similar\ntasks together",
    body: "Group emails, calls, and reviews. Context-switching is the enemy of deep work.",
    accent: "#013b2d",
    type: "tip" as const,
  },
  {
    number: "04",
    title: "Take real\nbreaks",
    body: "Step away from your desk. A 10-minute walk beats 10 minutes of scrolling.",
    accent: "#4a90d9",
    type: "tip" as const,
  },
  {
    number: "05",
    title: "Review your\nday",
    body: "Spend 5 minutes at the end of each day reflecting on what worked and what didn't.",
    accent: "#f26a2c",
    type: "tip" as const,
  },
  {
    title: "Want more tips?",
    subtitle: "Follow for weekly productivity insights",
    bg: "linear-gradient(160deg, #1a1a2e 0%, #0f0f0f 100%)",
    accent: "#f26a2c",
    type: "cta" as const,
  },
];

const CoverSlide: React.FC<{ title: string; subtitle: string; bg: string; accent: string }> = ({
  title, subtitle, bg, accent,
}) => (
  <AbsoluteFill
    style={{
      background: bg,
      justifyContent: "center",
      alignItems: "center",
      padding: 80,
    }}
  >
    <div
      style={{
        width: 80,
        height: 6,
        backgroundColor: accent,
        borderRadius: 3,
        marginBottom: 48,
      }}
    />
    <div
      style={{
        fontSize: 72,
        fontWeight: 900,
        color: "white",
        textAlign: "center",
        lineHeight: 1.15,
        whiteSpace: "pre-line",
        marginBottom: 32,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: 28,
        color: "rgba(255,255,255,0.5)",
        letterSpacing: 2,
      }}
    >
      {subtitle}
    </div>
  </AbsoluteFill>
);

const TipSlide: React.FC<{
  number: string; title: string; body: string; accent: string;
}> = ({ number, title, body, accent }) => (
  <AbsoluteFill
    style={{
      background: "linear-gradient(180deg, #0f0f0f 0%, #141422 100%)",
      padding: 80,
      justifyContent: "center",
    }}
  >
    <div
      style={{
        fontSize: 120,
        fontWeight: 900,
        color: accent,
        opacity: 0.15,
        position: "absolute",
        top: 60,
        right: 80,
      }}
    >
      {number}
    </div>
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        backgroundColor: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        fontWeight: 700,
        color: "white",
        marginBottom: 40,
      }}
    >
      {number}
    </div>
    <div
      style={{
        fontSize: 52,
        fontWeight: 800,
        color: "white",
        lineHeight: 1.2,
        whiteSpace: "pre-line",
        marginBottom: 28,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: 26,
        color: "rgba(255,255,255,0.6)",
        lineHeight: 1.6,
        maxWidth: 900,
      }}
    >
      {body}
    </div>
  </AbsoluteFill>
);

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const slide = slides[frame];

  if (!slide) return <AbsoluteFill style={{ background: "#0f0f0f" }} />;

  if (slide.type === "cover" || slide.type === "cta") {
    return (
      <CoverSlide
        title={slide.title}
        subtitle={slide.subtitle!}
        bg={slide.bg!}
        accent={slide.accent}
      />
    );
  }

  return (
    <TipSlide
      number={slide.number!}
      title={slide.title}
      body={slide.body!}
      accent={slide.accent}
    />
  );
};
```

**Root.tsx for carousel:**
```tsx
import { Composition } from "remotion";
import { Video } from "./Video";

export const Root: React.FC = () => {
  return (
    <Composition
      id="carousel"
      component={Video}
      durationInFrames={7}
      fps={1}
      width={1200}
      height={1500}
    />
  );
};
```

**Rendering:** 7 frames at 1fps. Each frame = one slide. Render with `render-carousel.sh` to get individual PNGs stitched into a PDF.

**Usage:** LinkedIn carousel posts. Upload the PDF directly to LinkedIn. Good for tips, tutorials, case studies, and thought leadership.
