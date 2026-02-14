# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the TCW1 application.

## Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "TCW1-Auth")
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, select your project
2. Navigate to "APIs & Services" > "Library"
3. Search for "Google+ API"
4. Click on it and click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type and click "Create"
3. Fill in the required information:
   - App name: TCW1
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. On the Scopes page, click "Save and Continue" (default scopes are sufficient)
6. On the Test users page, add test users if needed
7. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name (e.g., "TCW1 Web Client")
5. Add authorized JavaScript origins:
   - For development: `http://localhost:5173`
   - For production: Your frontend URL (e.g., `https://yourdomain.com`)
6. Add authorized redirect URIs:
   - For development: `http://localhost:3001/api/auth/google/callback`
   - For production: Your backend URL + `/api/auth/google/callback`
7. Click "Create"
8. Copy the Client ID and Client Secret

## Step 5: Configure Environment Variables

### Backend (.env)

Add the following variables to your backend `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

**For production:**
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env)

Create a `.env` file in the frontend directory if it doesn't exist:

```env
VITE_API_URL=http://localhost:3001
```

**For production:**
```env
VITE_API_URL=https://api.yourdomain.com
```

## Step 6: Test the Integration

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to the login page
4. Click "Sign in with Google"
5. You should be redirected to Google's sign-in page
6. After signing in, you should be redirected back to your application

## Troubleshooting

### Common Issues

1. **Redirect URI mismatch**
   - Make sure the redirect URI in Google Console exactly matches your backend URL + `/api/auth/google/callback`
   - Check for trailing slashes and HTTP vs HTTPS

2. **"Error 400: redirect_uri_mismatch"**
   - The redirect URI must be registered in Google Cloud Console
   - Ensure your BACKEND_URL environment variable is correct

3. **"This app isn't verified"**
   - This is normal for apps in development
   - Click "Advanced" and then "Go to [App Name] (unsafe)" for testing
   - For production, you'll need to verify your app with Google

4. **User not being created**
   - Check your MongoDB connection
   - Check backend logs for errors
   - Ensure the User model has been updated correctly

## Security Notes

- **Never commit your `.env` file** - Add it to `.gitignore`
- Keep your Client Secret secure
- Use HTTPS in production
- For production, consider publishing your OAuth app or adding specific test users
- Regularly rotate your Client Secret

## Additional Features

### Linking Existing Accounts

If a user signs up with email/password first and then tries to sign in with Google using the same email:
- The system will automatically link the Google account to the existing user account
- The user can then sign in using either method

### Profile Picture

Google OAuth automatically fetches the user's profile picture, which is stored in the `profilePicture` field of the User model.

## Production Deployment

When deploying to production:

1. Update the authorized JavaScript origins and redirect URIs in Google Cloud Console
2. Update your environment variables with production URLs
3. Consider publishing your OAuth consent screen for public access
4. Ensure your SSL certificates are valid (HTTPS required for production)

## Support

For issues with Google OAuth setup:
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Common OAuth Errors](https://developers.google.com/identity/protocols/oauth2/openid-connect#server-flow)
