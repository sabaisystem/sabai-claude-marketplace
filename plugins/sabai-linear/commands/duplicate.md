---
name: duplicate
description: Find potential duplicate or related tickets in Linear
---

# /duplicate - Check for Duplicate Tickets

Find potential duplicate or related tickets in Linear.

## Usage

```
/duplicate [ticket-id|"text description"]
```

- `ticket-id`: Find duplicates of existing ticket
- `text`: Search for similar tickets by description

## What It Does

1. Analyzes ticket title and description
2. Searches for similar existing tickets
3. Identifies potential duplicates
4. Suggests merge or link actions

## Output Format

```markdown
## Duplicate Check: TICKET-123

### Ticket Summary
**Title:** Add CSV export to reports
**Description:** Users should be able to export report data...

### Potential Duplicates Found

#### High Confidence (>80% similar)
| Ticket | Title | Status | Similarity |
|--------|-------|--------|------------|
| TICKET-050 | Export reports to CSV | Done | 95% |
| TICKET-089 | CSV export feature | Cancelled | 85% |

**Recommendation:** TICKET-123 may be a duplicate of TICKET-050 (already completed). Verify and close as duplicate.

#### Medium Confidence (50-80% similar)
| Ticket | Title | Status | Similarity |
|--------|-------|--------|------------|
| TICKET-067 | PDF export for reports | In Progress | 65% |
| TICKET-072 | Data export API | Backlog | 55% |

**Recommendation:** These are related but different. Consider linking.

#### Related Tickets
These aren't duplicates but may be relevant:
- TICKET-100 - Report improvements epic
- TICKET-101 - Export feature planning

### Suggested Actions
1. ✅ Mark TICKET-123 as duplicate of TICKET-050
2. 🔗 Link TICKET-123 to TICKET-067 (related)
3. 📝 Add comment referencing TICKET-072
```

## Search Strategy

When checking for duplicates, search by:

1. **Exact title match**
2. **Key terms** from title
3. **Similar phrases** in description
4. **Same labels/components**
5. **Same reporter** (may have filed twice)

## Linear Queries

- `linear_search_issues` with title keywords
- `linear_search_issues` with label filters
- Check recently created tickets

## Duplicate Handling

| Scenario | Action |
|----------|--------|
| Exact duplicate | Close newer, link to original |
| Similar scope | Merge requirements into one |
| Overlapping | Link as related, clarify scope |
| Different but related | Link for reference |

## Prevention Tips

- Check for duplicates before creating tickets
- Use consistent naming conventions
- Tag with components/areas
- Reference related tickets in description

## Bulk Duplicate Check

```
/duplicate backlog
```

Scans backlog for potential duplicates:

```markdown
## Backlog Duplicate Scan

### Potential Duplicate Groups

**Group 1: Export functionality**
- TICKET-123 - CSV export
- TICKET-050 - Export to CSV
- TICKET-089 - Data export

**Group 2: Login issues**
- TICKET-200 - Login fails on mobile
- TICKET-205 - Can't log in on iPhone
- TICKET-210 - Mobile login broken

### Summary
- 3 potential duplicate groups found
- Estimated cleanup: 5 tickets can be merged
```
