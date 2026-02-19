# /refine - Backlog Refinement Assistant

Analyze tickets for refinement readiness and suggest improvements.

## Usage

```
/refine [ticket-id|"backlog"]
```

- `ticket-id`: Refine specific ticket
- `backlog`: Analyze top of backlog for refinement needs

## Single Ticket Refinement

### Quality Checklist

```markdown
## Refinement Analysis: TICKET-123

### Completeness Score: 7/10

| Criteria | Status | Notes |
|----------|--------|-------|
| Clear title | ✅ | Descriptive |
| User story format | ⚠️ | Missing "so that" |
| Acceptance criteria | ❌ | Not defined |
| Estimated | ✅ | 5 points |
| Dependencies identified | ⚠️ | Possible API dependency |
| Design attached | ❌ | Needs mockup |
| Technical approach | ⚠️ | Needs spike |

### Suggested Improvements

1. **Add acceptance criteria:**
   - [ ] User can [specific action]
   - [ ] System displays [specific result]
   - [ ] Error state shows [specific message]

2. **Clarify user story:**
   Current: "Add export feature"
   Suggested: "As a report viewer, I want to export reports to CSV, so that I can analyze data in Excel"

3. **Identify dependencies:**
   - Check if new API endpoint needed
   - Verify design is approved

### Questions for Team
- What file formats should be supported?
- Should export include all data or filtered view?
- Any size limits?
```

## Backlog Refinement

```markdown
## Backlog Refinement Report

### Ready for Sprint ✅
Tickets that are fully refined:
- TICKET-100 (5 pts) - All criteria met
- TICKET-101 (3 pts) - All criteria met

### Needs Minor Updates ⚠️
Almost ready, small gaps:
| Ticket | Missing | Effort to Refine |
|--------|---------|------------------|
| TICKET-102 | Acceptance criteria | 10 min |
| TICKET-103 | Estimate | 5 min |

### Needs Significant Work 🔴
Requires refinement session:
| Ticket | Issues | Recommendation |
|--------|--------|----------------|
| TICKET-104 | No description, no AC | Schedule refinement |
| TICKET-105 | Unclear scope | Split into smaller |

### Refinement Session Agenda
1. TICKET-104 - Define scope and AC (15 min)
2. TICKET-105 - Break down epic (20 min)
3. Review dependencies for TICKET-106 (10 min)
```

## Refinement Criteria

| Criteria | Description |
|----------|-------------|
| **Title** | Clear, action-oriented |
| **Description** | User story or clear context |
| **Acceptance Criteria** | Testable conditions |
| **Estimate** | Points or t-shirt size |
| **Priority** | Set and justified |
| **Dependencies** | Identified and linked |
| **Design** | Mockups attached if UI |
| **Technical** | Approach discussed |

## Linear Queries

- `linear_get_issue` for ticket details
- `linear_search_issues` with `status:backlog` and priority sort
- Check for empty fields

## Tips

- Refine 2 sprints ahead
- Timebox refinement discussions
- If it takes too long, split the ticket
- Document decisions in comments
