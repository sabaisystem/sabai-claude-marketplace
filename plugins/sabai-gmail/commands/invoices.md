# /invoices Command

Find, organize, and download invoice and receipt emails.

## Usage

```
/invoices [action] [options]
```

## Actions

| Action | Description |
|--------|-------------|
| `find` | Search for invoice emails (default) |
| `download` | Download invoice attachments |
| `tag` | Label invoice emails for organization |
| `summary` | Show invoice summary with totals |

## Options

| Option | Description | Example |
|--------|-------------|---------|
| `--from` | Filter by sender/vendor | `--from amazon` |
| `--after` | Start date | `--after 2026-01-01` |
| `--before` | End date | `--before 2026-02-01` |
| `--month` | Shorthand for month | `--month january` |
| `--year` | Filter by year | `--year 2025` |
| `--unread` | Only unread emails | `--unread` |
| `--label` | Apply/filter by label | `--label "Invoices/2026"` |

## Behavior

### `/invoices` (no action)

Default: Find invoices from the last 30 days.

1. Search Gmail for invoice/receipt emails
2. Display results table with:
   - Date
   - Sender/Vendor
   - Subject
   - Attachment info
3. Offer quick actions (download, tag, details)

### `/invoices find [options]`

Search with specific criteria:

```
/invoices find --from aws --month january
/invoices find --after 2025-01-01 --before 2025-12-31
/invoices find --unread
```

### `/invoices download [options]`

Download invoice attachments:

```
/invoices download                    # Download from last 30 days
/invoices download --from amazon      # Download Amazon receipts
/invoices download --year 2025        # Download all 2025 invoices
```

Files saved to: `~/Downloads/Invoices/[year]/[month]/[vendor]/`

### `/invoices tag [label] [options]`

Apply labels to invoice emails:

```
/invoices tag                         # Tag with default "Invoices" label
/invoices tag "Tax 2025"              # Tag with custom label
/invoices tag "Expenses/AWS" --from aws
```

### `/invoices summary [options]`

Generate invoice summary with totals:

```
/invoices summary --year 2025
/invoices summary --month january
```

Output:
```
Invoice Summary - January 2026

| Vendor | Count | Total |
|--------|-------|-------|
| AWS | 1 | $142.50 |
| Slack | 1 | $82.00 |
| Adobe | 1 | $54.99 |
| **Total** | **3** | **$279.49** |
```

## Examples

```
# Find all invoices from last month
/invoices

# Find Amazon receipts from 2025
/invoices find --from amazon --year 2025

# Download all invoices for tax filing
/invoices download --year 2025

# Tag Q1 invoices
/invoices tag "Q1 2026" --after 2026-01-01 --before 2026-04-01

# Get summary for expense report
/invoices summary --month february
```

## Output

### Find Results

```
Found 12 invoice emails from the last 30 days:

| # | Date | Vendor | Subject | Attachment |
|---|------|--------|---------|------------|
| 1 | Feb 18 | AWS | AWS Invoice February | invoice.pdf |
| 2 | Feb 15 | Apple | App Store Receipt | receipt.pdf |
| 3 | Feb 12 | Slack | Slack Invoice | invoice-feb.pdf |
...

Quick actions:
- Download all: `/invoices download`
- Tag all: `/invoices tag "Feb 2026"`
- View details: "Show me invoice #3"
```

### Download Confirmation

```
Downloaded 12 invoice attachments:

Saved to ~/Downloads/Invoices/2026/02/:
  aws/invoice-february-2026.pdf
  apple/receipt-2026-02-15.pdf
  slack/invoice-feb.pdf
  ...

Total: 12 files, 4.2 MB
```

### Tag Confirmation

```
Tagged 12 emails with label "Invoices/Feb 2026"

View anytime: Search "label:Invoices/Feb 2026"
```

## Related Commands

- `/inbox` - General inbox management
- `/search` - Advanced email search

## Related Skills

- `invoice-detection.md` - Full invoice detection workflow
