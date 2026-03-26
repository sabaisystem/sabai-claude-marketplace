# LinkedIn Carousel Template

Multi-slide carousel at 1200x1500. Each frame is one slide. Renders as individual PNGs then stitched into a single PDF for LinkedIn upload.

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
    subtitle: "Swipe to learn more \u2192",
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
}) => {
  const { width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const padding = minDim * 0.06;

  return (
    <AbsoluteFill
      style={{
        background: bg,
        justifyContent: "center",
        alignItems: "center",
        padding,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: width * 0.067,
          height: height * 0.004,
          backgroundColor: accent,
          borderRadius: height * 0.002,
          marginBottom: minDim * 0.035,
        }}
      />
      <div
        style={{
          fontSize: width * 0.06,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          lineHeight: 1.15,
          whiteSpace: "pre-line",
          marginBottom: minDim * 0.025,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: width * 0.023,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: width * 0.0015,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

const TipSlide: React.FC<{
  number: string; title: string; body: string; accent: string;
}> = ({ number, title, body, accent }) => {
  const { width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const padding = minDim * 0.06;
  const numberBadgeSize = minDim * 0.045;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f0f0f 0%, #141422 100%)",
        padding,
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: width * 0.1,
          fontWeight: 900,
          color: accent,
          opacity: 0.15,
          position: "absolute",
          top: height * 0.04,
          right: width * 0.067,
        }}
      >
        {number}
      </div>
      <div
        style={{
          width: numberBadgeSize,
          height: numberBadgeSize,
          borderRadius: "50%",
          backgroundColor: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: width * 0.02,
          fontWeight: 700,
          color: "white",
          marginBottom: minDim * 0.03,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontSize: width * 0.043,
          fontWeight: 800,
          color: "white",
          lineHeight: 1.2,
          whiteSpace: "pre-line",
          marginBottom: minDim * 0.02,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: width * 0.022,
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.6,
          maxWidth: width * 0.75,
        }}
      >
        {body}
      </div>
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const slide = slides[frame];

  if (!slide) return <AbsoluteFill style={{ background: "#0f0f0f", overflow: "hidden" }} />;

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
