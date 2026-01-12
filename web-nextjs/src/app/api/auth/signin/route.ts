import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple in-memory store for demo (use database in production)
// In production, use DynamoDB, MongoDB, or any database
const users = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, provider, id, picture } = body;

    // Handle Google Sign-In
    if (provider === 'google') {
      const userId = id || crypto.randomUUID();
      
      // Check if user exists
      let user = Array.from(users.values()).find(u => u.email === email);
      
      if (!user) {
        // Create new user
        user = {
          id: userId,
          email,
          name,
          picture,
          provider: 'google',
          customerId: `cust_${crypto.randomBytes(16).toString('hex')}`,
          createdAt: new Date().toISOString(),
        };
        users.set(userId, user);
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          provider: user.provider,
          customerId: user.customerId,
        },
      });
    }

    // Handle Email/Password Sign-In
    if (provider === 'email') {
      // Find user by email
      const user = Array.from(users.values()).find(u => u.email === email);

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      // Verify password (in production, use bcrypt)
      const passwordHash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      if (user.passwordHash !== passwordHash) {
        return NextResponse.json(
          { success: false, message: 'Invalid password' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          provider: user.provider,
          customerId: user.customerId,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid provider' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { success: false, message: 'Sign-in failed' },
      { status: 500 }
    );
  }
}
