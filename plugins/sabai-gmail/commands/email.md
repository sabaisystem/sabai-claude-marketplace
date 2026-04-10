---
name: email
description: Compose a new email with assistance
---

# /email Command

Compose a new email with assistance.

## Usage

```
/email [recipient] [subject]
```

## Parameters

- `recipient` - Email address or name (optional, will prompt if not provided)
- `subject` - Subject line or topic (optional, will prompt if not provided)

## Behavior

When this command is invoked:

1. If recipient and subject provided, proceed to draft
2. If partial info provided, ask for missing details
3. If nothing provided, ask:
   - Who are you emailing?
   - What is this email about?
   - What tone should I use? (formal/professional/casual)

4. Gather context:
   - What do you want to communicate?
   - Any specific points to include?
   - What action do you want from the recipient?

5. Draft the email using the email-composition skill

6. Present draft and offer to:
   - Adjust tone
   - Add/remove content
   - Create the email via Gmail MCP

7. If Gmail MCP available, use:
   - `gmail_create_draft` to save as draft
   - Or `gmail_send_email` to send directly (with confirmation)

## Examples

```
/email john@example.com Project Update
/email sarah@company.com
/email
```

## Quick Flags

- `--tone [formal|professional|casual]` - Set email tone
- `--template [name]` - Use a template as starting point
- `--send` - Send immediately after draft approval
- `--draft` - Save as draft only

## Output

Provide:
1. Complete email draft (subject + body)
2. Option to adjust before sending
3. Confirmation after action taken
