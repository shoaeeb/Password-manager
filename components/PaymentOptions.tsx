"use client";

import { RazorpaySubscription } from "./RazorpaySubscription";

interface PaymentOptionsProps {
  onSuccess?: () => void;
  onError?: () => void;
}

export const PaymentOptions = ({ onSuccess, onError }: PaymentOptionsProps) => {
  return (
    <div className="space-y-4">
      <RazorpaySubscription onSuccess={onSuccess} onError={onError} />
    </div>
  );
};