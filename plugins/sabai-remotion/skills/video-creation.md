# Video Creation Skill

Create videos programmatically using Remotion templates.

## Capabilities

- Generate preview frames from video templates
- Render full videos in MP4, WebM, or GIF format
- Customize video properties (text, colors, data)
- Support multiple aspect ratios (9:16, 16:9)

## Available Templates

### Social Clip (9:16)
Vertical video for TikTok, Instagram Reels, YouTube Shorts.

**Properties:**
- `title`: Main headline text
- `subtitle`: Secondary text
- `backgroundColor`: Background color (hex)
- `textColor`: Text color (hex)

### Tutorial (16:9)
Horizontal video for YouTube, presentations, demos.

**Properties:**
- `title`: Tutorial title
- `steps`: Array of step descriptions
- `backgroundColor`: Background color (hex)
- `textColor`: Text color (hex)

### Data Visualization (16:9)
Animated charts and data visualizations.

**Properties:**
- `title`: Chart title
- `data`: Array of { label, value } objects
- `chartColor`: Bar/chart color (hex)
- `backgroundColor`: Background color (hex)

### Text Animation (16:9)
Animated text reveals and effects.

**Properties:**
- `text`: Text to animate
- `fontSize`: Font size in pixels
- `fontFamily`: Font family name
- `color`: Text color (hex)
- `backgroundColor`: Background color (hex)
- `effect`: Animation effect (fade-in, slide-up, scale, typewriter)

## Workflow

1. **List templates**: Use `list_templates` to see available options
2. **Preview**: Use `preview_frame` to generate a single frame preview
3. **Iterate**: Adjust properties and preview again
4. **Render**: Use `render_video` to create the final video

## Example Interactions

**User:** "Create a social clip announcing our new product"
**Assistant:**
1. Call `preview_frame` with social-clip template
2. Show preview and ask for adjustments
3. Call `render_video` when user approves

**User:** "Make a data visualization of monthly sales"
**Assistant:**
1. Ask for the sales data or help format it
2. Call `preview_frame` with data-viz template
3. Render when approved

**User:** "Generate a text animation saying 'Welcome to 2026'"
**Assistant:**
1. Call `preview_frame` with text-animation template
2. Offer effect options (fade-in, typewriter, etc.)
3. Render the final video

## Output Formats

| Codec | Extension | Best For |
|-------|-----------|----------|
| h264 | .mp4 | Universal compatibility |
| vp9 | .webm | Web playback |
| gif | .gif | Social media, previews |

## Sabai System Colors

For brand consistency, use these colors:
- Orange: `#f26a2c`
- Orange Dark: `#e55310`
- Teal: `#013b2d`
- Cream: `#fef2ec`
