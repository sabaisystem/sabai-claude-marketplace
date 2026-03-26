import jwt from "jsonwebtoken";
import fs from "fs";

export interface DocuSignAccount {
  name: string;
  integrationKey: string;
  userId: string;
  accountId: string;
  privateKey?: string;
  privateKeyPath?: string;
  environment: "demo" | "production";
}

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

const AUTH_HOSTS: Record<string, string> = {
  demo: "account-d.docusign.com",
  production: "account.docusign.com",
};

const API_HOSTS: Record<string, string> = {
  demo: "demo.docusign.net",
  production: "na1.docusign.net",
};

let tokenCache: TokenCache | null = null;

export function getApiBaseUrl(account: DocuSignAccount): string {
  const host = API_HOSTS[account.environment] || API_HOSTS.demo;
  return `https://${host}/restapi`;
}

export function getConsentUrl(account: DocuSignAccount): string {
  const host = AUTH_HOSTS[account.environment] || AUTH_HOSTS.demo;
  const scopes = encodeURIComponent("signature impersonation");
  return `https://${host}/oauth/auth?response_type=code&scope=${scopes}&client_id=${account.integrationKey}&redirect_uri=https://localhost/callback`;
}

function resolvePrivateKey(account: DocuSignAccount): string {
  // Prefer inline key content
  if (account.privateKey) {
    return account.privateKey;
  }

  // Fall back to file path
  if (account.privateKeyPath) {
    if (!fs.existsSync(account.privateKeyPath)) {
      throw new Error(
        `RSA private key not found at: ${account.privateKeyPath}\n` +
        `Generate one in DocuSign Admin > Integration Key > RSA Keypairs`
      );
    }
    return fs.readFileSync(account.privateKeyPath, "utf8");
  }

  throw new Error(
    "No private key configured. Provide either privateKey (PEM content) or privateKeyPath."
  );
}

export async function getAccessToken(account: DocuSignAccount): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.accessToken;
  }

  const authHost = AUTH_HOSTS[account.environment] || AUTH_HOSTS.demo;
  const privateKey = resolvePrivateKey(account);

  // Build JWT assertion
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: account.integrationKey,
    sub: account.userId,
    aud: authHost,
    scope: "signature impersonation",
    iat: now,
    exp: now + 3600,
  };

  const assertion = jwt.sign(payload, privateKey, { algorithm: "RS256" });

  // Exchange JWT for access token
  const tokenUrl = `https://${authHost}/oauth/token`;
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    if (error.includes("consent_required")) {
      const consentUrl = getConsentUrl(account);
      throw new Error(
        `Consent required for this DocuSign account.\n` +
        `Visit this URL to grant consent (one-time):\n${consentUrl}`
      );
    }
    throw new Error(`DocuSign auth failed: ${response.status} ${error}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return tokenCache.accessToken;
}

export function clearTokenCache(): void {
  tokenCache = null;
}
