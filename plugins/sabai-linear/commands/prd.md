# /prd Command

Create a Product Requirement Document (PRD).

## Usage

```
/prd [feature name or description]
```

## Behavior

When this command is invoked:

1. If a feature name/description is provided, start drafting the PRD immediately
2. If no input, ask clarifying questions:
   - What feature or product are we documenting?
   - What problem does it solve?
   - Who are the target users?

3. Generate a complete PRD using the template from the PRD skill

4. After generating, offer to:
   - Refine any section
   - Break it down into Linear tickets
   - Export to a specific format

## Examples

```
/prd User authentication with SSO
/prd
/prd We need a dashboard for analytics
```
