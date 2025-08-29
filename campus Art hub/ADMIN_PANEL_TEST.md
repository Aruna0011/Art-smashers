# 🧪 Admin Panel Supabase Sync Test Guide

## How to Test Your Admin Panel

Your admin panel now includes a **built-in test panel** on the dashboard to verify Supabase sync is working correctly.

### Step 1: Configure Environment Variables

Update your `.env` file with real Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### Step 2: Access Test Panel

1. **Login to Admin Panel**
2. **Go to Dashboard tab** (first tab)
3. **Look for "Admin Panel Supabase Sync Test" card** on the right
4. **Click "Run All Tests"**

### Step 3: Test Results

The test will check:

✅ **Environment Variables** - Are credentials configured?
✅ **Supabase Connection** - Can we connect to your database?
✅ **Load Categories** - Can we read existing categories?
✅ **Load Products** - Can we read existing products?
✅ **Add Category** - Can we create new categories?
✅ **Add Product** - Can we create new products?
✅ **Delete Operations** - Can we clean up test data?

### Step 4: Fix Issues

**If tests fail:**

1. **Red "Environment Variables"** → Update your `.env` file
2. **Red "Supabase Connection"** → Check your Supabase project is active
3. **Red "Add Category/Product"** → Check Supabase table permissions
4. **Red "Load Data"** → Verify your SQL script ran successfully

### Step 5: Manual Testing

After tests pass, manually test:

1. **Add Category**: Categories tab → "Add New Category" button
2. **Add Product**: Products tab → "Add New Product" button  
3. **Check Sync**: Go to Home page → See if new items appear
4. **Check Supabase**: Open Supabase dashboard → Verify data in tables

## Troubleshooting

### Add Category Button Not Working

**Common causes:**
- Environment variables not set correctly
- Supabase project not configured
- Missing table permissions
- Network connectivity issues

**Solutions:**
1. Run the test panel first
2. Check browser console for errors
3. Verify Supabase credentials
4. Ensure SQL script was executed

### Data Not Syncing

**Check:**
- Test panel shows all green
- Browser console for errors
- Supabase dashboard for new data
- Network tab for failed requests

## Success Indicators

✅ Test panel shows all green checkmarks
✅ Add category button creates new categories
✅ Add product button creates new products
✅ New items appear on website immediately
✅ Supabase dashboard shows new data

Your admin panel is now fully integrated with Supabase for real-time sync!
