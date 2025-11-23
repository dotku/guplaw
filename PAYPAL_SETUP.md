# PayPal Subscription Integration Setup Guide

## Overview
This guide will help you complete the PayPal subscription integration for GPULaw.

## What's Already Done ✓

1. **PayPal SDK installed**: `@paypal/react-paypal-js` package
2. **Environment variables configured**: PayPal credentials added to `.env.local`
3. **API routes created**:
   - `/api/paypal/create-subscription` - Creates new subscriptions
   - `/api/paypal/verify-subscription` - Verifies subscription status
   - `/api/paypal/create-plans` - Creates subscription plans programmatically
4. **Components created**:
   - `PayPalProvider` - Wraps the app with PayPal context
   - `PayPalSubscriptionButton` - Subscription button component
5. **Pricing page updated**: Now uses PayPal subscription buttons
6. **Automated setup tools**:
   - Web UI at `/setup/paypal` - Browser-based plan creation
   - CLI script at `scripts/setup-paypal-plans.js` - Command-line plan creation

---

## 🚀 Quick Start: Create PayPal Subscription Plans

You have **three easy ways** to create subscription plans automatically:

### Option 1: Web UI (Easiest) ⭐ RECOMMENDED

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Visit the setup page:**

   Open your browser to: **http://localhost:3000/setup/paypal**

3. **Click the button** to create all three plans (Basic, Professional, Premium)

4. **Copy the Plan IDs** displayed on screen to your `.env.local` file

5. **Restart your dev server** to load the new environment variables

### Option 2: Command Line Script

1. **Run the setup script:**
   ```bash
   node scripts/setup-paypal-plans.js
   ```

2. **Copy the Plan IDs** printed to the console to your `.env.local` file

3. **Restart your dev server**

### Option 3: Manual Setup via PayPal Dashboard (Not Recommended)

If you prefer to create plans manually:

#### Step 1: Log into PayPal Dashboard
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/) (for sandbox)
2. Or [PayPal Business Dashboard](https://www.paypal.com/billing/plans) (for production)

#### Step 2: Create Three Plans

**Basic Plan:**
- Name: GPULaw Basic
- Description: Essential AI legal tools for everyday needs
- Billing cycle: Monthly
- Price: $9.00 USD
- Copy the Plan ID

**Professional Plan:**
- Name: GPULaw Professional
- Description: AI assistance plus limited attorney access
- Billing cycle: Monthly
- Price: $29.00 USD
- Copy the Plan ID

**Premium Plan:**
- Name: GPULaw Premium
- Description: Full AI + attorney protection for peace of mind
- Billing cycle: Monthly
- Price: $299.00 USD
- Copy the Plan ID

#### Step 3: Update Environment Variables

Add the Plan IDs to your `.env.local` file:

```bash
# PayPal Plan IDs
NEXT_PUBLIC_PAYPAL_PLAN_ID_BASIC=P-XXXXXXXXXXXXX
NEXT_PUBLIC_PAYPAL_PLAN_ID_PROFESSIONAL=P-XXXXXXXXXXXXX
NEXT_PUBLIC_PAYPAL_PLAN_ID_PREMIUM=P-XXXXXXXXXXXXX
```

---

## 🧪 Testing the Integration

### Using Sandbox Mode (Recommended for Testing)

1. **Ensure sandbox credentials** are in `.env.local`
2. **Run the automated setup** (Option 1 or 2 above) to create sandbox plans
3. **Create a sandbox buyer account:**
   - Go to [Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
   - Click "Create Account"
   - Select "Personal" account type
   - Note the email and password

4. **Test the subscription flow:**
   - Run: `npm run dev`
   - Go to your pricing page
   - Click a subscription button
   - Log in with your sandbox buyer account
   - Complete the subscription

### Production Testing

1. Switch to **production credentials** in `.env.local`
2. Run the automated setup with `NODE_ENV=production`
3. Update `.env.local` with production Plan IDs
4. Deploy or test locally with production mode
5. Test with a real PayPal account (cancel immediately after testing if needed)

---

## 📁 File Structure

```
/Users/wlin/dev/gpulaw/
├── .env.local                                    # PayPal credentials and Plan IDs
├── components/
│   ├── PayPalProvider.tsx                        # PayPal SDK wrapper
│   ├── PayPalSubscriptionButton.tsx              # Subscription button component
│   └── Pricing.tsx                               # Updated with PayPal buttons
├── app/
│   ├── layout.tsx                                # Wrapped with PayPalProvider
│   ├── setup/paypal/page.tsx                     # Setup UI page
│   └── api/
│       └── paypal/
│           ├── create-subscription/route.ts      # Create subscription endpoint
│           ├── verify-subscription/route.ts      # Verify subscription endpoint
│           └── create-plans/route.ts             # Create plans API endpoint
├── scripts/
│   └── setup-paypal-plans.js                     # CLI setup script
└── PAYPAL_SETUP.md                               # This file
```

---

## 🔄 How It Works

1. **User clicks subscription button** → PayPal button renders
2. **User logs into PayPal** → PayPal handles authentication
3. **User approves subscription** → PayPal creates subscription
4. **App verifies subscription** → Calls `/api/paypal/verify-subscription`
5. **Success!** → User is subscribed

---

## 📋 Plan Details

The automated setup creates these three plans:

| Plan | Price | Description |
|------|-------|-------------|
| **Basic** | $9/month | Essential AI legal tools for everyday needs |
| **Professional** | $29/month | AI assistance plus limited attorney access |
| **Premium** | $299/month | Full AI + attorney protection for peace of mind |

---

## ✅ Next Steps

1. ✅ **Create PayPal subscription plans** (use Option 1 or 2 above)
2. ✅ **Add Plan IDs to `.env.local`**
3. ✅ **Test with sandbox account**
4. ⚠️  **Add database integration** to store subscription data
5. ⚠️  **Add webhook handling** for subscription events
6. ⚠️  **Add user authentication** to link subscriptions to users

---

## 🔔 Advanced: Webhook Integration (Recommended)

To handle subscription events (renewals, cancellations, etc.):

1. Create webhook endpoint: `/app/api/paypal/webhook/route.ts`
2. Register webhook URL in PayPal Dashboard
3. Handle events like:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`
   - `PAYMENT.SALE.COMPLETED`

Example webhook handler:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const event = await request.json();

  switch (event.event_type) {
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
      // Handle subscription activation
      break;
    case 'BILLING.SUBSCRIPTION.CANCELLED':
      // Handle subscription cancellation
      break;
    // ... handle other events
  }

  return NextResponse.json({ received: true });
}
```

---

## 🆘 Support

- **PayPal Developer Docs**: https://developer.paypal.com/docs/subscriptions/
- **PayPal Support**: https://www.paypal.com/businesshelp
- **Subscription Plans API**: https://developer.paypal.com/docs/api/subscriptions/v1/

---

## 🔒 Security Notes

- ✅ Client Secret is only used server-side (never exposed to frontend)
- ✅ Client ID is safe to expose in frontend
- ✅ All subscription verification happens server-side
- ⚠️  Add rate limiting to API routes in production
- ⚠️  Validate webhook signatures in production
- ⚠️  Use HTTPS for webhook URLs in production

---

## 🐛 Troubleshooting

### "PayPal Plan ID not configured" error
- Make sure you've run the setup (Option 1 or 2)
- Verify Plan IDs are in `.env.local`
- Restart your dev server after updating `.env.local`

### "Failed to create plans" error
- Check your PayPal credentials in `.env.local`
- Ensure you're using the correct environment (sandbox vs production)
- Verify your PayPal account has API access enabled

### Subscription button doesn't appear
- Check browser console for errors
- Verify `PayPalProvider` is wrapping your app in `layout.tsx`
- Ensure `@paypal/react-paypal-js` is installed
