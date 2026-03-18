# Changelog

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
