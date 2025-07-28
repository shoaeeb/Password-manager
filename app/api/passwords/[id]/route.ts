import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Password from '@/lib/models/Password';
import User from '@/lib/models/User';
import { authenticate } from '@/lib/middleware';

// PUT - Update password entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const auth = authenticate(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, encryptedData, category } = body;

    const password = await Password.findOneAndUpdate(
      { _id: params.id, userId: auth.userId },
      { title, encryptedData, category },
      { new: true }
    );

    if (!password) {
      return NextResponse.json(
        { error: 'Password not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Password updated successfully',
      password,
    });

  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete password entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const auth = authenticate(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const password = await Password.findOneAndDelete({
      _id: params.id,
      userId: auth.userId,
    });

    if (!password) {
      return NextResponse.json(
        { error: 'Password not found' },
        { status: 404 }
      );
    }

    // Update password count
    await User.findByIdAndUpdate(auth.userId, {
      $inc: { passwordCount: -1 }
    });

    return NextResponse.json({
      message: 'Password deleted successfully',
    });

  } catch (error) {
    console.error('Delete password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}