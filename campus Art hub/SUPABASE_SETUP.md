# Supabase Setup Guide for Art Hub

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `art-hub` or `campus-art-hub`
   - Database Password: Create a strong password
   - Region: Choose closest to your users
6. Click "Create new project"
7. Wait for project to be created (2-3 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Create Environment File

Create `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Step 5: Run Database Setup

1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy and paste the complete SQL from `sql/complete_setup.sql`
4. Click "Run" to execute

## Step 6: Enable Storage

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `images`
3. Make it public
4. Set up policies (already included in SQL script)

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Go to admin login: `/admin-login`
3. Login with: `admin@campusarthub.com` / `admin123`
4. Try uploading an image in Image Management tab
5. Check if it appears on the home page

## Troubleshooting

- If images don't upload: Check Storage policies in Supabase
- If database errors: Verify SQL script ran successfully
- If authentication fails: Check environment variables
