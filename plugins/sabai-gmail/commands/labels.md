# /labels Command

Manage email labels and organization.

## Usage

```
/labels [action]
```

## Actions

| Action | Description |
|--------|-------------|
| `list` | Show all labels |
| `create [name]` | Create a new label |
| `suggest` | Suggest labels for organization |
| `apply [label] [search]` | Apply label to matching emails |
| `cleanup` | Find unused or redundant labels |

## Behavior

When this command is invoked:

1. If action provided, execute it
2. If no action, show options:
   - View existing labels
   - Create new label
   - Get organization suggestions
   - Apply labels to emails
   - Clean up labels

3. Use Gmail MCP for label operations:
   - `gmail_list_labels` - Get all labels
   - `gmail_create_label` - Create new label
   - `gmail_modify_labels` - Apply/remove labels

## Examples

```
/labels list
/labels create priority/urgent
/labels suggest
/labels apply project/alpha from:team@company.com
/labels cleanup
```

## Recommended Label Structure

```
priority/
  urgent       # Needs immediate attention
  high         # Important, handle today
  medium       # Standard priority
  low          # When you have time

status/
  action-needed    # You need to do something
  waiting-response # Awaiting someone's reply
  reference        # Keep for reference
  delegated        # Passed to someone else

projects/
  [project-name]   # Per-project labels

clients/
  [client-name]    # Per-client labels

type/
  meeting      # Meeting-related
  invoice      # Billing/invoices
  newsletter   # Subscriptions
  personal     # Personal emails
```

## Quick Flags

- `--nested` - Create as nested label (e.g., `priority/urgent`)
- `--color [name]` - Set label color
- `--batch` - Apply to multiple emails

## Label Colors

Gmail label colors:
- Red, Orange, Yellow
- Green, Teal, Blue, Purple
- Gray

## Cleanup Suggestions

The cleanup action identifies:
- Labels with no emails
- Similar/duplicate labels
- Labels that could be merged
- Deeply nested labels (simplification opportunities)

## Output

**For list:**
- Organized list of all labels
- Email count per label
- Nested structure shown

**For create:**
- Confirmation of label creation
- Suggestion for related labels

**For suggest:**
- Recommended labels based on inbox analysis
- Organization improvements

**For apply:**
- Count of emails labeled
- Preview of affected emails

**For cleanup:**
- List of labels to review
- Merge/delete recommendations
