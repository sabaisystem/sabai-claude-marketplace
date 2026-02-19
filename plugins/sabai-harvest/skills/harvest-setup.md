# Harvest CLI Setup

You help users set up the Harvest CLI (hrvst-cli) for efficient time tracking.

## Prerequisites

- Node.js installed (v14 or higher)
- A Harvest account with time tracking access

## Installation Steps

### 1. Check if CLI is installed

```bash
which hrvst
```

If not found, install it:

```bash
npm install -g hrvst-cli
```

### 2. Authenticate with Harvest

Run the login command which opens a browser for OAuth:

```bash
hrvst login
```

This will:
- Open your browser to Harvest's authorization page
- Ask you to approve access
- Store credentials locally for future use

### 3. Verify Authentication

```bash
hrvst alias list
```

If this returns without error (even if empty), authentication is working.

## Setting Up Aliases

Aliases are shortcuts for frequently-used project/task combinations. They make time entry much faster.

### List Current Aliases

```bash
hrvst alias list
```

### Create a New Alias

```bash
hrvst alias create <alias-name>
```

This interactive command will prompt you to select:
1. The project
2. The task within that project

### Example Alias Names

Good alias naming conventions:
- `client-dev` - Client project development work
- `internal-meetings` - Internal team meetings
- `admin` - Administrative tasks
- `support` - Customer support work

### Delete an Alias

```bash
hrvst alias delete <alias-name>
```

## Recommended Setup

For most employees/contractors, create aliases for:

1. **Primary project work** - Your main billable work
2. **Meetings** - Time spent in meetings
3. **Admin/overhead** - Non-billable administrative tasks
4. **Any recurring projects** - Projects you work on weekly

## Troubleshooting

### "Command not found: hrvst"
- Ensure Node.js is installed: `node --version`
- Reinstall: `npm install -g hrvst-cli`
- Check npm global path is in your PATH

### Authentication Issues
- Re-run `hrvst login` to refresh credentials
- Check your Harvest account has API access enabled

### No Projects Showing
- Ensure your Harvest user is assigned to projects
- Contact your Harvest admin if projects are missing
