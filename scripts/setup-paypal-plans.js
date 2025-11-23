#!/usr/bin/env node

/**
 * PayPal Subscription Plans Setup Script
 *
 * This script creates subscription plans via the PayPal API.
 * Run with: node scripts/setup-paypal-plans.js
 */

const https = require('https');
const http = require('http');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const isProduction = process.env.PAYPAL_MODE === 'production';
const PAYPAL_API_BASE = isProduction
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Error: PayPal credentials not found in .env.local');
  console.error('Please ensure NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are set.');
  process.exit(1);
}

console.log(`\n🔧 Setting up PayPal plans in ${isProduction ? 'PRODUCTION' : 'SANDBOX'} mode...\n`);

function makeRequest(url, options, postData = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const lib = urlObj.protocol === 'https:' ? https : http;

    const requestOptions = {
      ...options,
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
    };

    const req = lib.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(postData);
    }

    req.end();
  });
}

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const response = await makeRequest(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
    'grant_type=client_credentials'
  );

  return response.data.access_token;
}

async function createProduct(accessToken, name, description) {
  const response = await makeRequest(
    `${PAYPAL_API_BASE}/v1/catalogs/products`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
    JSON.stringify({
      name,
      description,
      type: 'SERVICE',
      category: 'SOFTWARE',
    })
  );

  return response.data;
}

async function createBillingPlan(accessToken, productId, planName, planDescription, price) {
  const response = await makeRequest(
    `${PAYPAL_API_BASE}/v1/billing/plans`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
    JSON.stringify({
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
          total_cycles: 0,
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
    })
  );

  return response.data;
}

async function main() {
  try {
    const accessToken = await getAccessToken();
    console.log('✓ Authenticated with PayPal\n');

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

    const envVars = [];

    for (const planConfig of plans) {
      console.log(`Creating "${planConfig.name}" ($${planConfig.price}/month)...`);

      const product = await createProduct(
        accessToken,
        planConfig.name,
        planConfig.description
      );
      console.log(`  ✓ Product created: ${product.id}`);

      const plan = await createBillingPlan(
        accessToken,
        product.id,
        planConfig.name,
        planConfig.description,
        planConfig.price
      );
      console.log(`  ✓ Billing plan created: ${plan.id}\n`);

      envVars.push(`${planConfig.envKey}=${plan.id}`);
    }

    console.log('✓ All plans created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Add these to your .env.local file:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    envVars.forEach((line) => console.log(line));
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  Remember to restart your development server after updating .env.local\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
