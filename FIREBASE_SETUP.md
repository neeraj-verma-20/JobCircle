# Firebase Setup Guide for Job Application OTP Verification

This guide will help you set up Firebase Authentication for OTP verification in the JobCircle job portal.

## Prerequisites

1. A Google account
2. Access to Firebase Console (https://console.firebase.google.com/)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter project name (e.g., "JobCircle")
4. Follow the setup wizard
5. Enable Google Analytics (optional)

## Step 2: Enable Phone Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started** (if not already enabled)
3. Go to **Sign-in method** tab
4. Click on **Phone** provider
5. Enable it and click **Save**

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "JobCircle Web")
5. Copy the Firebase configuration object

## Step 4: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIRELIC_FIREBASE_APP_ID=your_app_id
```

**Important:** Replace all placeholder values with your actual Firebase configuration values.

## Step 5: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings**
2. Scroll to **Authorized domains**
3. Add your domain (e.g., `localhost` for development, your production domain)
4. Firebase automatically includes:
   - `localhost` (for development)
   - `your-project-id.firebaseapp.com`
   - `your-project-id.web.app`

## Step 6: Set up reCAPTCHA (for Phone Auth)

Firebase Phone Authentication uses invisible reCAPTCHA. It's automatically handled, but make sure:

1. Your domain is authorized (Step 5)
2. You're testing on `localhost` or an authorized domain
3. For production, ensure your domain is added to authorized domains

## Step 7: Install Dependencies

The Firebase package is already added to `package.json`. Run:

```bash
npm install
```

## Step 8: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to a job detail page
3. Click "Apply for Job" button
4. Fill in the form and try sending an OTP
5. Check your phone for the OTP code

## Troubleshooting

### OTP Not Received

1. **Check phone number format**: Must be 10 digits (Indian format)
2. **Check Firebase Console**: Go to Authentication > Users to see if verification was attempted
3. **Check browser console**: Look for any error messages
4. **Verify Firebase config**: Ensure all environment variables are correct

### reCAPTCHA Errors

1. **Domain not authorized**: Add your domain to Firebase authorized domains
2. **Network issues**: Check internet connection
3. **Browser compatibility**: Try a different browser

### Firebase Initialization Errors

1. **Check environment variables**: Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set
2. **Check Firebase config**: Verify the config object in `src/lib/firebase.js`
3. **Check console**: Look for specific error messages

### Common Errors

- **"auth/too-many-requests"**: Too many OTP requests. Wait before retrying.
- **"auth/invalid-phone-number"**: Phone number format is incorrect.
- **"auth/captcha-check-failed"**: reCAPTCHA verification failed. Try refreshing the page.

## Production Deployment

1. **Add production domain** to Firebase authorized domains
2. **Update environment variables** in your hosting platform
3. **Test OTP flow** on production domain
4. **Monitor Firebase Console** for any issues

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all Firebase config
- Keep your Firebase API keys secure
- Regularly review Firebase security rules

## Support

For more information, refer to:
- [Firebase Phone Authentication Docs](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firebase Console](https://console.firebase.google.com/)
