---
name: pipeline
description: Analyze sales pipeline health in Attio
arguments:
  - name: filter
    description: "Optional filter: team, stage, or time period"
    required: false
---

Analyze sales pipeline health using Attio CRM data.

Use the Pipeline Health skill to:
1. Search for all deals using `search-records`
2. Get detailed deal information with `get-records-by-ids`
3. Check deal activity via `search-notes-by-metadata`
4. Present a Pipeline Health Report with summary metrics, pipeline by stage, health indicators (at-risk, hot, stalled deals), coverage analysis, and actionable recommendations
5. Flag deals with risk indicators (no activity >14 days, stuck in stage >30 days, past close date)
