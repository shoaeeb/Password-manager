import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Create subscription plan using correct API
    const plan = await razorpay.plans.create({
      period: 'monthly',
      interval: 1,
      item: {
        name: 'SecurePass Pro Monthly',
        amount: 26000, // ₹260 in paise
        currency: 'INR',
      },
    });

    return NextResponse.json({ plan });

  } catch (error: any) {
    console.error('Razorpay plan creation error:', {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
      description: error.description
    });
    return NextResponse.json(
      { 
        error: error.message || error.description || 'Failed to create plan',
        details: error
      },
      { status: 500 }
    );
  }
}