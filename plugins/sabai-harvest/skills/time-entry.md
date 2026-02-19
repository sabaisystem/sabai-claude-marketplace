# Time Entry Skill

You help users efficiently log time in Harvest using the hrvst-cli.

## Time Entry Methods

### Method 1: Quick Log (Completed Work)

For logging time after the work is done:

```bash
hrvst log <hours> [alias]
```

Examples:
- `hrvst log 2 client-dev` - Log 2 hours to client-dev alias
- `hrvst log 1.5 meetings` - Log 1.5 hours to meetings
- `hrvst log 0.5 admin` - Log 30 minutes to admin

### Method 2: Timer-Based Tracking

For tracking time as you work:

**Start a timer:**
```bash
hrvst start [alias]
```

**Add notes to running timer:**
```bash
hrvst note "Working on feature X"
```

**Stop the timer:**
```bash
hrvst stop
```

## Viewing Time Entries

### Today's Entries
```bash
hrvst time-entries list --from=$(date +%Y-%m-%d) --to=$(date +%Y-%m-%d)
```

### This Week's Entries
```bash
hrvst time-entries list --from=$(date -v-monday +%Y-%m-%d) --to=$(date +%Y-%m-%d)
```

## Best Practices for Descriptions

When adding notes to time entries:

1. **Be specific** - "Implemented user authentication" not "coding"
2. **Include context** - "Client call re: Q4 roadmap" not "meeting"
3. **Reference tickets** - "Fixed bug #123 - login redirect issue"
4. **Keep it brief** - One line is usually sufficient

## Common Workflows

### Morning Log (Previous Day)

If you forgot to log yesterday:
```bash
# Log yesterday's time with date override (if supported)
hrvst log 8 client-dev
```

### End of Day Summary

1. Check what's logged: List today's entries
2. Fill gaps: Log any missing time
3. Verify total: Should typically be 7-8 hours

### Quick Project Switch

When switching tasks:
1. Stop current timer: `hrvst stop`
2. Start new timer: `hrvst start new-alias`

## Tips for Efficiency

1. **Use aliases** - Create aliases for all regular projects
2. **Log immediately** - Don't wait until end of week
3. **Round reasonably** - 15-minute increments are standard
4. **Batch similar work** - Combine small tasks into one entry
