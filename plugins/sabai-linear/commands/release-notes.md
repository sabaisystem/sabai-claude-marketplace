---
name: release-notes
description: Generate professional release notes from completed Linear tickets
---

# /release-notes - Generate Release Notes

Generate professional release notes from completed Linear tickets, categorized by label and formatted for easy distribution.

## Usage

```
/release-notes [version] [since] [--project name]
```

- `version`: Version label for the release header (e.g., `v2.1.0`)
- `since`: Previous version tag (e.g., `v2.0.0`) or explicit date (e.g., `--since Mar-1`)
- `--project`: Optional project name filter (e.g., `sabai-calendar`)

**Examples:**
- `/release-notes v2.1.0` — Since last git tag
- `/release-notes v2.1.0 v2.0.0` — Between two versions
- `/release-notes v2.1.0 --since Mar-1` — Since explicit date
- `/release-notes v2.1.0 --project sabai-calendar` — Scoped to a project

## Instructions

### Step 1: Resolve Team & Project Context

1. Call `mcp__sabai-linear__linear_get_teams` to list available teams
2. Note the `teamId` for the "Sabai Claude Marketplace" team (or the first team if unambiguous)
3. If `--project` is specified:
   - Call `mcp__sabai-linear__linear_list_projects` with:
     - `teamId`: from above
   - Fuzzy-match the project name (e.g., "calendar" matches "Sabai calendar")
   - Note the `projectId` for filtering subsequent queries
4. If no `--project` specified, the release notes cover the whole team

### Step 2: Determine "Since" Date

Resolve the cutoff date using this 3-tier priority:

1. **Explicit date provided** (`--since Mar-1`): Parse the date to ISO 8601 and use as `sinceDate`

   #### Date Format Support

   Accept any of these formats (all resolve to the current year unless a year is specified):

   | Input | Parsed As |
   |-------|-----------|
   | `Mar-1` or `Mar-01` | March 1 of current year |
   | `March 1` or `March 01` | March 1 of current year |
   | `3/1` or `03/01` | March 1 of current year |
   | `2026-03-01` | ISO format (already complete) |

   **Parsing rules:**
   - Month names: accept both abbreviated (`Jan`, `Feb`, ...) and full (`January`, `February`, ...), case-insensitive
   - Separator: `-`, `/`, or space between month and day
   - If no year is provided, assume the current year
   - Output: ISO 8601 format (e.g., `2026-03-01T00:00:00Z`)
   - The `--since` prefix is optional — bare dates like `Mar-1` work without it

2. **Previous version provided** (second positional arg like `v2.0.0`): Run `git log -1 --format=%aI v2.0.0` to get the tag's author date and use as `sinceDate`
   - **If git is unavailable** (e.g., CoWork sandbox): Inform the user: "No git repository available — cannot resolve version tag `v2.0.0`. Please use `--since [date]` instead (e.g., `--since Mar-1`)." and stop.

3. **Neither provided** (just `/release-notes v2.1.0`): Git tag fallback —
   - Run `git describe --tags --abbrev=0` to find the most recent tag
   - Run `git log -1 --format=%aI [tag]` to get its date
   - Use that date as `sinceDate`
   - If no git tags exist at all, default to 14 days ago and inform the user: "No git tags found — showing issues completed in the last 14 days."
   - **If git is unavailable** (e.g., CoWork sandbox): Default to 14 days ago and inform the user: "No git repository available — defaulting to issues completed in the last 14 days. Use `--since [date]` for a specific cutoff."

Format `sinceDate` as ISO 8601 (e.g., `2026-03-01T00:00:00Z`).

### Step 3: Fetch All Completed Issues

Call `mcp__sabai-linear__linear_search_issues` with:
- `teamId`: from Step 1
- `projectId`: from Step 1 (only if `--project` was specified)
- `stateName`: `"Done"`
- `completedAfter`: `sinceDate` from Step 2
- `limit`: `250`

If the result count equals 250, warn the user: "Results may be truncated — 250 issue limit reached. Consider narrowing the date range or using `--project`."

### Step 4: Categorize by Labels (Client-Side)

Inspect each issue's `labels` array. Assign each issue to the **first matching** category in this priority order:

1. **Breaking Changes**: label contains `breaking-change` or `breaking`
2. **Security**: label contains `security`
3. **Features**: label contains `feature` or `enhancement`
4. **Bug Fixes**: label contains `bug`
5. **Improvements**: label contains `improvement` or `performance`
6. **Other Changes**: no matching label

Matching is case-insensitive. Use a single broad query + client-side categorization — this is more efficient than multiple per-label API calls (the API only supports one `labelName` filter at a time) and catches unlabeled issues too.

### Step 5: Group Related Features

If 3 or more feature tickets share a common theme (e.g., all relate to "calendar integration" or "export functionality"):
- Group them under a descriptive subheading (e.g., `### Calendar Integration`)
- List individual items within the group

If fewer than 3 features share a theme, or features are unrelated:
- List each feature individually without subheadings

Only apply grouping to the **Features** category — list all other categories as flat lists.

### Step 6: Write User-Friendly Descriptions

Transform each issue's technical title into a user-facing release note:

- Lead with the user benefit, use active voice
- One line per item
- Include the Linear ticket identifier in parentheses at the end
- Bold the feature/change name for Features and Breaking Changes

**Translation examples:**
| Ticket Title | Release Note |
|---|---|
| "Add CSV export to reports" | **Export Reports** - Export any report to CSV format (SCM-45) |
| "Fix null pointer in auth" | Fixed login issues affecting some users (SCM-46) |
| "Optimize DB queries for dashboard" | Improved dashboard loading speed (SCM-47) |
| "Remove legacy v1 API endpoints" | **V1 API Removal** - Legacy v1 endpoints have been removed. Migrate to v2 endpoints before upgrading (SCM-48) |

### Step 7: Generate Highlights Summary

Select the 2-3 most significant changes based on:
- Priority level (urgent/high first)
- Scope of impact (features affecting many users over narrow fixes)
- Breaking changes (always highlight)

Write a brief 2-3 sentence summary paragraph covering these key changes.

### Step 8: Format Output

Present the final output in a single markdown code block so the user can easily copy it. **Omit any sections that have zero items.**

## Output Format

```markdown
# Release Notes: v[version]
**Released:** [today's date]

## Highlights
[2-3 sentence summary of the most significant changes]

## New Features
### [Group Name] (only if 3+ related features)
- **Feature Name** - Description (SCM-XX)

## Bug Fixes
- Description (SCM-XX)

## Improvements
- Description (SCM-XX)

## Security
- Description (SCM-XX)

## Breaking Changes
- **Change Name** - Migration instructions (SCM-XX)

## Other Changes
- Description (SCM-XX)
```

## Notes

- The "version" argument is a label only — it appears in the header but does not create a git tag
- The "since" date determines which completed tickets to include, resolved via the 3-tier fallback in Step 2
- A single `linear_search_issues` call with `stateName: "Done"` + `completedAfter` fetches all relevant issues; categorization happens client-side by inspecting each issue's labels array
- Feature grouping only applies when 3+ features share a clear theme — avoid over-grouping
- Empty sections are always omitted from the output
- Output is wrapped in a code block for easy copy-paste to changelogs, Slack, or email
- For audience-specific variants (public, technical, internal), see the companion skill at `skills/release-notes.md`
