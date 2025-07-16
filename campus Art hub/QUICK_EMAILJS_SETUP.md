# 🚀 Quick EmailJS Setup - Get Real Emails Working in 10 Minutes!

## ⚠️ Current Issue
Your customers aren't receiving real emails because EmailJS isn't configured yet. The system is using placeholder values.

## ✅ Quick Fix Steps

### Step 1: Create EmailJS Account (2 minutes)
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" (it's free)
3. Use your email and create a password
4. Verify your email address

### Step 2: Add Gmail Service (3 minutes)
1. Login to EmailJS dashboard
2. Click "Email Services" → "Add New Service"
3. Choose "Gmail"
4. Click "Connect Account"
5. Login with your Gmail account
6. **Copy the Service ID** (looks like `service_abc123`)

### Step 3: Create Email Template (2 minutes)
1. Click "Email Templates" → "Create New Template"
2. Name it: "Password Reset"
3. Subject: `Password Reset Request - Art Smashers`
4. Content:
```
Hello {{to_name}},

You requested a password reset for your Art Smashers account.

Click the link below to reset your password:
{{reset_link}}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

Best regards,
{{from_name}}
```
5. **Copy the Template ID** (looks like `template_xyz789`)

### Step 4: Get Your Public Key (1 minute)
1. Click "Account" → "API Keys"
2. **Copy the Public Key** (looks like `user_def456`)

### Step 5: Update Your Code (2 minutes)
Open `src/utils/emailService.js` and replace these lines:

**Line 8:** Replace `"YOUR_PUBLIC_KEY"` with your actual public key
**Line 25:** Replace `'YOUR_SERVICE_ID'` with your service ID  
**Line 26:** Replace `'YOUR_TEMPLATE_ID'` with your template ID
**Line 28:** Replace `'YOUR_PUBLIC_KEY'` with your public key

### Example:
```javascript
// Line 8
emailjs.init("user_def456");

// Line 25-28
const response = await emailjs.send(
  'service_abc123',    // Your service ID
  'template_xyz789',   // Your template ID
  templateParams,
  'user_def456'        // Your public key
);
```

## 🧪 Test It
1. Save the file
2. Restart your React app
3. Go to login page
4. Click "Forgot Password"
5. Enter `user@email.com`
6. Click "Send Reset Link"
7. Check your email inbox!

## 🔍 Check Console
Open browser console (F12) and look for:
- ✅ "📧 Real email sent successfully via EmailJS!"
- ❌ "🔄 Falling back to mock email service..." (means setup failed)

## 🆘 Still Not Working?
1. **Check console errors** - Look for EmailJS error messages
2. **Verify Gmail connection** - Make sure Gmail service is connected
3. **Check template variables** - Make sure they match the code
4. **Try different email** - Test with your own email address

## 💡 Pro Tips
- Use your own email for testing first
- Check spam folder if email doesn't arrive
- EmailJS free plan allows 200 emails/month
- Make sure your Gmail account has "Less secure app access" enabled

## 🎯 Expected Result
After setup, customers will receive real emails like this:
```
From: your-gmail@gmail.com
Subject: Password Reset Request - Art Smashers
To: customer@email.com

Hello Customer Name,

You requested a password reset for your Art Smashers account.

Click the link below to reset your password:
https://your-art-hub.com/reset-password?token=demo123&email=customer@email.com

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

Best regards,
Art Smashers Team
``` 