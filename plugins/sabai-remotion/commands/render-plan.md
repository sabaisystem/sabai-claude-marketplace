# /render-plan

Prepare a handoff for implementing or rendering a Remotion video.

## Usage

```
/render-plan [brief or code context]
```

## When to Use

- The storyboard is approved and the team needs implementation guidance
- The user wants to map scenes to compositions, props, and assets
- The user needs a checklist before rendering variants

## Instructions

1. Gather the production constraints:
   - Target formats
   - FPS
   - Duration
   - Captioning or audio needs
   - Localization or variant requirements
2. Organize the build into:
   - Compositions
   - Reusable components
   - Data/props shape
   - Assets and fonts
   - Render variants
3. Highlight technical risks such as dynamic text overflow, asset loading, or timing drift.
4. If the user shares a Remotion project structure, match the plan to that structure.
5. End with an execution checklist in the order the team should build.

## Output Format

```markdown
# Render Plan: [Title]

## Build Targets

## Composition Map

## Props / Data Model

## Assets Needed

## Technical Risks

## Execution Checklist
1.
2.
3.
```
