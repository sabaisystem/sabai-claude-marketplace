---
name: setup-harvest
description: Set up the Harvest CLI for time tracking
---

# /setup-harvest - Set Up Harvest CLI

Set up the Harvest CLI for time tracking.

## Usage

```
/setup-harvest
```

## What It Does

1. **Check if hrvst-cli is installed**
   - Run: `which hrvst`
   - If not found, install it: `npm install -g hrvst-cli`

2. **Verify authentication**
   - Run: `hrvst alias list`
   - If auth fails, guide user to run: `hrvst login`

3. **Help create aliases**
   - List existing aliases: `hrvst alias list`
   - For each common work type, suggest creating an alias
   - Run: `hrvst alias create <name>` interactively

## Workflow

### Step 1: Check Installation

```bash
which hrvst
```

- If found: Proceed to Step 2
- If not found: Run `npm install -g hrvst-cli` then continue

### Step 2: Verify Login

```bash
hrvst alias list
```

- If works: Show existing aliases
- If auth error: Tell user to run `hrvst login` in their terminal (requires browser)

### Step 3: Alias Setup

Ask the user about their typical work:
- "What are your main projects?"
- "Do you track meetings separately?"
- "Any administrative or overhead time to track?"

For each category, help them create an alias:
```bash
hrvst alias create <suggested-name>
```

## Example Session

```
> /setup-harvest

Checking if Harvest CLI is installed...
hrvst-cli is installed.

Checking authentication...
You're logged in.

Current aliases:
- client-dev
- meetings

Would you like to create more aliases for common work types?
Suggested aliases:
- admin (administrative tasks)
- support (customer support)

Type the alias name to create, or 'done' to finish.
```

## Notes

- The `hrvst login` command opens a browser and cannot be run non-interactively
- Alias creation is interactive and requires user input to select project/task
- Guide the user through these interactive steps rather than trying to automate them
