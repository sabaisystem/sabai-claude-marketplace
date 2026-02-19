# /reply Command

Draft a smart reply to an email using AI-powered context analysis.

## Usage

```
/reply [email-id or search] [--tone TONE] [--brief|--detailed] [--smart]
```

## Parameters

- `email-id` - Email ID, thread ID, or search query to find the email
- `--tone` - Set reply tone: `formal`, `professional`, `casual` (default: auto-detect)
- `--brief` - Keep reply short and to the point
- `--detailed` - Include more context and detail
- `--smart` - Use smart draft generation (default if no instructions given)

## Behavior

When this command is invoked:

### Smart Mode (default)

1. **Identify Target Email**
   - Use provided email ID or search query
   - Or ask user to identify the email to reply to

2. **Fetch Full Thread** (via Gmail MCP)
   - Get complete email conversation
   - Extract sender info, subject, and all messages

3. **Analyze Context** (Smart Draft Generation skill)
   - Parse questions and requests
   - Identify deadlines and urgency
   - Determine appropriate tone
   - Note conversation history

4. **Generate Draft**
   - Create contextual reply addressing all points
   - Match sender's communication style
   - Include clear next steps

5. **Open Email Editor** (MCP App)
   - Launch editor with pre-filled draft
   - User can review, edit, and send

### Manual Mode

If specific instructions provided:
1. Use instructions to guide the reply
2. Generate draft based on user's intent
3. Open in email editor for review

## Examples

```
/reply                           # Smart reply to most recent email
/reply from:sarah@company.com    # Smart reply to latest from Sarah
/reply thread:ABC123             # Reply to specific thread
/reply --tone formal             # Force formal tone
/reply accept their proposal     # Manual: accept with your wording
/reply decline politely          # Manual: decline gracefully
```

## Smart Draft Features

The smart draft generation analyzes:

| Aspect | Analysis |
|--------|----------|
| **Questions** | Identifies and addresses each question |
| **Requests** | Notes what's being asked of you |
| **Deadlines** | Highlights time-sensitive items |
| **Tone** | Matches sender's communication style |
| **History** | References previous conversation context |

## Context Keywords

The command understands common reply intents:
- `accept` / `agree` - Positive response
- `decline` / `reject` - Negative response (politely)
- `clarify` / `ask` - Request more information
- `confirm` - Confirm receipt or details
- `thank` - Express gratitude
- `schedule` - Propose meeting/call

## Examples

```
/reply accept their proposal but suggest a later deadline
/reply decline politely, offer alternative
/reply with a professional tone thanking them for the feedback
/reply
```

## Context Keywords

The command understands common reply intents:
- `accept` / `agree` - Positive response
- `decline` / `reject` - Negative response (politely)
- `clarify` / `ask` - Request more information
- `confirm` - Confirm receipt or details
- `thank` - Express gratitude
- `schedule` - Propose meeting/call

## Output

1. **Thread Summary** - Brief overview of the conversation
2. **Draft Preview** - Generated reply content
3. **Email Editor** - Opens MCP App for final editing
4. **Send Option** - User can send directly from editor

## Related Skills

- `smart-draft-generation.md` - AI-powered contextual draft creation
- `email-composition.md` - Email writing best practices
- `tone-adjustment.md` - Tone matching and adjustment
