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
  return data.access_token;
}

async function createProduct(accessToken: string, name: string, description: string) {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      type: 'SERVICE',
      category: 'SOFTWARE',
    }),
  });

  const product = await response.json();
  return product;
}

async function createBillingPlan(
  accessToken: string,
  productId: string,
  planName: string,
  planDescription: string,
  price: string
) {
  const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      name: planName,
      description: planDescription,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // 0 means infinite
          pricing_scheme: {
            fixed_price: {
              value: price,
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD',
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  });

  const plan = await response.json();
  return plan;
}

export async function POST() {
  try {
    const accessToken = await getAccessToken();

    const plans = [
      {
        name: 'GPULaw Basic',
        description: 'Essential AI legal tools for everyday needs',
        price: '9.00',
        envKey: 'NEXT_PUBLIC_PAYPAL_PLAN_ID_BASIC',
      },
      {
        name: 'GPULaw Professional',
        description: 'AI assistance plus limited attorney access',
        price: '29.00',
        envKey: 'NEXT_PUBLIC_PAYPAL_PLAN_ID_PROFESSIONAL',
      },
      {
        name: 'GPULaw Premium',
        description: 'Full AI + attorney protection for peace of mind',
        price: '299.00',
        envKey: 'NEXT_PUBLIC_PAYPAL_PLAN_ID_PREMIUM',
      },
    ];

    const results = [];

    for (const planConfig of plans) {
      // Create product first
      const product = await createProduct(
        accessToken,
        planConfig.name,
        planConfig.description
      );

      if (product.id) {
        // Create billing plan
        const plan = await createBillingPlan(
          accessToken,
          product.id,
          planConfig.name,
          planConfig.description,
          planConfig.price
        );

        results.push({
          planName: planConfig.name,
          productId: product.id,
          planId: plan.id,
          envKey: planConfig.envKey,
          status: plan.status,
        });
      } else {
        results.push({
          planName: planConfig.name,
          error: 'Failed to create product',
          details: product,
        });
      }
    }

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      plans: results,
      message: 'Plans created successfully! Add these Plan IDs to your .env.local file:',
      envVariables: results.reduce((acc, plan) => {
        if (plan.planId) {
          acc[plan.envKey] = plan.planId;
        }
        return acc;
      }, {} as Record<string, string>),
    });
  } catch (error) {
    console.error('Error creating plans:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create plans',
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
