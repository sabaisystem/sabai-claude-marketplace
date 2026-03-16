# Decision Log Skill

Track and document product decisions with context for future reference using ADR (Architecture Decision Record) format stored in Linear.

## ADR Record Template

```markdown
# ADR-NNN: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Date
[Date]

## Context
What is the situation that requires a decision? What problem are we solving?

## Decision
What was decided or proposed, and the core reasoning.

## Options Considered

### Option 1: [Name]
**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

### Option 2: [Name]
**Pros:**
- Pro 1

**Cons:**
- Con 1

### Option 3: Do Nothing
**Pros:**
- No effort required

**Cons:**
- Impact of inaction

## Consequences

### Positive
- Benefit 1
- Benefit 2

### Negative
- Trade-off 1
- Trade-off 2

### Risks
- Risk 1 (mitigation: X)

## Related
- Links to related ADRs, tickets, or documents
```

## Quick Decision Template

For smaller decisions that don't need full ADR treatment:

```markdown
# ADR-NNN: [Title]
**Date:** [Date] | **Status:** Accepted

**Context:** [1-2 sentences]

**Options:**
1. Option A - [brief]
2. Option B - [brief]

**Decision:** Option [X] because [reason].

**Next Steps:**
- [ ] Action item
```

## Decision Categories

| Category | Examples |
|----------|----------|
| **Product** | Feature scope, prioritization, deprecation |
| **Technical** | Architecture, tech stack, integrations |
| **UX** | Flows, UI patterns, accessibility |
| **Business** | Pricing, partnerships, market focus |
| **Process** | Workflows, team structure, tools |

## When to Document

Always document when:
- Multiple stakeholders are involved
- Decision is costly to reverse
- Decision affects multiple teams
- You've debated it for > 30 minutes
- It's a recurring question
- It sets a precedent

## Decision Status Lifecycle

```
Proposed → Accepted → [Active]
                   ↘
                    → Deprecated (no longer applies)
                    → Superseded by ADR-XXX (replaced)
```

## Storage in Linear

ADRs are stored as Linear issues with:
- **Title pattern**: `ADR-NNN: [Decision Title]`
- **Label**: `Decision`
- **Metadata block**: `<!-- adr-metadata -->` in the description for machine-readable extraction

## Finding Past Decisions

- Search by `"ADR-"` to find all ADRs
- Filter by `Decision` label for all decision-labeled issues
- Search `"ADR-" [keyword]` to find ADRs by topic

## Best Practices

1. **Write it down immediately** — Context fades fast
2. **Include the "why"** — Future you will thank you
3. **List rejected options** — Shows due diligence
4. **Link related tickets** — Implementation traces back to rationale
5. **Use Proposed status** when gathering input, **Accepted** once agreed upon
6. **Set review dates** for decisions that may need revisiting
