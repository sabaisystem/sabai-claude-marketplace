---
name: xero-report
description: Generate Xero financial reports
user-invocable: true
---

# /xero-report Command

Generate financial reports from Xero including Profit & Loss, Balance Sheet, and Trial Balance.

## Usage

```
/xero-report [type] [period]
```

## Report Types

### Profit & Loss (P&L)

```
/xero-report pnl
/xero-report pnl january
/xero-report pnl 2026-01-01 to 2026-01-31
/xero-report pnl last-month
/xero-report pnl ytd
```

Shows income, expenses, and net profit for a period.

### Balance Sheet

```
/xero-report balance-sheet
/xero-report balance-sheet 2026-01-31
/xero-report balance-sheet end-of-month
```

Shows assets, liabilities, and equity as of a specific date.

### Trial Balance

```
/xero-report trial-balance
/xero-report trial-balance 2026-01-31
```

Shows all account balances for verification.

### Aged Receivables

```
/xero-report aged-receivables
/xero-report ar
```

Shows outstanding customer invoices by age.

### Aged Payables

```
/xero-report aged-payables
/xero-report ap
```

Shows outstanding bills by age.

## Period Shortcuts

| Shortcut | Description |
|----------|-------------|
| `today` | Current date |
| `yesterday` | Previous day |
| `this-month` | Current month |
| `last-month` | Previous month |
| `this-quarter` | Current quarter |
| `last-quarter` | Previous quarter |
| `ytd` | Year to date |
| `last-year` | Previous full year |

## Examples

### Monthly P&L

```
/xero-report pnl last-month
```

Output:
```
Profit & Loss - January 2026

INCOME
  Sales Revenue         $45,000.00
  Service Revenue       $12,500.00
  ─────────────────────────────────
  Total Income          $57,500.00

EXPENSES
  Salaries              $25,000.00
  Rent                   $3,500.00
  Software               $1,200.00
  Marketing              $2,800.00
  ─────────────────────────────────
  Total Expenses        $32,500.00

NET PROFIT              $25,000.00
```

### Balance Sheet

```
/xero-report balance-sheet today
```

Output:
```
Balance Sheet - Feb 20, 2026

ASSETS
  Cash & Bank           $85,000.00
  Accounts Receivable   $32,500.00
  Equipment             $15,000.00
  ─────────────────────────────────
  Total Assets         $132,500.00

LIABILITIES
  Accounts Payable      $12,500.00
  Loans                 $25,000.00
  ─────────────────────────────────
  Total Liabilities     $37,500.00

EQUITY
  Retained Earnings     $95,000.00
  ─────────────────────────────────
  Total Equity          $95,000.00

Total Liabilities + Equity: $132,500.00
```

### Quick Cash Position

```
/xero-report balance-sheet | focus on cash and bank accounts
```

## Tips

1. Use `ytd` for year-to-date comparisons
2. Balance sheet is always "as of" a date
3. P&L is always for a date range
4. Aged reports help with collections/payments
