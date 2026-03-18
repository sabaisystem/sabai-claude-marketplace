# Clarifying Questions Framework

Guide for determining what to ask the user before generating a video.

## Core Principle

**Ask less, create more.** Most users prefer to see something quickly and iterate, rather than answering a questionnaire. Only ask when genuinely ambiguous.

## Always Auto-Detect (Never Ask)

| Signal | Detection |
|--------|-----------|
| Platform | "TikTok" → 9:16, "YouTube" → 16:9, etc. |
| Duration | Short social → 5-10s, explainer → 15-30s |
| FPS | Always 30 unless specified |
| Codec | Always h264/MP4 |
| Background | Default dark gradient unless brand colors given |
| Easing | Spring for entries, linear for continuous motion |

## Always Ask (if not provided)

These are the only questions worth asking before starting:

1. **What's the main message or content?**
   - Only if the user's request is vague (e.g., "make me a video")
   - Not needed if they said something like "announce our product launch"

2. **What platform is this for?** (determines dimensions)
   - Only if no platform clues in the request
   - Not needed if they mention TikTok, YouTube, Instagram, etc.

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

When the user gives enough context, skip questions entirely:

| User Says | What To Do |
|-----------|------------|
| "Make a TikTok intro for my brand 'Acme'" | Just create it: 9:16, spring animation, brand text, 5s |
| "Animated bar chart showing Q1-Q4 sales" | Ask for the actual numbers, then create |
| "YouTube outro with subscribe reminder" | Just create it: 16:9, CTA text, 5s |
| "Announce our new feature X" | Just create it: default format, bold text reveal, 5s |
| "Make me a video" | Ask: "What would you like the video to show? And is this for a specific platform?" |

## Response Pattern

When you do need to ask:

```
I'll create that video for you! Just a couple of quick questions:

1. [Question]
2. [Question]

Or I can start with sensible defaults and you can adjust from there — want me to go ahead?
```

Always offer the option to skip questions and iterate instead.
