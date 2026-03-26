# Clarifying Questions Framework

Guide for determining what to ask the user before generating a video.

## Core Principle

**Always confirm before rendering.** Ask key questions upfront to avoid wasted renders. Keep it brief — a single message with 2-3 questions, not a long questionnaire.

## Auto-Detect (use as suggestions, still confirm)

| Signal | Detection |
|--------|-----------|
| Platform | "TikTok" → 9:16, "YouTube" → 16:9, etc. |
| Duration | Short social → 5-10s, explainer → 15-30s |
| FPS | Always 30 unless specified |
| Background | Default dark gradient unless brand colors given |
| Easing | Spring for entries, linear for continuous motion |

## Always Ask (even if partially specified)

These questions MUST be asked before generating, unless the user has already explicitly answered them:

1. **What's the main message or content?**
   - Only if the user's request is vague (e.g., "make me a video")
   - Not needed if they said something like "announce our product launch"

2. **What platform is this for?** (determines dimensions)
   - Always ask — even if there are clues, confirm with the user
   - Suggest based on context: "This sounds like a YouTube video (1920×1080) — is that right?"

3. **What output format do you want?** (MP4, WebM, or GIF)
   - Default: MP4 (h264) — best compatibility
   - WebM (vp8/vp9) — smaller files, good for web embedding
   - GIF — auto-generated as preview alongside video
   - Mention the options briefly so the user knows what's available

## Conditional Questions (ask only when relevant)

### For Brand Content
- "Do you have specific brand colors?" (otherwise use defaults)
- "Any specific text or tagline?" (otherwise infer from context)

### For Data Visualization
- "What data should I visualize?" (required — can't guess this)
- "Any specific chart type preference?" (otherwise choose best fit)

### For Multi-Scene Videos
- "How many scenes or key points?" (otherwise 3-4 scenes)
- "Any specific order or flow?" (otherwise logical progression)

### For Presentations
- "Slide content or key points?" (required)
- "Formal or casual tone?" (otherwise match context)

## Quick-Start Scenarios

Even with clear requests, confirm platform and format before generating:

| User Says | What To Confirm |
|-----------|-----------------|
| "Make a TikTok intro for my brand 'Acme'" | Confirm: "TikTok format (1080×1920), MP4 — sound good?" |
| "Animated bar chart showing Q1-Q4 sales" | Ask for numbers + confirm: "YouTube 16:9, MP4?" |
| "YouTube outro with subscribe reminder" | Confirm: "YouTube 16:9 (1920×1080), MP4 — ready to go?" |
| "Announce our new feature X" | Ask: "What platform? And MP4 or WebM?" |
| "Make me a video" | Ask: "What should it show? What platform? MP4 or WebM?" |

## Response Pattern

Always confirm before generating:

```
I'll create that for you! Let me confirm a few things:

- **Platform**: [detected or ask] (dimensions)
- **Duration**: [suggested]
- **Format**: MP4 / WebM / GIF

Sound good, or want to adjust anything?
```

Always offer the option to skip questions and iterate instead.
