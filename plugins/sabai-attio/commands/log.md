---
name: log
description: Log an activity to a contact in Attio
arguments:
  - name: type
    description: "Activity type: call, meeting, email, or note"
    required: true
  - name: contact
    description: Contact name or email
    required: true
---

Log an activity (call, meeting, email, or note) to a contact record in Attio.

Use the Activity Logging skill to:
1. Find the contact using `search-records` with the provided name/email
2. Verify with `get-records-by-ids`
3. Gather activity details from the user (summary, key points, next steps)
4. Log using `create-note` with the appropriate template:
   - **call**: Call log with duration, discussion points, outcomes, next steps
   - **meeting**: Meeting notes with attendees, agenda, action items
   - **email**: Email thread summary with key points and decisions
   - **note**: Quick update with topic and action items
5. Create follow-up tasks with `create-task` for any action items
