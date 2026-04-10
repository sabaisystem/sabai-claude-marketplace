---
name: followup
description: Find emails needing follow-up and create responses
---

# /followup Command

Find emails needing follow-up and create responses.

## Usage

```
/followup                           # Detect emails needing follow-up
/followup --detect                  # Same as above
/followup --detect --days 3         # Last 3 days only
/followup [email reference]         # Follow up on specific email
```

## Behavior

### Mode 1: Detection (default)

When invoked without a reference or with `--detect`:

#### Step 1: Search Recent Emails

Use `gmail_search` to find candidates:

```
gmail_search({ query: "in:inbox newer_than:7d -category:promotions -category:social -category:updates" })
```

Adjust `7d` based on `--days` flag.

#### Step 2: Get Details & Filter

For each email, use `gmail_get_message` to get full details.

**Include if:**
- Email is TO the user (not just CC)
- No reply from user in the thread
- Contains questions (? marks)
- Contains action keywords: please, could you, need, request, deadline, urgent, asap
- From a real person (not noreply@, notifications@, etc.)

**Exclude if:**
- Already replied to in the thread
- From newsletter/marketing (unsubscribe link)
- Automated notification (GitHub, Jira, calendar, etc.)
- From noreply@, notifications@, alerts@, mailer-daemon@

#### Step 3: Calculate Urgency Score (1-10)

For each remaining email, calculate score:

| Factor | Points |
|--------|--------|
| **Days waiting** | |
| 1-2 days | +1 |
| 3-4 days | +2 |
| 5-7 days | +3 |
| 7+ days | +4 |
| **Content signals** | |
| Contains "urgent" or "ASAP" | +3 |
| Contains deadline/date | +2 |
| Contains "?" (per question, max +3) | +1 |
| Contains "please" + action verb | +1 |
| Mentions money/payment | +2 |
| Has attachment | +1 |
| **Sender signals** | |
| From known/frequent contact | +2 |
| Has "Re:" (ongoing thread) | +1 |
| CC'd others (accountability) | +1 |

#### Step 4: Present Selection Interface

Use the email-selection skill to display emails as numbered cards:
- Show: sender, subject, date, days waiting, snippet preview, urgency score
- Sort by urgency (default) with option to re-sort

#### Step 5: Handle User Selection

- Accept number input (1, 2, 3...)
- Accept natural language ("the one from Sarah", "the budget email")
- Support sorting: "sort by date", "sort by sender"
- Support filtering: "show urgent only", "show emails from John"
- Support dismissal: "dismiss 3", "skip"
- Support pagination: "more", "next page"

#### Step 6: Confirm & Draft

Confirm selection, fetch full email thread, then draft the follow-up email.

---

### Mode 2: Direct Follow-up

When invoked with a specific email reference:

1. Use reference as context
2. Determine follow-up stage:
   - First follow-up (3-5 days)
   - Second follow-up (1 week later)
   - Final follow-up (2+ weeks)
3. Draft appropriate follow-up using templates below
4. Offer to create draft or send via `gmail_create_draft` / `gmail_send_email`

## Follow-up Templates

### First Follow-up (friendly)
```
Hi [Name],

I wanted to follow up on my email from [day/date] regarding [topic].

[Brief recap of request]

I understand you're busy - just checking if you had a chance to review this.

Thanks,
[Name]
```

### Second Follow-up (direct)
```
Hi [Name],

Circling back on [topic]. I reached out a couple of times and haven't heard back.

[Restate key point]

If this isn't relevant or you're not the right person, let me know.

Thanks,
[Name]
```

### Final Follow-up (closing)
```
Hi [Name],

I've reached out a few times about [topic] without response.

I'll assume this won't be moving forward unless I hear otherwise.

Best,
[Name]
```

### Selection Interaction Examples

After running `/followup`, you can:

```
> 1                                     # Select email #1
> the one from Sarah                    # Select by sender
> sort by date                          # Re-sort the list
> show urgent only                      # Filter to urgent emails
> dismiss 3                             # Remove email #3 from list
> more                                  # Show next page (if 10+ emails)
> skip                                  # Exit without selecting
```

## Quick Flags

- `--detect` - Run detection (default behavior)
- `--days N` - Scan last N days (default: 7)
- `--sort [urgency|date|sender]` - Initial sort order
- `--first` - First follow-up (friendly reminder)
- `--second` - Second follow-up (more direct)
- `--final` - Final follow-up (closing the loop)
- `--urgent` - Add urgency to the message

## Examples

```
/followup
/followup --days 3
/followup on the budget approval I sent last week
/followup John about the project timeline
/followup --second reminder for contract review
```
