# Presentation Deck Template

Static slide deck at 1920x1080 (16:9). Each frame is one slide. Renders as individual PNGs then stitched into a single PDF. Uses the Product Showcase visual design (icon badges, gradient backgrounds) without animation.

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
    title: "Product Name",
    subtitle: "Your tagline goes here",
    bg: "linear-gradient(160deg, #0f0f0f 0%, #1a1a2e 100%)",
    accent: "#f26a2c",
    type: "cover" as const,
  },
  {
    icon: "\u26a1",
    title: "Lightning Fast",
    subtitle: "Built for speed with optimized rendering and minimal overhead",
    accent: "#f26a2c",
    type: "feature" as const,
  },
  {
    icon: "\ud83d\udd12",
    title: "Secure by Default",
    subtitle: "Enterprise-grade security with end-to-end encryption",
    accent: "#013b2d",
    type: "feature" as const,
  },
  {
    icon: "\ud83d\ude80",
    title: "Scale Effortlessly",
    subtitle: "From startup to enterprise, grow without limits",
    accent: "#4a90d9",
    type: "feature" as const,
  },
  {
    title: "Get Started Today",
    subtitle: "Try it free for 14 days. No credit card required.",
    bg: "linear-gradient(160deg, #1a1a2e 0%, #0f0f0f 100%)",
    accent: "#f26a2c",
    type: "cta" as const,
  },
];

const CoverSlide: React.FC<{
  title: string;
  subtitle: string;
  bg: string;
  accent: string;
}> = ({ title, subtitle, bg, accent }) => {
  const { width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const padding = minDim * 0.08;

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
          width: width * 0.05,
          height: height * 0.005,
          backgroundColor: accent,
          borderRadius: height * 0.003,
          marginBottom: minDim * 0.04,
        }}
      />
      <div
        style={{
          fontSize: width * 0.04,
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: minDim * 0.02,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: width * 0.018,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: width * 0.001,
          textAlign: "center",
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

const FeatureSlide: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  accent: string;
}> = ({ icon, title, subtitle, accent }) => {
  const { width, height } = useVideoConfig();
  const minDim = Math.min(width, height);
  const iconSize = minDim * 0.09;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0f0f0f 0%, ${accent}22 100%)`,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: iconSize,
          height: iconSize,
          borderRadius: "50%",
          backgroundColor: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: iconSize * 0.48,
          marginBottom: minDim * 0.03,
          boxShadow: `0 ${minDim * 0.015}px ${minDim * 0.045}px ${accent}44`,
        }}
      >
        {icon}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: width * 0.03,
          fontWeight: "bold",
          color: "white",
          marginBottom: minDim * 0.012,
          textAlign: "center",
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: width * 0.015,
          color: "rgba(255, 255, 255, 0.6)",
          maxWidth: width * 0.5,
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
    <FeatureSlide
      icon={slide.icon!}
      title={slide.title}
      subtitle={slide.subtitle}
      accent={slide.accent}
    />
  );
};
```

**Root.tsx for presentation deck:**
```tsx
import { Composition } from "remotion";
import { Video } from "./Video";

export const Root: React.FC = () => {
  return (
    <Composition
      id="presentation"
      component={Video}
      durationInFrames={5}
      fps={1}
      width={1920}
      height={1080}
    />
  );
};
```

**Rendering:** 5 frames at 1fps. Each frame = one slide. Render with `render-carousel.sh` using composition ID `presentation` to get individual PNGs stitched into a PDF.

**Usage:** Presentation decks, pitch decks, feature overviews, and handouts. Upload the PDF or use as slide deck. Good for product launches, quarterly reviews, and stakeholder updates.
