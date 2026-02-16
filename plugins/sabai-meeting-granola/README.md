# Sabai Meeting Granola

Meeting intelligence plugin powered by [Granola](https://granola.ai). Search meetings, get summaries, run smart analysis by meeting type, and receive holistic coaching on your work patterns and communication.

## Prerequisites

This plugin requires the **Granola MCP** server to be configured:

```bash
claude mcp add granola --transport http https://mcp.granola.ai/mcp
```

You'll need a [Granola](https://granola.ai) account with MCP enabled.

## Commands

| Command | Description |
|---------|-------------|
| `/sabai-meeting-granola:connect` | Connect and authenticate with Granola |
| `/sabai-meeting-granola:search` | Search across your meeting history |
| `/sabai-meeting-granola:summary` | Summarize one or multiple meetings |
| `/sabai-meeting-granola:ask` | Ask questions about your meetings |
| `/sabai-meeting-granola:analyze` | Smart analysis based on meeting type |
| `/sabai-meeting-granola:coach` | Holistic coaching on work patterns |
| `/sabai-meeting-granola:next` | List upcoming meetings with context |
| `/sabai-meeting-granola:actions` | Track action items from meetings |
| `/sabai-meeting-granola:followup` | Generate follow-up emails |

## Usage Examples

### Search Meetings

```
/sabai-meeting-granola:search budget discussions with Acme
/sabai-meeting-granola:search interviews last month
/sabai-meeting-granola:search all meetings with John
```

### Summarize Meetings

```
/sabai-meeting-granola:summary Discovery call with Acme
/sabai-meeting-granola:summary all meetings yesterday
/sabai-meeting-granola:summary this week's customer calls
```

### Ask Questions

```
/sabai-meeting-granola:ask What did John say about the budget?
/sabai-meeting-granola:ask When did we last discuss the API redesign?
/sabai-meeting-granola:ask What objections has Acme raised?
/sabai-meeting-granola:ask What did I commit to this week?
```

### Upcoming Meetings

```
/sabai-meeting-granola:next
/sabai-meeting-granola:next today
/sabai-meeting-granola:next tomorrow
/sabai-meeting-granola:next this week
```

Shows upcoming meetings with context from previous interactions, open items, and prep suggestions.

### Action Items

```
/sabai-meeting-granola:actions
/sabai-meeting-granola:actions this week
/sabai-meeting-granola:actions my items
/sabai-meeting-granola:actions overdue
/sabai-meeting-granola:actions for John
```

Extracts and tracks all commitments, tasks, and follow-ups from your meetings. Shows what's overdue, due soon, delegated, and completed.

### Follow-up Emails

```
/sabai-meeting-granola:followup Discovery call with Acme
/sabai-meeting-granola:followup last meeting with John
/sabai-meeting-granola:followup Interview with Sarah
```

Generates professional follow-up emails based on meeting content. Auto-detects meeting type and adjusts tone (sales, interview, internal, executive). Includes action items, next steps, and suggested attachments.

### Smart Analysis

The `/analyze` command auto-detects meeting type and runs the appropriate analysis:

```
/sabai-meeting-granola:analyze Discovery call with Acme Corp
/sabai-meeting-granola:analyze Interview with Sarah for PM role
/sabai-meeting-granola:analyze Today's standup
/sabai-meeting-granola:analyze Steering committee Q1
```

#### Supported Meeting Types

| Type | Analysis Includes |
|------|------------------|
| **Discovery/Sales** | MEDDIC qualification, budget signals, objections, deal risk |
| **Interview** | Strengths, red flags, skills assessment, hiring recommendation |
| **Standup** | Team status, blockers, action items |
| **Steerco** | Executive report, decisions, risks, milestones |
| **1:1** | Topics, career development, follow-ups, relationship health |
| **Retrospective** | What worked, improvements, action items |

### Executive Coaching

The `/coach` command provides holistic analysis of your work patterns:

```
/sabai-meeting-granola:coach this week
/sabai-meeting-granola:coach last month
/sabai-meeting-granola:coach my sales calls
/sabai-meeting-granola:coach communication
/sabai-meeting-granola:coach time management
```

#### Coaching Dimensions

**Work Mode Assessment**
- Maker vs Manager schedule analysis
- Meeting load and deep work time
- Focus block identification

**Meeting Effectiveness**
- Meeting ROI by type
- Preparation quality
- Meetings to reconsider or decline

**Communication Analysis**
- Radical Candor quadrant assessment
- Talk/listen ratio by context
- Question quality (open vs closed)
- Language patterns (hedging, filler words, negative framing)
- Specific alternatives for improvement

**Customer & Stakeholder Handling**
- SPIN Selling question analysis
- Objection handling patterns
- Follow-up behavior

**Decision Making**
- Type 1 vs Type 2 decision recognition
- Decision velocity
- Delegation patterns

**Energy & Presence**
- Time-of-day patterns
- Fatigue signals
- High-energy moments

## Methodologies

The coaching is informed by established frameworks:

- **Radical Candor** (Kim Scott) - Communication quadrants
- **SPIN Selling** (Neil Rackham) - Question quality
- **Challenger Sale** - Customer engagement
- **MEDDIC** - Sales qualification
- **Deep Work** (Cal Newport) - Focus and productivity
- **Maker's Schedule** (Paul Graham) - Time management
- **The Coaching Habit** (Michael Bungay Stanier) - Coaching questions
- **Type 1/Type 2 Decisions** (Jeff Bezos) - Decision making

## Installation

1. Clone or download this plugin
2. Add to your Claude Code plugins directory
3. Ensure Granola MCP is configured

## About

Built by [Sabai System](https://sabaisystem.com) for the Claude Marketplace.

## License

MIT
