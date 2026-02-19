#!/bin/bash
# Hook: validate-role.sh
# Purpose: Block manager-only commands for employees
# Exit codes:
#   0 - Allow the command
#   2 - Block with error message (shown to user)

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt')

# Get user role from config
CONFIG_FILE="$HOME/.sabai/harvest.json"
ROLE=$(jq -r '.role // "employee"' "$CONFIG_FILE" 2>/dev/null || echo "employee")

# Manager-only commands pattern
MANAGER_COMMANDS="^/(team-timesheet|approve|project-budget|team-report|remind)"

if [[ "$PROMPT" =~ $MANAGER_COMMANDS ]]; then
  if [[ "$ROLE" != "manager" && "$ROLE" != "admin" ]]; then
    cat << 'EOF' >&2
This command requires manager access.

Your current role: employee
Required role: manager

To configure manager access, run:
  /setup-harvest

If you believe you should have manager access, contact your Harvest administrator.
EOF
    exit 2  # Block with message
  fi
fi

exit 0
