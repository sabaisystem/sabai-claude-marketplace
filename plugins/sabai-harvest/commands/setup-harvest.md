# /setup-harvest - Set Up Harvest CLI

Set up the Harvest CLI for time tracking and configure your role.

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

3. **Detect and configure role**
   - Check Harvest API permissions
   - Store role in `~/.sabai/harvest.json`

4. **Help create aliases**
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

### Step 3: Detect Role

Check user's Harvest permissions to detect role:

```bash
# Try to list team members (manager-only endpoint)
hrvst users list
```

- If succeeds: User has manager access
- If fails with 403: User is an employee

Present the detection result to the user:

```
Detecting your Harvest permissions...

Your access level:
  - Your own time entries
  - Team member time entries (if manager)
  - Project budgets and rates (if manager)

This indicates you have [Manager/Employee] access.

Configure as [Manager/Employee]? (yes/no)
```

### Step 4: Store Configuration

After user confirms, store the role:

```bash
mkdir -p ~/.sabai
cat > ~/.sabai/harvest.json << EOF
{
  "role": "manager",
  "configuredAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
```

Configuration file format (`~/.sabai/harvest.json`):

```json
{
  "role": "manager",
  "harvestUserId": "12345",
  "defaultProject": "Development",
  "configuredAt": "2026-02-20T12:00:00Z"
}
```

### Step 5: Alias Setup

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

Detecting your Harvest permissions...

Your access level:
  - Your own time entries
  - Team member time entries
  - Project budgets and rates

This indicates you have Manager access.

Configure as Manager? (yes/no)
> yes

Role saved to ~/.sabai/harvest.json

Current aliases:
- client-dev
- meetings

Would you like to create more aliases for common work types?
Suggested aliases:
- admin (administrative tasks)
- support (customer support)

Type the alias name to create, or 'done' to finish.
```

## Role-Based Commands

After role configuration, available commands depend on your role:

| Command | Employee | Manager |
|---------|----------|---------|
| `/timesheet` | Yes | Yes |
| `/duplicate-week` | Yes | Yes |
| `/log` | Yes | Yes |
| `/team-timesheet` | No | Yes |
| `/approve` | No | Yes |
| `/project-budget` | No | Yes |
| `/team-report` | No | Yes |
| `/remind` | No | Yes |

If you try to use a manager-only command as an employee, you'll see:

```
This command requires manager access.

Your current role: employee
Required role: manager

To configure manager access, run:
  /setup-harvest
```

## Notes

- The `hrvst login` command opens a browser and cannot be run non-interactively
- Alias creation is interactive and requires user input to select project/task
- Guide the user through these interactive steps rather than trying to automate them
- Role configuration is stored locally and can be reconfigured at any time
