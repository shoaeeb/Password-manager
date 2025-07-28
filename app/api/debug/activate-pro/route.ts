import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { authenticate } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const auth = authenticate(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      auth.userId,
      {
        subscriptionStatus: 'active',
        subscriptionId: 'test_subscription_' + Date.now(),
        subscriptionStartDate: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Pro status activated',
      subscriptionStatus: updatedUser?.subscriptionStatus
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to activate Pro' },
      { status: 500 }
    );
  }
}