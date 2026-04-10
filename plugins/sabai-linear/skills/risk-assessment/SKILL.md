---
name: Risk Assessment
description: Identify, assess, and mitigate risks in product initiatives using structured frameworks.
---

# Risk Assessment Skill

Identify, assess, and mitigate risks in product initiatives.

## Risk Assessment Template

```markdown
# Risk Assessment: [Project/Feature Name]

**Date:** [Date]
**Assessor:** [Name]
**Review Date:** [Date for next review]

## Executive Summary
Brief overview of risk profile and key concerns.

## Risk Register

| ID | Risk | Category | Probability | Impact | Score | Mitigation | Owner |
|----|------|----------|-------------|--------|-------|------------|-------|
| R1 | Description | Tech/Business/Resource | H/M/L | H/M/L | 1-9 | Plan | Name |

## Detailed Risk Analysis

### R1: [Risk Name]
**Description:** What could go wrong?
**Trigger:** What would cause this risk to materialize?
**Probability:** High/Medium/Low (and why)
**Impact:** High/Medium/Low (and why)
**Mitigation Strategy:**
- Preventive action 1
- Preventive action 2
**Contingency Plan:** What to do if it happens
**Owner:** Who is responsible
**Status:** Open/Mitigating/Closed

## Risk Matrix

```
         │ Low Impact │ Med Impact │ High Impact
─────────┼────────────┼────────────┼────────────
High Prob│ Medium (3) │ High (6)   │ Critical (9)
Med Prob │ Low (2)    │ Medium (4) │ High (6)
Low Prob │ Low (1)    │ Low (2)    │ Medium (3)
```

## Action Items
- [ ] Action 1 - Owner - Due date
- [ ] Action 2 - Owner - Due date
```

## Risk Categories

### Technical Risks
- Architecture scalability
- Integration complexity
- Technology maturity
- Security vulnerabilities
- Performance issues
- Technical debt

### Business Risks
- Market timing
- Competitive pressure
- Regulatory changes
- Customer adoption
- Revenue impact
- Brand reputation

### Resource Risks
- Team capacity
- Key person dependency
- Skill gaps
- Budget constraints
- Vendor reliability
- Timeline pressure

### External Risks
- Third-party dependencies
- Economic conditions
- Political/legal changes
- Natural disasters
- Pandemic impact

## Risk Scoring

**Probability:**
- High (3): >70% likely
- Medium (2): 30-70% likely
- Low (1): <30% likely

**Impact:**
- High (3): Project failure, major revenue loss, critical outage
- Medium (2): Significant delay, moderate cost, degraded experience
- Low (1): Minor delay, small cost, minimal user impact

**Risk Score = Probability x Impact**
- 6-9: Critical - Immediate action required
- 3-5: High - Active monitoring and mitigation
- 1-2: Low - Accept or monitor

## Common Mitigations

| Risk Type | Mitigation Strategies |
|-----------|----------------------|
| Technical complexity | Spike/POC first, phased rollout |
| Key person dependency | Documentation, cross-training |
| Third-party reliance | Fallback options, SLAs |
| Timeline pressure | Scope reduction, MVP approach |
| Adoption risk | Beta testing, feature flags |
| Security | Security review, penetration testing |

## Review Cadence

- **High-risk projects:** Weekly
- **Medium-risk:** Bi-weekly
- **Low-risk:** Monthly
- **After major milestones:** Always

## Alternative Frameworks

### ROAM (Agile-Friendly)

Categorize risks by status:

| Status | Meaning | Action |
|--------|---------|--------|
| **Resolved** | No longer a risk | Close it |
| **Owned** | Someone is handling it | Track progress |
| **Accepted** | We'll live with it | Document why |
| **Mitigated** | Controls in place | Monitor |

```markdown
## ROAM Risk Board

### Resolved ✅
- Risk A - Was resolved by [action]

### Owned 👤
- Risk B - Owner: [Name] - ETA: [Date]

### Accepted ⚠️
- Risk C - Accepted because [reason]

### Mitigated 🛡️
- Risk D - Mitigated by [control]
```

### RAID Log (Comprehensive)

Track four related items together:

| Type | Definition | Example |
|------|------------|---------|
| **Risk** | Might happen | "API might not scale" |
| **Assumption** | Believed true | "Users have modern browsers" |
| **Issue** | Already happening | "CI is flaky" |
| **Dependency** | External blocker | "Waiting on design" |

```markdown
## RAID Log

| ID | Type | Description | Owner | Status | Due |
|----|------|-------------|-------|--------|-----|
| R1 | Risk | API scaling | Dev | Monitoring | - |
| A1 | Assumption | Browser support | PM | Validated | - |
| I1 | Issue | CI flaky | DevOps | In Progress | Feb 20 |
| D1 | Dependency | Design review | PM | Blocked | Feb 18 |
```

### FMEA (Detailed Analysis)

**Failure Mode and Effects Analysis** - scores on three dimensions:

| Factor | Scale | Description |
|--------|-------|-------------|
| **Severity** | 1-10 | How bad if it happens |
| **Occurrence** | 1-10 | How likely to happen |
| **Detection** | 1-10 | How hard to catch before impact |

**RPN = Severity x Occurrence x Detection** (max 1000)

```markdown
## FMEA Register

| Failure Mode | Effect | Cause | S | O | D | RPN | Action |
|--------------|--------|-------|---|---|---|-----|--------|
| Auth timeout | User locked out | Network latency | 7 | 4 | 3 | 84 | Add retry logic |
| Data loss | User loses work | Browser crash | 9 | 2 | 8 | 144 | Auto-save |

### RPN Thresholds
- > 200: Critical - Immediate action
- 100-200: High - Plan mitigation
- 50-100: Medium - Monitor
- < 50: Low - Accept
```

## Framework Selection Guide

| Choose | When |
|--------|------|
| **Probability x Impact** | Quick assessment, most projects |
| **ROAM** | Agile teams, sprint-level tracking |
| **RAID Log** | Need to track assumptions/issues/dependencies too |
| **FMEA** | Critical systems, compliance requirements |
