import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { authenticate } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    const auth = authenticate(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = await request.json();

    // Verify subscription payment signature
    const body = razorpay_payment_id + '|' + razorpay_subscription_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Payment verified, activate subscription
    await connectDB();
    
    const updateData = {
      subscriptionStatus: 'active',
      subscriptionId: razorpay_subscription_id,
      subscriptionStartDate: new Date(),
    };

    console.log('Updating user subscription:', {
      userId: auth.userId,
      updateData
    });

    const updatedUser = await User.findByIdAndUpdate(
      auth.userId, 
      updateData,
      { new: true }
    );

    console.log('User updated:', {
      userId: updatedUser?._id,
      subscriptionStatus: updatedUser?.subscriptionStatus,
      subscriptionId: updatedUser?.subscriptionId
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified and subscription activated',
      subscriptionStatus: updatedUser?.subscriptionStatus
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}