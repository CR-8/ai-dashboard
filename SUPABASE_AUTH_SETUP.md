# Supabase Authentication Setup

This application now uses Supabase for authentication instead of Clerk.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Existing API Keys (keep these as they were)
GOOGLE_AI_API_KEY=your_google_ai_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
# ... other API keys
```

## Getting Your Supabase Keys

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > API
4. Copy your Project URL and anon/public key

## Database Setup

1. In your Supabase project dashboard, go to the SQL Editor
2. Run the SQL script from `supabase_schema.sql` to create the necessary tables
3. This will set up:
   - User authentication tables
   - User profiles
   - User sessions
   - Watchlists
   - Row Level Security (RLS) policies

## Features

- **Email/Password Authentication**: Users can sign up and sign in with email/password
- **OAuth Integration**: Support for Google and GitHub OAuth (configure in Supabase dashboard)
- **Email Verification**: Automatic email verification for new accounts
- **Password Reset**: Secure password reset functionality
- **Profile Management**: Users can update their profile information
- **Session Management**: Secure session handling with automatic refresh
- **Protected Routes**: Middleware-based route protection

## OAuth Setup (Optional)

To enable OAuth providers:

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Google and/or GitHub
3. Add your OAuth app credentials
4. Configure redirect URLs

## Security Features

- Row Level Security (RLS) enabled on all tables
- Secure session management
- Automatic token refresh
- Protected API routes
- Email verification
- Password reset with secure tokens

## Migration from Clerk

All Clerk-specific components and logic have been replaced with Supabase equivalents:

- `SignIn` and `SignUp` components replaced with custom forms
- `UserButton` replaced with custom user menu
- Clerk middleware replaced with Supabase SSR middleware
- Authentication context updated to use Supabase Auth
- Environment variables updated for Supabase

The user experience remains the same, but the backend authentication is now powered by Supabase.
