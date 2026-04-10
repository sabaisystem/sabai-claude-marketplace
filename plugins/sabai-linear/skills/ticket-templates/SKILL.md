---
name: Ticket Templates
description: Create well-structured Linear tickets using feature, bug, improvement, spike, and epic templates.
---

# Ticket Templates Skill

You are a Product Manager assistant helping create well-structured Linear tickets.

## Available Templates

### 1. Feature Ticket
```markdown
## Summary
Brief description of the feature.

## Problem
What problem does this solve? Who is affected?

## Proposed Solution
How should this be implemented at a high level?

## User Stories
- As a [user], I want to [action] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Design
[Link to designs or "Design needed"]

## Technical Notes
Any technical considerations or constraints.

## Dependencies
- Dependency 1
- Dependency 2

## Out of Scope
What is explicitly NOT included in this ticket.
```

### 2. Bug Ticket
```markdown
## Bug Description
Clear description of what's wrong.

## Steps to Reproduce
1. Go to...
2. Click on...
3. Observe...

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- Browser/Device:
- OS:
- User account:

## Screenshots/Videos
[Attach or link]

## Severity
- [ ] Critical - System down, data loss
- [ ] High - Major feature broken, no workaround
- [ ] Medium - Feature broken, workaround exists
- [ ] Low - Minor issue, cosmetic

## Possible Cause
Any hunches on what might be causing this.
```

### 3. Improvement Ticket
```markdown
## Current State
How does it work today?

## Proposed Improvement
What should change and why?

## Benefits
- Benefit 1
- Benefit 2

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Metrics
How will we measure success?
```

### 4. Spike/Research Ticket
```markdown
## Research Question
What are we trying to learn?

## Context
Why is this research needed?

## Approach
How will we investigate?

## Time Box
Maximum time to spend: [X hours/days]

## Expected Output
- [ ] Document findings
- [ ] Recommendation
- [ ] POC (if applicable)

## Questions to Answer
1. Question 1
2. Question 2
```

### 5. Epic Ticket
```markdown
## Epic Overview
High-level description of this body of work.

## Goals
- Goal 1
- Goal 2

## Success Metrics
| Metric | Target |
|--------|--------|
| | |

## Scope
### In Scope
- Item 1
- Item 2

### Out of Scope
- Item 1

## Child Tickets
- [ ] Ticket 1
- [ ] Ticket 2
- [ ] Ticket 3

## Timeline
Target completion: [Date]

## Risks
- Risk 1: Mitigation
```

## Using with Linear MCP

When creating tickets in Linear, use the Linear MCP tools:

1. **List teams**: `linear_get_teams` - Find the right team
2. **List projects**: `linear_get_projects` - Find or create a project
3. **Create issue**: `linear_create_issue` - Create the ticket with:
   - `title`: Clear, concise title
   - `description`: Use template above (markdown supported)
   - `teamId`: From teams list
   - `priority`: 0 (none) to 4 (urgent)
   - `projectId`: Optional, for grouping

## Best Practices

- **Titles**: Start with verb (Add, Fix, Update, Remove, Investigate)
- **Labels**: Use consistently (bug, feature, improvement, spike)
- **Priority**: P0 = urgent, P1 = high, P2 = medium, P3 = low
- **Estimates**: Use story points or time estimates consistently
- **Links**: Reference related tickets, PRDs, designs
