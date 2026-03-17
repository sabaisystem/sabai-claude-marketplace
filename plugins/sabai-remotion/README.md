# Sabai Remotion

**Remotion video production assistant for briefs, storyboards, composition plans, and render-ready implementation guidance.**

| Field | Value |
|-------|-------|
| Type | Skills + Commands |
| Version | 1.0.0 |
| Status | Active |
| Command | `/remotion`, `/storyboard`, `/scene`, `/render-plan` |
| Repo | `plugins/sabai-remotion` |

---

## Overview

Sabai Remotion helps turn rough ideas into structured Remotion work. It is designed for teams building product videos, explainers, social clips, launch assets, and internal motion content who need clear pre-production and implementation guidance before opening their editor.

The plugin focuses on the parts Claude is good at: tightening the brief, splitting a concept into scenes, defining reusable composition structure, and producing implementation notes that map cleanly to a Remotion codebase.

## Key Features

- Turn a short prompt into a concrete Remotion production brief
- Build storyboard and shot-by-shot scene plans with durations
- Define composition hierarchy, props, timing, and transition ideas
- Generate implementation handoff notes for a developer or motion designer
- Adapt output for landscape, portrait, or square deliverables

## Use Cases

- "Turn this launch announcement into a 30 second Remotion video"
- "Storyboard a 9:16 social teaser for our product update"
- "Help me break this script into scenes and transitions"
- "Create a render plan for a Remotion composition with captions and charts"

## Commands

- `/remotion [brief]` - Create or refine a complete Remotion video plan
- `/storyboard [brief]` - Produce a storyboard with scenes, beats, and timing
- `/scene [brief or scene goal]` - Drill into a single scene's layout, motion, and copy
- `/render-plan [brief or code context]` - Prepare a render-ready implementation handoff

## Configuration

### Settings

Customize defaults in plugin settings:

```json
{
  "preferences": {
    "default_format": "landscape-16:9",
    "default_fps": 30,
    "default_duration_seconds": 30,
    "brand_voice": "clear, modern, product-focused"
  }
}
```

| Preference | Description | Default |
|------------|-------------|---------|
| `default_format` | Default output format | landscape-16:9 |
| `default_fps` | Default frame rate | 30 |
| `default_duration_seconds` | Default video duration | 30 |
| `brand_voice` | Default script/copy tone | clear, modern, product-focused |

## Authentication

None required.

## Dependencies

- **Required**: None for planning
- **Optional**: A local Remotion project if you want the output translated directly into component or composition code

## Limitations

- This plugin does not render videos by itself
- Final code still depends on your project's Remotion setup, assets, and fonts
- Complex motion direction may need iteration after the first pass

## Tips

- Start with audience, format, and duration before discussing animation details
- Keep one visual idea per scene unless the video is intentionally dense
- Use `/scene` to refine the hardest moment instead of reworking the entire storyboard
- Use `/render-plan` when you are ready to hand work to a developer

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-remotion)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-remotion/CHANGELOG.md)
- [Remotion](https://www.remotion.dev)
