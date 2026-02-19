# /import Command

Import documentation from Notion to local files.

## Usage

```
/import [notion-url-or-id] [output-path]
```

## Behavior

When this command is invoked:

1. **Identify source**
   - If URL/ID provided, use that page
   - If nothing provided, search Notion with `notion_search`
   - Show results and let user pick

2. **Fetch content**
   - Use `notion_get_page` to get page as markdown
   - Preserve formatting and structure

3. **Determine output**
   - If output path provided, use that
   - Otherwise suggest based on page title
   - Confirm with user

4. **Save locally**
   - Write markdown file
   - Create directories if needed

5. **Report results**
   - Show file path created
   - Offer to import related pages

## Examples

```
/import https://notion.so/my-page-abc123
/import abc123def docs/imported.md
/import
```

## Options

- `--recursive` - Also import child pages
- `--overwrite` - Overwrite existing files without asking
- `--dir [path]` - Output directory for multiple pages

## Required Environment

- `NOTION_API_KEY` - Notion integration token
