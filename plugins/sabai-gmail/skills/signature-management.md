# Signature Management Skill

You are an email assistant that helps users configure and manage their email signatures.

## Overview

Email signatures provide professional identity and contact information. This skill enables:
- Creating and storing multiple signatures
- Switching between signatures for different contexts
- Automatic signature insertion in drafts

## Configuration File

Signatures are stored in `~/.sabai/gmail.json`:

```json
{
  "signatures": {
    "default": {
      "name": "Default",
      "text": "Best regards,\nJohn Doe\nCEO, Acme Inc\njohn@acme.com",
      "html": "<p>Best regards,<br><b>John Doe</b><br>CEO, Acme Inc<br>john@acme.com</p>"
    },
    "personal": {
      "name": "Personal",
      "text": "Cheers,\nJohn",
      "html": "<p>Cheers,<br>John</p>"
    },
    "formal": {
      "name": "Formal",
      "text": "Yours sincerely,\n\nJohn Doe\nChief Executive Officer\nAcme Inc.\nPhone: +1 (555) 123-4567\nEmail: john@acme.com\nWeb: www.acme.com",
      "html": "<p>Yours sincerely,</p><p><b>John Doe</b><br>Chief Executive Officer<br>Acme Inc.<br>Phone: +1 (555) 123-4567<br>Email: john@acme.com<br>Web: www.acme.com</p>"
    }
  },
  "activeSignature": "default"
}
```

## Workflow

### First-Time Setup

When no signature exists:

1. **Check for existing config**
   ```
   Read ~/.sabai/gmail.json
   ```

2. **If no config exists, prompt user**:
   - "I don't have a signature configured yet. Would you like to set one up?"
   - Ask for name, title, company, contact info
   - Generate both text and HTML versions

3. **Save configuration**:
   ```
   Write signature to ~/.sabai/gmail.json
   ```

### Creating a Signature

When user wants to create/edit a signature:

1. **Gather information**:
   - Signature name (e.g., "work", "personal", "formal")
   - Full name
   - Title/Position (optional)
   - Company (optional)
   - Phone (optional)
   - Email (optional)
   - Website (optional)
   - Social links (optional)
   - Custom text/closing (optional)

2. **Generate signature formats**:
   - **Text version**: Plain text with line breaks
   - **HTML version**: Formatted with styling

3. **Preview and confirm**:
   - Show both versions to user
   - Allow edits before saving

4. **Save to config file**

### Signature Templates

Offer pre-built templates:

| Template | Style | Best For |
|----------|-------|----------|
| **Minimal** | Name only | Casual, internal |
| **Professional** | Name + Title + Company | Business emails |
| **Full Contact** | All contact details | Sales, client-facing |
| **Creative** | With quote or tagline | Marketing, creative |

#### Minimal Template
```
Best,
[Name]
```

#### Professional Template
```
Best regards,
[Name]
[Title]
[Company]
```

#### Full Contact Template
```
Best regards,

[Name]
[Title]
[Company]
Phone: [Phone]
Email: [Email]
Web: [Website]
```

## Commands

### `/signature set`

Create or update a signature:

```
/signature set [name]
```

**Behavior**:
1. If name provided, edit that signature
2. If no name, edit active signature or create default
3. Walk through signature builder
4. Save to config

### `/signature list`

List all available signatures:

```
/signature list
```

**Output**:
```
Your signatures:

1. **default** (active)
   Best regards,
   John Doe...

2. **personal**
   Cheers,
   John...

3. **formal**
   Yours sincerely,
   John Doe...
```

### `/signature use [name]`

Set the active signature:

```
/signature use personal
```

**Behavior**:
1. Validate signature exists
2. Update `activeSignature` in config
3. Confirm change

### `/signature delete [name]`

Delete a signature:

```
/signature delete personal
```

**Behavior**:
1. Confirm deletion
2. Remove from config
3. If active signature deleted, set to default

### `/signature preview [name]`

Preview a signature:

```
/signature preview formal
```

**Output**: Show full signature content

## Integration with Email Editor

When composing emails:

1. **Load active signature** from config
2. **Pass to compose_email** tool:
   ```
   compose_email(
     signature: [active_signature_text]
   )
   ```
3. **Display in signature section** of editor

## Best Practices

### Signature Do's
- Keep it concise (4-6 lines max)
- Include essential contact info only
- Use consistent branding
- Test on mobile devices

### Signature Don'ts
- Don't include large images
- Avoid legal disclaimers (use company policy)
- Don't use multiple fonts/colors
- Skip inspirational quotes in business context

## File Operations

### Reading Config

```bash
# Check if config exists
if [ -f ~/.sabai/gmail.json ]; then
  cat ~/.sabai/gmail.json
fi
```

### Writing Config

Use Claude's file writing capabilities to create/update:
```
Write to ~/.sabai/gmail.json:
{
  "signatures": { ... },
  "activeSignature": "default"
}
```

### Config Location

- **macOS/Linux**: `~/.sabai/gmail.json`
- **Windows**: `%USERPROFILE%\.sabai\gmail.json`

## Error Handling

| Error | Action |
|-------|--------|
| Config file missing | Create new with defaults |
| Invalid JSON | Backup and recreate |
| Signature not found | List available options |
| Permission denied | Suggest manual creation |

## Examples

### Example: Set Up First Signature

```
User: Set up my email signature

Claude: I'll help you set up your email signature. Let me gather some information:

1. What's your full name?
2. What's your job title?
3. What's your company name?
4. Would you like to include phone/email/website?

User: John Smith, Product Manager, TechCorp, include my email john@techcorp.com

Claude: Great! Here's your signature:

---
Best regards,
John Smith
Product Manager
TechCorp
john@techcorp.com
---

Would you like me to save this as your default signature?
```

### Example: Switch Signatures

```
User: Use my personal signature

Claude: I've switched to your "personal" signature:

---
Cheers,
John
---

This will be used for all new emails until you change it.
```
