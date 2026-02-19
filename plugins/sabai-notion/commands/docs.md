# /docs Command

Generate documentation from source code.

## Usage

```
/docs [file-or-directory] [output]
```

## Behavior

When this command is invoked:

1. **Analyze source**
   - If file provided, analyze that file
   - If directory provided, find relevant code files
   - If nothing provided, analyze current project

2. **Extract documentation**
   - Parse code structure
   - Extract existing comments/docstrings
   - Identify functions, classes, exports

3. **Generate documentation**
   - Create comprehensive markdown docs
   - Include function signatures
   - Add usage examples

4. **Output results**
   - If output path provided, write there
   - Otherwise show in chat
   - Offer to publish to Notion

## Examples

```
/docs src/utils.ts
/docs src/ docs/api/
/docs
```

## Options

- `--style [style]` - Output style (markdown, jsdoc, docstring)
- `--publish` - Also publish to Notion
- `--readme` - Generate a README instead of API docs

## Supported Languages

- TypeScript / JavaScript
- Python
- Go
- Rust
- Java
- C#
- And more...

## Output Format

Generated documentation includes:

- Module/file overview
- Function/method signatures
- Parameter descriptions
- Return type information
- Usage examples
- Related items

## Integration

After generating docs, options available:
1. Save to local file
2. Publish to Notion with `/publish`
3. Add to existing documentation page
