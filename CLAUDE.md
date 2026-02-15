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

## Documentation Requirements (IMPORTANT)

When creating or updating any plugin, ALWAYS ensure:

1. **Plugin README.md** - Must accurately describe:
   - What the plugin does
   - Installation instructions
   - Usage examples
   - Any configuration required

2. **Main README.md** - Must list the plugin in the Available Plugins table:
   - Plugin name with link
   - Short description
   - Type (MCP App, Skills, Commands, etc.)

3. **Before committing**, verify both READMEs are up to date. If you modified a plugin's functionality, update its documentation to match.

## Commits

Follow conventional commit format:
- `feat: Add new plugin`
- `fix: Fix bug in plugin`
- `docs: Update documentation`

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
