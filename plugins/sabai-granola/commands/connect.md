# Connect to Granola

Connect and authenticate with Granola to enable all Sabai meeting intelligence features.

## When to use

When the user wants to:
- Set up Granola for the first time
- Re-authenticate with Granola
- Test the Granola connection

## Instructions

1. Inform the user that you're initiating the Granola OAuth connection
2. Call the Granola MCP `list_meetings` tool with `time_range: "this_week"` to trigger the OAuth flow
3. If authentication is needed, a browser window will open for the user to sign in
4. Once authenticated, confirm the connection is successful and show a sample meeting if available

## Example Response

If connection succeeds:
```
Connected to Granola successfully!

Your most recent meeting: "Weekly Team Standup" (Today at 10:00 AM)
```

If authentication is needed:
```
Opening browser for Granola authentication...

Please sign in with your Granola account in the browser window that just opened.
```

## Follow-up Actions

After a successful connection, if the current user prompt starts with /connect, use `AskUserQuestion` to help the user get started right away:

> "You're connected! What would you like to do first?"
> Options: "Show my recent meetings", "Summarize my last meeting", "Check my action items", "Ask a question about a meeting"

After a failed connection:
> "The connection didn't work. What would you like to try?"
> Options: "Try connecting again", "Check if Granola is running"
