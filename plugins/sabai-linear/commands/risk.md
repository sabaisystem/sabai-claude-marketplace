# /risk - Risk Assessment

Perform risk assessment for a project or feature using your preferred framework.

## Usage

```
/risk [project-name|ticket-id]
```

## Framework Selection

When you run `/risk`, Claude will ask which framework you want to use:

| Framework | Best For | Complexity |
|-----------|----------|------------|
| **Probability × Impact** | Quick assessments, most teams | Simple |
| **ROAM** | Agile teams, sprint-level risks | Simple |
| **RAID Log** | Comprehensive tracking | Medium |
| **FMEA** | Critical systems, detailed analysis | Advanced |

## What It Does

1. Asks which risk framework to use
2. Analyzes project/feature scope
3. Identifies potential risks across categories
4. Scores using your chosen framework
5. Suggests mitigations
6. Provides Linear setup instructions

## Output Format

```markdown
# Risk Assessment: [Project Name]

**Date:** [Date]
**Assessor:** PM
**Next Review:** [Date + 2 weeks]

## Executive Summary
Brief overview of overall risk level and key concerns.

## Risk Matrix

```
         │ Low Impact │ Med Impact │ High Impact
─────────┼────────────┼────────────┼────────────
High Prob│     -      │    R3      │  R1, R2
Med Prob │     -      │    R4      │     -
Low Prob │    R6      │    R5      │     -
```

## Risk Register

| ID | Risk | Category | Prob | Impact | Score | Owner |
|----|------|----------|------|--------|-------|-------|
| R1 | Timeline slip | Resource | H | H | 9 | PM |
| R2 | Tech complexity | Technical | H | H | 9 | Tech Lead |
| R3 | Scope creep | Business | H | M | 6 | PM |
| R4 | Integration issues | Technical | M | M | 4 | Dev |
| R5 | User adoption | Business | L | M | 2 | PM |
| R6 | Minor bugs | Technical | L | L | 1 | QA |

## Detailed Analysis

### R1: Timeline Slip
**Description:** Project may not meet target date
**Probability:** High - Dependencies on external team
**Impact:** High - Committed to stakeholders
**Mitigation:**
- Weekly sync with external team
- Identify parallel workstreams
- Prepare scope reduction options
**Contingency:** Push launch by 2 weeks, communicate early
**Status:** Active monitoring

### R2: Technical Complexity
**Description:** New architecture patterns untested at scale
**Probability:** High - First time implementing
**Impact:** High - Core feature
**Mitigation:**
- Spike in week 1
- Load testing before launch
- Feature flag for gradual rollout
**Contingency:** Fall back to simpler implementation
**Status:** Spike scheduled

## Action Items
- [ ] Schedule external team sync - PM - [Date]
- [ ] Complete architecture spike - Dev - [Date]
- [ ] Set up monitoring dashboards - DevOps - [Date]

## Review Schedule
- Next review: [Date]
- Stakeholder update: [Date]
```

## Risk Categories

| Category | Examples |
|----------|----------|
| **Technical** | Complexity, scalability, integration |
| **Resource** | Capacity, skills, availability |
| **Business** | Market, competition, adoption |
| **External** | Dependencies, vendors, regulations |
| **Timeline** | Deadlines, dependencies |

## Risk Scoring

**Probability × Impact = Risk Score**

| Score | Level | Response |
|-------|-------|----------|
| 7-9 | Critical | Immediate action required |
| 4-6 | High | Active mitigation needed |
| 2-3 | Medium | Monitor closely |
| 1 | Low | Accept and monitor |

## Linear Setup by Framework

### Probability × Impact Setup

**Labels to create:**
- `risk` - Tag all risk tickets
- `risk-critical` - Score 7-9
- `risk-high` - Score 4-6
- `risk-medium` - Score 2-3
- `risk-low` - Score 1

**Custom fields (optional):**
- Probability: Dropdown (High/Medium/Low)
- Impact: Dropdown (High/Medium/Low)
- Risk Score: Number

---

### ROAM Setup

**Labels to create:**
- `risk-resolved` - No longer a risk
- `risk-owned` - Assigned owner handling it
- `risk-accepted` - Consciously accepting the risk
- `risk-mitigated` - Controls in place

**Workflow states:**
```
Identified → Owned → Mitigated/Accepted/Resolved
```

**Custom fields:**
- Risk Owner: User field
- Acceptance Reason: Text (for accepted risks)

---

### RAID Log Setup

**Labels to create:**
- `raid-risk` - Might happen
- `raid-assumption` - What we believe true
- `raid-issue` - Already happening (needs action)
- `raid-dependency` - External blocker

**Custom fields:**
- RAID Type: Dropdown (Risk/Assumption/Issue/Dependency)
- Status: Dropdown (Open/Monitoring/Closed)
- Due Date: Date (for issues and dependencies)

**Views to create:**
- RAID Board: Filter by `raid-*` labels, group by type

---

### FMEA Setup

**Labels to create:**
- `risk` - All FMEA items
- `fmea-critical` - RPN > 200
- `fmea-high` - RPN 100-200
- `fmea-medium` - RPN 50-100
- `fmea-low` - RPN < 50

**Custom fields (required for FMEA):**
- Severity: Number 1-10
- Occurrence: Number 1-10
- Detection: Number 1-10
- RPN: Number (auto-calculate or manual)

**Description template:**
```markdown
## Failure Mode
What could go wrong?

## Effect
What happens if it fails?

## Cause
Why would this happen?

## Current Controls
What's in place to prevent/detect?

## Recommended Actions
What should we do?
```

---

## Quick Setup Commands

Ask Claude to help set up Linear:
```
Help me set up Linear for ROAM risk tracking
```

```
Create the labels and custom fields for FMEA in Linear
```

## Tips

- Review risks at sprint boundaries
- Update probabilities as work progresses
- Celebrate mitigated risks
- Learn from realized risks (retros)
- Choose simpler frameworks (ROAM) for fast-moving teams
- Use FMEA for high-stakes features (payments, security)
