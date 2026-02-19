# Sabai Claude Marketplace

Public marketplace for Claude plugins by [Sabai System](https://sabaisystem.com).

## Available Plugins

| Plugin | Description | Type | Version | Status | Updated |
|--------|-------------|------|---------|--------|---------|
| [sabai-sudoku](plugins/sabai-sudoku) | Interactive Sudoku game with smart hints | MCP App | 1.0.0 | Active | 2026-02-16 |
| [sabai-linear](plugins/sabai-linear) | Product Manager assistant with Linear integration | Skills + Commands | 1.0.0 | Active | 2026-02-16 |
| [sabai-attio](plugins/sabai-attio) | CRM assistant with Attio integration | Skills + Commands | 1.0.0 | Active | 2026-02-16 |
| [sabai-conversion](plugins/sabai-conversion) | Smart currency and timezone converter with preferences | Skills | 1.0.0 | Active | 2026-02-16 |
| [sabai-notion](plugins/sabai-notion) | Documentation workflow with Notion integration | MCP + Skills + Commands | 1.0.0 | Active | 2026-02-16 |
| [sabai-gmail](plugins/sabai-gmail) | Gmail assistant with smart draft generation and inbox management | Skills + Commands | 1.4.0 | Active | 2026-02-20 |
| [sabai-calendar](plugins/sabai-calendar) | Calendar assistant with Google Calendar integration | Skills + Commands | 1.0.0 | Active | 2026-02-16 |
| [sabai-granola](plugins/sabai-granola) | Meeting intelligence with Granola for summaries and coaching | MCP + Commands | 1.2.0 | Active | 2026-02-17 |
| [sabai-sabai](plugins/sabai-sabai) | Relax with chill Thai vibes when you need a break | MCP App + Command | 1.0.0 | Active | 2026-02-16 |
| [sabai-tella](plugins/sabai-tella) | Tella video management and content planning | MCP + Commands | 1.0.0 | Active | 2026-02-16 |
| [sabai-harvest](plugins/sabai-harvest) | Efficient Harvest time tracking for employees/contractors | Skills + Commands | 1.0.0 | Active | 2026-02-16 |
| [sabai-discord](plugins/sabai-discord) | Discord assistant for server management and messaging | Skills + Commands | 1.0.0 | Active | 2026-02-16 |
| [sabai-slack](plugins/sabai-slack) | Full-featured Slack integration for messaging and search | MCP + Skills + Commands | 1.0.0 | Active | 2026-02-16 |
| [sabai-recall](plugins/sabai-recall) | Meeting bot automation with Recall.ai for recording and transcription | MCP App + Commands | 1.4.0 | Active | 2026-02-16 |

**Status:** Active = Stable and maintained | Beta = In development | Deprecated = No longer maintained

## Installation

### Claude for Work (Recommended)

The easiest way to install plugins is through [Claude for Work](https://claude.ai/work). This allows your entire team to access and manage plugins.

#### Adding the Marketplace

1. Open [Claude for Work](https://claude.ai/work) and sign in as an Admin
2. Navigate to **Settings** → **Plugins**
3. Under "Plugin Marketplaces", click **Add marketplace**
4. Select **GitHub** as the source
5. Enter the repository: `sabaisystem/sabai-claude-marketplace`
6. Click **Add marketplace**

#### Installing Plugins

Once the marketplace is added:

1. Go to **Settings** → **Plugins**
2. Browse available plugins from the Sabai System marketplace
3. Click **Install** on any plugin you want to enable
4. Configure plugin settings if required (API keys, preferences, etc.)
5. The plugin is now available to all users in your workspace

> **Note:** Some plugins require MCP servers or external API connections. Check each plugin's README for specific setup requirements.

### Claude Code CLI

Add the marketplace and install plugins via CLI:

```bash
claude plugin marketplace add sabaisystem/sabai-claude-marketplace
claude plugin install sabai-sudoku@sabai-claude-marketplace
```

### Manual Installation (Claude Desktop)

For Claude Desktop or manual setup:

1. Clone this repository:
   ```bash
   git clone https://github.com/sabaisystem/sabai-claude-marketplace.git
   ```

2. Navigate to the plugin and install dependencies:
   ```bash
   cd sabai-claude-marketplace/plugins/sabai-sudoku/mcp
   npm install
   ```

3. Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "sabai-sudoku": {
         "command": "bash",
         "args": ["/path/to/sabai-claude-marketplace/plugins/sabai-sudoku/mcp/startup.sh"]
       }
     }
   }
   ```

4. Restart Claude Desktop

## Plugin Structure

Each plugin follows this structure:

```
plugins/
  plugin-name/
    .claude-plugin/
      plugin.json       # Plugin manifest
    mcp/                # MCP server (optional)
      server.ts         # Server implementation
      startup.sh        # Startup script
      package.json      # Dependencies
    skills/             # Skills (optional)
    commands/           # Slash commands (optional)
    README.md           # Plugin documentation
```

## Project Management

This repository is tracked in [Linear](https://linear.app/sabaisystem) under the **Sabai Claude Marketplace** team. Each plugin has a corresponding project for issue tracking.

- **Report bugs or request features**: Create an issue in the appropriate plugin project
- **General issues**: Use the "Sabai Plugins" project for cross-plugin concerns
- **Workflow**: Triage → Backlog → Todo → In Progress → In Review → Done

### Developer Commands

When working on this repo with Claude Code:

- `/todo <plugin> <description>` - Create a ticket for a plugin
- `/work-on <ticket-id>` - Work on a specific ticket (e.g., `/work-on SCM-27`)
- `/work-on <plugin>` - List and work on all tickets for a plugin

## Contributing

We welcome contributions! To add a plugin:

1. Fork this repository
2. Create your plugin following the structure above
3. Add a `plugin.json` manifest
4. Test your plugin locally
5. Submit a pull request

### Plugin Manifest

Every plugin must have a `.claude-plugin/plugin.json`:

```json
{
  "name": "plugin-name",
  "description": "What your plugin does",
  "version": "1.0.0",
  "author": "Your Name",
  "mcpServers": {
    "server-name": {
      "command": "bash",
      "args": ["${CLAUDE_PLUGIN_ROOT}/mcp/startup.sh"]
    }
  }
}
```

## License

MIT License - see individual plugins for their specific licenses.

## Links

- [Sabai System](https://sabaisystem.com)
- [Report Issues](https://github.com/sabaisystem/sabai-claude-marketplace/issues)
