---
name: reply
description: Draft a reply to an email or conversation
---

# /reply Command

Draft a reply to an email or conversation.

## Usage

```
/reply [context or instructions]
```

## Parameters

- `context` - Instructions for how to reply (optional)

## Behavior

When this command is invoked:

1. If context provided, use it to guide the reply
2. If no context, ask:
   - What email are you replying to? (paste or describe)
   - What's your response?
   - What tone should I use?

3. If original email provided:
   - Analyze the sender's message
   - Identify questions or requests
   - Note any deadlines mentioned

4. Draft reply:
   - Address all points from original email
   - Match appropriate tone
   - Be clear and concise

5. Present draft and offer adjustments

6. If Gmail MCP available, offer to:
   - Create draft reply
   - Send reply (with confirmation)

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

## Quick Flags

- `--tone [formal|professional|casual]` - Set reply tone
- `--brief` - Keep reply short
- `--detailed` - Include more context

## Output

Provide:
1. Complete reply draft
2. Highlighting how it addresses original email points
3. Option to adjust before sending
