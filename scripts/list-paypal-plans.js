#!/usr/bin/env node

/**
 * PayPal Subscription Plans List Script
 *
 * This script lists all subscription plans in your PayPal account.
 * Run with: node scripts/list-paypal-plans.js
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

console.log(`\n📋 Listing PayPal plans in ${isProduction ? 'PRODUCTION' : 'SANDBOX'} mode...\n`);

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

  if (response.statusCode !== 200) {
    throw new Error(`Authentication failed: ${JSON.stringify(response.data)}`);
  }

  return response.data.access_token;
}

async function listPlans(accessToken) {
  const response = await makeRequest(
    `${PAYPAL_API_BASE}/v1/billing/plans?page_size=20&total_required=true`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.statusCode !== 200) {
    throw new Error(`Failed to list plans: ${JSON.stringify(response.data)}`);
  }

  return response.data;
}

async function main() {
  try {
    const accessToken = await getAccessToken();
    console.log('✓ Authenticated with PayPal\n');

    const result = await listPlans(accessToken);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Found ${result.total_items} plan(s):`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (!result.plans || result.plans.length === 0) {
      console.log('No plans found in this account.\n');
      console.log('💡 Tip: Run the setup script to create plans:');
      console.log('   node scripts/setup-paypal-plans.js\n');
      return;
    }

    result.plans.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name}`);
      console.log(`   Plan ID: ${plan.id}`);
      console.log(`   Product ID: ${plan.product_id}`);
      console.log(`   Status: ${plan.status}`);

      // Get price if available
      if (plan.billing_cycles && plan.billing_cycles.length > 0) {
        const regularCycle = plan.billing_cycles.find(c => c.tenure_type === 'REGULAR');
        if (regularCycle && regularCycle.pricing_scheme) {
          const price = regularCycle.pricing_scheme.fixed_price;
          const frequency = regularCycle.frequency;
          console.log(`   Price: ${price.currency_code} ${price.value}/${frequency.interval_unit.toLowerCase()}`);
        }
      }

      console.log(`   Created: ${new Date(plan.create_time).toLocaleString()}`);
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Environment Variables:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Suggest environment variable mappings
    const gpulawPlans = result.plans.filter(p =>
      p.name.toLowerCase().includes('gpulaw') ||
      p.name.toLowerCase().includes('basic') ||
      p.name.toLowerCase().includes('professional') ||
      p.name.toLowerCase().includes('premium')
    );

    if (gpulawPlans.length > 0) {
      console.log('Add these to your .env.local file:\n');

      gpulawPlans.forEach(plan => {
        const name = plan.name.toLowerCase();
        let envKey = '';

        if (name.includes('basic')) {
          envKey = 'NEXT_PUBLIC_PAYPAL_PLAN_ID_BASIC';
        } else if (name.includes('professional')) {
          envKey = 'NEXT_PUBLIC_PAYPAL_PLAN_ID_PROFESSIONAL';
        } else if (name.includes('premium')) {
          envKey = 'NEXT_PUBLIC_PAYPAL_PLAN_ID_PREMIUM';
        }

        if (envKey) {
          console.log(`${envKey}=${plan.id}`);
        }
      });
      console.log('');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
