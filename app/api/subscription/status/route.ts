import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Password from '@/lib/models/Password';
import { authenticate } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const auth = authenticate(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Sync password count with actual passwords in database
    const actualPasswordCount = await Password.countDocuments({ userId: auth.userId });
    
    if (user.passwordCount !== actualPasswordCount) {
      await User.findByIdAndUpdate(auth.userId, { passwordCount: actualPasswordCount });
      user.passwordCount = actualPasswordCount;
    }

    return NextResponse.json({
      subscriptionStatus: user.subscriptionStatus,
      passwordCount: user.passwordCount,
      isProUser: user.subscriptionStatus === 'active',
      canAddPasswords: user.subscriptionStatus === 'active' || user.passwordCount < 25,
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const auth = authenticate(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscriptionId, status, planId } = await request.json();

    const updateData: any = { subscriptionStatus: status };
    
    if (subscriptionId) updateData.subscriptionId = subscriptionId;
    if (planId) updateData.subscriptionPlanId = planId;
    if (status === 'active') updateData.subscriptionStartDate = new Date();

    const user = await User.findByIdAndUpdate(
      auth.userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Subscription status updated',
      subscriptionStatus: user.subscriptionStatus,
    });

  } catch (error) {
    console.error('Update subscription status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}