import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { authenticate } from '@/lib/middleware';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, currency } = await request.json();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount, // Amount in paise
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: auth.userId,
        plan: 'pro_monthly',
      },
    });

    return NextResponse.json(order);

  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}