import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { hashMasterPassword, generateToken } from '@/lib/auth';
import { registerSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, masterPassword } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash master password with salt
    const { hash, salt } = await hashMasterPassword(masterPassword);

    // Create new user
    const user = new User({
      email,
      masterPasswordHash: hash,
      salt,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id.toString());

    return NextResponse.json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}