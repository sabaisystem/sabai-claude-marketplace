# /work-on

Work on Linear tickets for this project.

## Usage

```
/work-on <ticket-id>           # Work on a specific ticket
/work-on <plugin-name>         # Work on all tickets for a plugin
/work-on <plugin-name> --todo  # List tickets as a todo list first
```

## Examples

```
/work-on SCM-27
/work-on sabai-harvest
/work-on sabai-gmail --todo
```

## Behavior

### Single Ticket (`/work-on SCM-27`)

1. Fetch the ticket from Linear using `mcp__linear__get_issue`
2. Read the ticket description, acceptance criteria, and technical notes
3. Understand what needs to be implemented
4. Start implementing the ticket:
   - Create/modify files as needed
   - Follow the acceptance criteria
   - Mark items complete as you go
5. When done, update the ticket status and add a comment

### Plugin Project (`/work-on sabai-harvest`)

1. Find the Linear project matching the plugin name using `mcp__linear__list_projects`
2. List all open tickets in that project using `mcp__linear__list_issues`
3. Create a TodoWrite list with all tickets
4. Ask which ticket to start with, or work through them in priority order
5. For each ticket, follow the single ticket flow above

### With `--todo` flag

1. Fetch tickets but only create a todo list
2. Don't start working until user confirms which ticket

## Implementation Notes

- Plugin names map to Linear projects (e.g., `sabai-harvest` → "Sabai Harvest" project)
- Ticket IDs use the identifier format (e.g., `SCM-27`)
- Prioritize tickets by: priority field, then parent tickets before children
- Update Linear status to "In Progress" when starting work
- Add implementation notes as comments on the ticket

## Linear Project Mapping

| Plugin | Linear Project |
|--------|---------------|
| sabai-gmail | Sabai Gmail |
| sabai-calendar | Sabai Calendar |
| sabai-harvest | Sabai Harvest |
| sabai-slack | Sabai Slack |
| sabai-discord | Sabai Discord |
| sabai-notion | Sabai Notion |
| sabai-linear | Sabai Linear |
| sabai-attio | Sabai Attio |
| sabai-tella | Sabai Tella |
| sabai-granola | Sabai Granola |
| sabai-conversion | Sabai Conversion |
| sabai-recall | Sabai Recall |
| sabai-sudoku | Sabai Sudoku |
| sabai-sabai | Sabai Sabai |
