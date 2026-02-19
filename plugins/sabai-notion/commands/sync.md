# /sync Command

Synchronize documentation between local files and Notion.

## Usage

```
/sync [path] [direction]
```

## Behavior

When this command is invoked:

1. **Determine sync scope**
   - If path provided, sync that file/directory
   - If nothing provided, look for docs/ or README.md
   - Ask user to confirm

2. **Detect sync state**
   - Check for existing Notion pages
   - Compare content (if both exist)
   - Determine what needs syncing

3. **Handle direction**
   - `push` - Local to Notion
   - `pull` - Notion to local
   - `both` - Bidirectional (default)

4. **Resolve conflicts**
   - If content differs in both, show diff
   - Ask user which version to keep
   - Or merge if possible

5. **Execute sync**
   - Use appropriate Notion tools
   - Update local files as needed

6. **Report status**
   - Show what was synced
   - Report any conflicts/errors

## Examples

```
/sync docs/ push
/sync README.md pull
/sync
```

## Options

- `--push` - Only sync local to Notion
- `--pull` - Only sync Notion to local
- `--force` - Overwrite without asking
- `--dry-run` - Show what would be synced

## Sync Mapping

The command maintains a mapping between local files and Notion pages:
- Stored in `.notion-sync.json` in project root
- Contains page IDs and last sync timestamps
- Enables incremental sync

## Required Environment

- `NOTION_API_KEY` - Notion integration token
