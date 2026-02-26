# /video

Quick video generation from natural language.

## Usage

```
/video <description>
```

## Examples

```
/video create a social clip with title "Launch Day" in orange
/video render a tutorial showing 3 steps
/video make a data visualization with sales data
/video text animation saying "Welcome" with typewriter effect
```

## Behavior

1. Parse the user's description to identify:
   - Template type (social-clip, tutorial, data-viz, text-animation)
   - Custom properties (title, colors, text, data)
   - Output preferences (format, duration)

2. Show a preview frame using `preview_frame` tool

3. Ask for confirmation before rendering

4. Render the video using `render_video` tool

## Template Selection

| Keywords | Template |
|----------|----------|
| social, clip, tiktok, reel, short, vertical | social-clip |
| tutorial, steps, how-to, guide | tutorial |
| data, chart, visualization, graph | data-viz |
| text, animation, typewriter, reveal | text-animation |

## Default Output

- Format: MP4 (h264)
- Location: User's Downloads folder or specified path
