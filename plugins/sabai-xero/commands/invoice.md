---
name: invoice
description: Create, list, and manage Xero invoices
user-invocable: true
---

# /invoice Command

Manage Xero invoices - create, list, view, and update invoices and bills.

## Usage

```
/invoice [action] [options]
```

## Actions

### List Invoices

```
/invoice list
/invoice list outstanding
/invoice list overdue
/invoice list draft
```

**Options:**
- `outstanding` - Show unpaid invoices (AUTHORISED status)
- `overdue` - Show past-due invoices
- `draft` - Show draft invoices
- `bills` - Show bills (ACCPAY) instead of sales invoices

### View Invoice

```
/invoice view INV-001
/invoice INV-001
```

Shows full invoice details including line items, payments, and history.

### Create Invoice

```
/invoice create
/invoice create for "Client Name"
/invoice create bill
```

**Interactive flow:**
1. Select or create contact
2. Add line items (description, quantity, price)
3. Set due date
4. Choose status (DRAFT or AUTHORISED)

### Update Invoice

```
/invoice update INV-001
```

Update invoice details (only DRAFT invoices can be fully edited).

### Void Invoice

```
/invoice void INV-001
```

Void/cancel an invoice. Only works for unpaid invoices.

## Examples

### Quick Invoice Creation

```
/invoice create for "ABC Company" - Web Development 10hrs @ $150/hr due in 30 days
```

### List Outstanding

```
/invoice list outstanding
```

Output:
```
Outstanding Invoices (3)

INV-001  ABC Company      $1,500.00   Due: Feb 28, 2026
INV-002  XYZ Corp         $3,200.00   Due: Mar 05, 2026
INV-003  Acme Inc         $750.00     Due: Mar 10, 2026

Total Outstanding: $5,450.00
```

### Create a Bill

```
/invoice create bill from "Office Depot" for $250 - Office Supplies
```

## Invoice Types

| Type | Code | Created By |
|------|------|------------|
| Sales Invoice | ACCREC | `/invoice create` |
| Bill | ACCPAY | `/invoice create bill` |

## Status Flow

```
DRAFT → SUBMITTED → AUTHORISED → PAID
                         ↓
                      VOIDED
```

## Tips

1. Use `list outstanding` for quick aging review
2. Draft invoices can be edited freely
3. Authorised invoices require voiding to cancel
4. Bills (ACCPAY) track what you owe suppliers
