# Quick Google OAuth Setup

## Why is Google Sign-In Missing?

The Google sign-in button is missing because the Google OAuth Client ID is not configured. You'll see a warning message instead of the button.

## Quick Fix (3 Steps)

### Step 1: Get a Google Client ID (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add these to "Authorized JavaScript origins":
   - `http://localhost:5173`
   - `http://localhost:3000`
7. Click "Create"
8. Copy the Client ID (looks like: `123456789-abcdef.apps.googleusercontent.com`)

### Step 2: Update Environment File

Edit the `.env` file in the frontend directory:

```bash
cd AgriAssist1/frontend
```

Replace the content of `.env` with:
```env
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Step 3: Restart the Frontend

```bash
npm run dev
```

## What You'll See

- ✅ **Before**: Warning message "Google Sign-In is not configured"
- ✅ **After**: Google sign-in button appears

## Testing

1. Go to `http://localhost:5173/login`
2. You should see the Google sign-in button
3. Click it to test the OAuth flow

## Troubleshooting

### Button Still Missing?
- Check that your Client ID is correct
- Make sure you added `http://localhost:5173` to authorized origins
- Restart the frontend server

### Getting Errors?
- Check browser console for errors
- Verify backend server is running on port 8000
- Test API endpoints: `curl http://localhost:8000/api/v1/user/google-login/`

## For Production

When deploying:
1. Add your production domain to authorized origins
2. Update the Client ID for production
3. Enable HTTPS (required for Google OAuth)

## Need Help?

- Check the full setup guide: `GOOGLE_OAUTH_SETUP.md`
- Test API endpoints directly
- Check browser console for errors 