---
name: video
description: Create, preview, and render Remotion videos through conversation
---

# /video

Create, preview, and render Remotion videos through conversation.

## Prerequisites (MUST run before any subcommand)

Before processing ANY subcommand, check if Remotion is set up:

```bash
if [ ! -d "/tmp/remotion-project/node_modules" ]; then
  bash "${CLAUDE_PLUGIN_ROOT}/scripts/setup-remotion.sh"
fi
```

1. Check if `/tmp/remotion-project/node_modules` exists
2. If NOT: tell the user **"Setting up video tools, one moment..."** and run `setup-remotion.sh`
3. Wait for setup to complete (~1-2 min) before proceeding
4. If it already exists, skip setup and proceed immediately

**This check is mandatory. Never skip it. Never process a subcommand without confirming setup is complete.**

## Usage

```
/video <subcommand> [arguments]
```

## Subcommands

### `/video create [description]`

Create a new video from a natural language description.

**Behavior:**
1. Read and follow `skills/video-creator/SKILL.md` for the full creation workflow
2. Parse the description for platform clues, duration, style, and content
3. If description is vague or missing, ask targeted questions using `skills/video-creator/references/clarifying-questions.md`
4. Set up the Remotion environment if not already done (run `setup-remotion.sh`)
5. Generate Remotion React components based on the description
6. Render the MP4 video
7. Auto-generate a GIF preview for the user to review the animation
8. Provide both the GIF preview and MP4 download link

**Cover selection:**
After rendering, key frames are shown to the user. The AI recommends the best frame as cover. If the user picks one, it becomes both the video thumbnail and a 2-second visible intro at the start. If not, the video stays as-is.

**Examples:**
```
/video create A 30-second intro animation with our logo
/video create TikTok countdown timer from 10 to 0
/video create animated bar chart showing Q1: 45, Q2: 72, Q3: 61, Q4: 89
/video create YouTube outro with subscribe call to action
/video create product showcase with 4 feature slides for "Acme Tech"
```

If no description is given (`/video create`), begin a brief configuration wizard:
1. Ask what the video is about (content/message)
2. Ask the target platform (or default to YouTube 16:9)
3. Ask about duration preference (or use sensible default)
4. Proceed to generation

---

### `/video carousel [description]`

Create a LinkedIn carousel (1200×1500 per slide) rendered as a PDF.

**Behavior:**
1. Read and follow `skills/video-creator/SKILL.md` Step 3b for the carousel workflow
2. Parse the description for content, number of slides, and style
3. If description is vague, ask what the carousel is about and how many slides
4. Generate a Remotion component where each frame = one slide (1200×1500, 1fps)
5. Render all slides as PNGs and stitch into a single PDF via `render-carousel.sh`
6. Provide the PDF download link for direct LinkedIn upload

**Examples:**
```
/video carousel 5 tips for better productivity
/video carousel Case study: How we grew 300% in 6 months
/video carousel Top 10 design trends for 2026
/video carousel Our team values - 4 slides with icons
```

**Defaults:**
- Slides: 5-7 (cover + content + CTA)
- Dimensions: 1200×1500 (LinkedIn optimal)
- Style: Dark gradient background, clean typography

---

### `/video presentation [description]`

Create a presentation deck (1920×1080 per slide) rendered as a PDF.

**Behavior:**
1. Read and follow `skills/video-creator/SKILL.md` Step 3c for the presentation deck workflow
2. Parse the description for content, number of slides, and style
3. If description is vague, ask what the presentation is about and how many slides
4. Generate a Remotion component where each frame = one slide (1920×1080, 1fps) using Product Showcase design
5. Render all slides as PNGs and stitch into a single PDF via `render-carousel.sh`
6. Provide the PDF download link

**Examples:**
```
/video presentation 4 feature slides for Acme Tech
/video presentation Pitch deck: problem, solution, market, team, CTA
/video presentation Quarterly review with 6 key metrics
/video presentation Product overview with 5 highlights
```

**Defaults:**
- Slides: 4-6 (cover + features + CTA)
- Dimensions: 1920×1080 (16:9 landscape)
- Style: Product Showcase design (icon badges, gradient backgrounds)

---

### `/video preview`

Preview the current video composition.

**Behavior:**
1. Check that a video composition exists at `/tmp/remotion-project/src/Video.tsx`
   - If not: respond "No video to preview yet. Use `/video create [description]` to start."
2. Render the MP4 video
3. Auto-generate a GIF preview from the rendered video
4. Show the GIF preview inline and provide the MP4 download link

---

### `/video render [options]`

Render the current video composition to a downloadable file.

**Behavior:**
1. Check that a video composition exists at `/tmp/remotion-project/src/Video.tsx`
   - If not: respond "No video to render yet. Use `/video create [description]` to start."
2. Parse options from the arguments:
   - `--quality <low|medium|high>` — Render quality (default: `high`)
     - `low`: 720p (1280×720)
     - `medium`: 1080p (1920×1080) — same as high for most videos
     - `high`: Native resolution from composition
   - `--output <filename>` — Custom output filename (default: `video.mp4`)
3. Render the MP4 using `render-video.sh`
4. Auto-generate a GIF preview using `render-gif.sh`
5. Place the output in the downloads directory:
   ```bash
   OUTPUT_DIR=$(find /sessions -path "*/mnt/outputs" -type d 2>/dev/null | head -1)
   OUTPUT_DIR="${OUTPUT_DIR:-/tmp}"
   ```
6. Provide the `computer://` download link and file details (size, resolution, duration)

**Examples:**
```
/video render
/video render --quality high
/video render --output my-intro.mp4
```

---

### `/video validate`

Validate the current composition by rendering key frames and checking for visual issues.

**Behavior:**
1. Check that `/tmp/remotion-project/src/Video.tsx` exists
   - If not: respond "No video to validate yet. Use `/video create [description]` to start."
2. Read `Video.tsx` to determine scene structure (Sequences, durationInFrames) and calculate key frames
3. Render check frames via `render-scene-checks.sh`
4. Show each screenshot inline with analysis of any visual issues
5. Report findings and offer to fix issues

**Key frames are selected by:**
- First frame (0) and last frame (durationInFrames - 1)
- Start of each `<Sequence>` or major animation phase
- Mid-composition frame
- Minimum 3, maximum 6 frames

---

### `/video templates`

List available starter templates with descriptions.

**Behavior:**
1. Read the template files from `skills/video-creator/references/templates/`
2. Display a summary table of available templates:

```
Available templates:

| # | Template            | Duration | Best For                              |
|---|---------------------|----------|---------------------------------------|
| 1 | Intro / Outro       | 5s       | Logo reveals, brand intros, outros    |
| 2 | Data Visualization  | 6s       | Bar charts, dashboards, data stories  |
| 3 | Product Showcase    | 12s      | Feature tours, product launches, ads  |
| 4 | Text Announcement   | 4s       | Social posts, launches, announcements |
| 5 | LinkedIn Carousel   | 7 slides | Carousels, tips, case studies (PDF)   |
| 6 | 3D Retro Pixel Font | 8s       | Pixel text building, retro gaming, announcements |
| 7 | Presentation Deck   | 5 slides | Pitch decks, feature overviews (PDF)  |
| 8 | Tutorial/Walkthrough | 18s     | Tutorials, how-tos, onboarding walkthroughs |

Use `/video create` with a description, or tell me a template number to start from.
```

3. If the user picks a template number, load that template's code from the corresponding file in `references/templates/` into `/tmp/remotion-project/src/Video.tsx` and ask what they'd like to customize (text, colors, timing, etc.)

---

## Default Behavior

If the user runs just `/video` with no subcommand, show help:

```
Sabai Remotion — Video Creation Pipeline

Commands:
  /video create [description]         Create a new video from a description
  /video carousel [description]       Create a LinkedIn carousel PDF (1200×1500)
  /video presentation [description]   Create a presentation deck PDF (1920×1080)
  /video preview                      Preview the current video composition
  /video validate                     Validate scenes visually before rendering
  /video render [options]             Render video to downloadable file
  /video templates                    Browse starter templates

Quick start:
  /video create "A 10-second intro with the text 'Hello World'"

Options for /video render:
  --quality <low|med|high>  Render quality (default: high)
  --output <filename>       Custom output filename
```

If the user runs `/video` followed by something that doesn't match a subcommand but looks like a description (e.g., `/video a cool intro animation`), treat it as `/video create <description>`.

## Reference Files

- `skills/video-creator/SKILL.md` — Full creation workflow, component rules, platform presets
- `skills/video-creator/references/remotion-patterns.md` — Animation code snippets
- `skills/video-creator/references/templates/` — Complete starter templates (one file per template)
- `skills/video-creator/references/clarifying-questions.md` — Question framework
- `skills/video-creator/references/pixel-font-data.md` — 5×7 pixel font character maps

**v3.4.0:** Visual scene validation now checks key frames for layout issues before rendering the full video. Use `/video validate` for manual checks.
