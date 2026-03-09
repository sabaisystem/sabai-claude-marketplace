---
name: contacts
description: Manage Xero contacts (customers and suppliers)
user-invocable: true
---

# /contacts Command

Manage Xero contacts including customers, suppliers, and other business relationships.

## Usage

```
/contacts [action] [options]
```

## Actions

### List Contacts

```
/contacts
/contacts list
/contacts list customers
/contacts list suppliers
/contacts search "company name"
```

**Filters:**
- `customers` - Show customers only (IsCustomer=true)
- `suppliers` - Show suppliers only (IsSupplier=true)
- `active` - Show active contacts only

### View Contact

```
/contacts view "Company Name"
/contacts "Company Name"
```

Shows full contact details including:
- Contact info (name, email, phone)
- Addresses
- Payment terms
- Outstanding balance

### Create Contact

```
/contacts create
/contacts create "New Company Name"
/contacts create customer "ABC Corp"
/contacts create supplier "XYZ Supplies"
```

**Interactive flow:**
1. Enter contact name
2. Select type (customer/supplier/both)
3. Add contact details (email, phone)
4. Add address (optional)

### Update Contact

```
/contacts update "Company Name"
```

Update contact details like email, phone, address.

## Examples

### List All Customers

```
/contacts list customers
```

Output:
```
Customers (15)

ABC Company           abc@example.com        $1,500.00 owing
XYZ Corporation       contact@xyz.com        $0.00
Acme Industries       billing@acme.com       $3,200.00 owing
...

Total Outstanding: $12,450.00
```

### Create a Customer

```
/contacts create customer "New Client Ltd"
- Email: billing@newclient.com
- Phone: +1 555-0123
- Payment Terms: 30 days
```

### Search Contacts

```
/contacts search "tech"
```

Output:
```
Search Results for "tech" (3)

TechCorp Inc          Customer    techcorp@example.com
Tech Supplies Ltd     Supplier    orders@techsupplies.com
Hightech Solutions    Both        info@hightech.io
```

### View with Balance

```
/contacts view "ABC Company"
```

Output:
```
ABC Company
═══════════════════════════════════════

Type:           Customer
Status:         Active
Email:          billing@abc.com
Phone:          +1 555-0100

Outstanding:    $1,500.00
  INV-001       $1,000.00   Due Feb 28
  INV-003       $500.00     Due Mar 5

Payment Terms:  Net 30
```

## Contact Types

| Type | Description |
|------|-------------|
| Customer | Someone you invoice (ACCREC) |
| Supplier | Someone who invoices you (ACCPAY) |
| Both | Can be either customer or supplier |

## Tips

1. Search by partial name works
2. View command shows outstanding balance
3. Customers and suppliers can overlap
4. Use `active` filter to hide archived contacts
