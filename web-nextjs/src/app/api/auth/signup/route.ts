import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple in-memory store for demo (use database in production)
const users = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const userId = crypto.randomUUID();
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    const newUser = {
      id: userId,
      email,
      name,
      passwordHash,
      provider: 'email',
      customerId: `cust_${crypto.randomBytes(16).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };

    users.set(userId, newUser);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        provider: newUser.provider,
        customerId: newUser.customerId,
      },
    });
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { success: false, message: 'Sign-up failed' },
      { status: 500 }
    );
  }
}
