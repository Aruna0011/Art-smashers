# EmailJS Setup Guide for Real Email Sending

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template content:

```html
Subject: Password Reset Request - Art Smashers

Hello {{to_name}},

You requested a password reset for your Art Smashers account.

Click the link below to reset your password:
{{reset_link}}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

Best regards,
{{from_name}}
```

4. Save the template and note down your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Your Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key** (e.g., `user_def456`)

## Step 5: Update the Code
Replace the placeholder values in `src/utils/emailService.js`:

```javascript
// Line 8: Replace with your public key
emailjs.init("YOUR_PUBLIC_KEY");

// Line 25: Replace with your service ID
'YOUR_SERVICE_ID'

// Line 26: Replace with your template ID  
'YOUR_TEMPLATE_ID'

// Line 28: Replace with your public key
'YOUR_PUBLIC_KEY'
```

## Example Configuration:
```javascript
emailjs.init("user_def456");

const response = await emailjs.send(
  'service_abc123',
  'template_xyz789', 
  templateParams,
  'user_def456'
);
```

## Step 6: Test the Email
1. Start your React app
2. Go to login page
3. Click "Forgot Password"
4. Enter any registered email (user@email.com, priya@email.com, admin@art.com)
5. Click "Send Reset Link"
6. Check the email inbox for the reset link

## Troubleshooting:
- **Email not received**: Check spam folder
- **Service error**: Verify your email service is properly connected
- **Template error**: Make sure template variables match the code
- **API key error**: Verify your public key is correct

## Free Plan Limits:
- 200 emails per month
- Perfect for testing and small applications

## Security Note:
- Never expose your private keys in client-side code
- For production, consider using a backend service
- EmailJS is suitable for development and small applications 