# Remotion Templates

Complete, working Remotion compositions. Use these as starting points and customize for the user's request. All templates use responsive, viewport-relative sizing that adapts to any resolution.

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
  const { fps, width, height } = useVideoConfig();
  const delay = index * 8;
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 15, stiffness: 120, overshootClamping: true },
  });
  const maxBarWidth = width * 0.4;
  const barWidth = (item.value / maxValue) * maxBarWidth * progress;
  const valueOpacity = interpolate(progress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barHeight = height * 0.04;
  const labelWidth = width * 0.08;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: width * 0.012, marginBottom: height * 0.015 }}>
      <div
        style={{
          width: labelWidth,
          fontSize: width * 0.013,
          color: "rgba(255,255,255,0.8)",
          textAlign: "right",
        }}
      >
        {item.label}
      </div>
      <div
        style={{
          height: barHeight,
          width: barWidth,
          backgroundColor: item.color,
          borderRadius: `0 ${barHeight * 0.2}px ${barHeight * 0.2}px 0`,
          minWidth: 4,
        }}
      />
      <div style={{ fontSize: width * 0.014, color: "white", fontWeight: "bold", opacity: valueOpacity }}>
        {Math.floor(item.value * progress)}
      </div>
    </div>
  );
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const maxValue = Math.max(...data.map((d) => d.value));
  const padding = Math.min(width, height) * 0.08;
  const slideDistance = Math.min(width, height) * 0.02;

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [slideDistance, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding,
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: width * 0.028,
          fontWeight: "bold",
          color: "white",
          marginBottom: height * 0.04,
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

---

## Product Showcase with Images Template

Multi-slide product showcase using real images via Remotion's `<Img>` component. Supports full-screen image with overlay, split-screen (image + text), and call-to-action layouts with smooth transitions between slides.

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
  Img,
} from "remotion";

// --- Data: customize slides here ---
interface ProductSlide {
  type: "hero" | "split" | "cta";
  imageUrl?: string;
  title: string;
  subtitle?: string;
  body?: string;
  price?: string;
  accentColor: string;
  ctaText?: string;
}

const slides: ProductSlide[] = [
  {
    type: "hero",
    imageUrl: "https://picsum.photos/id/1/1920/1080",
    title: "Introducing Product X",
    subtitle: "Designed for the modern workflow",
    accentColor: "#f26a2c",
  },
  {
    type: "split",
    imageUrl: "https://picsum.photos/id/26/800/600",
    title: "Precision Engineered",
    body: "Every detail has been refined for peak performance and reliability.",
    price: "$299",
    accentColor: "#f26a2c",
  },
  {
    type: "split",
    imageUrl: "https://picsum.photos/id/96/800/600",
    title: "Built to Last",
    body: "Premium materials meet cutting-edge technology for lasting quality.",
    price: "$399",
    accentColor: "#013b2d",
  },
  {
    type: "cta",
    title: "Get Yours Today",
    subtitle: "Free shipping on all orders",
    ctaText: "Shop Now →",
    accentColor: "#f26a2c",
  },
];

const SLIDE_DURATION = 90; // frames per slide (3s at 30fps)

// --- Hero Slide: full-screen image with text overlay ---
const HeroSlide: React.FC<{ slide: ProductSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const minDim = Math.min(width, height);

  const scale = interpolate(frame, [0, SLIDE_DURATION], [1, 1.08], {
    extrapolateRight: "clamp",
  });
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 160, overshootClamping: true },
  });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [20, 40], [minDim * 0.02, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {/* Background image with slow zoom (Ken Burns effect) */}
      {slide.imageUrl && (
        <Img
          src={slide.imageUrl}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale})`,
          }}
        />
      )}

      {/* Gradient scrim for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Text overlay */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: minDim * 0.08,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            opacity: titleProgress,
            transform: `translateY(${interpolate(titleProgress, [0, 1], [minDim * 0.03, 0])}px)`,
            fontSize: width * 0.045,
            fontWeight: 900,
            color: "white",
            marginBottom: minDim * 0.015,
            textShadow: `0 ${minDim * 0.003}px ${minDim * 0.015}px rgba(0,0,0,0.5)`,
          }}
        >
          {slide.title}
        </div>
        {slide.subtitle && (
          <div
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
              fontSize: width * 0.02,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: width * 0.001,
            }}
          >
            {slide.subtitle}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Split Slide: image left, text + price right ---
const SplitSlide: React.FC<{ slide: ProductSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const minDim = Math.min(width, height);

  const imgProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 140, overshootClamping: true },
  });
  const textDelay = 12;
  const textOpacity = interpolate(frame, [textDelay, textDelay + 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const textY = interpolate(
    frame,
    [textDelay, textDelay + 20],
    [minDim * 0.025, 0],
    { extrapolateRight: "clamp" }
  );
  const priceDelay = 25;
  const priceScale = spring({
    frame: Math.max(0, frame - priceDelay),
    fps,
    config: { damping: 12, stiffness: 180, overshootClamping: true },
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      {/* Image half */}
      <div
        style={{
          width: "50%",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: minDim * 0.04,
        }}
      >
        {slide.imageUrl && (
          <Img
            src={slide.imageUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: width * 0.012,
              opacity: imgProgress,
              transform: `scale(${interpolate(imgProgress, [0, 1], [0.9, 1])})`,
              boxShadow: `0 ${minDim * 0.02}px ${minDim * 0.06}px rgba(0,0,0,0.4)`,
            }}
          />
        )}
      </div>

      {/* Text half */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: minDim * 0.06,
        }}
      >
        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <div
            style={{
              fontSize: width * 0.03,
              fontWeight: 800,
              color: "white",
              marginBottom: minDim * 0.02,
              lineHeight: 1.2,
            }}
          >
            {slide.title}
          </div>
          {slide.body && (
            <div
              style={{
                fontSize: width * 0.015,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.6,
                marginBottom: minDim * 0.03,
                maxWidth: width * 0.35,
              }}
            >
              {slide.body}
            </div>
          )}
        </div>

        {/* Price badge */}
        {slide.price && (
          <div
            style={{
              transform: `scale(${priceScale})`,
              display: "inline-flex",
              alignItems: "center",
              gap: width * 0.008,
            }}
          >
            <div
              style={{
                fontSize: width * 0.028,
                fontWeight: 900,
                color: slide.accentColor,
              }}
            >
              {slide.price}
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// --- CTA Slide: call-to-action with brand accent ---
const CtaSlide: React.FC<{ slide: ProductSlide }> = ({ slide }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const minDim = Math.min(width, height);

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 160, overshootClamping: true },
  });
  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaDelay = 25;
  const ctaProgress = spring({
    frame: Math.max(0, frame - ctaDelay),
    fps,
    config: { damping: 14, stiffness: 200, overshootClamping: true },
  });
  // Pulse the CTA button gently
  const ctaPulse =
    1 + Math.sin((frame - ctaDelay) * 0.08) * 0.015 * ctaProgress;

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [SLIDE_DURATION - 20, SLIDE_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0f0f0f 0%, ${slide.accentColor}15 100%)`,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${titleScale})`,
          fontSize: width * 0.04,
          fontWeight: 900,
          color: "white",
          marginBottom: minDim * 0.015,
          textAlign: "center",
        }}
      >
        {slide.title}
      </div>
      {slide.subtitle && (
        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: width * 0.018,
            color: "rgba(255,255,255,0.6)",
            marginBottom: minDim * 0.04,
            textAlign: "center",
          }}
        >
          {slide.subtitle}
        </div>
      )}
      {slide.ctaText && (
        <div
          style={{
            transform: `scale(${ctaProgress * ctaPulse})`,
            backgroundColor: slide.accentColor,
            color: "white",
            fontSize: width * 0.018,
            fontWeight: 700,
            padding: `${minDim * 0.015}px ${minDim * 0.04}px`,
            borderRadius: minDim * 0.006,
            boxShadow: `0 ${minDim * 0.01}px ${minDim * 0.04}px ${slide.accentColor}55`,
          }}
        >
          {slide.ctaText}
        </div>
      )}
    </AbsoluteFill>
  );
};

// --- Main composition: sequences each slide ---
export const Video: React.FC = () => {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {slides.map((slide, i) => (
        <Sequence
          key={i}
          from={i * SLIDE_DURATION}
          durationInFrames={SLIDE_DURATION}
        >
          {slide.type === "hero" && <HeroSlide slide={slide} />}
          {slide.type === "split" && <SplitSlide slide={slide} />}
          {slide.type === "cta" && <CtaSlide slide={slide} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

**Root.tsx:**
```tsx
import { Composition } from "remotion";
import { Video } from "./Video";

export const Root: React.FC = () => {
  return (
    <Composition
      id="main"
      component={Video}
      durationInFrames={360}  // 4 slides × 90 frames
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

**Usage:** 360 frames at 30fps = 12 seconds (4 slides × 3s each). Customize by editing the `slides` array — add/remove slides, change layouts, swap image URLs.

**Layouts available:**
- `hero` — Full-screen image with gradient scrim and text overlay (great for opening slides)
- `split` — 50/50 image + text with price badge (great for product features)
- `cta` — Call-to-action with accent color and animated button (great for closing slides)

**Customization tips:**
- Change `SLIDE_DURATION` to adjust time per slide (90 frames = 3s at 30fps)
- Replace `imageUrl` values with real product image URLs (HTTPS only)
- Adjust `accentColor` per slide for brand consistency
- Add more slides by appending to the `slides` array and updating `durationInFrames` in Root.tsx
