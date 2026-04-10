---
name: risk
description: Analyze project risks and ticket-level concerns using Impact x Likelihood scoring
---

# /risk - Risk Assessment

Analyze real Linear data to identify project risks and ticket-level concerns using Impact x Likelihood scoring.

## Usage

```
/risk [project-name|ticket-id]
```

- `project-name`: Fuzzy-matched project name for project-wide assessment (e.g., `sabai-linear`, `calendar`)
- `ticket-id`: Ticket identifier for single-ticket deep analysis (e.g., `SCM-99`)

**Examples:**
- `/risk sabai-linear` — Project-wide risk assessment
- `/risk SCM-99` — Deep analysis of a single ticket
- `/risk` — Interactive (will ask what to assess)

## Instructions

### Step 1: Resolve Target

Determine the mode from the argument:

- **Ticket Mode**: Argument matches pattern `[A-Z]+-\d+` (e.g., `SCM-99`)
- **Project Mode**: Anything else (e.g., `sabai-linear`, `calendar`)
- **No argument**: Ask the user: "What would you like to assess? Provide a project name or ticket ID."

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
2. Note the full issue data including `children`, `relations`, `labels`, `state`, `assignee`, `estimate`, `updatedAt`, `priority`

### Step 2: Fetch Team Context

Call `mcp__sabai-linear__linear_get_team` with:
- `teamId`: from Step 1 (for Project Mode) or from the issue's `team.id` (for Ticket Mode)

Note the team's `members`, `states`, and `labels` — needed for checking unassigned issues and matching risk labels.

### Step 3: Fetch Issues

**Project Mode:**
Call `mcp__sabai-linear__linear_list_issues` with:
- `projectId`: from Step 1
- `limit`: `250`

If the result count equals 250, warn: "Results may be truncated — 250 issue limit reached."

**Ticket Mode:**
The issue is already fetched in Step 1 with children and relations. No additional call needed.

### Step 4: Identify Risk Indicators (Client-Side)

Analyze the fetched issue data for risk signals. Each indicator has a code, condition, and default Impact/Likelihood scores on a 1-4 scale.

**Issue-level indicators** (both modes):

| Code | Indicator | Condition | Impact | Likelihood |
|------|-----------|-----------|--------|------------|
| RI-1 | No estimate | `estimate` is null | 2 | 3 |
| RI-2 | High priority not started | `priority` <= 2 AND `state.type` in [backlog, unstarted, triage] | 3 | 3 |
| RI-3 | Stale in-progress | `state.type` = "started" AND `updatedAt` > 7 days ago | 3 | 2 |
| RI-4 | Unassigned | `assignee` is null AND `state.type` not in [completed, cancelled] | 2 | 3 |
| RI-5 | Large scope | children count > 5 | 3 | 2 |
| RI-6 | Blocked | has "blocks" relation where blocker not completed | 3 | 3 |
| RI-7 | Keyword: spike/poc | title or label contains `spike`, `poc`, `investigate`, `experiment` | 2 | 2 |
| RI-8 | Keyword: security | title or label contains `security`, `vulnerability`, `auth` | 4 | 2 |
| RI-9 | Keyword: migration | title or label contains `migration`, `migrate`, `breaking`, `deprecat` | 3 | 2 |

> **Note:** RI-5 and RI-6 are **Ticket Mode only**. `linear_list_issues` does not return children or relations — only `linear_get_issue` does (see `mcp/index.ts:369-397`). Skip these indicators in Project Mode.

**Project-level indicators** (Project Mode only):

| Code | Indicator | Condition | Impact | Likelihood |
|------|-----------|-----------|--------|------------|
| RP-1 | Overdue project | `targetDate` < today | 4 | 4 |
| RP-2 | Low progress | `progress` < 0.3 AND today is past midpoint between `startDate` and `targetDate` | 3 | 3 |
| RP-3 | Many unestimated | > 40% of active issues have no `estimate` | 3 | 3 |
| RP-4 | Concentration risk | > 50% of assigned issues belong to one person | 3 | 2 |

### Step 5: Score and Categorize

**Score** = Impact x Likelihood (range 1-16)

| Score | Level | Color |
|-------|-------|-------|
| 12-16 | Critical | Red |
| 6-11 | High | Orange |
| 3-5 | Medium | Yellow |
| 1-2 | Low | Green |

**Categories** — assign each risk to the most fitting category:
- **Technical**: complexity, architecture, integration, security, migration
- **Resource**: staffing, skills, availability, concentration
- **Process**: estimation, tracking, workflow, stale work
- **Timeline**: deadlines, overdue, progress, blocked items

### Step 6: Generate Output

Present the assessment in a markdown code block for easy copy-paste. Use the appropriate template based on mode. **Omit any sections that have zero items.**

### Step 7: Create Tracking Issues (Optional)

For risks scored **Critical or High** (score >= 6), offer:

```
Would you like me to create Linear tracking issues for the Critical/High risks?
1. Yes — create issues for all Critical/High risks
2. Select — let me choose which ones
3. No — skip
```

If yes, for each risk create an issue using `mcp__sabai-linear__linear_create_issue` with:
- `title`: `[Risk] [Risk description]`
- `description`: Include risk code, score, indicator details, and suggested mitigation
- `teamId`: from Step 2
- `projectId`: from Step 1 (Project Mode only)

## Output Format — Project Mode

```markdown
# Risk Assessment: [Project Name]

**Date:** [today's date]
**Project:** [name] | **Target:** [targetDate or "No target date"]
**Progress:** [progress as %] | **Issues:** [total] ([completed]/[active]/[backlog])

## Risk Summary

| Level | Count |
|-------|-------|
| Critical | [n] |
| High | [n] |
| Medium | [n] |
| Low | [n] |

**Overall Risk Level:** [Critical/High/Medium/Low — based on highest risk found]

## Risk Matrix

```
            │ Impact 1  │ Impact 2  │ Impact 3  │ Impact 4
────────────┼───────────┼───────────┼───────────┼──────────
Likelihood 4│           │           │           │
Likelihood 3│           │           │           │
Likelihood 2│           │           │           │
Likelihood 1│           │           │           │
```

[Place risk codes in the matching cells]

## Critical & High Risks

### [Code]: [Risk Title]
- **Score:** [Impact] x [Likelihood] = [Score] ([Level])
- **Category:** [Technical/Resource/Process/Timeline]
- **Affected:** [ticket identifier(s) or "project-level"]
- **Details:** [What was detected and why it matters]
- **Suggested Mitigation:** [Actionable recommendation]

## All Risks

| Code | Risk | Category | Impact | Likelihood | Score | Level | Affected |
|------|------|----------|--------|------------|-------|-------|----------|
| [code] | [description] | [cat] | [1-4] | [1-4] | [n] | [level] | [tickets] |

## Recommendations

1. [Top priority action]
2. [Second priority action]
3. [Third priority action]
```

## Output Format — Ticket Mode

```markdown
# Risk Assessment: [Ticket Identifier] — [Title]

**Date:** [today's date]
**Status:** [state.name] | **Priority:** [priorityLabel] | **Assignee:** [name or "Unassigned"]
**Estimate:** [estimate or "Not estimated"] | **Children:** [count]

## Risk Summary

| Level | Count |
|-------|-------|
| Critical | [n] |
| High | [n] |
| Medium | [n] |
| Low | [n] |

**Overall Risk Level:** [Critical/High/Medium/Low]

## Risks Found

### [Code]: [Risk Title]
- **Score:** [Impact] x [Likelihood] = [Score] ([Level])
- **Category:** [Technical/Resource/Process/Timeline]
- **Details:** [What was detected]
- **Suggested Mitigation:** [Recommendation]

## Children Status

| Ticket | Title | State | Priority | Risks |
|--------|-------|-------|----------|-------|
| [id] | [title] | [state] | [priority] | [risk codes or "—"] |

## Relations

| Type | Ticket | Title | State | Risk |
|------|--------|-------|-------|------|
| blocks/blocked-by | [id] | [title] | [state] | [RI-6 if blocking and not completed] |

## Recommendations

1. [Top priority action]
2. [Second priority action]
```

## Notes

- Risk indicators are detected automatically from Linear data — no manual input required
- RI-5 (Large scope) and RI-6 (Blocked) only apply in Ticket Mode because `linear_list_issues` does not return children or relations
- Impact and Likelihood use a 4-point scale; Score = Impact x Likelihood gives a 1-16 range
- For alternative risk frameworks (ROAM, RAID, FMEA), see `skills/risk-assessment.md`
- The assessment is a snapshot — risks change as work progresses. Re-run periodically.
- Output is wrapped in a code block for easy copy-paste
- Empty sections are always omitted from the output
