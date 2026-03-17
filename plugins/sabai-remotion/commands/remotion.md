# /remotion

Create or refine a complete Remotion production plan from a short brief.

## Usage

```
/remotion [brief]
```

## When to Use

- The user has a rough video idea and needs structure
- The user wants a Remotion-friendly plan before writing code
- The user wants to adapt one concept into multiple formats or durations

## Instructions

1. Clarify the production brief:
   - Goal
   - Audience
   - Target duration
   - Output format (16:9, 9:16, 1:1)
   - Call to action
   - Constraints such as assets, voiceover, captions, or brand rules
2. If information is missing, make the smallest reasonable assumptions and state them.
3. Produce a plan with:
   - Creative direction
   - Core message
   - Scene-by-scene structure with durations
   - Composition/component breakdown
   - Motion and transition notes
   - Asset checklist
   - Implementation notes for Remotion
4. If the user mentions an existing codebase, align naming and structure to the files or conventions they provide.
5. Keep recommendations practical. Avoid motion ideas that are expensive to implement unless the user asks for them.

## Output Format

```markdown
# Remotion Plan: [Title]

## Brief
- Goal:
- Audience:
- Format:
- Duration:
- CTA:

## Creative Direction

## Structure
| Scene | Time | Purpose | Visual |
|-------|------|---------|--------|

## Composition Plan
- Root composition:
- Child components:
- Shared props:

## Motion Notes

## Asset Checklist

## Implementation Notes
```
