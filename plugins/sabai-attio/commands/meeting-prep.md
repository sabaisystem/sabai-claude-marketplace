---
name: meeting-prep
description: Generate a meeting briefing from Attio CRM data
arguments:
  - name: company_or_contact
    description: Company name or contact to prepare for
    required: true
---

Generate a comprehensive meeting briefing using Attio CRM data.

Use the Meeting Prep skill to:
1. Search for the company/contact using `search-records`
2. Pull detailed records with `get-records-by-ids`
3. Review interaction history via `search-notes-by-metadata`, `search-emails-by-metadata`, and `search-meetings`
4. Present a Meeting Briefing with company overview, key contacts, relationship history, open deals, intelligence, talking points, and suggested agenda
5. Include post-meeting action items template
