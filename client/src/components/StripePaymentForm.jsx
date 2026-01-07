import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // ඔබේ Button component එක

const StripePaymentForm = ({ amount, currency, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  // State Management
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  // Stripe Element Styling (ඔබේ Site එකේ Styles වලට ගැලපෙන ලෙස)
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937", // text-gray-800
        fontFamily: "system-ui, -apple-system, sans-serif",
        "::placeholder": {
          color: "#9ca3af", // text-gray-400
        },
        iconColor: "#666",
      },
      invalid: {
        color: "#ef4444", // text-red-500
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: true, // අවශ්‍ය නම් false කරන්න
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe library එක load වෙලා නැත්නම් නවතින්න
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // ----------------------------------------------------------------
      // පියවර 1: Backend එකෙන් Client Secret එක ලබා ගැනීම (IMPORTANT)
      // ----------------------------------------------------------------
      // සැබෑ ලෝකයේදී, ඔබ මෙතැනදී ඔබේ Backend API එකට call කළ යුතුය.
      // උදා: const res = await fetch('/api/create-payment-intent', { method: 'POST', body: JSON.stringify({ amount }) });
      // const { clientSecret } = await res.json();

      // --- DEMO PURPOSES ONLY (Backend නැති නිසා අපි මෙය Mock කරමු) ---
      // මෙය සැබෑ Project එකකදී ඉවත් කරන්න.
      await new Promise((resolve) => setTimeout(resolve, 2000)); // තත්පර 2ක් ඉන්නවා වගේ පෙන්වන්න

      // Mock Successful Response (සැබෑවටම Payment එකක් නොවෙයි)
      const mockPaymentIntent = { id: "pi_mock_12345", status: "succeeded" };

      // සැබෑවටම නම් මෙතන එන්නේ:
      // const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      //   payment_method: { card: cardElement },
      // });

      const stripeError = null; // Demo නිසා Error එක null කරමු

      // ----------------------------------------------------------------

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      } else {
        // Payment සාර්ථකයි!
        console.log("Payment Succeeded:", mockPaymentIntent);
        onSuccess(mockPaymentIntent); // Parent component එකට දන්වන්න
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-1 mt-4">
      {/* Card Input Container */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="p-4 transition-colors bg-white border border-gray-300 rounded-lg shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <CardElement
            options={cardElementOptions}
            onChange={(e) => {
              setError(e.error ? e.error.message : null);
              setCardComplete(e.complete);
            }}
          />
        </div>
        {/* Error Message Display */}
        {error && (
          <div className="flex items-center mt-2 text-sm text-red-600 animate-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Pay Button */}
      <Button
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        className="w-full h-12 text-lg font-bold text-white transition-all shadow-md bg-primary hover:bg-primary/90"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Pay {currency} {amount}
          </div>
        )}
      </Button>

      <p className="mt-4 text-xs text-center text-gray-400">
        Payments are secured by Stripe. Your card details are never stored on
        our servers.
      </p>
    </form>
  );
};

export default StripePaymentForm;
