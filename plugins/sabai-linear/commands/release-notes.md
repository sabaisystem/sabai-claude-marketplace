# /release-notes - Generate Release Notes

Generate professional release notes from completed Linear tickets.

## Usage

```
/release-notes [version] [since]
```

- `version`: Version number (e.g., v1.2.0)
- `since`: Date or previous version to compare from

## What It Does

1. Fetches all completed tickets since last release
2. Categorizes by type (feature, fix, improvement)
3. Writes user-friendly descriptions
4. Formats for different audiences

## Output Format

```markdown
# Release Notes - v[X.Y.Z]
**Release Date:** [Date]

## Highlights
Brief summary of the most important changes.

## New Features
- **[Feature Name]** - What users can now do
- **[Feature Name]** - What users can now do

## Improvements
- **[Area]** - What was improved and why it matters

## Bug Fixes
- Fixed issue where [user-facing description]

## Breaking Changes
- **[Change]** - Migration instructions

## Known Issues
- [Issue] - Workaround: [workaround]

---
Questions? Contact support@company.com
```

## Ticket to Release Note Translation

Transform technical tickets into user-friendly notes:

| Ticket Title | Release Note |
|--------------|--------------|
| "Add CSV export to reports" | **Export Reports** - Export any report to CSV format |
| "Fix null pointer in auth" | Fixed login issues for some users |
| "Optimize DB queries" | Improved dashboard loading speed |

## Linear Queries

- `linear_search_issues` with `status:completed, completedAfter:[date]`
- Filter by labels: `feature`, `bug`, `improvement`

## Audience Versions

Generate different versions:
- **Public**: Focus on user benefits
- **Technical**: Include API changes
- **Internal**: Include ticket IDs and contributors

## Tips

- Lead with value, not technical details
- Group related changes
- Highlight breaking changes prominently
- Link to documentation for complex features
