---
name: deal
description: Manage a deal in Attio
arguments:
  - name: action
    description: "Action to take: view, advance, update, or log"
    required: true
  - name: deal_name
    description: Name of the deal or company
    required: true
---

Manage a specific deal through the sales process in Attio.

Use the Deal Management skill to:
1. Find the deal using `search-records` with the deal name
2. Get full details with `get-records-by-ids`
3. Based on the action:
   - **view**: Show deal overview with key contacts, timeline, competition, and next steps
   - **advance**: Check stage gate criteria and advance to next stage, log a note explaining the advancement
   - **update**: Update deal information (value, close date, stage)
   - **log**: Log activity to the deal using `create-note`
4. Create follow-up tasks with `create-task` as needed
