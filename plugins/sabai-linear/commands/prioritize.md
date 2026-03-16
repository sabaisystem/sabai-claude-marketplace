# /prioritize - Interactive Prioritization Calculator

Score and rank Linear tickets using RICE, ICE, or MoSCoW frameworks. Saves scores to Linear and maps results to priorities.

## Usage

```
/prioritize [framework] [scope]
```

**Frameworks:** `rice`, `ice`, `moscow`, `rank` (omit to choose interactively)
**Scope:** `SCM-123` (single ticket), `--project <name>`, `--team <name>` (omit to ask)

## Framework Selection

| Framework | Best For | Output |
|-----------|----------|--------|
| **RICE** | Data-driven prioritization with reach data | Numerical score |
| **ICE** | Quick scoring without usage data | Numerical score |
| **MoSCoW** | Release planning, categorizing must-haves | Category labels |
| **Rank** | Viewing scored issues, priority mapping | Ranked table + matrix |

If no framework is specified, present this table and ask the user to choose.

---

## RICE Framework

**Formula:** `(Reach * Impact * Confidence) / Effort = RICE Score`

### Behavior

1. **Fetch tickets** using `linear_get_issue` (single) or `linear_list_issues` (batch)
2. **For each ticket**, walk through scoring:

| Factor | Prompt | Scale |
|--------|--------|-------|
| **Reach** | "How many users/customers will this affect per quarter?" | Number (e.g., 1000) |
| **Impact** | "How much will this move the needle?" | 3 = Massive, 2 = High, 1 = Medium, 0.5 = Low, 0.25 = Minimal |
| **Confidence** | "How confident are you in these estimates?" | 100% = High, 80% = Medium, 50% = Low |
| **Effort** | "How many person-weeks to complete?" | Number (e.g., 2) |

3. **Validate inputs** before calculating:

   | Factor | Valid Range | Error Message |
   |--------|------------|---------------|
   | Reach | >= 0 (integer) | "Reach must be a non-negative integer (e.g., 500)" |
   | Impact | One of: 0.25, 0.5, 1, 2, 3 | "Impact must be one of: 0.25 (Minimal), 0.5 (Low), 1 (Medium), 2 (High), 3 (Massive)" |
   | Confidence | 0-100 (percentage) | "Confidence must be between 0 and 100 (e.g., 80 for 80%)" |
   | Effort | > 0 (number) | "Effort must be greater than 0 (person-weeks)" |

   If any value is out of range, show the valid range and ask the user to re-enter that specific factor.

4. **Calculate and display:**

```
RICE Score for SCM-123: "Add SSO login"

| Factor | Value |
|--------|-------|
| Reach | 1000 users/quarter |
| Impact | 2 (High) |
| Confidence | 80% |
| Effort | 2 person-weeks |
| **RICE Score** | **(1000 * 2 * 0.8) / 2 = 800** |
```

5. **Offer to save** score to Linear (see Score Storage below)

### Quick Mode

Support inline scoring to skip prompts:
```
/prioritize rice SCM-45
> R=1000, I=2, C=80, E=2
```

Parse: `R=<reach>, I=<impact>, C=<confidence>, E=<effort>`

---

## ICE Framework

**Formula:** `Impact * Confidence * Ease = ICE Score`

### Behavior

1. **Fetch tickets** using `linear_get_issue` or `linear_list_issues`
2. **For each ticket**, walk through scoring:

| Factor | Prompt | Scale |
|--------|--------|-------|
| **Impact** | "What's the potential impact on your goal?" | 1-10 |
| **Confidence** | "How confident are you in this assessment?" | 1-10 |
| **Ease** | "How easy is this to implement?" | 1-10 |

3. **Validate inputs** before calculating:

   | Factor | Valid Range | Error Message |
   |--------|------------|---------------|
   | Impact | 1-10 (integer) | "Impact must be between 1 and 10" |
   | Confidence | 1-10 (integer) | "Confidence must be between 1 and 10" |
   | Ease | 1-10 (integer) | "Ease must be between 1 and 10" |

   If any value is out of range, show the valid range and ask the user to re-enter that specific factor.

4. **Calculate and display:**

```
ICE Score for SCM-456: "Improve onboarding"

| Factor | Value |
|--------|-------|
| Impact | 8 |
| Confidence | 7 |
| Ease | 5 |
| **ICE Score** | **8 * 7 * 5 = 280** |
```

5. **Offer to save** score to Linear

### Quick Mode

```
/prioritize ice SCM-456
> I=8, C=7, E=5
```

Parse: `I=<impact>, C=<confidence>, E=<ease>`

---

## MoSCoW Method

**Categories:** Must Have (~60% effort), Should Have (~20%), Could Have (~20%), Won't Have

### Behavior

1. **Fetch backlog items** using `linear_list_issues` with appropriate filters
2. **For each ticket**, ask: "Must / Should / Could / Won't?"
   - Support single categorization: `SCM-123: Must`
   - Support bulk: present tickets in numbered list, accept `1-5: Must, 6-8: Should, 9-10: Could`
3. **Display categorized summary:**

```
## MoSCoW Categorization

### Must Have (60% effort budget)
| # | Ticket | Title |
|---|--------|-------|
| 1 | SCM-101 | User authentication |
| 2 | SCM-102 | Payment processing |

### Should Have (20% effort budget)
| # | Ticket | Title |
|---|--------|-------|
| 3 | SCM-103 | Email notifications |

### Could Have (20% effort budget)
| # | Ticket | Title |
|---|--------|-------|
| 4 | SCM-104 | Dark mode support |

### Won't Have (this release)
| # | Ticket | Title |
|---|--------|-------|
| 5 | SCM-105 | Social login |
```

4. **Effort budget analysis:**
   - Count tickets per category
   - If available, sum estimate points per category
   - Warn if Must Haves exceed 60% of total effort
5. **Persist via labels:**
   - Apply labels `moscow:must`, `moscow:should`, `moscow:could`, `moscow:wont` using `linear_update_issue`
   - Fetch existing team labels via `linear_get_team` first
   - Remove any existing `moscow:*` label before applying the new one

### Batch Controls

- Type `skip` to skip a ticket
- Type `cancel` to stop and save progress so far
- Type `back` to re-categorize the previous ticket

---

## Rank View

**Usage:** `/prioritize rank [--project <name>] [--team <name>]`

### Behavior

1. **Fetch scored issues** by reading issue descriptions for `<!-- prioritization-metadata -->` blocks
   - Use `linear_list_issues` to get issues, then `linear_get_issue` for each to read descriptions
   - Also check for `moscow:*` labels

2. **Display ranked table** sorted by score (highest first):

```
## Prioritization Ranking

| Rank | Ticket | Title | Framework | Score | Priority |
|------|--------|-------|-----------|-------|----------|
| 1 | SCM-45 | Add SSO | RICE | 800 | P1 Urgent |
| 2 | SCM-46 | Improve onboarding | ICE | 432 | P1 Urgent |
| 3 | SCM-47 | Email templates | RICE | 350 | P2 High |
| 4 | SCM-48 | Dashboard redesign | ICE | 280 | P3 Medium |
| 5 | SCM-49 | Dark mode | ICE | 120 | P4 Low |
```

3. **Derive Value vs Effort matrix** from RICE/ICE scores:
   - **Value axis:** Map RICE/ICE score to High/Low (above/below median)
   - **Effort axis:** For RICE, use the Effort factor directly. For ICE, invert the Ease score (10 - Ease)
   - Place tickets in quadrants:

```
Value vs Effort Matrix

High Value | Quick Wins        | Major Projects
           | (Do First)        | (Plan Carefully)
           | SCM-45, SCM-46    | SCM-47
-----------+-------------------+-------------------
Low Value  | Fill-ins          | Avoid
           | (Do If Time)      | (Deprioritize)
           | SCM-49            | SCM-50
           +-------------------+-------------------
             Low Effort          High Effort
```

4. **Map to Linear priorities:**
   - Top 25% by score -> P1 (Urgent)
   - 25-50% -> P2 (High)
   - 50-75% -> P3 (Medium)
   - Bottom 25% -> P4 (Low)

5. **Offer to update** Linear priorities via `linear_update_issue` with `priority` field:
   - `priority: 1` = Urgent
   - `priority: 2` = High
   - `priority: 3` = Medium
   - `priority: 4` = Low

6. **Always confirm** before writing priority changes: show the proposed mapping and ask "Apply these priorities to Linear?"

---

## Score Storage in Linear

### Numerical Scores (RICE/ICE)

Store scores as a metadata block in the issue description. Use `<!-- prioritization-metadata -->` delimiters.

**Format:**
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

**Write procedure:**
1. Fetch current description via `linear_get_issue`
2. If `<!-- prioritization-metadata -->` block exists, replace it
3. If no block exists, append it to the end of the description
4. Update via `linear_update_issue` with the new description

**Read procedure:**
1. Fetch description via `linear_get_issue`
2. Extract content between `<!-- prioritization-metadata -->` and `<!-- /prioritization-metadata -->`
3. Parse the markdown table for Framework, Score, and factor values

### Category Scores (MoSCoW)

Store as Linear labels: `moscow:must`, `moscow:should`, `moscow:could`, `moscow:wont`

- Fetch existing labels via `linear_get_team` to get label IDs
- When applying, remove any existing `moscow:*` label first
- Use `linear_update_issue` with `labelIds` to set labels

### Priority Mapping

Use `linear_update_issue` with the `priority` field (1-4) after ranking.

---

## Interactive Design

### Confirmation

Always confirm before writing to Linear:
```
Ready to save RICE scores for 5 tickets to Linear. Proceed? (yes/no)
```

### Batch Mode Controls

When scoring multiple tickets:
- `skip` - Skip this ticket, move to next
- `cancel` - Stop scoring, offer to save what's been scored so far
- `back` - Re-score the previous ticket

### Input Flexibility

Accept scores in multiple formats:
- Prompted: answer each factor one at a time
- Inline: `R=1000, I=2, C=80, E=2` (RICE) or `I=8, C=7, E=5` (ICE)
- When user provides all values at once, skip individual prompts

---

## Examples

```
# Score a single ticket with RICE
/prioritize rice SCM-123

# Quick-score with ICE
/prioritize ice SCM-456

# Categorize project backlog with MoSCoW
/prioritize moscow --project "Sabai Calendar"

# View rankings and priority mapping
/prioritize rank --team "Sabai Claude Marketplace"

# Interactive - choose framework
/prioritize
```

## Tips

- Use RICE when you have usage/reach data available
- Use ICE for quick gut-feel scoring when speed matters
- Use MoSCoW at the start of a release cycle to set scope
- Run `/prioritize rank` after scoring to see the big picture
- Re-score periodically as understanding evolves
- Combine with `/risk` to factor in risk alongside priority
