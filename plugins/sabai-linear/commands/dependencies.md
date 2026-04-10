---
name: dependencies
description: Analyze and visualize ticket dependencies in Linear
---

# /dependencies - Dependency Analysis

Analyze and visualize ticket dependencies in Linear, detecting circular dependencies, critical paths, bottlenecks, and orphaned issues.

## Usage

```
/dependencies [ticket-id|project-name]
```

- `ticket-id`: Analyze a single ticket's dependency graph (2 levels deep)
- `project-name`: Map all dependencies across a project

**Examples:**
- `/dependencies SCM-99` — Deep dependency graph for a single ticket
- `/dependencies sabai-linear` — Project-wide dependency map
- `/dependencies` — Interactive (will ask what to analyze)

## Instructions

### Step 1: Resolve Target

Determine the mode from the argument:

- **Ticket Mode**: Argument matches pattern `[A-Z]+-\d+` (e.g., `SCM-99`)
- **Project Mode**: Anything else (e.g., `sabai-linear`, `calendar`)
- **No argument**: Ask the user: "What would you like to analyze? Provide a project name or ticket ID."

**Project Mode resolution:**

1. Call `mcp__sabai-linear__linear_get_teams` to list teams
2. Note the `teamId` for "Sabai Claude Marketplace" (or first team if unambiguous)
3. Call `mcp__sabai-linear__linear_list_projects` with:
   - `teamId`: from above
4. Fuzzy-match the argument to a project name (e.g., "calendar" matches "Sabai calendar")
5. Call `mcp__sabai-linear__linear_get_project` with:
   - `projectId`: matched project's `id`
6. Note the project's `name`, `targetDate`, `progress`, `startDate`

**Ticket Mode resolution:**

1. Call `mcp__sabai-linear__linear_get_issue` with:
   - `issueId`: the ticket identifier (e.g., `SCM-99`)
2. Note the full issue data including `relations`, `children`, `state`, `assignee`, `priority`, `updatedAt`

### Step 2: Fetch Team Context

Call `mcp__sabai-linear__linear_get_team` with:
- `teamId`: from Step 1 (for Project Mode) or from the issue's `team.id` (for Ticket Mode)

Note the team's `members` and `states` — needed for identifying assignee names and state types.

### Step 3: Fetch Issue Data with Relations

**Ticket Mode — 2-Level Deep Graph:**

1. The root issue is already fetched in Step 1 with `relations` and `children`
2. From `relations`, collect all related issue identifiers (from `relatedIssue.identifier`)
3. From `children`, collect all child issue identifiers
4. For each related/child issue (Level 1), call `mcp__sabai-linear__linear_get_issue` with:
   - `issueId`: the identifier
5. From each Level 1 issue's `relations`, collect their related issue identifiers
6. For each Level 2 issue not already fetched, call `mcp__sabai-linear__linear_get_issue` with:
   - `issueId`: the identifier
7. Cap at 20 direct relations from the root issue. If more exist, warn: "Showing first 20 direct relations out of [N]. Consider narrowing your analysis."

**Project Mode — All Active Issues:**

1. Call `mcp__sabai-linear__linear_list_issues` with:
   - `projectId`: from Step 1
   - `limit`: `250`
2. Filter results to active issues only — exclude issues where `state.name` is "Done", "Cancelled", or "Canceled"
3. Cap at 50 active issues. If more exist, warn: "Analyzing first 50 active issues out of [N]. Results may be incomplete."
4. For each active issue, call `mcp__sabai-linear__linear_get_issue` with:
   - `issueId`: the issue's `identifier`
5. This fetches `relations` and `children` for each issue, which `linear_list_issues` does not return

> **Performance note:** Project Mode requires N individual API calls (one per active issue) because `linear_list_issues` does not return relations — only `linear_get_issue` does. This is documented transparently. For large projects, consider analyzing specific tickets instead.

### Step 4: Build Dependency Graph (Client-Side)

Build an adjacency list from the fetched data. For each issue, track:

```
{
  identifier: "SCM-99",
  title: "...",
  state: "In Progress",
  stateType: "started",       // backlog, unstarted, started, completed, cancelled
  assignee: "Name" or null,
  priority: "High",
  updatedAt: "2026-03-10T...",
  blocks: ["SCM-100", "SCM-101"],      // issues this ticket blocks
  blockedBy: ["SCM-98"],               // issues blocking this ticket
  related: ["SCM-95"],                 // non-directional relations
  children: ["SCM-99-1", "SCM-99-2"], // sub-issues
}
```

**Mapping relation types from Linear API:**
- `type: "blocks"` → the current issue blocks `relatedIssue`
- `type: "blockedBy"` → the current issue is blocked by `relatedIssue`
- `type: "related"` → non-directional relationship
- `type: "duplicate"` → treat as `related`

### Step 5: Detect Problems (Client-Side)

Run these analyses on the dependency graph:

**1. Circular Dependencies (DFS Cycle Detection)**
- Traverse the `blocks` edges using depth-first search
- Track visited and in-stack nodes to detect back edges
- Report each cycle as a list: `A → B → C → A`

**2. Critical Path (Longest Blocking Chain)**
- Find the longest chain of `blocks`/`blockedBy` edges through non-completed issues
- Report the full chain with each node's state
- This is the sequence that determines minimum project completion time

**3. Bottleneck Issues**
- Count how many downstream issues each issue transitively blocks (follow `blocks` edges recursively)
- Issues blocking the most downstream work are bottlenecks
- Report the top 5, sorted by downstream count

**4. Orphaned Issues (Project Mode Only)**
- Issues with no `blocks`, `blockedBy`, or `related` relations within the project
- These can be started anytime but may indicate missing dependency modeling

**5. Stale Blockers**
- Issues where `stateType` is `"started"` AND `updatedAt` is more than 7 days ago
- AND the issue has at least one `blocks` relation to a non-completed issue
- These are actively blocking work but may be stuck

### Step 6: Generate Output

Present the analysis in a markdown code block for easy copy-paste. Use the appropriate template based on mode. **Omit any sections that have zero items.**

### Step 7: Offer Follow-Up Actions

```
What would you like to do?
1. Investigate a specific dependency chain
2. Check a blocker's details
3. Create tracking issues for circular dependencies
4. Done
```

- If **Investigate**: Ask which chain or ticket, call `mcp__sabai-linear__linear_get_issue` for details
- If **Create issues**: For each circular dependency, create an issue using `mcp__sabai-linear__linear_create_issue` with:
  - `title`: `[Dependency] Resolve circular dependency: [A] <-> [B]`
  - `description`: Include the full cycle and recommended resolution approach
  - `teamId`: from Step 2
  - `projectId`: from Step 1 (Project Mode only)

## Output Format — Ticket Mode

```markdown
# Dependency Analysis: [Identifier] — [Title]

**Date:** [today's date]
**Status:** [state.name] | **Priority:** [priorityLabel] | **Assignee:** [name or "Unassigned"]

## Dependency Tree

### Blocks (downstream — waiting on this ticket)
```
[Identifier] [Title] ([state])
├── [Identifier] [Title] ([state])
│   └── [Identifier] [Title] ([state])
└── [Identifier] [Title] ([state])
```

### Blocked By (upstream — this ticket is waiting on)
```
[Identifier] [Title] ([state])
├── [Identifier] [Title] ([state]) ✅
└── [Identifier] [Title] ([state]) 🔄
```

Status icons: ✅ completed, 🔄 in progress, ⏸️ not started, ❌ cancelled

### Related (non-blocking)
- [Identifier] — [Title] ([state])

## Problems Detected

### Circular Dependencies
- [A] → [B] → [C] → [A]
  **Recommendation:** [Which edge to break and why]

### Critical Path
```
[A] ([state]) → [B] ([state]) → [C] ([state])
```
**Length:** [N] tickets | **Bottleneck:** [identifier] (longest wait)

### Stale Blockers
| Ticket | Title | Status | Last Updated | Blocks |
|--------|-------|--------|--------------|--------|
| [id] | [title] | [state] | [date] | [count] tickets |

## Risk Assessment
- **Total dependencies:** [N] direct, [M] transitive
- **Blocked by incomplete:** [N] tickets
- **Critical path length:** [N] tickets
- **Circular dependencies:** [N] found
- **Overall:** [Clean / Minor concerns / Needs attention / Critical]

## Recommendations
1. [Top priority action]
2. [Second priority action]
```

## Output Format — Project Mode

```markdown
# Dependency Map: [Project Name]

**Date:** [today's date]
**Project:** [name] | **Target:** [targetDate or "No target date"]
**Progress:** [progress as %] | **Active Issues:** [N] analyzed

## Dependency Summary

| Metric | Count |
|--------|-------|
| Total relations | [N] |
| Blocking chains | [N] |
| Circular dependencies | [N] |
| Bottleneck issues | [N] |
| Orphaned issues | [N] |
| Stale blockers | [N] |

## Bottleneck Issues

Issues blocking the most downstream work:

| Rank | Ticket | Title | State | Downstream | Assignee |
|------|--------|-------|-------|------------|----------|
| 1 | [id] | [title] | [state] | [N] tickets | [name] |
| 2 | [id] | [title] | [state] | [N] tickets | [name] |

## Circular Dependencies

### Cycle 1
```
[A] → [B] → [C] → [A]
```
**Recommendation:** [Which edge to break and why]

## Critical Path

The longest blocking chain through non-completed issues:

```
[A] ([state]) → [B] ([state]) → [C] ([state]) → [D] ([state])
```
**Length:** [N] tickets | **Estimated completion:** Depends on [bottleneck ticket]

## Stale Blockers

Issues in progress for 7+ days that are blocking other work:

| Ticket | Title | Assignee | Last Updated | Blocks |
|--------|-------|----------|--------------|--------|
| [id] | [title] | [name] | [date] | [N] tickets |

## Orphaned Issues

Issues with no dependency relations (can be started anytime):

- [Identifier] — [Title] ([priority])

## Dependency Graph

```
[A] ──blocks──→ [B] ──blocks──→ [D]
 │                │
 blocks           blocks
 ↓                ↓
[C]              [E]

[F] (orphaned)
[G] (orphaned)
```

## Recommendations
1. [Top priority action]
2. [Second priority action]
3. [Third priority action]
```

## Notes

- `linear_list_issues` does NOT return `relations` or `children` — only `linear_get_issue` does. Project Mode requires N individual API calls to build the full dependency graph.
- Ticket Mode traverses 2 levels deep from the root issue — deeper dependencies are not shown.
- Relation types from Linear: `blocks`, `blockedBy`, `related`, `duplicate`. Only `blocks`/`blockedBy` are directional.
- The critical path analysis only considers `blocks`/`blockedBy` edges through non-completed issues.
- Stale blockers are defined as issues in `started` state not updated in 7+ days that block at least one non-completed issue.
- Project Mode caps at 50 active issues to manage API call volume. For larger projects, use Ticket Mode on specific areas.
- Output is wrapped in a code block for easy copy-paste.
- Empty sections are always omitted from the output.
