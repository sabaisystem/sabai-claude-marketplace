# /dependencies - Dependency Analysis

Analyze and visualize ticket dependencies in Linear.

## Usage

```
/dependencies [ticket-id|project]
```

- `ticket-id`: Analyze dependencies for specific ticket
- `project`: Analyze all dependencies in a project

## What It Does

1. Maps blocking and blocked-by relationships
2. Identifies dependency chains
3. Finds circular dependencies (problems)
4. Highlights critical path items

## Output Format

### Single Ticket Analysis

```markdown
## Dependency Analysis: TICKET-123

### Blocks (downstream)
These tickets are waiting on TICKET-123:
- TICKET-124 - Feature B
- TICKET-125 - Integration C
  - TICKET-126 - Testing D (indirect)

### Blocked By (upstream)
TICKET-123 is waiting on:
- TICKET-120 - API Design ✅ (completed)
- TICKET-121 - Database Migration 🔄 (in progress)
- TICKET-122 - Auth Service ⏸️ (not started)

### Critical Path
TICKET-122 → TICKET-121 → TICKET-123 → TICKET-124

### Risk Assessment
- **Longest chain:** 4 tickets deep
- **Blocked by incomplete:** 2 tickets
- **Estimated unblock date:** Based on velocity
```

### Project Dependency Map

```markdown
## Project Dependencies: [Project Name]

### Dependency Graph
```
TICKET-100 ──→ TICKET-101 ──→ TICKET-103
     │              │
     ↓              ↓
TICKET-102    TICKET-104
```

### Bottlenecks
Tickets blocking the most work:
1. TICKET-101 - Blocks 5 tickets
2. TICKET-100 - Blocks 3 tickets

### Circular Dependencies ⚠️
- TICKET-110 ↔ TICKET-111 (needs resolution)

### Orphaned Tickets
Tickets with no dependencies (can start anytime):
- TICKET-150
- TICKET-151
```

## Linear Queries

- `linear_get_issue` with relations
- `linear_search_issues` for project scope
- Check `blocking` and `blockedBy` fields

## Tips

- Review dependencies before sprint planning
- Break circular dependencies immediately
- Consider parallel workstreams
- Identify and resource bottleneck tickets first
