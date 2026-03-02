# Inline Editing Skill

You help users edit timesheet cells directly within the MCP App interface for quick modifications.

## Click-to-Edit Functionality

### Activating Edit Mode

Users can click on any timesheet cell to enter edit mode:

1. **Hours cells** - Click to modify logged hours
2. **Notes cells** - Click to edit entry descriptions
3. **Project/Task cells** - Click to change project assignment

### Visual Indicators

When a cell is editable:
- Hover shows edit cursor and subtle highlight
- Click transforms cell into input field
- Current value is pre-selected for easy replacement
- Border color changes to indicate active editing

## Quick Time Entry Modifications

### Editing Hours

```
Click on hours cell -> Enter new value -> Tab/Enter to save
```

Supported formats:
- Decimal: `1.5`, `2.25`, `0.75`
- Time notation: `1:30`, `2:15`, `0:45`
- Minutes: `90m`, `45m`, `30m`

### Editing Notes

```
Click on notes cell -> Type new description -> Tab/Enter to save
```

Tips:
- Shift+Enter for multi-line notes
- Escape to cancel changes
- Auto-expand cell height for long notes

## Validation Rules

### Maximum Hours Validation

| Rule | Limit | Error Message |
|------|-------|---------------|
| Single entry max | 24 hours | "Entry cannot exceed 24 hours" |
| Daily total max | 24 hours | "Daily total cannot exceed 24 hours" |
| Typical day warning | > 12 hours | "Warning: Entry exceeds typical workday" |

### Project Assignment Validation

- Entry must have a valid project/task assignment
- Cannot save time to archived projects
- Cannot save to projects user is not assigned to
- Billable entries require billable project

### Input Format Validation

- Hours must be positive numbers
- Maximum 2 decimal places
- Empty hours treated as deletion (with confirmation)

## Keyboard Navigation Support

### Navigation Keys

| Key | Action |
|-----|--------|
| Tab | Move to next editable cell |
| Shift+Tab | Move to previous editable cell |
| Arrow Up/Down | Navigate between rows |
| Arrow Left/Right | Navigate between columns |
| Enter | Confirm edit and move down |
| Escape | Cancel current edit |

### Quick Actions

| Shortcut | Action |
|----------|--------|
| Ctrl+S / Cmd+S | Save all pending changes |
| Ctrl+Z / Cmd+Z | Undo last change |
| Delete/Backspace | Clear cell (with confirmation) |
| Ctrl+D / Cmd+D | Duplicate entry to next day |

### Cell Selection

- Click+Drag to select multiple cells
- Ctrl/Cmd+Click for non-contiguous selection
- Shift+Click for range selection

## Auto-Save Behavior

### Save Triggers

Changes are automatically saved when:
1. User presses Tab or Enter to move to another cell
2. User clicks outside the edited cell
3. User navigates away from the timesheet view
4. Idle timeout of 3 seconds after last keystroke

### Save States

| State | Indicator | Description |
|-------|-----------|-------------|
| Editing | Blue border | Cell is being modified |
| Saving | Spinner icon | Save in progress |
| Saved | Green checkmark (brief) | Successfully saved |
| Error | Red border + icon | Save failed, retry needed |

### Conflict Resolution

If another user/device modified the same entry:
1. Show conflict dialog with both versions
2. Options: Keep yours, Keep theirs, Merge
3. Merge shows side-by-side comparison

### Offline Support

- Changes are queued locally when offline
- Sync indicator shows pending changes count
- Auto-sync when connection restored
- Conflict resolution for any discrepancies

## Error Handling

### Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| "Invalid project" | Project no longer available | Select different project |
| "Exceeds daily limit" | Total > 24 hours | Reduce hours on this or other entries |
| "Save failed" | Network/API error | Retry or save later |
| "Entry locked" | Week already submitted | Contact admin to unlock |

### Recovery Actions

- **Retry**: Automatic retry with exponential backoff (3 attempts)
- **Queue**: Save to local queue if retries fail
- **Notify**: Show notification with manual retry option
- **Revert**: Option to revert to last saved state

## Integration with Week View

### Batch Operations

When multiple cells are selected:
- Apply same hours to all selected cells
- Copy/paste across cells
- Clear multiple entries at once

### Row Operations

- Edit entire day's entries in sequence
- Quick fill: Apply same entry across week
- Smart suggestions based on previous weeks

## Usage Examples

### Quick Hour Adjustment

```
1. Click on "2.0" hours cell for Monday
2. Type "2.5"
3. Press Tab to save and move to next cell
```

### Update Entry Notes

```
1. Click on notes cell showing "Development work"
2. Type "Implemented user authentication feature"
3. Press Enter to save
```

### Change Project Assignment

```
1. Click on project cell
2. Start typing project name
3. Select from filtered dropdown
4. Press Enter to confirm
```

### Keyboard-Only Editing

```
1. Press Tab to focus first editable cell
2. Type new value
3. Press Enter to save
4. Use arrow keys to navigate
5. Press Escape to exit edit mode
```
