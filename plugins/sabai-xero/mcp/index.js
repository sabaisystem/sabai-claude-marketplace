#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { XeroClient, Invoice, Contact, Payment } from "xero-node";
import fs from "fs";
import path from "path";
import http from "http";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { URL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const tokenPath = process.env.XERO_TOKEN_PATH || path.join(__dirname, "../config/token.json");
const clientId = process.env.XERO_CLIENT_ID;
const clientSecret = process.env.XERO_CLIENT_SECRET; // Optional for PKCE
const redirectUri = "http://localhost:3000/callback";

const SCOPES = [
  "openid",
  "profile",
  "email",
  "accounting.transactions",
  "accounting.contacts",
  "accounting.settings",
  "accounting.reports.read",
  "offline_access",
];

let xero;
let activeTenantId = null;
let codeVerifier = null; // For PKCE flow

// ============ PKCE HELPERS ============

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString("base64url");
}

function generateCodeChallenge(verifier) {
  return crypto.createHash("sha256").update(verifier).digest("base64url");
}

// ============ AUTHENTICATION ============

async function runAuthFlow() {
  console.error("\n🔐 No authentication token found. Starting OAuth flow...\n");

  const tokenDir = path.dirname(tokenPath);
  if (!fs.existsSync(tokenDir)) {
    fs.mkdirSync(tokenDir, { recursive: true });
  }

  // Generate PKCE code verifier and challenge
  codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Configure Xero client (clientSecret is optional for PKCE)
  const xeroConfig = {
    clientId,
    redirectUris: [redirectUri],
    scopes: SCOPES,
  };

  // Only add clientSecret if provided (for non-PKCE flow)
  if (clientSecret) {
    xeroConfig.clientSecret = clientSecret;
  }

  xero = new XeroClient(xeroConfig);
  await xero.initialize();

  // Build consent URL with PKCE parameters
  let consentUrl = await xero.buildConsentUrl();

  // Add PKCE parameters to the URL
  const url = new URL(consentUrl);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  consentUrl = url.toString();

  console.error("Opening browser for authentication (PKCE flow)...");
  console.error("If browser doesn't open, visit this URL:\n");
  console.error(consentUrl);
  console.error("\n");

  // Open browser
  const { exec } = await import("child_process");
  exec(`open "${consentUrl}"`);

  // Start local server to receive callback
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, "http://localhost:3000");
        if (url.pathname === "/callback") {
          const code = url.searchParams.get("code");

          if (!code) {
            throw new Error("No authorization code received");
          }

          // For PKCE without client_secret, manually exchange the code for tokens
          const tokenResponse = await fetch("https://identity.xero.com/connect/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: redirectUri,
              client_id: clientId,
              code_verifier: codeVerifier,
            }).toString(),
          });

          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`);
          }

          const tokenSet = await tokenResponse.json();

          // Add expires_at for token expiry checking
          tokenSet.expires_at = Math.floor(Date.now() / 1000) + tokenSet.expires_in;

          // Save token
          fs.writeFileSync(tokenPath, JSON.stringify(tokenSet, null, 2));

          // Set the token on the XeroClient
          await xero.setTokenSet(tokenSet);

          // Update tenants
          await xero.updateTenants();

          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`
            <html>
              <body style="font-family: system-ui; text-align: center; padding: 50px;">
                <h1>✅ Xero Authentication Successful!</h1>
                <p>Connected to ${xero.tenants.length} organization(s).</p>
                <p>You can close this window. The MCP server will now start.</p>
              </body>
            </html>
          `);

          console.error("✅ Authentication successful! Token saved.\n");
          console.error(`Connected tenants: ${xero.tenants.map(t => t.tenantName).join(", ")}\n`);

          server.close();
          resolve(tokenSet);
        }
      } catch (error) {
        console.error("Auth error:", error.message);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Authentication failed: " + error.message);
        server.close();
        reject(error);
      }
    });

    server.listen(3000, () => {
      console.error("Waiting for authentication callback on http://localhost:3000...\n");
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error("Authentication timed out after 5 minutes"));
    }, 300000);
  });
}

// Manual token refresh for PKCE flow
async function refreshTokenManually(refreshToken) {
  const tokenResponse = await fetch("https://identity.xero.com/connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Token refresh failed: ${tokenResponse.status} - ${errorText}`);
  }

  const newTokenSet = await tokenResponse.json();
  newTokenSet.expires_at = Math.floor(Date.now() / 1000) + newTokenSet.expires_in;
  return newTokenSet;
}

// Check if token is expired
function isTokenExpired(tokenSet) {
  if (!tokenSet.expires_at) return true;
  return Date.now() / 1000 >= tokenSet.expires_at - 60; // 60 second buffer
}

async function initXero() {
  if (!clientId) {
    throw new Error("XERO_CLIENT_ID environment variable is required");
  }

  // Configure Xero client (clientSecret is optional for PKCE)
  const xeroConfig = {
    clientId,
    redirectUris: [redirectUri],
    scopes: SCOPES,
  };

  // Only add clientSecret if provided (for non-PKCE flow)
  if (clientSecret) {
    xeroConfig.clientSecret = clientSecret;
  }

  xero = new XeroClient(xeroConfig);
  await xero.initialize();

  if (!fs.existsSync(tokenPath)) {
    await runAuthFlow();
  } else {
    let tokenSet = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

    // Check if token is expired and refresh
    if (isTokenExpired(tokenSet)) {
      console.error("Token expired, refreshing...");
      tokenSet = await refreshTokenManually(tokenSet.refresh_token);
      fs.writeFileSync(tokenPath, JSON.stringify(tokenSet, null, 2));
      console.error("Token refreshed successfully.\n");
    }

    await xero.setTokenSet(tokenSet);
    await xero.updateTenants();
  }

  // Set default tenant
  if (xero.tenants.length > 0) {
    activeTenantId = xero.tenants[0].tenantId;
  }
}

async function ensureAuth() {
  let tokenSet = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
  if (isTokenExpired(tokenSet)) {
    tokenSet = await refreshTokenManually(tokenSet.refresh_token);
    fs.writeFileSync(tokenPath, JSON.stringify(tokenSet, null, 2));
    await xero.setTokenSet(tokenSet);
  }
}

// ============ TOOL DEFINITIONS ============

const tools = [
  // Tenant Management
  {
    name: "xero_get_tenants",
    description: "List all connected Xero organizations (tenants). Returns tenant IDs and names.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "xero_select_tenant",
    description: "Select a tenant (organization) to use for subsequent API calls.",
    inputSchema: {
      type: "object",
      properties: {
        tenantId: { type: "string", description: "The tenant ID to select" },
      },
      required: ["tenantId"],
    },
  },

  // Contacts
  {
    name: "xero_list_contacts",
    description: "List contacts (customers and suppliers) with optional filtering.",
    inputSchema: {
      type: "object",
      properties: {
        where: { type: "string", description: "Filter expression (e.g., 'ContactStatus==\"ACTIVE\"')" },
        order: { type: "string", description: "Sort order (e.g., 'Name ASC')" },
        page: { type: "number", description: "Page number (default 1)" },
      },
    },
  },
  {
    name: "xero_get_contact",
    description: "Get a single contact by ID.",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "string", description: "The contact ID" },
      },
      required: ["contactId"],
    },
  },
  {
    name: "xero_create_contact",
    description: "Create a new contact (customer or supplier).",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Contact name (required)" },
        firstName: { type: "string", description: "First name" },
        lastName: { type: "string", description: "Last name" },
        emailAddress: { type: "string", description: "Email address" },
        phone: { type: "string", description: "Phone number" },
        isCustomer: { type: "boolean", description: "Is this a customer?" },
        isSupplier: { type: "boolean", description: "Is this a supplier?" },
      },
      required: ["name"],
    },
  },
  {
    name: "xero_update_contact",
    description: "Update an existing contact.",
    inputSchema: {
      type: "object",
      properties: {
        contactId: { type: "string", description: "The contact ID to update" },
        name: { type: "string", description: "Contact name" },
        firstName: { type: "string", description: "First name" },
        lastName: { type: "string", description: "Last name" },
        emailAddress: { type: "string", description: "Email address" },
        phone: { type: "string", description: "Phone number" },
      },
      required: ["contactId"],
    },
  },

  // Invoices
  {
    name: "xero_list_invoices",
    description: "List invoices with optional filtering.",
    inputSchema: {
      type: "object",
      properties: {
        where: { type: "string", description: "Filter expression (e.g., 'Status==\"AUTHORISED\"')" },
        order: { type: "string", description: "Sort order (e.g., 'Date DESC')" },
        page: { type: "number", description: "Page number (default 1)" },
        statuses: {
          type: "array",
          items: { type: "string" },
          description: "Filter by statuses (DRAFT, SUBMITTED, AUTHORISED, PAID, VOIDED)",
        },
      },
    },
  },
  {
    name: "xero_get_invoice",
    description: "Get a single invoice by ID.",
    inputSchema: {
      type: "object",
      properties: {
        invoiceId: { type: "string", description: "The invoice ID" },
      },
      required: ["invoiceId"],
    },
  },
  {
    name: "xero_create_invoice",
    description: "Create a new invoice.",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["ACCREC", "ACCPAY"],
          description: "Invoice type: ACCREC (accounts receivable/sales) or ACCPAY (accounts payable/bills)",
        },
        contactId: { type: "string", description: "Contact ID for the invoice" },
        lineItems: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              quantity: { type: "number" },
              unitAmount: { type: "number" },
              accountCode: { type: "string" },
              taxType: { type: "string" },
            },
          },
          description: "Line items for the invoice",
        },
        date: { type: "string", description: "Invoice date (YYYY-MM-DD)" },
        dueDate: { type: "string", description: "Due date (YYYY-MM-DD)" },
        reference: { type: "string", description: "Reference number" },
        status: {
          type: "string",
          enum: ["DRAFT", "SUBMITTED", "AUTHORISED"],
          description: "Initial status (default DRAFT)",
        },
      },
      required: ["type", "contactId", "lineItems"],
    },
  },
  {
    name: "xero_update_invoice",
    description: "Update an existing invoice (status, line items, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        invoiceId: { type: "string", description: "The invoice ID to update" },
        status: {
          type: "string",
          enum: ["DRAFT", "SUBMITTED", "AUTHORISED"],
          description: "New status",
        },
        reference: { type: "string", description: "Reference number" },
        dueDate: { type: "string", description: "Due date (YYYY-MM-DD)" },
      },
      required: ["invoiceId"],
    },
  },
  {
    name: "xero_void_invoice",
    description: "Void an invoice.",
    inputSchema: {
      type: "object",
      properties: {
        invoiceId: { type: "string", description: "The invoice ID to void" },
      },
      required: ["invoiceId"],
    },
  },

  // Payments
  {
    name: "xero_list_payments",
    description: "List payments with optional filtering.",
    inputSchema: {
      type: "object",
      properties: {
        where: { type: "string", description: "Filter expression" },
        order: { type: "string", description: "Sort order (e.g., 'Date DESC')" },
      },
    },
  },
  {
    name: "xero_get_payment",
    description: "Get a single payment by ID.",
    inputSchema: {
      type: "object",
      properties: {
        paymentId: { type: "string", description: "The payment ID" },
      },
      required: ["paymentId"],
    },
  },
  {
    name: "xero_create_payment",
    description: "Record a payment against an invoice.",
    inputSchema: {
      type: "object",
      properties: {
        invoiceId: { type: "string", description: "The invoice ID to pay" },
        accountId: { type: "string", description: "Bank account ID for the payment" },
        amount: { type: "number", description: "Payment amount" },
        date: { type: "string", description: "Payment date (YYYY-MM-DD)" },
        reference: { type: "string", description: "Payment reference" },
      },
      required: ["invoiceId", "accountId", "amount", "date"],
    },
  },
  {
    name: "xero_delete_payment",
    description: "Delete (void) a payment.",
    inputSchema: {
      type: "object",
      properties: {
        paymentId: { type: "string", description: "The payment ID to delete" },
      },
      required: ["paymentId"],
    },
  },

  // Reports
  {
    name: "xero_profit_loss",
    description: "Generate a Profit and Loss report.",
    inputSchema: {
      type: "object",
      properties: {
        fromDate: { type: "string", description: "Start date (YYYY-MM-DD)" },
        toDate: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
      required: ["fromDate", "toDate"],
    },
  },
  {
    name: "xero_balance_sheet",
    description: "Generate a Balance Sheet report.",
    inputSchema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Report date (YYYY-MM-DD)" },
      },
      required: ["date"],
    },
  },
  {
    name: "xero_trial_balance",
    description: "Generate a Trial Balance report.",
    inputSchema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Report date (YYYY-MM-DD)" },
      },
      required: ["date"],
    },
  },

  // Accounts
  {
    name: "xero_list_accounts",
    description: "List chart of accounts (bank accounts, revenue accounts, etc.).",
    inputSchema: {
      type: "object",
      properties: {
        where: { type: "string", description: "Filter expression (e.g., 'Type==\"BANK\"')" },
      },
    },
  },
];

// ============ TOOL IMPLEMENTATIONS ============

// Tenant Management
async function getTenants() {
  await ensureAuth();
  return xero.tenants.map((t) => ({
    tenantId: t.tenantId,
    tenantName: t.tenantName,
    tenantType: t.tenantType,
    isActive: t.tenantId === activeTenantId,
  }));
}

async function selectTenant(tenantId) {
  const tenant = xero.tenants.find((t) => t.tenantId === tenantId);
  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantId}`);
  }
  activeTenantId = tenantId;
  return { success: true, tenantId, tenantName: tenant.tenantName };
}

// Contacts
async function listContacts(where, order, page = 1) {
  await ensureAuth();
  const response = await xero.accountingApi.getContacts(
    activeTenantId,
    undefined, // ifModifiedSince
    where,
    order,
    undefined, // IDs
    page,
    false, // includeArchived
    true // summaryOnly
  );
  return response.body.contacts?.map((c) => ({
    contactId: c.contactID,
    name: c.name,
    firstName: c.firstName,
    lastName: c.lastName,
    emailAddress: c.emailAddress,
    isCustomer: c.isCustomer,
    isSupplier: c.isSupplier,
    contactStatus: c.contactStatus,
  }));
}

async function getContact(contactId) {
  await ensureAuth();
  const response = await xero.accountingApi.getContact(activeTenantId, contactId);
  const c = response.body.contacts?.[0];
  return {
    contactId: c.contactID,
    name: c.name,
    firstName: c.firstName,
    lastName: c.lastName,
    emailAddress: c.emailAddress,
    phones: c.phones,
    addresses: c.addresses,
    isCustomer: c.isCustomer,
    isSupplier: c.isSupplier,
    contactStatus: c.contactStatus,
  };
}

async function createContact(args) {
  await ensureAuth();
  const contact = {
    name: args.name,
    firstName: args.firstName,
    lastName: args.lastName,
    emailAddress: args.emailAddress,
    isCustomer: args.isCustomer,
    isSupplier: args.isSupplier,
  };

  if (args.phone) {
    contact.phones = [{ phoneType: "MOBILE", phoneNumber: args.phone }];
  }

  const response = await xero.accountingApi.createContacts(activeTenantId, { contacts: [contact] });
  const c = response.body.contacts?.[0];
  return {
    contactId: c.contactID,
    name: c.name,
    emailAddress: c.emailAddress,
  };
}

async function updateContact(args) {
  await ensureAuth();
  const contact = { contactID: args.contactId };

  if (args.name) contact.name = args.name;
  if (args.firstName) contact.firstName = args.firstName;
  if (args.lastName) contact.lastName = args.lastName;
  if (args.emailAddress) contact.emailAddress = args.emailAddress;
  if (args.phone) {
    contact.phones = [{ phoneType: "MOBILE", phoneNumber: args.phone }];
  }

  const response = await xero.accountingApi.updateContact(activeTenantId, args.contactId, {
    contacts: [contact],
  });
  return { success: true, contactId: args.contactId };
}

// Invoices
async function listInvoices(where, order, page = 1, statuses) {
  await ensureAuth();
  const response = await xero.accountingApi.getInvoices(
    activeTenantId,
    undefined, // ifModifiedSince
    where,
    order,
    undefined, // IDs
    undefined, // invoiceNumbers
    undefined, // contactIDs
    statuses,
    page,
    false, // includeArchived
    false, // createdByMyApp
    4 // unitdp
  );
  return response.body.invoices?.map((i) => ({
    invoiceId: i.invoiceID,
    invoiceNumber: i.invoiceNumber,
    type: i.type,
    contactName: i.contact?.name,
    date: i.date,
    dueDate: i.dueDate,
    status: i.status,
    total: i.total,
    amountDue: i.amountDue,
    amountPaid: i.amountPaid,
    reference: i.reference,
  }));
}

async function getInvoice(invoiceId) {
  await ensureAuth();
  const response = await xero.accountingApi.getInvoice(activeTenantId, invoiceId);
  const i = response.body.invoices?.[0];
  return {
    invoiceId: i.invoiceID,
    invoiceNumber: i.invoiceNumber,
    type: i.type,
    contact: {
      contactId: i.contact?.contactID,
      name: i.contact?.name,
    },
    date: i.date,
    dueDate: i.dueDate,
    status: i.status,
    lineItems: i.lineItems?.map((l) => ({
      description: l.description,
      quantity: l.quantity,
      unitAmount: l.unitAmount,
      lineAmount: l.lineAmount,
      accountCode: l.accountCode,
      taxType: l.taxType,
    })),
    subTotal: i.subTotal,
    totalTax: i.totalTax,
    total: i.total,
    amountDue: i.amountDue,
    amountPaid: i.amountPaid,
    reference: i.reference,
    currencyCode: i.currencyCode,
  };
}

async function createInvoice(args) {
  await ensureAuth();
  const invoice = {
    type: args.type === "ACCREC" ? Invoice.TypeEnum.ACCREC : Invoice.TypeEnum.ACCPAY,
    contact: { contactID: args.contactId },
    lineItems: args.lineItems.map((l) => ({
      description: l.description,
      quantity: l.quantity || 1,
      unitAmount: l.unitAmount,
      accountCode: l.accountCode,
      taxType: l.taxType,
      lineAmount: l.lineAmount || (l.quantity || 1) * l.unitAmount,
    })),
    date: args.date || new Date().toISOString().split("T")[0],
    dueDate: args.dueDate,
    reference: args.reference,
    status: args.status
      ? Invoice.StatusEnum[args.status]
      : Invoice.StatusEnum.DRAFT,
  };

  const response = await xero.accountingApi.createInvoices(
    activeTenantId,
    { invoices: [invoice] },
    true, // summarizeErrors
    4 // unitdp
  );

  const i = response.body.invoices?.[0];
  return {
    invoiceId: i.invoiceID,
    invoiceNumber: i.invoiceNumber,
    status: i.status,
    total: i.total,
  };
}

async function updateInvoice(args) {
  await ensureAuth();
  const invoice = { invoiceID: args.invoiceId };

  if (args.status) {
    invoice.status = Invoice.StatusEnum[args.status];
  }
  if (args.reference) invoice.reference = args.reference;
  if (args.dueDate) invoice.dueDate = args.dueDate;

  const response = await xero.accountingApi.updateInvoice(activeTenantId, args.invoiceId, {
    invoices: [invoice],
  });
  return { success: true, invoiceId: args.invoiceId };
}

async function voidInvoice(invoiceId) {
  await ensureAuth();
  const invoice = {
    invoiceID: invoiceId,
    status: Invoice.StatusEnum.VOIDED,
  };

  await xero.accountingApi.updateInvoice(activeTenantId, invoiceId, {
    invoices: [invoice],
  });
  return { success: true, invoiceId, status: "VOIDED" };
}

// Payments
async function listPayments(where, order) {
  await ensureAuth();
  const response = await xero.accountingApi.getPayments(
    activeTenantId,
    undefined, // ifModifiedSince
    where,
    order
  );
  return response.body.payments?.map((p) => ({
    paymentId: p.paymentID,
    date: p.date,
    amount: p.amount,
    reference: p.reference,
    status: p.status,
    invoiceNumber: p.invoice?.invoiceNumber,
    accountName: p.account?.name,
  }));
}

async function getPayment(paymentId) {
  await ensureAuth();
  const response = await xero.accountingApi.getPayment(activeTenantId, paymentId);
  const p = response.body.payments?.[0];
  return {
    paymentId: p.paymentID,
    date: p.date,
    amount: p.amount,
    reference: p.reference,
    status: p.status,
    invoice: {
      invoiceId: p.invoice?.invoiceID,
      invoiceNumber: p.invoice?.invoiceNumber,
    },
    account: {
      accountId: p.account?.accountID,
      name: p.account?.name,
    },
  };
}

async function createPayment(args) {
  await ensureAuth();
  const payment = {
    invoice: { invoiceID: args.invoiceId },
    account: { accountID: args.accountId },
    amount: args.amount,
    date: args.date,
    reference: args.reference,
  };

  const response = await xero.accountingApi.createPayment(activeTenantId, payment);
  const p = response.body.payments?.[0];
  return {
    paymentId: p.paymentID,
    amount: p.amount,
    date: p.date,
  };
}

async function deletePayment(paymentId) {
  await ensureAuth();
  const paymentDelete = { status: "DELETED" };
  await xero.accountingApi.deletePayment(activeTenantId, paymentId, paymentDelete);
  return { success: true, paymentId, status: "DELETED" };
}

// Reports
async function profitLoss(fromDate, toDate) {
  await ensureAuth();
  const response = await xero.accountingApi.getReportProfitAndLoss(
    activeTenantId,
    fromDate,
    toDate,
    undefined, // periods
    undefined, // timeframe
    undefined, // trackingCategoryID
    undefined, // trackingCategoryID2
    undefined, // trackingOptionID
    undefined, // trackingOptionID2
    true // standardLayout
  );
  return response.body.reports?.[0];
}

async function balanceSheet(date) {
  await ensureAuth();
  const response = await xero.accountingApi.getReportBalanceSheet(
    activeTenantId,
    date,
    undefined, // periods
    undefined, // timeframe
    undefined, // trackingOptionID1
    undefined, // trackingOptionID2
    true // standardLayout
  );
  return response.body.reports?.[0];
}

async function trialBalance(date) {
  await ensureAuth();
  const response = await xero.accountingApi.getReportTrialBalance(
    activeTenantId,
    date,
    undefined // paymentsOnly
  );
  return response.body.reports?.[0];
}

// Accounts
async function listAccounts(where) {
  await ensureAuth();
  const response = await xero.accountingApi.getAccounts(
    activeTenantId,
    undefined, // ifModifiedSince
    where
  );
  return response.body.accounts?.map((a) => ({
    accountId: a.accountID,
    code: a.code,
    name: a.name,
    type: a.type,
    bankAccountType: a.bankAccountType,
    status: a.status,
    currencyCode: a.currencyCode,
  }));
}

// ============ MCP SERVER SETUP ============

const server = new Server(
  {
    name: "sabai-xero",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      // Tenants
      case "xero_get_tenants":
        result = await getTenants();
        break;
      case "xero_select_tenant":
        result = await selectTenant(args.tenantId);
        break;

      // Contacts
      case "xero_list_contacts":
        result = await listContacts(args.where, args.order, args.page);
        break;
      case "xero_get_contact":
        result = await getContact(args.contactId);
        break;
      case "xero_create_contact":
        result = await createContact(args);
        break;
      case "xero_update_contact":
        result = await updateContact(args);
        break;

      // Invoices
      case "xero_list_invoices":
        result = await listInvoices(args.where, args.order, args.page, args.statuses);
        break;
      case "xero_get_invoice":
        result = await getInvoice(args.invoiceId);
        break;
      case "xero_create_invoice":
        result = await createInvoice(args);
        break;
      case "xero_update_invoice":
        result = await updateInvoice(args);
        break;
      case "xero_void_invoice":
        result = await voidInvoice(args.invoiceId);
        break;

      // Payments
      case "xero_list_payments":
        result = await listPayments(args.where, args.order);
        break;
      case "xero_get_payment":
        result = await getPayment(args.paymentId);
        break;
      case "xero_create_payment":
        result = await createPayment(args);
        break;
      case "xero_delete_payment":
        result = await deletePayment(args.paymentId);
        break;

      // Reports
      case "xero_profit_loss":
        result = await profitLoss(args.fromDate, args.toDate);
        break;
      case "xero_balance_sheet":
        result = await balanceSheet(args.date);
        break;
      case "xero_trial_balance":
        result = await trialBalance(args.date);
        break;

      // Accounts
      case "xero_list_accounts":
        result = await listAccounts(args.where);
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  await initXero();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sabai Xero MCP server running");
}

main().catch(console.error);
