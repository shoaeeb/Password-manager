import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Password from '@/lib/models/Password';
import User from '@/lib/models/User';
import { authenticate } from '@/lib/middleware';
import { passwordEntrySchema } from '@/lib/validation';

// GET - Fetch all passwords for authenticated user
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const auth = authenticate(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query: any = { userId: auth.userId };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    let passwords = await Password.find(query).sort({ updatedAt: -1 });

    // Client-side search by title
    if (search) {
      passwords = passwords.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({ passwords });

  } catch (error) {
    console.error('Fetch passwords error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new password entry
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const auth = authenticate(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check subscription limits
    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.subscriptionStatus !== 'active' && user.passwordCount >= 25) {
      return NextResponse.json(
        { error: 'Password limit reached. Upgrade to Pro for unlimited passwords.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, encryptedData, category } = body;

    if (!title || !encryptedData) {
      return NextResponse.json(
        { error: 'Title and encrypted data are required' },
        { status: 400 }
      );
    }

    const password = new Password({
      userId: auth.userId,
      title,
      encryptedData,
      category: category || 'General',
    });

    await password.save();

    // Update password count
    await User.findByIdAndUpdate(auth.userId, {
      $inc: { passwordCount: 1 }
    });

    return NextResponse.json({
      message: 'Password saved successfully',
      password,
    });

  } catch (error) {
    console.error('Create password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}