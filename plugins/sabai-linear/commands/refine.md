---
name: refine
description: Analyze tickets for refinement readiness and interactively apply improvements
---

# /refine - Backlog Refinement Assistant

Analyze tickets for refinement readiness, score completeness, and interactively apply suggested improvements — acceptance criteria, estimates, labels, and priority.

## Usage

```
/refine [ticket-id|"backlog"]
```

- `ticket-id`: Deep analysis and interactive improvement for a single ticket (e.g., `SCM-99`)
- `backlog`: Batch readiness scoring across the project backlog
- No argument: Same as `backlog` — asks which project to analyze

**Examples:**
- `/refine SCM-99` — Deep single-ticket analysis with suggestions
- `/refine backlog` — Score all backlog tickets for readiness
- `/refine` — Interactive (will ask which project or ticket)

## Instructions

### Step 1: Resolve Target

Determine the mode from the argument:

- **Ticket Mode**: Argument matches pattern `[A-Z]+-\d+` (e.g., `SCM-99`)
- **Backlog Mode**: Argument is `"backlog"`, or no argument provided
- **No argument**: Ask the user: "Would you like to refine a specific ticket (e.g., SCM-99) or review the backlog? If backlog, which project?"

**Ticket Mode resolution:**

1. Call `mcp__sabai-linear__linear_get_issue` with:
   - `issueId`: the ticket identifier (e.g., `SCM-99`)
2. Note the full issue data including `description`, `estimate`, `priority`, `labels`, `relations`, `children`, `comments`, `state`, `assignee`

**Backlog Mode resolution:**

1. Call `mcp__sabai-linear__linear_get_teams` to list teams
2. Note the `teamId` for "Sabai Claude Marketplace" (or first team if unambiguous)
3. If a project name was provided (e.g., `/refine backlog sabai-linear`):
   - Call `mcp__sabai-linear__linear_list_projects` with:
     - `teamId`: from above
   - Fuzzy-match the project name
   - Note the `projectId`
4. If no project specified, ask: "Which project should I review? Or type 'all' for the entire team backlog."
   - If "all", skip projectId filtering

### Step 2: Fetch Team Context

Call `mcp__sabai-linear__linear_get_team` with:
- `teamId`: from Step 1 (for Backlog Mode) or from the issue's `team.id` (for Ticket Mode)

From the response, note:
- `members` — for assignee suggestions
- `states` — for understanding workflow and state IDs
- `labels` — the full list of available labels (needed for label suggestions in Step 5)

### Step 3: Fetch Issues

**Ticket Mode:**
The issue is already fetched in Step 1. No additional call needed.

**Backlog Mode:**
1. Call `mcp__sabai-linear__linear_list_issues` with:
   - `teamId`: from Step 1
   - `projectId`: from Step 1 (if project-scoped)
   - `stateName`: `"Backlog"`
   - `limit`: `50`
2. If zero results, try fallback state names in order:
   - `stateName`: `"Todo"`
   - `stateName`: `"Triage"`
3. If still zero results, inform: "No backlog/todo/triage issues found for this project."

**Both Modes — Fetch Completed Issues for Estimation Comparison:**
Call `mcp__sabai-linear__linear_search_issues` with:
- `teamId`: from Step 2
- `projectId`: from Step 1 (if project-scoped, otherwise omit)
- `stateName`: `"Done"`
- `limit`: `50`

These completed issues provide estimation baselines — used in Step 5 for suggesting estimates by comparing similar tickets.

### Step 4: Analyze Completeness (Client-Side)

Score each issue on a 0-10 scale against these criteria:

| Criterion | Pass Condition | Fail Condition | Weight |
|-----------|---------------|----------------|--------|
| Clear title | > 5 words and contains a verb (action-oriented) | < 3 words or very vague | 1 |
| Description | > 50 characters of meaningful content | Empty or < 10 characters | 2 |
| Acceptance criteria | Description contains `- [ ]` checkboxes OR a heading with `acceptance`, `criteria`, or `AC` | None found | 3 |
| Estimate | `estimate` is not null | `estimate` is null | 2 |
| Priority | `priority` is 1-4 (urgent through low) | `priority` is 0 (none) | 1 |
| Labels | Has at least one label | No labels | 1 |

**Scoring formula:**
- Each criterion contributes `weight` points when passed
- Maximum possible: 1 + 2 + 3 + 2 + 1 + 1 = 10
- Score = sum of weights for passing criteria

**Backlog Mode categorization:**

| Score | Category | Meaning |
|-------|----------|---------|
| 8-10 | Ready | Can be pulled into a sprint as-is |
| 5-7 | Needs Minor Updates | Almost ready, small gaps to fill |
| 0-4 | Needs Significant Work | Requires a refinement session |

### Step 5: Generate Suggestions (Client-Side)

For each failing criterion, generate actionable suggestions:

**Missing acceptance criteria (weight 3):**
- AI-generate 3-5 acceptance criteria from the title and description
- Format as markdown checkboxes: `- [ ] [criterion]`
- Focus on testable, user-observable outcomes

**Missing estimate (weight 2):**
- Search the completed issues (from Step 3) for similar tickets by:
  - Matching labels
  - Keyword overlap in titles
- If similar completed tickets have estimates, suggest the median: "Similar completed tickets ([identifiers]) averaged [N] points."
- If no similar tickets found, suggest a range based on description length and complexity

**Missing labels (weight 1):**
- Match the issue's title keywords against the team's available labels (from Step 2)
- Suggest up to 3 matching labels with their `labelId`s
- Common keyword mappings: "bug"/"fix" → Bug, "add"/"new"/"create" → Feature, "improve"/"refactor"/"optimize" → Improvement, "doc"/"readme" → Documentation

**Missing priority (weight 1):**
- If the ticket has a label suggesting urgency (bug, security), suggest priority 2 (high)
- Otherwise suggest priority 3 (medium) as a safe default

**Vague title (weight 1):**
- Suggest a rewritten title that starts with a verb and is more specific
- Example: "Dashboard" → "Add user activity dashboard with weekly metrics"

**Missing description (weight 2):**
- Generate a description template with sections the user can fill in
- Include: Overview, Context, Requirements

**Additionally, for every ticket (Ticket Mode):**
- Generate 2-4 clarifying questions based on gaps or ambiguities in the title/description
- Examples: "What file formats should be supported?", "Should this work offline?", "Is there a design mockup?"

### Step 6: Present Results & Interactive Flow

**Ticket Mode — Interactive:**

Display the analysis, then offer:

```
What would you like to do?
1. Apply all suggestions — update the ticket with all recommended changes
2. Review one by one — walk through each suggestion ("Apply / Edit / Skip")
3. Just the report — no changes made
```

- **Apply all**: Proceed to Step 7 with all suggestions
- **Review one by one**: For each suggestion, display it and ask:
  ```
  [Suggestion details]
  → Apply / Edit / Skip?
  ```
  - **Apply**: Accept as-is
  - **Edit**: Let the user modify the suggestion, then accept
  - **Skip**: Move to next
- **Just the report**: Display the output and stop — do not update anything

**Backlog Mode — Batch Report:**

Display the full backlog report (see Output Format below). Then offer:

```
Would you like to:
1. Refine a specific ticket — enter a ticket ID to start interactive refinement
2. Done
```

If the user picks a ticket, switch to Ticket Mode for that ticket (restart from Step 1 in Ticket Mode).

### Step 7: Apply Changes

Collect all approved suggestions and apply via a single `mcp__sabai-linear__linear_update_issue` call.

**Building the update:**

1. **Acceptance criteria** — Append to the existing description under an `## Acceptance Criteria` heading:
   - Read the current `description` from the fetched issue
   - If description already has an AC section, append new items to it
   - If no AC section exists, append:
     ```markdown

     ## Acceptance Criteria

     - [ ] [criterion 1]
     - [ ] [criterion 2]
     ```
   - Set `description` in the update

2. **Estimate** — Set `estimate` to the suggested value

3. **Labels** — Merge with existing labels (the API replaces all labels on update):
   - Start with the issue's current `labels` array (get `id` from each)
   - Add new suggested `labelId`s
   - Deduplicate
   - Set `labelIds` in the update

4. **Priority** — Set `priority` to the suggested value

5. **Title** — Set `title` to the rewritten title

6. **Description** — If description was updated (AC or template), set `description`

Call `mcp__sabai-linear__linear_update_issue` with:
- `issueId`: the ticket identifier
- Plus all approved fields from above

### Step 8: Display Confirmation

Show what was updated:

```
Updated [identifier]: [title]
[Open in app](linear://sabaisystem/issue/[identifier]) | [Open in browser]([url])

Changes applied:
- [List each change made]
```

## Output Format — Ticket Mode

```markdown
# Refinement Analysis: [Identifier] — [Title]

**Date:** [today's date]
**Status:** [state.name] | **Priority:** [priorityLabel or "None"] | **Assignee:** [name or "Unassigned"]

## Completeness Score: [N]/10

| Criterion | Status | Weight | Notes |
|-----------|--------|--------|-------|
| Clear title | ✅ / ❌ | 1 | [Observation] |
| Description | ✅ / ❌ | 2 | [Observation] |
| Acceptance criteria | ✅ / ❌ | 3 | [Observation] |
| Estimate | ✅ / ❌ | 2 | [Current value or "Not set"] |
| Priority | ✅ / ❌ | 1 | [Current value or "Not set"] |
| Labels | ✅ / ❌ | 1 | [Current labels or "None"] |

## Suggested Improvements

### 1. [Improvement Title]
**Current:** [What exists now]
**Suggested:** [What to change]

### 2. Add Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### 3. Estimate: [N] points
Based on similar completed tickets: [SCM-XX] ([N] pts), [SCM-YY] ([N] pts)

## Clarifying Questions
- [Question 1]
- [Question 2]
- [Question 3]

## Relations & Context
| Type | Ticket | Title | State |
|------|--------|-------|-------|
| [blocks/blockedBy/related] | [id] | [title] | [state] |
```

## Output Format — Backlog Mode

```markdown
# Backlog Refinement Report: [Project Name or "All Projects"]

**Date:** [today's date]
**Total tickets analyzed:** [N]

## Summary

| Category | Count | Percentage |
|----------|-------|------------|
| Ready (8-10) | [N] | [%] |
| Needs Minor Updates (5-7) | [N] | [%] |
| Needs Significant Work (0-4) | [N] | [%] |

## Ready for Sprint ✅

Tickets that are fully refined (score 8-10):

| Ticket | Title | Score | Priority | Estimate |
|--------|-------|-------|----------|----------|
| [id] | [title] | [N]/10 | [priority] | [pts] |

## Needs Minor Updates ⚠️

Almost ready, small gaps to fill (score 5-7):

| Ticket | Title | Score | Missing | Quick Fix |
|--------|-------|-------|---------|-----------|
| [id] | [title] | [N]/10 | [gaps] | [what to add] |

## Needs Significant Work 🔴

Requires refinement session (score 0-4):

| Ticket | Title | Score | Issues | Recommendation |
|--------|-------|-------|--------|----------------|
| [id] | [title] | [N]/10 | [what's missing] | [action needed] |

## Refinement Session Agenda

Suggested order for refinement discussion:

1. **[Identifier]** — [Title] — [What needs discussion] ([estimated time])
2. **[Identifier]** — [Title] — [What needs discussion] ([estimated time])

**Estimated total refinement time:** [N] minutes
```

## Notes

- The completeness score uses a weighted system (max 10). Acceptance criteria carry the highest weight (3) because they most directly impact sprint execution.
- Missing acceptance criteria are AI-generated from the title and description — always review before applying.
- Estimate suggestions are based on comparing with similar completed tickets by label and keyword overlap. Treat as a starting point, not a definitive answer.
- `labelIds` on `linear_update_issue` **replaces** all labels — the command always merges with existing labels before updating to avoid removing labels.
- There is no "add comment" tool — all content additions (like acceptance criteria) are appended to the issue description via `linear_update_issue`.
- Backlog Mode searches for issues in "Backlog" state first, falling back to "Todo" then "Triage".
- Backlog Mode caps at 50 issues. For larger backlogs, filter by project.
- Empty sections are always omitted from the output.
- Output is wrapped in a code block for easy copy-paste.
