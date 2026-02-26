# Claude Code Rules for Sabai Claude Marketplace

## Repository Purpose

This is a public marketplace for Claude plugins by Sabai System. All plugins here are open source and publicly available.

## Developer Guide

For comprehensive plugin development guidelines, brand attribution, and MCP App setup, see: `skills/sabai-plugin-guide.md`

## Plugin Structure

Every plugin MUST follow this structure:

```
plugins/
  plugin-name/
    .claude-plugin/
      plugin.json       # Required: Plugin manifest
    mcp/                # Optional: MCP server
    skills/             # Optional: Skill files (.md)
    commands/           # Optional: Slash commands (.md)
    README.md           # Required: Plugin documentation
```

## Creating New Plugins

When creating a new plugin:

1. **Create the folder structure** under `plugins/`
2. **Add plugin.json** with name, description, and configuration
3. **Add README.md** documenting what the plugin does and how to use it
4. **Build and test** before committing
5. **Update the main README.md** to list the new plugin
6. **Add to marketplace.json** (see below)

## Marketplace Configuration

The marketplace is defined in `.claude-plugin/marketplace.json`. When adding a new plugin, add an entry:

```json
{
  "name": "sabai-claude-marketplace",
  "owner": {
    "name": "Sabai System"
  },
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugins/plugin-name",
      "description": "What your plugin does."
    }
  ]
}
```

**Important:** This format is required for Claude for Work compatibility. Do not add extra fields like `id`, `version`, `category`, or `tags` - only `name`, `source`, and `description`.

## MCP App Plugins

For plugins with MCP Apps (interactive UIs):

1. Use the `@modelcontextprotocol/ext-apps` SDK
2. Bundle the UI into a single HTML file using `vite-plugin-singlefile`
3. Include the `dist/` folder in git (users shouldn't need to build)
4. Use `tsx` as devDependency for running TypeScript servers

## Sabai System Branding

When appropriate, use Sabai System brand colors:
- Orange: `#f26a2c`
- Orange Dark: `#e55310`
- Teal: `#013b2d`
- Cream: `#fef2ec`

Include a footer link to sabaisystem.com when building MCP Apps.

## Code Quality

- Use TypeScript for all code
- Include proper error handling
- Support both light and dark modes for UIs
- Test plugins before committing
- Keep dependencies minimal

## Testing MCP Plugins

### Marketplace Deployment (Production)

When deploying through the marketplace, plugins work normally:
- `startup.sh` runs `npm install` to install dependencies
- MCP server starts with `node index.js`
- No bundling required

### Local Testing with Zip Import (Claude for Work)

When testing plugins by importing a zip file into Claude for Work, **bundling is required** because:
- Claude for Work's sandboxed environment cannot run `npm install`
- Dependencies must be pre-bundled into a single file

### How to Bundle for Testing

1. **Add esbuild as devDependency**:
   ```bash
   cd plugins/plugin-name/mcp
   npm install esbuild --save-dev
   ```

2. **Bundle the server**:
   ```bash
   npx esbuild index.js --bundle --platform=node --target=node18 --outfile=dist/server.cjs --format=cjs --minify
   ```

3. **Update startup.sh for bundled mode**:
   ```bash
   # For testing (bundled)
   exec node dist/server.cjs

   # For production (normal)
   exec node index.js
   ```

4. **Create zip without node_modules**:
   ```bash
   cd plugins/plugin-name
   zip -r ~/Desktop/plugin-name.zip . -x "mcp/node_modules/*"
   ```

### When to Bundle

| Scenario | Bundle Required? |
|----------|------------------|
| Marketplace deployment | No |
| Claude Code CLI | No |
| Claude for Work zip import | **Yes** |
| Claude Desktop manual config | No |

### Important Notes

- Keep `esbuild` as devDependency for testing support
- The `dist/` folder with bundled server is only needed for zip testing
- Don't commit `dist/server.cjs` to git unless specifically needed
- Include credentials and token in test zips (but never commit them)

## Automatic Release Management (CRITICAL)

When you modify any plugin code (not just docs), you MUST automatically:

1. **Update CHANGELOG.md** in the plugin folder:
   - Add a new version section at the top (below the header)
   - Use today's date
   - Categorize changes: Added, Changed, Fixed, Removed
   - Keep entries concise but descriptive

2. **Bump version in plugin.json**:
   - Patch (1.0.x): Bug fixes, small changes
   - Minor (1.x.0): New features, non-breaking changes
   - Major (x.0.0): Breaking changes

3. **Update README.md table**:
   - Update the Version column
   - Update the Updated column with today's date

### Changelog Format

```markdown
## [1.1.0] - 2026-02-17

### Added
- New feature description

### Changed
- What was modified

### Fixed
- Bug that was fixed
```

### Example Workflow

When fixing a bug in sabai-sudoku:
1. Make the code fix
2. Add to `plugins/sabai-sudoku/CHANGELOG.md`:
   ```
   ## [1.0.1] - 2026-02-17

   ### Fixed
   - Description of the bug fix
   ```
3. Update `plugins/sabai-sudoku/.claude-plugin/plugin.json` version to "1.0.1"
4. Update main `README.md` table: version "1.0.1", updated "2026-02-17"

## Documentation Requirements (IMPORTANT)

Plugin README.md and Linear project descriptions MUST stay in sync using the same template.

### Plugin Description Template

Use this template for both `plugins/plugin-name/README.md` and the Linear project description:

```markdown
# [Plugin Name]

**[One-line description]**

| Field | Value |
|-------|-------|
| Type | MCP App / Skills / Commands |
| Version | 1.0.0 |
| Status | Backlog / In Progress / Active |
| Command | `/command-name` |
| Repo | `plugins/plugin-name` |

---

## Overview

[2-3 sentences describing what the plugin does and its main use case]

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Use Cases

- "Help me log 2 hours on Project X"
- "Show my calendar for tomorrow"

## MCP Tools

- `tool_name` - Description

## Commands

- `/command` - What it does

## Hooks

| Event | Matcher | Command | Description |
|-------|---------|---------|-------------|
| PostToolCall | `mcp__x__tool` | `command` | Why it's needed |

## Configuration

### Environment Variables
- `API_KEY` - Description

### Settings
- `~/.config/plugin/settings.json` - What it stores

## Authentication

- OAuth / API Key / None
- Setup steps if needed

## Permissions

Required Claude Code permissions:
- `Bash(command:*)` - Why needed
- `WebFetch(domain:api.example.com)` - Why needed

## Dependencies

- **Required**: What must be installed/configured
- **Optional**: Nice-to-have integrations

## Limitations

- Known issue 1
- Not yet supported: feature X

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/plugin-name)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/plugin-name/CHANGELOG.md)
```

**Notes:**
- Omit sections that don't apply (e.g., no Hooks section if plugin has no hooks)
- README is the source of truth - update it first, then sync to Linear

### Keeping README and Linear in Sync

**Command:** Use `/sync-linear [plugin-name]` to push README content to Linear project description.

**Git Hook:** A pre-commit hook (via Husky) reminds you to sync when plugin READMEs change.

Setup (one-time):
```bash
npm install
```

The hook automatically runs on commit and shows a reminder if any `plugins/*/README.md` files were modified.

### Checklist

1. **Plugin README.md** - Uses template above
2. **Linear Project** - Synced with `/sync-linear`
3. **Main README.md** - Plugin listed in Available Plugins table

## Commits

Follow conventional commit format:
- `feat: Add new plugin`
- `fix: Fix bug in plugin`
- `docs: Update documentation`

## Ticket-First Workflow (CRITICAL)

**NEVER start working on a plugin without a Linear ticket.**

When asked to implement, fix, or change anything in a plugin:

### Step 1: Check for Existing Ticket

1. Search Linear for an existing ticket matching the request
2. If found, confirm with user: "I found ticket SCM-XX for this. Should I work on it?"

### Step 2: Create Ticket if None Exists

If no ticket exists:
1. **Create the ticket first** using `mcp__linear__create_issue`
2. Include: title, overview, requirements, acceptance criteria
3. **Show the ticket to the user** with the Linear link
4. **Ask for confirmation**: "Is this ticket clear? Would you like to edit it or should I start working?"

### Step 3: Wait for Approval

- If user wants edits → update the ticket, ask again
- If user approves → change status to "In Progress" and start working
- If user says "later" → leave ticket in backlog, don't start

### Step 4: Work on the Ticket

Only after user approval:
1. Update ticket status to "In Progress"
2. Implement the changes following the acceptance criteria
3. Reference the ticket ID in commits (e.g., `feat: Add feature [SCM-28]`)
4. When done, add a comment to the ticket summarizing what was done
5. **When creating a PR, automatically update ticket status to "In Review"**

### Example Flow

```
User: I want the calendar plugin to find meeting slots

Claude: Let me create a ticket for this feature.

[Creates ticket SCM-29: "Smart Meeting Slot Finder" in Sabai Calendar project]

Created: SCM-29 - Smart Meeting Slot Finder
[Open in app](linear://sabaisystem/issue/SCM-29) | [Open in browser](https://linear.app/sabaisystem/issue/SCM-29)

## Overview
Implement a meeting slot finder that analyzes calendar availability...

## Requirements
- [ ] Analyze calendar for free slots
- [ ] Respect working hours
- [ ] Suggest ranked options

Is this ticket clear? Would you like to:
1. Edit the ticket
2. Start working on it
3. Leave it for later

User: 2

Claude: Starting work on SCM-29...
[Updates status to In Progress]
[Begins implementation]
```

### Ticket Links

Always show both app and browser links when displaying tickets:
```
[Open in app](linear://sabaisystem/issue/SCM-XX) | [Open in browser](https://linear.app/sabaisystem/issue/SCM-XX)
```

### Commands

- `/status` - Show current git context and plugin status overview
- `/status <plugin>` - Show detailed status for a specific plugin
- `/todo <plugin> <description>` - Create a ticket and optionally start working
- `/work-on <ticket-id>` - Work on an existing ticket
- `/work-on <plugin>` - List and work on tickets for a plugin

## Linear Project Management

This repository is tracked in Linear under the **Sabai Claude Marketplace** team. Each plugin has a corresponding Linear project for issue tracking.

### Setup

Linear MCP is configured in `.mcp.json` using the hosted endpoint with OAuth:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

On first use, a browser window will open for Linear OAuth authentication.

### Team Structure

- **Team**: Sabai Claude Marketplace
- **Projects**: One per plugin (e.g., "Sabai sudoku", "Sabai calendar")
- **Meta Project**: "Sabai Plugins" for cross-plugin or general issues

### Workflow Statuses

`Triage` → `Backlog` → `Todo` → `In Progress` → `In Review` → `Done`

### Issue Labels

Bug, Feature, Improvement, Documentation, Design, Infrastructure, Security, Marketing, Investigate

### Creating Issues

When creating issues for this repo:

1. **Select the correct project** matching the plugin being worked on
2. **Use appropriate labels** (Bug, Feature, etc.)
3. **Link to relevant code** using file paths or commit references

### Linking Commits to Issues

Reference Linear issues in commit messages:
```
feat: Add new game mode [SCM-123]
fix: Resolve timer bug

Fixes SCM-456
```

## No Sensitive Data (CRITICAL)

This is a PUBLIC repository. NEVER commit:
- API keys, tokens, or secrets
- Personal data (names, emails, addresses, etc.)
- Credentials of any kind
- Private URLs or internal endpoints
- Customer or user data
- Proprietary business information

Before EVERY commit, verify no sensitive data is included in:
- Source code
- Configuration files
- README examples
- Comments or documentation
- Environment files (never commit .env files)
