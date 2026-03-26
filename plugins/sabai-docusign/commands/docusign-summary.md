---
name: docusign-summary
description: Summarize a DocuSign agreement in plain language
arguments: "<agreement name or envelope ID>"
---

# /docusign-summary

Generate a plain-language summary of a DocuSign agreement for quick pre-meeting prep.

## Instructions

1. **Find the agreement**:
   - If the argument looks like a GUID (contains hyphens, 32+ chars), treat it as an envelope ID and call `docusign_get_envelope` directly.
   - Otherwise, call `docusign_list_envelopes` with the argument as `searchText`.
   - If multiple matches, show them and ask the user to pick one.

2. **Get full details**: Call `docusign_get_envelope` with the envelope ID (includes recipients, documents, and tabs).

3. **Get document list**: Call `docusign_get_documents` to understand what's in the envelope.

4. **Generate a plain-language summary** covering:

```
## Agreement Summary: [Subject]

**Account:** [Active account name]
**Envelope ID:** [ID]
**Status:** [Status with emoji: completed, pending, etc.]

### Parties
- **Sender:** [Name, email]
- **Signers:** [Name, email, status for each]
- **CC:** [Name, email]

### Documents
- [Document name] ([page count] pages)

### Timeline
- Created: [date]
- Sent: [date]
- Last activity: [date]
- Completed: [date, if applicable]

### Signing Status
- [Name]: Signed on [date] / Pending since [date] / Declined
```

5. **Add context**:
   - If all signed: "This agreement is fully executed."
   - If pending: "Waiting on [names]. Last reminder was [date]."
   - If declined: "Declined by [name] on [date]."

6. **Offer follow-up**: "Want me to check recipients in detail, or look at another agreement?"
