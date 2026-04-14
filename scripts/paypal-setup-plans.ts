/**
 * One-shot PayPal setup script.
 *
 * Creates a Product + two Billing Plans (User $19/mo, Attorney $299/mo) in
 * whichever PayPal environment PAYPAL_MODE points at (sandbox by default),
 * using the credentials already in .env.local.
 *
 * Run:
 *   node --experimental-strip-types --env-file=.env.local scripts/paypal-setup-plans.ts
 *
 * Output: two `NEXT_PUBLIC_PAYPAL_PLAN_ID_*` lines ready to paste into .env.local.
 *
 * Safe to re-run — it will create new records each time, so only re-run if
 * you actually want fresh plans.
 */

const LIVE_BASE = 'https://api-m.paypal.com';
const SANDBOX_BASE = 'https://api-m.sandbox.paypal.com';

function baseUrl(): string {
  const mode = (process.env.PAYPAL_MODE ?? 'sandbox').toLowerCase();
  return mode === 'production' || mode === 'live' ? LIVE_BASE : SANDBOX_BASE;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    throw new Error('Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET');
  }
  const basic = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const res = await fetch(`${baseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    throw new Error(`OAuth failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function createProduct(token: string): Promise<string> {
  const res = await fetch(`${baseUrl()}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify({
      name: 'GPULaw Membership',
      description: 'AI legal assistance and attorney consultation subscriptions',
      type: 'SERVICE',
      category: 'SOFTWARE',
      // PayPal requires a public HTTPS URL here (rejects localhost).
      home_url: 'https://gpulaw.com',
    }),
  });
  const body = (await res.json()) as { id?: string; message?: string; details?: unknown };
  if (!res.ok || !body.id) {
    throw new Error(`Create product failed (${res.status}): ${JSON.stringify(body)}`);
  }
  return body.id;
}

interface PlanSpec {
  name: string;
  description: string;
  price: string; // "19.00"
}

async function createPlan(
  token: string,
  productId: string,
  spec: PlanSpec,
): Promise<string> {
  const res = await fetch(`${baseUrl()}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify({
      product_id: productId,
      name: spec.name,
      description: spec.description,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: { interval_unit: 'MONTH', interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // 0 = infinite
          pricing_scheme: {
            fixed_price: { value: spec.price, currency_code: 'USD' },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: { value: '0', currency_code: 'USD' },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  });
  const body = (await res.json()) as { id?: string; message?: string; details?: unknown };
  if (!res.ok || !body.id) {
    throw new Error(
      `Create plan "${spec.name}" failed (${res.status}): ${JSON.stringify(body)}`,
    );
  }
  return body.id;
}

async function main() {
  console.log(`PayPal environment: ${baseUrl()}`);

  const token = await getAccessToken();
  console.log('✓ Acquired access token');

  const productId = await createProduct(token);
  console.log(`✓ Created product: ${productId}`);

  const userPlanId = await createPlan(token, productId, {
    name: 'GPULaw User',
    description: 'AI legal assistance for individuals and families',
    price: '19.00',
  });
  console.log(`✓ Created User plan:     ${userPlanId}`);

  const attorneyPlanId = await createPlan(token, productId, {
    name: 'GPULaw Attorney',
    description: 'Precision AI tools for practicing attorneys',
    price: '299.00',
  });
  console.log(`✓ Created Attorney plan: ${attorneyPlanId}`);

  console.log('\nPaste into .env.local:');
  console.log('----------------------------------------');
  console.log(`NEXT_PUBLIC_PAYPAL_PLAN_ID_USER=${userPlanId}`);
  console.log(`NEXT_PUBLIC_PAYPAL_PLAN_ID_ATTORNEY=${attorneyPlanId}`);
  console.log('----------------------------------------');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
