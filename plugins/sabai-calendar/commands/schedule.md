# /schedule - Schedule a Meeting

Find available times and schedule a meeting with attendees.

## Usage

```
/schedule [description] [duration] [attendees]
```

- `description`: What the meeting is about
- `duration`: Meeting length (30m, 1h, etc.)
- `attendees`: Email addresses (comma-separated)

## Examples

```
/schedule Project kickoff 1h alice@example.com, bob@example.com
/schedule 1:1 with Sarah 30m sarah@example.com
/schedule Team sync 45m
```

## What It Does

1. Parses meeting details from input
2. Queries free/busy for all attendees
3. Finds available slots within working hours
4. Presents options to user
5. Creates event on confirmation

## Interaction Flow

```markdown
## Scheduling: Project Kickoff (1 hour)

**Attendees:**
- alice@example.com
- bob@example.com
- You

**Looking for times in the next 5 business days...**

### Available Slots

| # | Date | Time | All Available |
|---|------|------|---------------|
| 1 | Mon, Jan 15 | 10:00 AM - 11:00 AM | Yes |
| 2 | Mon, Jan 15 | 2:00 PM - 3:00 PM | Yes |
| 3 | Tue, Jan 16 | 11:00 AM - 12:00 PM | Yes |
| 4 | Wed, Jan 17 | 9:00 AM - 10:00 AM | Yes |

Which time works best? (Enter number or suggest another time)
```

## After Selection

```markdown
## Meeting Created

**Project Kickoff**
- **When:** Monday, Jan 15, 10:00 AM - 11:00 AM EST
- **Where:** Google Meet (link attached)
- **Attendees:** alice@example.com, bob@example.com

Calendar invites have been sent to all attendees.
```

## Options

- `--video`: Include video call link (Meet by default)
- `--zoom`: Use Zoom instead of Meet
- `--location [place]`: Add physical location
- `--urgent`: Look only in next 2 days

## Tips

- Always confirm timezone with attendees in different zones
- Suggest 25 or 50 minute meetings for buffer time
- Avoid scheduling over lunch or late Friday
- Include agenda in meeting description
