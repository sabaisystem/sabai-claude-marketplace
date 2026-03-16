# Prioritization Frameworks Skill

Help product managers prioritize features and tickets using proven frameworks.

## RICE Framework

**R**each × **I**mpact × **C**onfidence ÷ **E**ffort = RICE Score

| Factor | Description | Scale |
|--------|-------------|-------|
| **Reach** | How many users affected per quarter | Number (e.g., 1000) |
| **Impact** | How much it moves the needle | 3 = Massive, 2 = High, 1 = Medium, 0.5 = Low, 0.25 = Minimal |
| **Confidence** | How sure are we | 100% = High, 80% = Medium, 50% = Low |
| **Effort** | Person-months to complete | Number (e.g., 2) |

### Example RICE Calculation
```
Feature: Add SSO login
Reach: 500 users/quarter
Impact: 2 (High)
Confidence: 80%
Effort: 1 person-month

RICE = (500 × 2 × 0.8) ÷ 1 = 800
```

### RICE Template
```markdown
| Feature | Reach | Impact | Confidence | Effort | RICE Score |
|---------|-------|--------|------------|--------|------------|
| Feature A | 1000 | 2 | 80% | 2 | 800 |
| Feature B | 500 | 3 | 50% | 1 | 750 |
| Feature C | 2000 | 1 | 100% | 3 | 667 |
```

## ICE Framework

**I**mpact × **C**onfidence × **E**ase = ICE Score

Simpler than RICE, good for quick prioritization.

| Factor | Description | Scale |
|--------|-------------|-------|
| **Impact** | Potential impact on goal | 1-10 |
| **Confidence** | How sure are we | 1-10 |
| **Ease** | How easy to implement | 1-10 |

### ICE Template
```markdown
| Feature | Impact | Confidence | Ease | ICE Score |
|---------|--------|------------|------|-----------|
| Feature A | 8 | 7 | 5 | 280 |
| Feature B | 6 | 9 | 8 | 432 |
```

## MoSCoW Method

Categorize features by necessity:

| Category | Meaning | Guideline |
|----------|---------|-----------|
| **Must** | Non-negotiable | ~60% of effort |
| **Should** | Important but not vital | ~20% of effort |
| **Could** | Nice to have | ~20% of effort |
| **Won't** | Not this time | Explicitly excluded |

### MoSCoW Template
```markdown
## Must Have
- [ ] Feature A - Critical for launch
- [ ] Feature B - Legal requirement

## Should Have
- [ ] Feature C - Significant value add
- [ ] Feature D - User requested

## Could Have
- [ ] Feature E - Nice improvement
- [ ] Feature F - Polish item

## Won't Have (this release)
- Feature G - Future consideration
- Feature H - Descoped
```

## How to Use

1. **Gather features** - List all candidates
2. **Choose framework** - RICE for data-driven, ICE for quick, MoSCoW for releases
3. **Score each item** - Be consistent in scoring
4. **Rank by score** - Highest first
5. **Sanity check** - Does the ranking make sense?
6. **Create tickets** - Use `/ticket` to create in Linear with priority

## Score Storage in Linear

When using `/prioritize`, scores are persisted in Linear for later retrieval by `/prioritize rank`.

### Numerical Scores (RICE/ICE)

Stored as a metadata block in the issue description using delimiters:

```markdown
<!-- prioritization-metadata -->
| Field | Value |
|-------|-------|
| Framework | RICE |
| Reach | 1000 |
| Impact | 2 |
| Confidence | 80% |
| Effort | 2 |
| Score | 800 |
| Scored | 2026-03-16 |
<!-- /prioritization-metadata -->
```

When writing, replace any existing block between the delimiters, or append if none exists.

### Category Scores (MoSCoW)

Stored as Linear labels: `moscow:must`, `moscow:should`, `moscow:could`, `moscow:wont`. Remove any existing `moscow:*` label before applying a new one.

## Value vs Effort Matrix

> **Note:** This matrix is auto-derived from RICE/ICE scores by `/prioritize rank`. Value is mapped from the score (above/below median), and Effort is mapped from the RICE Effort factor or inverted ICE Ease score.

Quick 2x2 prioritization:

```
High Value | Quick Wins    | Major Projects
           | (Do First)    | (Plan Carefully)
-----------+---------------+----------------
Low Value  | Fill-ins      | Time Sinks
           | (Do If Time)  | (Avoid)
           +--------------+----------------
             Low Effort      High Effort
```

## Integration with Linear

After prioritization, set Linear priorities:
- RICE/ICE top 25% → Priority 1 (Urgent)
- RICE/ICE 25-50% → Priority 2 (High)
- RICE/ICE 50-75% → Priority 3 (Medium)
- RICE/ICE bottom 25% → Priority 4 (Low)
