import { NextRequest, NextResponse } from 'next/server';

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  console.log('PayPal Mode:', process.env.PAYPAL_MODE);
  console.log('PayPal API Base:', PAYPAL_API_BASE);
  console.log('Client ID:', clientId ? `${clientId.substring(0, 10)}...` : 'NOT SET');

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
    console.error('PayPal authentication failed:', data);
    throw new Error(`PayPal auth failed: ${data.error_description || data.error}`);
  }

  console.log('✓ PayPal authentication successful');
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();

    console.log('Creating subscription for plan:', planId);

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const accessToken = await getAccessToken();

    const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: planId,
        application_context: {
          brand_name: 'GPULaw',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}?subscription=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}?subscription=cancelled`,
        },
      }),
    });

    const subscription = await response.json();

    if (!response.ok) {
      console.error('PayPal subscription creation error:', {
        status: response.status,
        statusText: response.statusText,
        error: subscription,
      });
      return NextResponse.json(
        {
          error: 'Failed to create subscription',
          details: subscription,
          message: subscription.message || subscription.error_description || 'Unknown error'
        },
        { status: response.status }
      );
    }

    console.log('✓ Subscription created:', subscription.id);
    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
