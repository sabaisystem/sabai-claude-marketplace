# /connect

Connect and authenticate with Granola.

## When to use

When the user wants to:
- Set up Granola for the first time
- Re-authenticate with Granola
- Test the Granola connection

## Instructions

1. Inform the user that you're initiating the Granola OAuth connection
2. Call the Granola MCP `list_meetings` tool with a limit of 1 to trigger the OAuth flow
3. If authentication is needed, a browser window will open for the user to sign in
4. Once authenticated, confirm the connection is successful and show a sample meeting if available

## Example Response

If connection succeeds:
```
✓ Connected to Granola successfully!

Your recent meeting: "Weekly Team Standup" (Today at 10:00 AM)

You can now use:
- /search - Search your meetings
- /summary - Summarize meetings
- /ask - Ask questions about meetings
- /analyze - Smart analysis by meeting type
- /coach - Get coaching on work patterns
```

If authentication is needed:
```
🔐 Opening browser for Granola authentication...

Please sign in with your Granola account in the browser window that just opened.
```
