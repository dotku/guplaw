'use client';

import { useState } from 'react';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';

interface PayPalSubscriptionButtonProps {
  planId: string;
  buttonText: string;
  planName: string;
  color?: 'gold' | 'blue' | 'silver' | 'white' | 'black';
}

export default function PayPalSubscriptionButton({
  planId,
  buttonText,
  planName,
  color = 'gold',
}: PayPalSubscriptionButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [{ isPending }] = usePayPalScriptReducer();

  // Determine button gradient based on color prop
  const getButtonGradient = () => {
    switch (color) {
      case 'blue':
        return 'from-blue-600 to-blue-800';
      case 'silver':
        return 'from-gray-600 to-gray-800';
      case 'gold':
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create subscription via PayPal API
      const response = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const subscription = await response.json();

      if (!response.ok) {
        console.error('Subscription creation failed:', subscription);
        throw new Error(subscription.details?.message || subscription.error || 'Failed to create subscription');
      }

      // Find the approval URL
      const approvalUrl = subscription.links?.find(
        (link: any) => link.rel === 'approve'
      )?.href;

      if (approvalUrl) {
        // Redirect to PayPal for approval
        window.location.href = approvalUrl;
      } else {
        throw new Error('No approval URL found');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError(`Failed to start subscription. Please try again.`);
      setLoading(false);
    }
  };

  if (!planId || planId.startsWith('your_')) {
    return (
      <button
        disabled
        className="w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-white bg-gray-400 cursor-not-allowed text-base sm:text-lg"
        title="PayPal Plan ID not configured"
      >
        {buttonText} (Setup Required)
      </button>
    );
  }

  if (success) {
    return (
      <div className="w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-white bg-green-600 text-center text-base sm:text-lg">
        ✓ Subscription Active!
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-2 p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}
      <button
        onClick={handleSubscribe}
        disabled={loading || isPending}
        className={`w-full py-3 sm:py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${getButtonGradient()} hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg text-base sm:text-lg ${
          loading || isPending ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Processing...' : buttonText}
      </button>
    </div>
  );
}
