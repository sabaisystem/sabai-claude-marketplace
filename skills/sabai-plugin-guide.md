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
  "author": {
    "name": "Sabai Team"
  },
  "keywords": ["relevant", "keywords"],
  "skills": "./skills/",
  "commands": "./commands/",
  "mcpServers": {
    "plugin-name": {
      "command": "bash",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp/startup.sh"]
    }
  }
}
```

**Important format rules:**
- `author` must be an object with `name` property
- `skills` and `commands` are directory paths (strings), not arrays
- `mcpServers` is at root level with server name as key (not `mcp` or `dependencies.mcpServers`)

## Marketplace Registration (Required)

Every plugin must be added to `.claude-plugin/marketplace.json` for Claude for Work compatibility:

```json
{
  "name": "plugin-name",
  "source": "./plugins/plugin-name",
  "description": "What your plugin does."
}
```

**Important:** Only use `name`, `source`, and `description` fields. Do not add `id`, `version`, `category`, or `tags` - the Claude for Work format is simpler than Claude Code.

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

## OAuth Auto-Connect for Remote MCP Servers

For plugins that use remote MCP servers with OAuth (like Granola, Google APIs), implement auto-authentication on first load. This provides a seamless user experience where the browser opens automatically for sign-in.

### Using mcp-remote with Auto-Auth

For HTTP-based MCP servers that require OAuth, use `mcp-remote` with a startup script that checks for existing authentication:

```bash
#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# mcp-remote stores auth in ~/.mcp-auth
MCP_AUTH_DIR="$HOME/.mcp-auth"
REMOTE_URL="https://api.example.com/mcp"

# Check if authenticated (look for cached tokens)
check_auth() {
  if [ -d "$MCP_AUTH_DIR" ]; then
    # Check for service-specific tokens
    if ls "$MCP_AUTH_DIR"/*example* 2>/dev/null | grep -q .; then
      return 0
    fi
  fi
  return 1
}

# If not authenticated, run OAuth flow first
if ! check_auth; then
  echo "🔐 No authentication found. Starting OAuth flow..." >&2
  echo "A browser window will open for you to sign in." >&2

  # mcp-remote-client triggers the OAuth flow
  npx -y mcp-remote@latest mcp-remote-client "$REMOTE_URL" --auth-timeout 300 2>&1 | head -20 >&2

  echo "✅ Authentication complete!" >&2
fi

# Start the MCP server
exec npx -y mcp-remote@latest "$REMOTE_URL"
```

### Custom OAuth Flow (Google APIs)

For Google APIs, implement the OAuth flow directly in your MCP server. Check for existing token on startup, and if missing, open browser for OAuth:

```javascript
async function initAuth() {
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  const { client_id, client_secret } = credentials.installed || credentials.web;

  auth = new google.auth.OAuth2(client_id, client_secret, "http://localhost:3000/oauth2callback");

  // Check for existing token
  if (!fs.existsSync(tokenPath)) {
    // No token - run OAuth flow
    await runAuthFlow();
  }

  const token = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
  auth.setCredentials(token);
}

async function runAuthFlow() {
  console.error("🔐 No token found. Starting OAuth flow...");

  const authUrl = auth.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  // Open browser
  const { exec } = await import("child_process");
  exec(`open "${authUrl}"`);

  // Start local server for callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, "http://localhost:3000");
      if (url.pathname === "/oauth2callback") {
        const code = url.searchParams.get("code");
        const { tokens } = await auth.getToken(code);
        fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>✅ Authentication Successful!</h1><p>You can close this window.</p>");

        server.close();
        resolve(tokens);
      }
    });

    server.listen(3000);
    setTimeout(() => { server.close(); reject(new Error("Timeout")); }, 300000);
  });
}
```

### Key Points

1. **Check for existing auth** before starting the MCP server
2. **Open browser automatically** - don't require manual steps
3. **Log to stderr** (not stdout) so MCP protocol isn't corrupted
4. **Set reasonable timeout** (5 minutes) for OAuth completion
5. **Save tokens** for subsequent sessions

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

## Automatic Release Management

When modifying plugin code, you MUST automatically update:

1. **CHANGELOG.md** - Add new version entry with changes
2. **plugin.json** - Bump version number
3. **Main README.md** - Update version and date in table

### Changelog Format

```markdown
## [1.1.0] - 2026-02-17

### Added
- New feature description

### Changed
- What was modified

### Fixed
- Bug that was fixed

### Removed
- What was removed
```

### Version Bumping

- **Patch** (1.0.x): Bug fixes, small tweaks
- **Minor** (1.x.0): New features, non-breaking changes
- **Major** (x.0.0): Breaking changes

## Checklist Before Committing

- [ ] **NO SENSITIVE DATA** in any file (code, config, docs, comments)
- [ ] Plugin follows the standard structure
- [ ] `plugin.json` manifest is complete (version bumped if code changed)
- [ ] `CHANGELOG.md` updated with new version entry
- [ ] Plugin added to `.claude-plugin/marketplace.json`
- [ ] Plugin `README.md` documents usage accurately
- [ ] Main `README.md` table updated (version + date)
- [ ] MCP server has `startup.sh`
- [ ] Built `dist/` folder is committed (for MCP Apps)
- [ ] Brand colors used appropriately
- [ ] Sabai System attribution in footer (for MCP Apps)
- [ ] Light/dark mode supported
