---
name: docusign-status
description: Check the status of your DocuSign agreements
arguments: "[optional: agreement name or 'pending' or 'completed']"
---

# /docusign-status

Check the status of DocuSign agreements for the active account.

## Instructions

1. **Check active account**: Call `docusign_list_accounts` to confirm which account is active. If none configured, guide the user to set one up.

2. **Determine filter**:
   - No argument: List all recent envelopes (last 30 days)
   - `pending`: Filter status `sent,delivered`
   - `completed`: Filter status `completed`
   - Any other text: Use as `searchText` to find matching envelopes

3. **Call `docusign_list_envelopes`** with the appropriate filters.

4. **Present results as a table**:

```
## DocuSign Status — [Account Name]

| Agreement | Status | Pending Signers | Last Activity |
|-----------|--------|-----------------|---------------|
| NDA - Acme Corp | Delivered | john@acme.com | 2026-03-20 |
| Service Agreement | Completed | — | 2026-03-18 |
```

5. **Highlight items needing attention**:
   - Envelopes where the authenticated user needs to sign
   - Envelopes that have been `delivered` but not signed for >3 days
   - Any `declined` envelopes

6. **If no envelopes found**, suggest widening the date range or checking the search term.

7. **Offer follow-up**: "Want me to get details on any of these? Or check a different account?"
