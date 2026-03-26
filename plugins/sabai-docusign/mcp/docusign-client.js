import { getAccessToken, getApiBaseUrl } from "./auth.js";
async function apiRequest(account, endpoint, method = "GET") {
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
export async function getUserInfo(account) {
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
    return response.json();
}
export async function listEnvelopes(account, params = {}) {
    const queryParams = new URLSearchParams();
    // Default to last 30 days if no fromDate specified
    if (params.fromDate) {
        queryParams.set("from_date", params.fromDate);
    }
    else {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        queryParams.set("from_date", thirtyDaysAgo.toISOString());
    }
    if (params.toDate)
        queryParams.set("to_date", params.toDate);
    if (params.status)
        queryParams.set("status", params.status);
    if (params.searchText)
        queryParams.set("search_text", params.searchText);
    if (params.count)
        queryParams.set("count", String(params.count));
    queryParams.set("include", "recipients");
    const endpoint = `/v2.1/accounts/${account.accountId}/envelopes?${queryParams}`;
    return apiRequest(account, endpoint);
}
export async function getEnvelope(account, envelopeId) {
    const endpoint = `/v2.1/accounts/${account.accountId}/envelopes/${envelopeId}?include=recipients,tabs,documents`;
    return apiRequest(account, endpoint);
}
export async function getEnvelopeDocuments(account, envelopeId) {
    const endpoint = `/v2.1/accounts/${account.accountId}/envelopes/${envelopeId}/documents`;
    return apiRequest(account, endpoint);
}
export async function getEnvelopeRecipients(account, envelopeId) {
    const endpoint = `/v2.1/accounts/${account.accountId}/envelopes/${envelopeId}/recipients`;
    return apiRequest(account, endpoint);
}
