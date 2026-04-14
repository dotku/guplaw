// Server-side PayPal helper. Uses the OAuth2 client-credentials flow to
// exchange the Client ID + Secret for a short-lived access token, then calls
// PayPal's REST API (v1 Subscriptions, v2 Orders, etc).
// Docs: https://developer.paypal.com/api/rest/authentication/

const LIVE_BASE = 'https://api-m.paypal.com';
const SANDBOX_BASE = 'https://api-m.sandbox.paypal.com';

export function getPayPalBaseUrl(): string {
  const mode = (process.env.PAYPAL_MODE ?? 'sandbox').toLowerCase();
  return mode === 'production' || mode === 'live' ? LIVE_BASE : SANDBOX_BASE;
}

function getCreds(): { clientId: string; secret: string } {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error(
      'PayPal credentials missing: set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET',
    );
  }
  return { clientId, secret };
}

// Token cache (per server instance). PayPal tokens are valid ~9 hours;
// refresh a minute early to be safe.
let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const { clientId, secret } = getCreds();
  const basic = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const res = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal auth failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.value;
}

export interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

export interface CreateSubscriptionResult {
  id: string;
  status: string;
  links: PayPalLink[];
}

export interface CreateSubscriptionOptions {
  planId: string;
  returnUrl: string;
  cancelUrl: string;
  subscriberEmail?: string;
  subscriberName?: { given_name?: string; surname?: string };
  customId?: string;
}

export async function createSubscription(
  opts: CreateSubscriptionOptions,
): Promise<CreateSubscriptionResult> {
  const token = await getAccessToken();

  const body: Record<string, unknown> = {
    plan_id: opts.planId,
    application_context: {
      brand_name: 'GPULaw',
      user_action: 'SUBSCRIBE_NOW',
      return_url: opts.returnUrl,
      cancel_url: opts.cancelUrl,
    },
  };

  if (opts.subscriberEmail || opts.subscriberName) {
    body.subscriber = {
      ...(opts.subscriberEmail ? { email_address: opts.subscriberEmail } : {}),
      ...(opts.subscriberName ? { name: opts.subscriberName } : {}),
    };
  }

  if (opts.customId) {
    body.custom_id = opts.customId;
  }

  const res = await fetch(`${getPayPalBaseUrl()}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      // PayPal requires an idempotency-style request id for mutating calls
      // to subscriptions; regenerating per-request is fine.
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = (await res.json()) as CreateSubscriptionResult & {
    message?: string;
    name?: string;
    details?: unknown;
  };

  if (!res.ok) {
    throw new Error(
      `PayPal create-subscription failed (${res.status}): ${data.message ?? data.name ?? 'unknown error'}`,
    );
  }

  return data;
}

export async function getSubscription(subscriptionId: string) {
  const token = await getAccessToken();
  const res = await fetch(
    `${getPayPalBaseUrl()}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal get-subscription failed (${res.status}): ${body}`);
  }
  return res.json();
}
