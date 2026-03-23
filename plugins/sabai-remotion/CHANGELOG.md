# Changelog

## [3.5.1] - 2026-03-23

### Added
- Embed cover art (MP4 attached picture) generated from the last composition frame.

## [3.5.0] - 2026-03-23

### Added
- Presentation Deck template — static Product Showcase design for PDF slide decks (1920×1080, 16:9)
- `/video presentation [desc]` subcommand for creating presentation deck PDFs
- Step 3c in SKILL.md for presentation deck rendering workflow
- Auto-detect "presentation", "deck", "pitch deck" keywords to route to PDF output
- Presentation (PDF) preset in platform presets table

### Changed
- Refactored templates into individual files (`references/templates/*.md`) for better progressive disclosure
- Updated all template references in SKILL.md and commands to use individual files

## [3.4.0] - 2026-03-23

### Added
- Visual scene validation (Step 2.5) — renders key frames as PNGs and checks for layout issues before full MP4 render
- `render-scene-checks.sh` script for rendering specific frames as PNGs with GL fallback
- `/video validate` subcommand for manual visual validation of the current composition

### Changed
- Video creation workflow now validates scenes before rendering MP4
- Iteration step re-runs scene validation when layout/positioning/text changes are made

## [3.3.0] - 2026-03-23

### Added
- 3D Retro Pixel Font template — animated cursors build text from 3D pixel blocks
- 5×7 pixel font data reference with A–Z, 0–9, space, and punctuation (. ! ? - :)
- 6 color scheme presets: classic, retro, neon, ocean, sunset, sabai
- Typewriter subtitle animation with blinking cursor
- Auto-scaling block size for long text strings

## [3.2.0] - 2026-03-19

### Added
- Safe Layout Rules in SKILL.md — viewport-relative sizing prevents elements going off-screen
- Scene planning step (Step 1.5) — maps content to scenes with frame allocation before coding
- Pre-flight checks in setup-remotion.sh (node, npm, ffmpeg validation)
- GL fallback chain in all render scripts (angle-egl → swangle)
- Non-empty output validation in all render scripts
- ffmpeg availability check in render-gif.sh
- Safe Layout Helpers section in remotion-patterns.md with responsive sizing utilities

### Changed
- All templates now use viewport-relative sizing (no hardcoded pixel values)
- All templates enforce `overflow: "hidden"` on root AbsoluteFill
- All spring animations now use `overshootClamping: true` by default
- Element entry animations bounded to safe margin instead of full viewport
- render-video.sh now uses `--crf=18` for higher quality output
- remotion.config.ts now sets concurrency to 2
- setup-remotion.sh creates `public/` directory

### Fixed
- Animations going outside the screen on non-1920×1080 resolutions
- Unbounded translate values causing elements to fly off viewport
- Springs overshooting and pushing elements past viewport bounds
- Render scripts failing silently on empty output files

## [3.1.0] - 2026-03-18

### Added
- LinkedIn Carousel template (1200×1500 per slide, 7-slide starter)
- `render-carousel.sh` script — renders each frame as PNG then stitches into PDF
- `/video carousel [description]` subcommand for carousel creation
- LinkedIn Carousel preset in platform auto-detection
- ImageMagick/img2pdf PDF stitching with fallback chain

## [3.0.0] - 2026-03-18

### Removed
- MCP App (interactive HTML preview) — was not working reliably
- MCP server and all MCP tools (preview_video, render_preview, read_media_chunk, get_composition_info, check_project_status)
- 3D cinema preview mode (Three.js)
- Chunked binary transfer
- Excessive commands: `/remotion`, `/storyboard`, `/scene`, `/render-plan`
- Excessive skills: video-brief, scene-design, render-handoff

### Added
- Auto-generate GIF preview after every MP4 render for quick animation review
- GIF preview is automatically provided alongside the MP4 download link

### Changed
- Simplified to Skills + Commands + Scripts (no MCP server)
- Single command `/video` with subcommands (create, preview, render, templates)
- Single skill `video-creator` covers the full workflow
- Render flow: generate component → render MP4 → auto-generate GIF preview → deliver both
- ffmpeg is now a required dependency (needed for GIF conversion)

## [2.1.0] - 2026-03-18

### Added
- 3D scene preview mode with interactive orbit controls (rotate, zoom, pan)
- Toggle button to switch between 2D flat view and 3D floating cinema screen
- Pure Three.js integration (no R3F dependency) for React 19 compatibility
- Floating screen plane with media texture, edge outline, ground plane, and lighting
- Video playback on 3D screen via VideoTexture
- Dark mode support for 3D scene background
- IntersectionObserver pauses Three.js render loop when offscreen
- ResizeObserver for responsive 3D canvas sizing

## [2.0.0] - 2026-03-18

### Added
- Interactive MCP App for video preview with playback controls and composition metadata
- MCP server (`sabai-remotion`) with tools: `preview_video`, `render_preview`, `read_media_chunk`, `get_composition_info`, `check_project_status`
- Media resource endpoints for binary preview delivery
- Chunked transfer support for large MP4 files
- One-click re-render buttons (Still Frame, GIF Preview, MP4 Video) in the MCP App
- Dark mode support with Sabai System branding
- Intersection observer to auto-pause video when scrolled offscreen
- "Ask Claude to Refine" button in the MCP App

### Changed
- Updated SKILL.md to call `preview_video` after each render step
- Updated video.md to document MCP App preview functionality

## [1.0.0] - 2026-03-16

### Added
- Initial `sabai-remotion` plugin with Remotion-focused commands for briefs, storyboards, scene design, and render planning.
- Skills for converting rough video ideas into production-ready Remotion handoff documents.
