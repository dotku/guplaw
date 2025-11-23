import { NextResponse } from 'next/server';

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

export async function GET() {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/plans?page_size=20&total_required=true`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to list plans:', data);
      return NextResponse.json(
        { error: 'Failed to list plans', details: data },
        { status: response.status }
      );
    }

    // Format the response
    const formattedPlans = data.plans?.map((plan: any) => {
      const regularCycle = plan.billing_cycles?.find((c: any) => c.tenure_type === 'REGULAR');
      const price = regularCycle?.pricing_scheme?.fixed_price;

      return {
        id: plan.id,
        name: plan.name,
        productId: plan.product_id,
        status: plan.status,
        price: price ? `${price.currency_code} ${price.value}` : 'N/A',
        frequency: regularCycle?.frequency?.interval_unit || 'N/A',
        created: plan.create_time,
      };
    }) || [];

    return NextResponse.json({
      success: true,
      environment: process.env.PAYPAL_MODE === 'production' ? 'production' : 'sandbox',
      totalPlans: data.total_items || 0,
      plans: formattedPlans,
    });
  } catch (error) {
    console.error('Error listing plans:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list plans',
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
