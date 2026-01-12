# Authentication Setup Guide

This guide will help you set up user authentication with Google Sign-In and custom email/password login.

## Features

- ✅ Google Sign-In (OAuth 2.0)
- ✅ Email/Password Authentication
- ✅ Automatic customer ID generation
- ✅ User session management
- ✅ Pre-filled checkout forms
- ✅ Protected checkout flow

## Setup Google Sign-In

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Identity Services API

### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure the consent screen:
   - Application name: `All About Table Tennis`
   - User support email: Your email
   - Developer contact: Your email
4. Select **Web application**
5. Add **Authorized JavaScript origins**:
   - For local development: `http://localhost:3000`
   - For production: `https://allabouttabletennis.in`
   - For Amplify: `https://your-app-id.amplifyapp.com`
6. Click **Create**
7. Copy your **Client ID** (looks like: `123456789-abcdef.apps.googleusercontent.com`)

### Step 3: Configure Environment Variables

**Local Development:**

Add to `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

**Production (Amplify):**

1. Go to [Amplify Console](https://console.aws.amazon.com/amplify/)
2. Select your app → **Environment variables**
3. Add:
   - **Variable name:** `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - **Value:** Your Google Client ID
4. Redeploy your app

### Step 4: Test Authentication

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test Sign In:**
   - Go to your site
   - Click **Sign In** in the navigation
   - Try both Google Sign-In and Email/Password registration
   - Add items to cart and proceed to checkout
   - Verify you stay logged in after page refresh

## How It Works

### Authentication Flow

1. **User Signs In** (Google or Email/Password)
2. **Customer ID Generated** - Unique ID like `cust_abc123def456`
3. **User Session Created** - Saved in localStorage
4. **Checkout Access** - User can now complete purchases

### Customer ID Integration

When a user signs in, the system automatically:
- Creates a unique customer ID
- Stores it with the user profile
- Passes it to Razorpay for payment processing
- Includes it in order notifications

### Protected Checkout

- Checkout page requires authentication
- Auth modal appears automatically if user not logged in
- Form pre-fills with user's name and email
- Customer ID sent with payment requests

## User Data Storage

**Current Implementation (Demo):**
- In-memory storage (resets on server restart)
- Suitable for development/testing

**Production Recommendations:**

### Option 1: AWS DynamoDB (Recommended)
```typescript
// Example DynamoDB table structure
{
  TableName: 'users',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' }
  ],
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' },
    { AttributeName: 'email', AttributeType: 'S' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'email-index',
      KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }]
    }
  ]
}
```

### Option 2: MongoDB
```javascript
const userSchema = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  passwordHash: String,
  provider: { type: String, enum: ['google', 'email'] },
  customerId: { type: String, required: true },
  picture: String,
  createdAt: { type: Date, default: Date.now }
});
```

### Option 3: AWS Cognito
- Managed authentication service
- Built-in user pools
- Automatic scaling
- Federation with Google, Facebook, etc.

## Security Considerations

### Current Implementation (For Demo)

⚠️ **Password Hashing:** Uses SHA-256 (not recommended for production)
⚠️ **Session Management:** LocalStorage (vulnerable to XSS)
⚠️ **No Token Refresh:** Sessions don't expire

### Production Security Checklist

✅ **Use bcrypt for password hashing:**
```bash
npm install bcrypt
```
```typescript
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, user.passwordHash);
```

✅ **Implement JWT tokens:**
```typescript
import jwt from 'jsonwebtoken';
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: '7d'
});
```

✅ **Use HTTP-only cookies for sessions:**
```typescript
response.cookies.set('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7 // 7 days
});
```

✅ **Add CSRF protection**
✅ **Implement rate limiting**
✅ **Add email verification**
✅ **Enable 2FA (optional)**

## API Endpoints

### POST /api/auth/signin
Sign in with email/password or Google

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "provider": "email"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "provider": "email",
    "customerId": "cust_abc123"
  }
}
```

### POST /api/auth/signup
Create new account with email/password

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "customerId": "cust_abc123"
  }
}
```

## Troubleshooting

### "Google Sign-In failed"
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
- Check authorized JavaScript origins in Google Cloud Console
- Ensure you're using the correct domain (localhost vs production)
- Clear browser cache and try again

### "Customer ID is required" error
- This means user is not logged in
- Auth modal should appear automatically
- Check browser console for auth errors
- Verify localStorage has user data

### User session lost after refresh
- Check if localStorage is enabled in browser
- Verify AuthContext is wrapped around the app
- Check browser console for errors

### Google Sign-In popup blocked
- Allow popups for your domain
- Check browser popup blocker settings
- Try using a different browser

## Migration from Demo to Production

1. **Choose a database** (DynamoDB, MongoDB, etc.)
2. **Update API routes** to use database instead of Map
3. **Implement bcrypt** for password hashing
4. **Add JWT tokens** for session management
5. **Use HTTP-only cookies** instead of localStorage
6. **Add email verification** for new signups
7. **Implement rate limiting** on auth endpoints
8. **Add logging and monitoring**
9. **Enable HTTPS only** in production
10. **Regular security audits**

## Next Steps

Once authentication is working:
1. Test the complete checkout flow
2. Verify customer IDs are passed to Razorpay
3. Check order notifications include customer info
4. Consider adding:
   - Order history page for logged-in users
   - Saved addresses
   - Wishlist functionality
   - Profile management

## Support

- Google OAuth Documentation: [https://developers.google.com/identity/gsi/web](https://developers.google.com/identity/gsi/web)
- Next.js Authentication: [https://nextjs.org/docs/authentication](https://nextjs.org/docs/authentication)
- AWS Cognito: [https://docs.aws.amazon.com/cognito/](https://docs.aws.amazon.com/cognito/)
