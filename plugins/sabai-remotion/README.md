# Sabai Remotion

**Video creation assistant — generates Remotion components and renders MP4 videos with GIF previews.**

| Field | Value |
|-------|-------|
| Type | Skills + Commands + Scripts |
| Version | 3.3.0 |
| Status | Active |
| Command | `/video`, `/video carousel` |
| Repo | `plugins/sabai-remotion` |

---

## Overview

Sabai Remotion turns ideas into rendered videos. Describe what you want, and it generates Remotion React components, renders them into MP4 videos, and automatically creates GIF previews so you can review the animation before downloading the final file.

## Key Features

- Turn a prompt into a Remotion video (MP4 output)
- Auto-generate GIF preview after every render for quick review
- External image support — use product photos via HTTPS URLs with Remotion's `<Img>`
- LinkedIn Carousel creation (1200×1500 slides → PDF)
- Platform auto-detection (TikTok, YouTube, Instagram, LinkedIn, etc.)
- Safe zone enforcement — responsive sizing prevents elements going off-screen
- Animation patterns library (text reveals, transitions, data viz)
- Ready-to-use templates (intro/outro, data viz, product showcase, product showcase with images, carousel)

## Use Cases

- "Create a 30-second intro animation with our logo"
- "Make a TikTok countdown timer from 10 to 0"
- "Animated bar chart showing Q1: 45, Q2: 72, Q3: 61, Q4: 89"

## Commands

- `/video create [description]` - Create a new video from a description
- `/video carousel [description]` - Create a LinkedIn carousel PDF (1200×1500 per slide)
- `/video preview` - Preview the current video (renders MP4 + GIF)
- `/video render [options]` - Render video to downloadable file
- `/video templates` - Browse starter templates

## Configuration

### Settings

Customize defaults in plugin settings:

| Preference | Description | Default |
|------------|-------------|---------|
| `default_format` | Default output format | landscape-16:9 |
| `default_fps` | Default frame rate | 30 |
| `default_duration_seconds` | Default video duration | 30 |
| `brand_voice` | Default script/copy tone | clear, modern, product-focused |

## Authentication

None required.

## Dependencies

- **Required**: Node.js 18+, npm
- **Required**: ffmpeg (for GIF conversion from MP4)
- **Required**: ImageMagick or img2pdf (for carousel PDF stitching)

## Limitations

- Rendering requires a Cowork VM or environment with headless Chrome
- Images supported via HTTPS URLs only (no local files or HTTP)
- No external video or font imports
- Complex motion direction may need iteration after the first pass

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-remotion)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-remotion/CHANGELOG.md)
- [Remotion](https://www.remotion.dev)
