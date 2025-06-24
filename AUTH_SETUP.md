# Authentication Setup Guide

This guide will help you set up the complete authentication system with Supabase and Clerk for your AI Dashboard.

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Clerk Account**: Create a free account at [clerk.com](https://clerk.com)

## 1. Supabase Setup

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project name: `ai-dashboard`
5. Enter a secure database password
6. Choose a region close to your users
7. Click "Create new project"

### Step 2: Set up Database Tables
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents from `supabase_schema.sql`
3. Click "Run" to execute the SQL
4. Verify tables are created in the Table Editor

### Step 3: Get Supabase Keys
1. Go to Settings > API
2. Copy the following:
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

## 2. Clerk Setup (for OAuth providers)

### Step 1: Create Clerk Application
1. Go to [clerk.com](https://clerk.com) and sign in
2. Click "Add application"
3. Enter application name: `AI Dashboard`
4. Choose your authentication options:
   - Email/Password ✓
   - Google ✓
   - GitHub ✓
   - Any other providers you want

### Step 2: Configure OAuth Providers

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-clerk-frontend-api.clerk.accounts.dev/oauth_callback`
6. Copy Client ID and Secret to Clerk

#### GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in application details
4. Set Authorization callback URL to Clerk's callback
5. Copy Client ID and Secret to Clerk

### Step 3: Get Clerk Keys
1. Go to Clerk Dashboard > API Keys
2. Copy:
   - Publishable key
   - Secret key

## 3. Environment Variables Setup

Create a `.env.local` file in your project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/login
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# JWT
JWT_SECRET=your_very_secure_random_string_here_min_32_chars
JWT_EXPIRE=7d

# App URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 4. Install Dependencies

The required packages are already installed, but if you need to install them manually:

```bash
npm install @supabase/supabase-js @clerk/nextjs bcryptjs jsonwebtoken
```

## 5. Integration with Existing Components

### Update Root Layout
Wrap your app with AuthProvider in `app/layout.js`:

```jsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Protect Dashboard Routes
Update your dashboard page to use authentication:

```jsx
import { withAuth } from '@/contexts/AuthContext';

function Dashboard() {
  // Your existing dashboard code
}

export default withAuth(Dashboard);
```

### Add User Menu
Add a user menu to your dashboard header:

```jsx
import { useAuth } from '@/contexts/AuthContext';

function UserMenu() {
  const { user, logout } = useAuth();
  
  return (
    <div className="flex items-center gap-4">
      <span>Welcome, {user?.firstName}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 6. Testing Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Test signup with a new account
4. Test login with existing credentials
5. Test OAuth providers (Google, GitHub)
6. Test logout functionality
7. Test protected routes

## 7. API Endpoints

Your authentication system includes these endpoints:

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/reset-password` - Request password reset

## 8. Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Session management
- ✅ Row Level Security (RLS) in Supabase
- ✅ CSRF protection
- ✅ Rate limiting ready
- ✅ Secure HTTP-only cookies
- ✅ Password strength validation

## 9. Next Steps

1. **Email Verification**: Implement email verification for new users
2. **Password Reset**: Complete email-based password reset flow
3. **Rate Limiting**: Add rate limiting to authentication endpoints
4. **Audit Logging**: Log authentication events
5. **Multi-factor Authentication**: Add 2FA support
6. **Session Management**: Add active session management UI

## Troubleshooting

### Common Issues:

1. **Supabase Connection Failed**
   - Check your environment variables
   - Verify project URL and keys
   - Check network connectivity

2. **Clerk OAuth Not Working**
   - Verify OAuth provider configuration
   - Check redirect URIs
   - Ensure keys are correct

3. **JWT Errors**
   - Check JWT_SECRET is set
   - Verify token expiration settings
   - Clear browser cookies

4. **Database Errors**
   - Check if tables exist in Supabase
   - Verify RLS policies are set correctly
   - Check service role permissions

### Debug Mode:
Set `NODE_ENV=development` to see detailed error logs.

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check server logs
3. Verify all environment variables are set
4. Test API endpoints directly
5. Check Supabase and Clerk dashboards for errors

For additional help, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
