---
name: xero-accounting
description: Manage Xero accounting - invoices, contacts, payments, and financial reports
user-invocable: true
sample-prompts:
  - "List all outstanding invoices"
  - "Create an invoice for Customer ABC"
  - "Show me the profit and loss for last month"
  - "Get the balance sheet as of today"
  - "List all contacts"
  - "Record a payment for invoice INV-001"
---

# Xero Accounting Skill

This skill provides full integration with Xero accounting software using the official Xero MCP Server.

## Available MCP Tools

### Tenant Management

| Tool | Description |
|------|-------------|
| `xero_get_tenants` | List all connected Xero organizations |
| `xero_select_tenant` | Select organization for subsequent API calls |

### Contacts

| Tool | Description |
|------|-------------|
| `xero_list_contacts` | List customers and suppliers with optional filtering |
| `xero_get_contact` | Get a single contact by ID |
| `xero_create_contact` | Create a new contact |
| `xero_update_contact` | Update contact information |

### Invoices

| Tool | Description |
|------|-------------|
| `xero_list_invoices` | List invoices with optional filtering by status, type |
| `xero_get_invoice` | Get a single invoice by ID |
| `xero_create_invoice` | Create a new invoice (ACCREC) or bill (ACCPAY) |
| `xero_update_invoice` | Update invoice details or status |
| `xero_void_invoice` | Void/cancel an invoice |

### Payments

| Tool | Description |
|------|-------------|
| `xero_list_payments` | List all payments |
| `xero_get_payment` | Get a single payment by ID |
| `xero_create_payment` | Record a payment against an invoice |
| `xero_delete_payment` | Delete (void) a payment |

### Financial Reports

| Tool | Description |
|------|-------------|
| `xero_profit_loss` | Generate Profit & Loss statement |
| `xero_balance_sheet` | Generate Balance Sheet |
| `xero_trial_balance` | Generate Trial Balance |

### Accounts

| Tool | Description |
|------|-------------|
| `xero_list_accounts` | List chart of accounts (bank, revenue, etc.) |

## Invoice Types

| Type | Code | Description |
|------|------|-------------|
| Sales Invoice | `ACCREC` | Invoices sent to customers (Accounts Receivable) |
| Bill | `ACCPAY` | Bills received from suppliers (Accounts Payable) |

## Invoice Statuses

| Status | Description | Editable |
|--------|-------------|----------|
| `DRAFT` | Not finalized | Yes |
| `SUBMITTED` | Awaiting approval | Limited |
| `AUTHORISED` | Approved, awaiting payment | No |
| `PAID` | Fully paid | No |
| `VOIDED` | Cancelled | No |

## Common Workflows

### Create and Send an Invoice

1. **Find or create the contact:**
```
List contacts to find "ABC Company"
```

2. **Get account codes (optional):**
```
List accounts where Type is REVENUE
```

3. **Create the invoice:**
```
Create an invoice for ABC Company:
- Description: Web Development Services
- Quantity: 10 hours
- Unit Price: $150
- Due Date: 30 days from today
- Status: AUTHORISED
```

### Record a Payment

1. **Find the invoice:**
```
List invoices with status AUTHORISED
```

2. **Get bank accounts:**
```
List accounts where Type is BANK
```

3. **Record the payment:**
```
Create payment for invoice INV-001:
- Account: Business Checking
- Amount: $1,500
- Date: Today
```

### Generate Financial Reports

**Profit & Loss:**
```
Generate Profit & Loss report for January 2026 (2026-01-01 to 2026-01-31)
```

**Balance Sheet:**
```
Generate Balance Sheet as of 2026-01-31
```

**Aged Receivables:**
```
Show aged receivables by contact
```

### Create a Bill (Supplier Invoice)

```
Create a bill from Supplier XYZ:
- Type: ACCPAY
- Description: Office Supplies
- Amount: $250
- Due Date: 2026-03-15
- Status: DRAFT
```

## Filter Examples

### Contacts
```
List contacts where IsCustomer is true
List contacts where Name contains "Smith"
List active contacts only
```

### Invoices
```
List invoices where Status is AUTHORISED
List invoices where Type is ACCREC
List invoices where AmountDue > 0
List overdue invoices
```

### Accounts
```
List accounts where Type is BANK
List accounts where Type is REVENUE
List active accounts
```

## Date Formats

- All dates use **YYYY-MM-DD** format
- Example: `2026-02-20`

## Currency

- Amounts use decimal format: `150.00`
- Currency is determined by your Xero organization settings

## Multi-Organization Support

If you have multiple Xero organizations connected:
1. The first organization is used by default
2. Use organization selection if available in MCP tools

## Rate Limiting

- Xero API: 60 calls/minute
- Handle 429 errors gracefully
- Add delays between bulk operations

## Troubleshooting

### Authentication Issues
- Verify XERO_CLIENT_ID and XERO_CLIENT_SECRET are set
- Check Custom Connection is properly authorized
- Ensure required scopes are granted

### "No invoices found"
- Check filter parameters
- Verify organization selection
- Try listing without filters first

### Rate Limit Exceeded
- Wait and retry after delay
- Reduce batch sizes for bulk operations
