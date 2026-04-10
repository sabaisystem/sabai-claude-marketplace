---
name: Release Notes
description: Generate professional release notes from completed Linear tickets.
---

# Release Notes Skill

Generate professional release notes from completed Linear tickets.

## Release Notes Template

```markdown
# Release Notes - v[X.Y.Z]
**Release Date:** [Date]

## Highlights
Brief summary of the most important changes (2-3 sentences).

## New Features
- **[Feature Name]** - Description of what users can now do
- **[Feature Name]** - Description of what users can now do

## Improvements
- **[Area]** - What was improved and why it matters
- **[Area]** - What was improved and why it matters

## Bug Fixes
- Fixed issue where [description of bug]
- Fixed issue where [description of bug]

## Breaking Changes
- **[Change]** - What changed and how to migrate

## Known Issues
- [Issue description] - Workaround: [workaround]

## Coming Soon
Preview of what's in the next release.

---
Questions? Contact [support email]
```

## Audience-Specific Versions

### For End Users (Public)
- Focus on benefits, not technical details
- Use simple language
- Highlight new capabilities
- Skip internal improvements

### For Technical Users (Developers)
- Include API changes
- Mention performance improvements
- List deprecated features
- Add migration guides

### For Internal Team
- Include all changes
- Reference ticket IDs
- Add deployment notes
- Mention contributors

## Generating from Linear

1. **Fetch completed tickets** since last release:
   ```
   linear_search_issues with status:completed, completedAfter:[last release date]
   ```

2. **Categorize tickets** by label:
   - `feature` → New Features
   - `improvement` → Improvements
   - `bug` → Bug Fixes

3. **Write human-friendly descriptions**:
   - Ticket: "Add CSV export to reports page"
   - Release note: "**Export Reports** - You can now export any report to CSV format for use in spreadsheets"

4. **Highlight the big ones**:
   - Epic completions
   - Highly requested features
   - Major bug fixes

## Best Practices

- **Be consistent** - Same format every release
- **Lead with value** - What can users do now?
- **Be concise** - One line per item
- **Link to docs** - For complex features
- **Thank contributors** - For open source
- **Date clearly** - ISO format (YYYY-MM-DD)

## Changelog vs Release Notes

| Changelog | Release Notes |
|-----------|---------------|
| Every change | Curated highlights |
| Technical | User-friendly |
| For developers | For all users |
| Comprehensive | Scannable |
