# Sabai Granola

**Meeting intelligence powered by Granola for search, summaries, smart analysis, and communication coaching.**

| Field | Value |
|-------|-------|
| Type | MCP + Commands |
| Version | 1.2.0 |
| Status | Active |
| Command | `/sabai-granola:search`, `/sabai-granola:summary`, `/sabai-granola:coach` |
| Repo | `plugins/sabai-granola` |

---

## Overview

A meeting intelligence plugin powered by Granola enabling users to search meeting history, generate summaries, ask questions about past meetings, and receive coaching on communication patterns. Supports smart analysis by meeting type (discovery calls, interviews, standups, 1:1s, retrospectives, steering committees), MEDDIC qualification for sales, SPIN Selling evaluation, Radical Candor coaching, decision-making velocity tracking, and meeting effectiveness analysis.

## Key Features

- Search across all meeting history
- Smart summaries of one or multiple meetings
- Ask questions about meeting content
- Smart analysis based on meeting type
- Holistic coaching on work patterns and communication
- Action item tracking
- Follow-up email generation

## Use Cases

- "Search for budget discussions with Acme"
- "Summarize this week's customer calls"
- "What did John say about the timeline?"
- "Coach me on my communication this week"
- "What action items do I have?"

## Commands

- `/sabai-granola:search` - Search meeting history
- `/sabai-granola:summary` - Summarize meetings
- `/sabai-granola:ask` - Ask questions about meetings
- `/sabai-granola:analyze` - Smart analysis by meeting type
- `/sabai-granola:coach` - Communication and work coaching
- `/sabai-granola:next` - List upcoming meetings
- `/sabai-granola:actions` - Track action items
- `/sabai-granola:followup` - Generate follow-up emails

## Configuration

### MCP Server Setup

```bash
claude mcp add granola --transport http https://mcp.granola.ai/mcp
```

## Authentication

OAuth via Granola. Browser opens for sign-in on first use.

## Dependencies

- **Required**: Granola account with MCP enabled

## Limitations

- Requires Granola subscription
- Meeting data availability depends on Granola capture

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-granola)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-granola/CHANGELOG.md)
