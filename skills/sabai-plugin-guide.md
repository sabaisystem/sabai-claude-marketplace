# Sabai Plugin Development Guide

This skill provides guidelines for creating plugins in the Sabai Claude Marketplace repository.

## When to Use

Use this skill when:
- Creating a new plugin for this marketplace
- Building MCP Apps with UI
- Structuring skills and commands
- Adding Sabai System brand attribution

## Plugin Structure

Every plugin MUST follow this structure:

```
plugins/
  plugin-name/
    .claude-plugin/
      plugin.json       # Required: Plugin manifest
    mcp/                # Optional: MCP server
      server.ts         # Server implementation
      startup.sh        # Startup script (required for MCP)
      package.json      # Dependencies
      ui/               # UI source (for MCP Apps)
      dist/             # Built UI (commit this)
    skills/             # Optional: Skill files (.md)
    commands/           # Optional: Slash commands (.md)
    README.md           # Required: Plugin documentation
```

## Plugin Manifest (plugin.json)

```json
{
  "name": "plugin-name",
  "description": "What your plugin does",
  "version": "1.0.0",
  "author": "Sabai System",
  "mcp": {
    "command": "bash",
    "args": ["${CLAUDE_PLUGIN_ROOT}/mcp/startup.sh"]
  },
  "commands": ["commands/command-name.md"],
  "skills": ["skills/skill-name.md"]
}
```

## MCP Apps (Interactive UIs)

### Required Setup

MCP Apps must use the `@modelcontextprotocol/ext-apps` SDK:

```typescript
import { useApp, useHostStyles } from "@modelcontextprotocol/ext-apps/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function MyApp() {
  const { app, error } = useApp({
    appInfo: { name: "App Name", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.ontoolresult = async (result) => {
        // Handle tool results
      };
      app.onerror = console.error;
    },
  });

  useHostStyles(app);

  if (error) return <div>Error: {error.message}</div>;
  if (!app) return <div>Connecting...</div>;

  return <main>Your UI here</main>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MyApp />
  </StrictMode>
);
```

### MCP App Limitations

- **No external iframes**: YouTube, Vimeo, Google Drive embeds are blocked
- **No external links**: `<a target="_blank">` and `window.open()` are blocked
- **Large assets**: Keep total HTML under 2MB for reliable rendering
- **Videos**: Must be base64 encoded and small (<500KB compressed)

### Build Configuration

Use vite with single-file output:

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "ui",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [react(), viteSingleFile()],
});
```

## Sabai System Brand Attribution

### Brand Colors

```css
:root {
  --sabai-orange: #f26a2c;
  --sabai-orange-dark: #e55310;
  --sabai-teal: #013b2d;
  --sabai-cream: #fef2ec;
}
```

### Logo SVG

Use this SVG for the Sabai System logo:

```jsx
<svg width="24" height="24" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sabaiGradient" x1="125" y1="2" x2="125" y2="248" gradientUnits="userSpaceOnUse">
      <stop offset=".458" stopColor="#F26A2C"/>
      <stop offset=".77" stopColor="#E95A19"/>
      <stop offset="1" stopColor="#E55310"/>
    </linearGradient>
  </defs>
  <circle cx="125" cy="125" r="124" fill="url(#sabaiGradient)"/>
  <path fill="#fff" d="M213.7 162l-9.5-31.7c-.1-.3-.2-.7-.4-1-1.6-3.2-5.5-4.6-8.8-3L165.3 141c-4.7 2.4-1.9 9.4 3.2 8l16-4.8c-.3.5-.6 1-.8 1.6C173.1 178 136.5 198 104 186.4c-10.6-3.6-20.2-10.2-28.3-18.4-2-2.1-5.3-2.2-7.5-.3-2.2 2-2.4 5.4-.4 7.6 4.4 4.8 9.2 9.2 14.6 13.1 41.2 30.2 98.7 9.9 116.4-36.9 3.5 7 6.8 13.7 6.8 13.7C208.1 169.8 215.1 167.1 213.7 162z"/>
</svg>
```

### Footer Attribution in MCP Apps

Always include a footer with Sabai System attribution in MCP Apps:

```jsx
// Bottom-right corner attribution
<div style={{
  position: "absolute",
  bottom: "20px",
  right: "20px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  opacity: 0.8,
}}>
  <span style={{ fontSize: "0.85rem", color: "inherit" }}>Made by</span>
  <SabaiLogo width={24} height={24} />
  <span style={{ fontSize: "0.85rem", color: "#f26a2c", fontWeight: 600 }}>
    Sabai System
  </span>
</div>
```

### Color Scheme Support

Support both light and dark modes:

```jsx
// In HTML head
<meta name="color-scheme" content="light dark">

// In CSS
@media (prefers-color-scheme: light) {
  body {
    background: var(--sabai-cream);
    color: var(--sabai-teal);
  }
}

@media (prefers-color-scheme: dark) {
  body {
    background: var(--sabai-teal);
    color: var(--sabai-cream);
  }
}
```

## Skill File Structure

Skills are markdown files that provide context and instructions:

```markdown
# Skill Name

Description of what the skill does.

## When to Use

- Trigger condition 1
- Trigger condition 2

## Instructions

Step-by-step instructions for Claude to follow.

## Examples

Show example inputs and outputs.
```

## Command File Structure

Commands are slash-invocable skills:

```markdown
# /command-name

Short description of the command.

## When to use

When the user wants to [action].

## Instructions

1. Step one
2. Step two
3. Step three
```

## Startup Script Template

Always use a startup.sh for MCP servers:

```bash
#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..." >&2
  npm install >&2
fi

# Check if dist folder exists (for MCP Apps)
if [ ! -d "dist" ]; then
  echo "Building..." >&2
  npm run build >&2
fi

# Run the server
exec npx tsx server.ts
```

Make it executable: `chmod +x startup.sh`

## Security: No Sensitive Data (CRITICAL)

This is a PUBLIC repository. NEVER include:
- API keys, tokens, or secrets
- Personal data (names, emails, addresses, phone numbers)
- Credentials or passwords
- Private URLs or internal endpoints
- Customer or user data
- Proprietary business information
- Environment files (.env)

**Before every commit**, search your changes for:
- Hardcoded strings that look like keys/tokens
- Email addresses or personal identifiers
- URLs containing auth tokens or private paths
- Any data that shouldn't be public

## Checklist Before Committing

- [ ] **NO SENSITIVE DATA** in any file (code, config, docs, comments)
- [ ] Plugin follows the standard structure
- [ ] `plugin.json` manifest is complete
- [ ] Plugin `README.md` documents usage accurately
- [ ] Main `README.md` lists the plugin in the table
- [ ] MCP server has `startup.sh`
- [ ] Built `dist/` folder is committed (for MCP Apps)
- [ ] Brand colors used appropriately
- [ ] Sabai System attribution in footer (for MCP Apps)
- [ ] Light/dark mode supported
