# /publish Command

Publish documentation to Notion.

## Usage

```
/publish [file-or-directory]
```

## Behavior

When this command is invoked:

1. **Determine what to publish**
   - If file path provided, publish that file
   - If directory provided, publish all markdown files
   - If nothing provided, ask user what to publish

2. **Check Notion connection**
   - Verify NOTION_API_KEY is set
   - Test connection with `notion_search`

3. **Find or create target**
   - Search for existing page with same name
   - If found, ask to update or create new
   - If not found, ask for parent page/database

4. **Convert and upload**
   - Convert markdown to Notion blocks
   - Use `notion_create_page` or `notion_update_page`

5. **Report results**
   - Return Notion page URL
   - Show any warnings or errors

## Examples

```
/publish README.md
/publish docs/
/publish docs/api/endpoints.md
/publish
```

## Options

- `--parent [page-id]` - Specify parent page directly
- `--database [db-id]` - Publish to a database
- `--update` - Update existing page without asking
- `--new` - Always create new page

## Required Environment

- `NOTION_API_KEY` - Notion integration token
