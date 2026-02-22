# Timesheet Week View MCP App

You help users visualize and edit their weekly timesheet using an interactive grid view.

## Overview

The Timesheet Week View is an MCP App that displays a visual grid of the user's time entries for a given week. It allows quick editing, identifies gaps, and shows totals at a glance.

## Week Grid Layout

The grid displays Monday through Friday as columns, with projects as rows:

```
┌─────────────────┬───────┬───────┬───────┬───────┬───────┬─────────┐
│ Project         │  Mon  │  Tue  │  Wed  │  Thu  │  Fri  │  Total  │
├─────────────────┼───────┼───────┼───────┼───────┼───────┼─────────┤
│ client-dev      │  4.0  │  6.0  │  5.0  │  4.5  │  3.0  │  22.5   │
│ internal-admin  │  1.0  │  0.5  │  1.0  │  0.5  │  1.0  │   4.0   │
│ meetings        │  2.0  │  1.5  │  2.0  │  2.0  │  1.5  │   9.0   │
│ code-review     │  1.0  │  0.0  │  0.0  │  1.0  │  2.5  │   4.5   │
├─────────────────┼───────┼───────┼───────┼───────┼───────┼─────────┤
│ Daily Total     │  8.0  │  8.0  │  8.0  │  8.0  │  8.0  │  40.0   │
└─────────────────┴───────┴───────┴───────┴───────┴───────┴─────────┘
```

## UI Components

### Header Section
- Week selector (previous/current/next week navigation)
- Date range display (e.g., "Feb 17 - Feb 21, 2026")
- Submit timesheet button

### Grid Cells
Each cell in the grid represents hours logged to a project on a specific day.

**Cell Interactions:**
- Click to edit hours
- Double-click to add notes
- Hover to show entry details (notes, created time)

### Visual States

Cells use color coding to indicate status:

| State | Color | Description |
|-------|-------|-------------|
| Empty | Light gray | No hours logged |
| Filled | White/Default | Hours logged, not yet submitted |
| Draft | Yellow | Modified but not saved |
| Submitted | Green | Timesheet submitted for the week |
| Error | Red | Invalid entry (e.g., negative hours) |

### Totals Row
- Shows daily totals at the bottom
- Highlights days under 8 hours in amber
- Highlights days over 8 hours in blue
- Shows weekly total with target comparison

### Project Column
- Lists all active project aliases
- "Add Project" button at bottom
- Projects with zero hours for the week shown in lighter text

## Data Flow

### Loading Week Data

```bash
# Get time entries for the week
hrvst time-entries list --from=2026-02-17 --to=2026-02-21 --json

# Get list of project aliases for the project column
hrvst alias list --json
```

### Updating Entries

When user edits a cell:

```bash
# Log hours to a project on a specific date
hrvst log <hours> <alias> --date=2026-02-18 --notes="<notes>"

# If entry exists, update it
hrvst time-entries update <entry-id> --hours=<hours>

# Delete an entry (when setting to 0)
hrvst time-entries delete <entry-id>
```

## MCP App Implementation

### Resource Registration

The MCP App registers a UI resource that Claude can display:

```typescript
// Register the timesheet week view
server.registerResource({
  uri: "ui://sabai-harvest/timesheet-week",
  name: "Timesheet Week View",
  mimeType: "text/html"
});
```

### Tool: show_timesheet_week

Shows the interactive week view for a specific week.

**Parameters:**
- `week`: string (optional) - ISO date within the week, defaults to current week

**Example:**
```json
{
  "week": "2026-02-17"
}
```

### Tool: update_timesheet_cell

Updates a single cell in the timesheet.

**Parameters:**
- `date`: string - The date (YYYY-MM-DD)
- `alias`: string - Project alias
- `hours`: number - Hours to log
- `notes`: string (optional) - Notes for the entry

## User Workflow

### Viewing the Timesheet

1. User asks: "Show my timesheet for this week"
2. Claude invokes `show_timesheet_week` tool
3. MCP App renders the grid with current data
4. User sees visual overview of their week

### Editing Entries

1. User clicks a cell in the grid
2. Input field appears for hours
3. User enters new value and presses Enter
4. MCP App calls `update_timesheet_cell`
5. Grid updates to show new value
6. Totals recalculate automatically

### Adding New Project

1. User clicks "Add Project" button
2. Dropdown shows available aliases not yet in grid
3. User selects alias
4. New row added to grid

### Week Navigation

1. User clicks previous/next arrows
2. Grid reloads with new week's data
3. URL updates to reflect selected week

## Gap Detection

The view automatically highlights gaps:

- **Missing days**: Days with 0 hours shown with dashed border
- **Under hours**: Days with < 8 hours shown in amber
- **Missing projects**: If user typically logs to a project but hasn't this week, subtle indicator shown

## Responsive Design

- Desktop: Full grid view
- Tablet: Scrollable horizontally
- Mobile: Card view per day (stacked)

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow keys | Navigate between cells |
| Enter | Edit selected cell |
| Escape | Cancel edit |
| Tab | Move to next cell |
| Shift+Tab | Move to previous cell |

## Sabai System Branding

The MCP App uses Sabai System brand colors:

- Primary actions: Orange (#f26a2c)
- Success states: Teal (#013b2d)
- Background: Cream (#fef2ec)
- Footer link to sabaisystem.com

## Integration with Other Commands

The week view complements other Harvest commands:

- `/timesheet week` - Opens this view
- `/log` - Quick entry that updates the grid
- `/duplicate-week` - Copies previous week, then shows this view for review
