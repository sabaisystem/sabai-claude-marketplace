# Sabai Xero

**Xero accounting integration for invoice management, contacts, payments, and financial reports.**

| Field | Value |
|-------|-------|
| Type | MCP + Skills + Commands |
| Version | 1.0.0 |
| Status | Active |
| Command | `/invoice`, `/xero-report`, `/contacts` |
| Repo | `plugins/sabai-xero` |

---

## Overview

A comprehensive Xero accounting plugin with PKCE authentication (free, no client secret required). Manage invoices, contacts, payments, and generate financial reports directly through Claude. Supports both sales invoices (ACCREC) and bills (ACCPAY), with full CRUD operations and financial reporting.

## Key Features

- **PKCE Authentication** - Free OAuth flow, no paid Xero subscription required
- Invoice management (create, view, update, void)
- Contact/customer management
- Payment recording and tracking
- Financial reports (Profit & Loss, Balance Sheet, Trial Balance)
- Multi-organization support

## Use Cases

- "List all outstanding invoices"
- "Create an invoice for Client ABC for $5,000"
- "Show me the profit and loss for last month"
- "Record a payment for invoice INV-001"
- "What's our current balance sheet?"
- "List all contacts"

## MCP Tools

### Tenant Management
- `xero_get_tenants` - List connected organizations
- `xero_select_tenant` - Select active organization

### Contacts
- `xero_list_contacts` - List customers and suppliers
- `xero_get_contact` - Get contact by ID
- `xero_create_contact` - Create new contact
- `xero_update_contact` - Update contact details

### Invoices
- `xero_list_invoices` - List invoices with filtering
- `xero_get_invoice` - Get invoice by ID
- `xero_create_invoice` - Create sales invoice or bill
- `xero_update_invoice` - Update invoice details
- `xero_void_invoice` - Void an invoice

### Payments
- `xero_list_payments` - List all payments
- `xero_get_payment` - Get payment by ID
- `xero_create_payment` - Record a payment
- `xero_delete_payment` - Delete (void) payment

### Financial Reports
- `xero_profit_loss` - Profit & Loss statement
- `xero_balance_sheet` - Balance Sheet
- `xero_trial_balance` - Trial Balance

### Accounts
- `xero_list_accounts` - Chart of accounts

## Commands

- `/invoice [action]` - Create, list, or manage invoices
- `/xero-report [type]` - Generate financial reports (pnl, balance-sheet, trial-balance)
- `/contacts [action]` - Manage Xero contacts

## Configuration

### Environment Variables

Required environment variables:

```bash
export XERO_CLIENT_ID="your_client_id_here"
```

**Note:** This plugin uses PKCE authentication, which does not require a client secret. This is the recommended approach for public applications as it's both free and more secure.

### MCP Server Setup

```json
{
  "mcpServers": {
    "xero": {
      "command": "node",
      "args": ["./mcp/index.js"],
      "env": {
        "XERO_CLIENT_ID": "${XERO_CLIENT_ID}"
      }
    }
  }
}
```

## Authentication

### Setting Up Xero API Access (PKCE - Free)

1. Go to [Xero Developer Portal](https://developer.xero.com/app/manage)
2. Click "New app"
3. Select **Web app**
4. Fill in details:
   - App name: Your app name
   - Company URL: Your company URL
   - Redirect URI: `http://localhost:3000/callback`
5. Click "Create app"
6. Copy the **Client ID** (no client secret needed for PKCE)
7. Set the `XERO_CLIENT_ID` environment variable

### First-Time Authentication

On first run, the MCP server will:
1. Open your browser to the Xero authorization page
2. Start a local server on `http://localhost:3000` to receive the callback
3. Exchange the authorization code using PKCE
4. Save the token to `config/token.json` for future use
5. Automatically refresh tokens when they expire

### Required Scopes

The following scopes are requested automatically:

- `accounting.transactions` - Invoices, payments, bills
- `accounting.contacts` - Contacts management
- `accounting.settings` - Chart of accounts, tax rates
- `accounting.reports.read` - Financial reports
- `offline_access` - Token refresh

## Permissions

Required Claude Code permissions:
- Xero MCP tools for accounting operations

## Dependencies

- **Required**: Node.js v18+
- **Required**: Xero account with API access
- **Required**: Xero Client ID (free, no paid subscription required)

## Invoice Types

| Type | Code | Description |
|------|------|-------------|
| Sales Invoice | `ACCREC` | Invoices you send to customers |
| Bill | `ACCPAY` | Bills you receive from suppliers |

## Invoice Statuses

| Status | Description |
|--------|-------------|
| `DRAFT` | Not finalized, can be edited |
| `SUBMITTED` | Awaiting approval |
| `AUTHORISED` | Approved, awaiting payment |
| `PAID` | Fully paid |
| `VOIDED` | Cancelled |

## Limitations

- Requires Xero account with API access
- First-time authentication requires browser access
- Rate limited to 60 API calls/minute
- Token stored locally in `config/token.json`

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-xero)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-xero/CHANGELOG.md)
- [Xero Developer Portal](https://developer.xero.com/)
- [Xero API Documentation](https://developer.xero.com/documentation/)
- [PKCE OAuth Guide](https://developer.xero.com/documentation/guides/oauth2/pkce-flow)
