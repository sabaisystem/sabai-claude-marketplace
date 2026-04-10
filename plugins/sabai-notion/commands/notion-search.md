---
name: notion-search
description: Search your Notion workspace
---

# /notion-search Command

Search your Notion workspace.

## Usage

```
/notion-search [query]
```

## Behavior

When this command is invoked:

1. **Execute search**
   - Use `notion_search` with the query
   - Return matching pages and databases

2. **Display results**
   - Show page/database titles
   - Include URLs
   - Show type (page or database)

3. **Offer actions**
   - Open page content
   - Import to local file
   - Get page details

## Examples

```
/notion-search API documentation
/notion-search meeting notes
/notion-search
```

## Options

- `--pages` - Only search pages
- `--databases` - Only search databases
- `--limit [n]` - Maximum results to return

## Output

```
Found 3 results:

1. [Page] API Documentation
   https://notion.so/api-docs-abc123

2. [Page] API Changelog
   https://notion.so/changelog-def456

3. [Database] Documentation
   https://notion.so/docs-db-ghi789
```

## Follow-up Actions

After search, user can:
- `/import [result-url]` - Import a result
- Ask to read page content
- Query a database for its entries

## Required Environment

- `NOTION_API_KEY` - Notion integration token
