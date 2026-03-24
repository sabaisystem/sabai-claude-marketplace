---
name: diagram
description: Generate and render Mermaid diagrams from natural language descriptions
---

# /diagram

Generate and render Mermaid diagrams from natural language descriptions.

## Usage

```
/diagram [description]
/diagram [type] [description]
/diagram export
/diagram types
```

## Subcommands

### `/diagram [description]`

Auto-detect the diagram type and render it.

**Behavior:**
1. Read and follow `skills/diagram-creator/SKILL.md` for the full creation workflow
2. Detect the diagram type from signal words in the description
3. Load the corresponding reference file from `skills/diagram-creator/references/`
4. Generate syntactically valid Mermaid code
5. Call `mcp__sabai-diagrams__render_diagram` with the generated code to display it in the visual panel
6. Offer to iterate or export

**Examples:**
```
/diagram User signup flow with email verification
/diagram How our CI/CD pipeline deploys to production
/diagram OAuth2 authentication between client and server
/diagram Order lifecycle from placed to delivered
/diagram Sprint plan for the next two weeks
/diagram Database schema for a blog with users, posts, and comments
```

---

### `/diagram [type] [description]`

Explicitly specify the diagram type. Supported types:

| Type | Keyword |
|---|---|
| Flowchart | `flowchart` |
| Sequence diagram | `sequence` |
| State diagram | `state` |
| Gantt chart | `gantt` |
| ER diagram | `er` |
| Class diagram | `class` |

**Behavior:**
1. Read and follow `skills/diagram-creator/SKILL.md`
2. Use the specified type (skip auto-detection)
3. Load the matching reference file
4. Generate and render via `mcp__sabai-diagrams__render_diagram`

**Examples:**
```
/diagram flowchart Customer support ticket routing
/diagram sequence Payment processing with Stripe API
/diagram state Feature flag lifecycle
/diagram gantt Q2 product roadmap with 4 milestones
/diagram er E-commerce schema with products, orders, and reviews
/diagram class Strategy pattern for notification delivery
```

---

### `/diagram export`

Export the current diagram to FigJam.

**Behavior:**
1. Check that a diagram has been rendered in the current session
   - If not: respond "No diagram to export yet. Use `/diagram [description]` to create one first."
2. Check that the diagram type is supported for FigJam export (flowchart, sequence, state, gantt)
   - If ER or class diagram: respond "ER and class diagrams are not supported by FigJam export. You can screenshot the rendered diagram instead."
3. Call `mcp__claude_ai_Figma__generate_diagram` with the Mermaid code and title
4. Provide the FigJam link to the user

---

### `/diagram types`

List available diagram types with descriptions and signal words.

**Behavior:**
Display this table:

```
Available diagram types:

| Type | Best For | Signal Words |
|------|----------|-------------|
| Flowchart | Processes, pipelines, decisions | flow, steps, process, if/then |
| Sequence | API flows, auth, service calls | request, response, API, calls |
| State | Lifecycles, statuses, transitions | status, lifecycle, state, becomes |
| Gantt | Timelines, sprints, roadmaps | schedule, sprint, timeline, phases |
| ER | Database schemas, data models | tables, schema, has many, entities |
| Class | OOP design, patterns, contracts | classes, extends, implements, methods |

Use `/diagram [description]` and I'll auto-detect the type,
or `/diagram [type] [description]` to choose explicitly.
```

---

## Default Behavior

If the user runs just `/diagram` with no arguments, show help:

```
Sabai Diagrams -- Mermaid Diagram Generator

Commands:
  /diagram [description]             Auto-detect type and render
  /diagram [type] [description]      Specify type explicitly
  /diagram export                    Export current diagram to FigJam
  /diagram types                     List available diagram types

Supported types: flowchart, sequence, state, gantt, er, class

Quick start:
  /diagram How our API handles user authentication
  /diagram flowchart CI/CD deployment pipeline
  /diagram sequence OAuth2 flow between client and auth server

After rendering, I can iterate on the diagram or export it to FigJam.
```

If the user runs `/diagram` followed by something that does not match a subcommand keyword (`export`, `types`) or a type keyword (`flowchart`, `sequence`, `state`, `gantt`, `er`, `class`), treat it as a description and auto-detect the type.

## Reference Files

- `skills/diagram-creator/SKILL.md` -- Full creation workflow, generation rules, guardrails
- `skills/diagram-creator/references/flowchart.md` -- Flowchart patterns and examples
- `skills/diagram-creator/references/sequence.md` -- Sequence diagram patterns and examples
- `skills/diagram-creator/references/state.md` -- State diagram patterns and examples
- `skills/diagram-creator/references/gantt.md` -- Gantt chart patterns and examples
- `skills/diagram-creator/references/technical.md` -- ER and class diagram patterns and examples
