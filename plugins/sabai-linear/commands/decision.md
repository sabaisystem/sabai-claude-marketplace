# /decision - Log a Decision

Document important decisions using ADR (Architecture Decision Record) format.

## Usage

```
/decision [title]
```

## What It Does

1. Creates structured decision record
2. Documents context and options
3. Records rationale and consequences
4. Stores for future reference

## Output Format

```markdown
# Decision: [Short Title]

**ID:** DEC-[NUMBER]
**Date:** [Today]
**Status:** Proposed
**Deciders:** [Names]

## Context
What situation requires this decision? What problem are we solving?

## Decision Drivers
- Driver 1: Why this matters
- Driver 2: Key constraint
- Driver 3: Goal we're achieving

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
**Risk:** [Impact of inaction]

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
- Risk 1: Mitigation plan
- Risk 2: Mitigation plan

## Action Items
- [ ] Action 1 - Owner - Due
- [ ] Action 2 - Owner - Due

## Follow-up
**Review Date:** [Date to revisit]
**Success Criteria:** How we'll know it worked

---
**Related Decisions:** DEC-X, DEC-Y
**Related Documents:** [Links]
```

## Quick Decision Format

For smaller decisions:

```markdown
# Decision: [Title]
**Date:** [Date] | **Deciders:** [Names]

**Context:** [1-2 sentences]

**Options:**
1. Option A - [brief]
2. Option B - [brief]

**Decision:** Option [X] because [reason].

**Next Steps:**
- [ ] Action item
```

## When to Document

Always document when:
- Multiple stakeholders involved
- Costly to reverse
- Affects multiple teams
- Debated > 30 minutes
- Recurring question
- Sets a precedent

## Decision Status

```
Proposed → Accepted → [Active]
                   ↘
                    → Deprecated (no longer applies)
                    → Superseded by DEC-XXX
```

## Linear Integration

- Create a decision document/ticket
- Link related implementation tickets
- Tag with `decision` label
- Reference DEC-ID in ticket descriptions

## Tips

- Write it down immediately (context fades)
- Include the "why" not just "what"
- List rejected options (shows due diligence)
- Set review dates (decisions aren't forever)
- Link related items
