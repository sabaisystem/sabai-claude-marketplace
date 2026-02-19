# Decision Log Skill

Track and document product decisions with context for future reference.

## Decision Record Template (ADR Style)

```markdown
# Decision: [Short Title]

**ID:** DEC-[NUMBER]
**Date:** [Date]
**Status:** Proposed | Accepted | Deprecated | Superseded
**Deciders:** [Names]

## Context
What is the situation that requires a decision? What problem are we solving?

## Decision Drivers
- Driver 1: Why this matters
- Driver 2: Constraint or requirement
- Driver 3: Goal we're trying to achieve

## Options Considered

### Option 1: [Name]
**Description:** Brief explanation
**Pros:**
- Pro 1
- Pro 2
**Cons:**
- Con 1
- Con 2
**Effort:** Low/Medium/High
**Risk:** Low/Medium/High

### Option 2: [Name]
**Description:** Brief explanation
**Pros:**
- Pro 1
- Pro 2
**Cons:**
- Con 1
- Con 2
**Effort:** Low/Medium/High
**Risk:** Low/Medium/High

### Option 3: Do Nothing
**Description:** Maintain status quo
**Pros:**
- No effort required
**Cons:**
- Problem persists
**Risk:** [Impact of not deciding]

## Decision
We decided on **Option X** because [reasoning].

## Consequences

### Positive
- Benefit 1
- Benefit 2

### Negative
- Tradeoff 1
- Tradeoff 2

### Risks
- Risk 1: Mitigation
- Risk 2: Mitigation

## Action Items
- [ ] Action 1 - Owner - Due
- [ ] Action 2 - Owner - Due

## Follow-up
**Review Date:** [Date to revisit this decision]
**Success Criteria:** How we'll know if this was the right call

---
**Related Decisions:** DEC-X, DEC-Y
**Related Documents:** [Links to PRDs, tickets, etc.]
```

## Quick Decision Template

For smaller decisions:

```markdown
# Decision: [Title]
**Date:** [Date] | **Deciders:** [Names]

**Context:** [1-2 sentences]

**Options:**
1. Option A - [brief description]
2. Option B - [brief description]

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
- Multiple stakeholders involved
- Decision is reversible but costly to reverse
- Decision affects multiple teams
- You've debated it for > 30 minutes
- It's a recurring question
- It sets a precedent

## Decision Status Lifecycle

```
Proposed → Accepted → [Active]
                   ↘
                    → Deprecated (no longer applies)
                    → Superseded by DEC-XXX (replaced)
```

## Finding Past Decisions

Organize decisions by:
- **Chronologically:** DEC-001, DEC-002, etc.
- **By area:** product/DEC-001, tech/DEC-001
- **By project:** project-x/DEC-001

## Best Practices

1. **Write it down immediately** - Context fades fast
2. **Include the "why"** - Future you will thank you
3. **List rejected options** - Shows due diligence
4. **Set review dates** - Decisions aren't forever
5. **Link related items** - PRDs, tickets, other decisions
6. **Name deciders** - Accountability and reference
