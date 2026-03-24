# Gantt Chart Reference

## When to Use

Gantt charts show tasks plotted against time. Use them for:

- **Project timelines** -- feature development across weeks or months
- **Sprint plans** -- task allocation within a two-week sprint
- **Migration roadmaps** -- phased rollouts with dependencies
- **Release schedules** -- coordinating work across teams
- **Onboarding plans** -- structured task sequences over days or weeks

## Syntax Reference

### Basic Structure

```mermaid
gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Phase 1
    Task A           :a1, 2026-01-05, 5d
    Task B           :a2, after a1, 3d

    section Phase 2
    Task C           :b1, after a2, 4d
    Task D           :b2, after a2, 6d
```

### Date Formats

| Setting | Format | Example |
|---|---|---|
| `dateFormat YYYY-MM-DD` | ISO date input | `2026-03-15` |
| `axisFormat %b %d` | Axis display (Month Day) | `Mar 15` |
| `axisFormat %Y-%m-%d` | Axis display (full date) | `2026-03-15` |
| `axisFormat %b %Y` | Axis display (Month Year) | `Mar 2026` |
| `axisFormat %d %b` | Axis display (Day Month) | `15 Mar` |

### Task Syntax

```
Task name    :status id, start, duration_or_end
```

**Status modifiers:**

| Status | Syntax | Rendering |
|---|---|---|
| Normal | `:task1, 2026-01-05, 5d` | Default bar |
| Active | `:active, task1, 2026-01-05, 5d` | Highlighted bar |
| Done | `:done, task1, 2026-01-05, 5d` | Dimmed/completed bar |
| Critical | `:crit, task1, 2026-01-05, 5d` | Red/critical bar |
| Milestone | `:milestone, m1, 2026-01-10, 0d` | Diamond marker |
| Critical + Active | `:crit, active, task1, 2026-01-05, 5d` | Red + highlighted |

### Start Options

- **Absolute date:** `2026-03-15`
- **After another task:** `after task_id`
- **After multiple tasks:** `after task_a task_b` (starts when both complete)

### Duration

- Days: `5d`
- Hours: `8h`
- Absolute end date: `2026-03-20` (instead of a duration)

### Dependencies

Chain tasks using `after`:

```mermaid
gantt
    title Task Dependencies
    dateFormat YYYY-MM-DD

    section Backend
    Design API       :api_design, 2026-03-01, 3d
    Build endpoints  :api_build, after api_design, 5d
    Write tests      :api_test, after api_build, 3d

    section Frontend
    Design UI        :ui_design, 2026-03-01, 4d
    Build components :ui_build, after ui_design, 6d
    Integration      :integrate, after api_test ui_build, 3d
```

### Milestones

```mermaid
gantt
    title Release Plan
    dateFormat YYYY-MM-DD

    section Development
    Feature work     :dev, 2026-03-01, 10d
    Code freeze      :milestone, m1, after dev, 0d
    QA testing       :qa, after m1, 5d
    Release          :milestone, m2, after qa, 0d
```

### Sections

Group tasks into sections for visual organization:

```mermaid
gantt
    title Sprint Plan
    dateFormat YYYY-MM-DD

    section Design
    Wireframes       :des1, 2026-03-01, 2d
    Mockups          :des2, after des1, 3d

    section Development
    Backend API      :dev1, after des2, 5d
    Frontend UI      :dev2, after des2, 4d

    section Testing
    Integration tests :test1, after dev1 dev2, 3d
```

## Example 1: Two-Week Sprint Plan

```mermaid
gantt
    title Sprint 14 — User Notifications
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Planning
    Sprint planning      :done, plan, 2026-03-17, 1d
    Technical design     :done, design, after plan, 1d

    section Backend
    Notification model   :active, be1, after design, 2d
    Email service        :be2, after be1, 2d
    Push service         :be3, after be1, 3d
    Preferences API      :be4, after be2, 2d

    section Frontend
    Settings page        :fe1, after design, 3d
    Notification center  :fe2, after fe1, 3d
    Toast component      :fe3, after fe1, 2d

    section QA
    Test plan            :qa1, after design, 2d
    Integration testing  :crit, qa2, after be4 fe2, 2d
    Bug fixes            :qa3, after qa2, 1d

    section Milestones
    Feature complete     :milestone, m1, after be4 fe2 fe3, 0d
    Sprint review        :milestone, m2, after qa3, 0d
```

## Example 2: Database Migration Roadmap with Critical Path

```mermaid
gantt
    title PostgreSQL to CockroachDB Migration
    dateFormat YYYY-MM-DD
    axisFormat %b %Y

    section Preparation
    Audit current schema       :done, audit, 2026-03-01, 10d
    Compatibility assessment   :done, compat, after audit, 5d
    Migration plan document    :done, plan, after compat, 3d
    Stakeholder approval       :milestone, m_approve, after plan, 0d

    section Schema Migration
    Convert DDL statements     :crit, ddl, after m_approve, 8d
    Update ORM mappings        :crit, orm, after ddl, 5d
    Create migration scripts   :crit, scripts, after orm, 5d
    Validate schema parity     :crit, validate_schema, after scripts, 3d

    section Data Migration
    Build ETL pipeline         :etl, after m_approve, 12d
    Test with sample data      :sample, after etl, 5d
    Full data migration dry run :crit, dry_run, after validate_schema sample, 4d
    Data validation            :crit, data_val, after dry_run, 3d

    section Application Changes
    Update connection strings  :app1, after orm, 3d
    Update query patterns      :app2, after orm, 8d
    Performance benchmarks     :crit, perf, after app2 data_val, 5d

    section Cutover
    Freeze writes              :crit, freeze, after perf, 1d
    Final data sync            :crit, sync, after freeze, 1d
    Switch traffic             :crit, switch, after sync, 1d
    Monitor and verify         :crit, monitor, after switch, 3d
    Migration complete         :milestone, m_done, after monitor, 0d

    section Rollback Plan
    Maintain reverse sync      :rollback, after dry_run, 20d
    Decommission old DB        :decom, after m_done, 10d
```

## Best Practices

1. **Use sections to organize tasks** -- group by team, phase, or workstream. A flat list of 20+ tasks is hard to scan
2. **Mark critical path tasks** -- use `:crit` on tasks that, if delayed, would push back the overall deadline. This highlights the most important chain
3. **Use dependencies (`after`) instead of hardcoded dates** -- `after task_a` is more maintainable than `2026-03-15` because shifting one task automatically shifts its dependents
4. **Add milestones for key checkpoints** -- sprint reviews, approvals, go-live dates. Milestones are zero-duration markers that anchor the timeline
5. **Use `done` and `active` status** -- mark completed tasks as `:done` and current tasks as `:active` so the chart shows progress at a glance
6. **Keep task names short** -- they appear as bar labels. Aim for 3-5 words
7. **Limit total tasks to 25** -- larger Gantt charts become unreadable. For complex projects, break into multiple charts by phase or team

## Prompting for Input

Gantt charts require structured data. When the user's request is vague, prompt for:

1. **What are the main tasks or phases?**
2. **What is the start date?**
3. **How long is each task (in days or weeks)?**
4. **Are there dependencies between tasks?** (What must finish before what can start?)
5. **Are there any milestones or deadlines?**
6. **Which tasks are critical or high-priority?**

If the user provides only a rough outline (e.g., "3-month migration plan"), propose a reasonable breakdown and ask them to confirm or adjust before rendering.

## Common Pitfalls

- **Forgetting `dateFormat`** -- without it, Mermaid may misparse dates. Always include `dateFormat YYYY-MM-DD`
- **Circular dependencies** -- `after a` on task B and `after b` on task A creates an impossible cycle. Mermaid will error
- **Tasks with no start** -- every task needs either an absolute start date or an `after` reference. Mermaid will not infer start dates
- **Overlapping section names** -- each section name must be unique. Duplicate section names cause rendering issues
- **Missing task IDs on tasks that are referenced** -- if another task uses `after my_task`, then `my_task` must have an explicit ID in its definition
