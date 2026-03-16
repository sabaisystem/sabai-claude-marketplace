# /decision - Log a Decision

Document important decisions using ADR (Architecture Decision Record) format, guided through a conversational flow, and saved to Linear.

## Usage

```
/decision [title]
```

- `title`: Short name for the decision (e.g., "Use PostgreSQL for analytics")

**Examples:**
- `/decision Use PostgreSQL for analytics` — Start with a title
- `/decision` — Start interactively (will ask for title)

## Instructions

### Step 1: Resolve Project Context

1. Call `mcp__sabai-linear__linear_get_teams` to list available teams
2. Note the `teamId` for the "Sabai Claude Marketplace" team (or the first team if unambiguous)
3. Call `mcp__sabai-linear__linear_list_projects` with:
   - `teamId`: from above
4. Note the project list — the ADR document will be saved to a project (ask user which project, or use "Sabai Linear" as default)

### Step 2: Determine Next ADR Number

1. Call `mcp__sabai-linear__linear_search_documents` with:
   - `query`: `"ADR-"`

2. From the results, extract ADR numbers from document titles matching the pattern `ADR-NNN:` (e.g., `ADR-001:`, `ADR-012:`)
   - Parse the numeric portion of each match
   - Find the highest number
   - Next ADR number = highest + 1, zero-padded to 3 digits (e.g., `001`, `012`, `013`)

3. If no existing ADRs are found, start at `ADR-001`

### Step 3: Gather Decision Context (Conversational)

If a title was provided, use it. Otherwise ask: "What decision do you need to document?"

Then guide the user through these questions **one at a time** (do not dump all questions at once). Adapt based on previous answers — skip questions the user already covered, and probe deeper where needed.

**Question flow:**

1. **Context**: "What's driving this decision? What problem or opportunity are you responding to?"
   - Listen for: business drivers, technical constraints, timeline pressure, user pain points
   - If the user's answer is vague, ask one follow-up: "What happens if we don't make this decision?"

2. **Options**: "What options did you consider?"
   - For each option, ask: "What are the main pros and cons?"
   - If the user only mentions one option, prompt: "Was there an alternative you considered, even briefly? Including 'do nothing' helps show due diligence."
   - Capture effort and risk level for each option if the user provides them

3. **Decision**: "Which option did you go with (or are you proposing), and what was the main reason?"
   - If the user hasn't decided yet, set status to `Proposed`
   - If they've decided, set status to `Accepted`

4. **Consequences**: "What are the main trade-offs or risks with this choice?"
   - Listen for: positive outcomes, negative trade-offs, risks with mitigations
   - If the user doesn't mention risks, ask: "Any risks to flag? Even small ones — we can note mitigations."

5. **Related items** (optional): "Are there any Linear tickets, previous ADRs, or documents related to this decision?"
   - If the user provides ticket identifiers (e.g., `SCM-123`), note them for the Related section and for linking in Step 6

**Shortcut**: If the user provides all the information upfront in a single message (context, options, decision, consequences), skip the conversational flow and proceed directly to Step 4.

### Step 4: Format the ADR

Assemble the ADR document using this template. Use today's date. Omit any sections the user didn't provide content for.

```markdown
# ADR-[NNN]: [Decision Title]

## Status
[Proposed | Accepted]

## Date
[Today's date, e.g., March 16, 2026]

## Context
[Synthesized from user's answer to the Context question. Write in complete sentences, 2-4 sentences covering the problem, constraints, and motivation.]

## Decision
[What was decided or proposed, and the core reasoning. 1-3 sentences.]

## Options Considered

### Option 1: [Name]
**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

### Option 2: [Name]
**Pros:**
- [Pro 1]

**Cons:**
- [Con 1]

### Option 3: Do Nothing
**Pros:**
- No effort required

**Cons:**
- [Impact of inaction]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Risks
- [Risk 1] (mitigation: [X])

## Related
- [Links to related ADRs, tickets, or documents]
```

### Step 5: Present for Review

Display the formatted ADR to the user and ask:

```
What would you like to do?
1. Save to Linear
2. Edit sections
3. Leave as draft (not saved)
```

- If **Edit**: Ask which section to change, make the edit, re-display, and ask again
- If **Draft**: Display the final ADR and stop — do not create a Linear issue
- If **Save**: Proceed to Step 6

### Step 6: Save to Linear

1. Call `mcp__sabai-linear__linear_create_document` with:
   - `title`: `ADR-[NNN]: [Decision Title]`
   - `content`: the full ADR content from Step 4 (markdown)
   - `projectId`: from Step 1 (the user's chosen project)
   - `icon`: `"📋"`

2. Note the returned `id` and `url`

### Step 7: Display Confirmation

Show the saved ADR with link:

```
ADR-[NNN]: [Decision Title]
Status: [Proposed/Accepted]
[Open in browser]([url])
```

If the user mentioned related tickets in Step 3, list them: "Related tickets: SCM-123, SCM-456"

## When to Document

Always document when:
- Multiple stakeholders are involved
- The decision is costly to reverse
- It affects multiple teams or services
- It's been debated for > 30 minutes
- It's a recurring question
- It sets a precedent

## Decision Status Lifecycle

```
Proposed → Accepted → [Active]
                   ↘
                    → Deprecated (no longer applies)
                    → Superseded by ADR-XXX
```

To update a decision's status later, edit the ADR issue in Linear and update both the `<!-- adr-metadata -->` block and the Status section.

## Finding Past ADRs

Search existing decisions using `mcp__sabai-linear__linear_search_documents` with:
- `query`: `"ADR-"` — finds all ADRs
- `query`: `"ADR-" [keyword]` — finds ADRs matching a topic

Or list all documents in a project using `mcp__sabai-linear__linear_list_documents` with:
- `projectId`: the project ID

## Tips

- Write it down immediately — context fades fast
- Include the "why" not just the "what"
- List rejected options — shows due diligence
- Set review dates for decisions that may need revisiting
- Link related tickets so implementation traces back to the rationale
- Use `Proposed` status when gathering input, `Accepted` once agreed upon

## Notes

- ADRs are stored as **Linear documents** (not issues) with `ADR-NNN:` title prefix, attached to a project
- Sequential numbering is determined by searching existing ADR documents at creation time
- The conversational flow adapts to how much information the user provides upfront
- If the user supplies all details in one message, the Q&A is skipped entirely
