import { NextRequest, NextResponse } from 'next/server';
import { createSubscription } from '@/lib/paypal';
import { getCurrentUser } from '@/lib/authUser';

export async function POST(request: NextRequest) {
  try {
    const { planId } = (await request.json()) as { planId?: string };

    if (!planId) {
      return NextResponse.json(
        { error: 'planId is required' },
        { status: 400 },
      );
    }

    // Optional signed-in user — if present we pre-fill subscriber info and
    // stamp the subscription with `custom_id` for later reconciliation.
    const user = await getCurrentUser().catch(() => null);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      request.nextUrl.origin;

    const subscription = await createSubscription({
      planId,
      returnUrl: `${appUrl}/dashboard?paypal=success`,
      cancelUrl: `${appUrl}/?paypal=cancelled`,
      subscriberEmail: user?.email ?? undefined,
      subscriberName: user?.name
        ? { given_name: user.name.split(' ')[0], surname: user.name.split(' ').slice(1).join(' ') || undefined }
        : undefined,
      customId: user?.id ?? undefined,
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('PayPal create-subscription error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create PayPal subscription', message },
      { status: 500 },
    );
  }
}
