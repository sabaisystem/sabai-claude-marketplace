import fs from "fs";
import path from "path";
import { type DocuSignAccount, clearTokenCache } from "./auth.js";

// Use CLAUDE_PLUGIN_DATA for persistent storage (survives plugin updates in CoWork)
// Fall back to local config directory for Claude Code / local dev
const DATA_DIR = process.env.CLAUDE_PLUGIN_DATA || process.env.DOCUSIGN_DATA_DIR || "";
const SCRIPT_DIR = typeof __dirname !== "undefined"
  ? __dirname
  : path.dirname(new URL(import.meta.url).pathname);
const ACCOUNTS_DIR = DATA_DIR
  ? path.join(DATA_DIR, "accounts")
  : path.join(SCRIPT_DIR, "config", "accounts");

let activeAccountName: string | null = null;

function ensureAccountsDir(): void {
  if (!fs.existsSync(ACCOUNTS_DIR)) {
    fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });
  }
}

function accountFilePath(name: string): string {
  return path.join(ACCOUNTS_DIR, `${name}.json`);
}

export function listAccounts(): Array<{ name: string; environment: string; isActive: boolean }> {
  ensureAccountsDir();
  const files = fs.readdirSync(ACCOUNTS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const name = path.basename(f, ".json");
    const data = JSON.parse(fs.readFileSync(path.join(ACCOUNTS_DIR, f), "utf8"));
    return {
      name,
      environment: data.environment || "demo",
      isActive: name === activeAccountName,
    };
  });
}

export function getActiveAccount(): DocuSignAccount | null {
  // If an active account is selected, use it
  if (activeAccountName) {
    const filePath = accountFilePath(activeAccountName);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8")) as DocuSignAccount;
    }
  }

  // Try loading from environment variables (default account)
  if (process.env.DOCUSIGN_INTEGRATION_KEY && process.env.DOCUSIGN_USER_ID) {
    return {
      name: "default",
      integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY,
      userId: process.env.DOCUSIGN_USER_ID,
      accountId: process.env.DOCUSIGN_ACCOUNT_ID || "",
      privateKeyPath: process.env.DOCUSIGN_PRIVATE_KEY_PATH,
      environment: (process.env.DOCUSIGN_ENVIRONMENT as "demo" | "production") || "demo",
    };
  }

  // Try the first saved account file
  const accounts = listAccounts();
  if (accounts.length > 0) {
    activeAccountName = accounts[0].name;
    return JSON.parse(fs.readFileSync(accountFilePath(accounts[0].name), "utf8")) as DocuSignAccount;
  }

  return null;
}

export function switchAccount(name: string): DocuSignAccount {
  const filePath = accountFilePath(name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Account "${name}" not found. Use docusign_list_accounts to see available accounts.`);
  }
  activeAccountName = name;
  clearTokenCache();
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as DocuSignAccount;
}

export function addAccount(account: DocuSignAccount): void {
  ensureAccountsDir();

  // Validate: must have either inline key or key path
  if (!account.privateKey && !account.privateKeyPath) {
    throw new Error("Either privateKey (PEM content) or privateKeyPath must be provided.");
  }

  // If key path provided, verify it exists
  if (account.privateKeyPath && !account.privateKey) {
    if (!fs.existsSync(account.privateKeyPath)) {
      throw new Error(`Private key file not found at: ${account.privateKeyPath}`);
    }
  }

  const filePath = accountFilePath(account.name);
  fs.writeFileSync(filePath, JSON.stringify(account, null, 2));

  // Auto-activate if this is the first account
  if (!activeAccountName) {
    activeAccountName = account.name;
  }
}

export function removeAccount(name: string): void {
  const filePath = accountFilePath(name);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Account "${name}" not found.`);
  }
  fs.unlinkSync(filePath);
  if (activeAccountName === name) {
    activeAccountName = null;
    clearTokenCache();
  }
}
