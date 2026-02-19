# /signature Command

Manage email signatures for use in composed emails.

## Usage

```
/signature [action] [name]
```

## Actions

| Action | Description |
|--------|-------------|
| `set [name]` | Create or edit a signature |
| `list` | List all signatures |
| `use [name]` | Set active signature |
| `delete [name]` | Delete a signature |
| `preview [name]` | Preview a signature |
| (no action) | Show current signature |

## Behavior

### `/signature` (no action)

Show the currently active signature and offer quick actions.

### `/signature set [name]`

1. If `name` provided, create/edit that signature
2. If no name, edit the default signature
3. Walk through signature builder:
   - Name
   - Title/Position
   - Company
   - Contact info (phone, email, website)
   - Closing phrase preference
4. Generate text and HTML versions
5. Preview and confirm
6. Save to `~/.sabai/gmail.json`

### `/signature list`

Display all saved signatures with:
- Signature name
- Active indicator
- Preview snippet

### `/signature use [name]`

1. Validate signature exists
2. Set as active signature
3. Confirm the change

### `/signature delete [name]`

1. Confirm deletion with user
2. Remove from config
3. If deleting active signature, switch to default

### `/signature preview [name]`

Show full signature content in both text and HTML format.

## Examples

```
/signature                    # Show current signature
/signature set                # Create/edit default signature
/signature set work           # Create "work" signature
/signature list               # List all signatures
/signature use personal       # Switch to personal signature
/signature delete old         # Delete "old" signature
/signature preview formal     # Preview formal signature
```

## Quick Templates

When setting up a signature, offer templates:

- **Minimal**: Just name and closing
- **Professional**: Name, title, company
- **Full**: All contact details
- **Custom**: Build from scratch

## Configuration

Signatures stored in: `~/.sabai/gmail.json`

```json
{
  "signatures": {
    "default": {
      "name": "Default",
      "text": "Best regards,\nJohn Doe",
      "html": "<p>Best regards,<br>John Doe</p>"
    }
  },
  "activeSignature": "default"
}
```

## Output

### List Output
```
📝 Your Email Signatures

1. ✓ default (active)
   Best regards,
   John Doe...

2. personal
   Cheers,
   John...

Use `/signature use [name]` to switch signatures.
```

### Set Confirmation
```
✓ Signature "work" saved!

Preview:
---
Best regards,
John Doe
Product Manager
TechCorp
john@techcorp.com
---

This is now your active signature.
```

## Related

- `signature-management.md` - Full signature management skill
- `email-composition.md` - Email writing guidelines
