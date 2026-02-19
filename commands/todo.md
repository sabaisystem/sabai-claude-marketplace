# /todo

Capture an idea as a Linear ticket for a plugin project.

## Usage

```
/todo <plugin-name> <description>
/todo <description>                  # Will ask which plugin
```

## Examples

```
/todo sabai-harvest Add weekly report export feature
/todo sabai-gmail Support attachments in email editor
/todo Add dark mode to all MCP Apps
```

## Behavior

### Step 1: Create the Ticket

1. Identify the plugin (ask if not specified)
2. Map plugin name to Linear project
3. Break down the description into:
   - Clear title
   - Overview
   - Requirements/acceptance criteria
   - Technical notes (if applicable)
4. Create the ticket in Linear using `mcp__linear__create_issue`
5. Show the created ticket with link

### Step 2: Clarify

Ask the user:
```
Created ticket SCM-28: "Add weekly report export feature"

[Open in app](linear://sabaisystem/issue/SCM-28) | [Open in browser](https://linear.app/sabaisystem/issue/SCM-28)

Is this clear? Would you like to:
1. Edit the ticket (add details, change scope)
2. Start working on it now
3. Leave it for later
```

### Step 3: Based on Response

**If "Edit":**
- Ask what to change
- Update ticket via `mcp__linear__update_issue`
- Return to Step 2

**If "Work on it":**
- Change ticket status to "In Progress"
- Start implementing (same as `/work-on SCM-28`)

**If "Leave for later":**
- Confirm ticket is saved
- End command

## Ticket Template

When creating, structure the ticket as:

```markdown
## Overview
[One paragraph describing the feature/fix]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2

## Technical Notes
[Implementation hints if relevant]
```

## Quick Flags

- `--priority <1-4>` - Set priority (1=urgent, 4=low)
- `--label <name>` - Add label (Feature, Bug, Improvement)
- `--work` - Skip to working on it immediately after creation
