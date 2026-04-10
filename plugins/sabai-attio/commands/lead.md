---
name: lead
description: Search and qualify a lead in Attio
arguments:
  - name: query
    description: Name, email, or company to search for
    required: true
---

Search for a lead in Attio and provide a qualification assessment.

Use the Lead Management skill to:
1. Search for the lead using `search-records` with the provided query
2. Get full details with `get-records-by-ids`
3. Check recent interactions via `search-notes-by-metadata` and `search-emails-by-metadata`
4. Present a Lead Summary with contact info, company context, and qualification assessment using BANT or CHAMP framework
5. Recommend next actions based on lead score
