# /template Command

Use an email template for quick composition.

## Usage

```
/template [name]
```

## Parameters

- `name` - Template name (optional, will show list if not provided)

## Available Templates

| Name | Description |
|------|-------------|
| `intro` | Professional introduction |
| `follow-up` | Follow-up on previous conversation |
| `thank-you` | Thank you email |
| `meeting-request` | Request a meeting |
| `update` | Status update |
| `decline` | Politely decline a request |
| `referral` | Request or give a referral |
| `feedback` | Request or provide feedback |

## Behavior

When this command is invoked:

1. If template name provided:
   - Load the template from email-templates skill
   - Prompt for required fields

2. If no name provided:
   - Show list of available templates
   - Ask which one to use

3. Customize template:
   - Fill in bracketed sections
   - Ask for missing information
   - Adjust tone if requested

4. Present completed draft:
   - Show full email
   - Offer adjustments

5. If Gmail MCP available:
   - Create draft
   - Send (with confirmation)

## Examples

```
/template meeting-request
/template intro
/template follow-up
/template
```

## Quick Flags

- `--to [email]` - Pre-fill recipient
- `--subject [text]` - Pre-fill subject
- `--tone [formal|professional|casual]` - Adjust template tone

## Template Fields

Each template prompts for relevant fields:

**intro:**
- Recipient name
- Your company/role
- Reason for reaching out
- Proposed next step

**meeting-request:**
- Recipient name
- Meeting topic
- Duration
- Proposed times

**follow-up:**
- Original topic/date
- Key point to recap
- Specific ask

## Output

Provide:
1. Template preview (before customization)
2. Questions for required fields
3. Completed email draft
4. Option to send or save as draft
