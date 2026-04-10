---
name: sync-linear
description: Sync a plugin's README to its Linear project description
---

# /sync-linear

Sync a plugin's README to its Linear project description.

## Usage

```
/sync-linear [plugin-name]
```

Examples:
- `/sync-linear sabai-sudoku` - Sync sabai-sudoku README to Linear
- `/sync-linear` - Sync current plugin (if in a plugin folder)

## Instructions

1. **Identify the plugin**
   - If plugin name provided, use `plugins/{plugin-name}/README.md`
   - If no name provided, detect from current working directory
   - Error if plugin not found

2. **Read the README**
   - Read the full content of `plugins/{plugin-name}/README.md`

3. **Find the Linear project**
   - Search for project in "Sabai Claude Marketplace" team
   - Project name format: "Sabai {plugin-name}" (e.g., "Sabai sudoku" for sabai-sudoku)
   - Error if project not found

4. **Extract description content**
   - The README content becomes the Linear project description
   - Keep markdown formatting (Linear supports it)

5. **Update Linear project**
   - Use `linear_update_project` to update the description
   - Report success with link to project

## Example Output

```
Syncing sabai-sudoku to Linear...

Reading: plugins/sabai-sudoku/README.md
Found Linear project: Sabai sudoku (id: xxx)
Updating project description...

Done! Linear project updated.
https://linear.app/sabaisystem/project/sabai-sudoku-xxx
```

## Error Handling

- Plugin not found: "Plugin 'xyz' not found in plugins/ folder"
- README missing: "No README.md found for plugin 'xyz'"
- Linear project not found: "No Linear project found for 'xyz'. Expected project name: 'Sabai xyz'"
