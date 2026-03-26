import { type DocuSignAccount, getAccessToken, getApiBaseUrl } from "./auth.js";

interface EnvelopeListParams {
  fromDate?: string;
  toDate?: string;
  status?: string;
  searchText?: string;
  count?: number;
}

interface Envelope {
  envelopeId: string;
  status: string;
  emailSubject: string;
  sentDateTime?: string;
  completedDateTime?: string;
  statusChangedDateTime?: string;
  createdDateTime?: string;
  recipients?: Recipients;
  [key: string]: unknown;
}

interface Recipient {
  name: string;
  email: string;
  status: string;
  recipientId: string;
  routingOrder: string;
  signedDateTime?: string;
  deliveredDateTime?: string;
  [key: string]: unknown;
}

interface Recipients {
  signers?: Recipient[];
  carbonCopies?: Recipient[];
  certifiedDeliveries?: Recipient[];
  [key: string]: unknown;
}

interface EnvelopeListResponse {
  envelopes?: Envelope[];
  totalSetSize?: string;
  resultSetSize?: string;
  [key: string]: unknown;
}

interface UserInfo {
  name: string;
  email: string;
  accounts: Array<{
    accountId: string;
    accountName: string;
    isDefault: string;
    baseUri: string;
  }>;
  [key: string]: unknown;
}

async function apiRequest(
  account: DocuSignAccount,
  endpoint: string,
  method: string = "GET",
): Promise<unknown> {
  const token = await getAccessToken(account);
  const baseUrl = getApiBaseUrl(account);
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DocuSign API error: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getUserInfo(account: DocuSignAccount): Promise<UserInfo> {
  const token = await getAccessToken(account);
  const authHost = account.environment === "production"
    ? "account.docusign.com"
    : "account-d.docusign.com";

  const response = await fetch(`https://${authHost}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.status}`);
  }

  return response.json() as Promise<UserInfo>;
}

export async function listEnvelopes(
  account: DocuSignAccount,
  params: EnvelopeListParams = {},
): Promise<EnvelopeListResponse> {
  const queryParams = new URLSearchParams();

  // Default to last 30 days if no fromDate specified
  if (params.fromDate) {
    queryParams.set("from_date", params.fromDate);
  } else {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    queryParams.set("from_date", thirtyDaysAgo.toISOString());
  }

  if (params.toDate) queryParams.set("to_date", params.toDate);
  if (params.status) queryParams.set("status", params.status);
  if (params.searchText) queryParams.set("search_text", params.searchText);
  if (params.count) queryParams.set("count", String(params.count));

  queryParams.set("include", "recipients");

  const endpoint = `/v2.1/accounts/${account.accountId}/envelopes?${queryParams}`;
  return apiRequest(account, endpoint) as Promise<EnvelopeListResponse>;
}

export async function getEnvelope(
  account: DocuSignAccount,
  envelopeId: string,
): Promise<Envelope> {
  const endpoint = `/v2.1/accounts/${account.accountId}/envelopes/${envelopeId}?include=recipients,tabs,documents`;
  return apiRequest(account, endpoint) as Promise<Envelope>;
}

export async function getEnvelopeDocuments(
  account: DocuSignAccount,
  envelopeId: string,
): Promise<unknown> {
  const endpoint = `/v2.1/accounts/${account.accountId}/envelopes/${envelopeId}/documents`;
  return apiRequest(account, endpoint);
}

export async function getEnvelopeRecipients(
  account: DocuSignAccount,
  envelopeId: string,
): Promise<Recipients> {
  const endpoint = `/v2.1/accounts/${account.accountId}/envelopes/${envelopeId}/recipients`;
  return apiRequest(account, endpoint) as Promise<Recipients>;
}
