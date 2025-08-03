# Google OAuth Setup Guide for AgriAssist

This guide will help you set up Google OAuth authentication for the AgriAssist application.

## Prerequisites

- Google Cloud Console account
- Access to create OAuth 2.0 credentials

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add your domain to the "Authorized JavaScript origins":
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using different port)
   - Your production domain (when deployed)
8. Add your domain to the "Authorized redirect URIs":
   - `http://localhost:5173` (for development)
   - Your production domain (when deployed)
9. Click "Create"
10. Copy the Client ID (you'll need this for the frontend)

## Step 2: Configure Frontend

1. Create a `.env` file in the `frontend` directory:
```bash
cd AgriAssist1/frontend
touch .env
```

2. Add your Google Client ID to the `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

3. Replace `your_google_client_id_here` with the actual Client ID from Step 1.

## Step 3: Configure Backend (Optional)

If you want to add additional Google OAuth fields to your User model, you can add them to the Django model:

```python
# In api/models.py, add to User model:
is_google_user = models.BooleanField(default=False)
google_id = models.CharField(max_length=100, blank=True, null=True)
```

Then run migrations:
```bash
cd AgriAssist1/backend
python manage.py makemigrations
python manage.py migrate
```

## Step 4: Test the Integration

1. Start the backend server:
```bash
cd AgriAssist1/backend
python manage.py runserver
```

2. Start the frontend development server:
```bash
cd AgriAssist1/frontend
npm run dev
```

3. Navigate to the login or register page
4. You should see Google sign-in buttons
5. Test the Google OAuth flow

## Features Implemented

### Enhanced Error Handling

- **Field-specific errors**: Each form field now shows specific error messages
- **Duplicate email handling**: Clear messages when email already exists
- **Network error handling**: Proper handling of connection issues
- **Loading states**: Visual feedback during authentication processes

### Google OAuth Integration

- **Google Sign-In**: Users can sign in with their Google account
- **Google Registration**: New users can register using Google
- **Automatic verification**: Google users are automatically verified
- **Token validation**: Backend validates Google tokens for security

### User Experience Improvements

- **Real-time validation**: Errors clear as users type
- **Loading indicators**: Spinners show during authentication
- **Success messages**: Clear feedback for successful operations
- **Responsive design**: Works on all device sizes

## Security Considerations

1. **Token Validation**: The backend validates Google tokens before creating/authenticating users
2. **Email Verification**: Google users are automatically verified (trusted source)
3. **Duplicate Prevention**: Proper handling of existing email addresses
4. **Error Sanitization**: Sensitive information is not exposed in error messages

## Troubleshooting

### Common Issues

1. **"Invalid Google token" error**:
   - Check that your Google Client ID is correct
   - Ensure the domain is added to authorized origins
   - Verify the Google+ API is enabled

2. **"Network error" messages**:
   - Check that the backend server is running
   - Verify the API base URL is correct
   - Check CORS settings in Django

3. **"404 Not Found" errors**:
   - Ensure the backend server is running on port 8000
   - Check that the proxy configuration is working
   - Verify the API endpoints are correctly configured

4. **Google button not appearing**:
   - Verify the Google OAuth provider is properly configured
   - Check browser console for JavaScript errors
   - Ensure the Google Client ID is set correctly

5. **Cross-Origin-Opener-Policy errors**:
   - This is a browser security warning and doesn't affect functionality
   - The proxy configuration should handle the API requests correctly

### Debug Mode

To enable debug mode, add to your `.env` file:
```env
VITE_DEBUG=true
```

This will show more detailed error messages in the console.

### Testing API Endpoints

You can test the backend endpoints directly:

```bash
# Test Google login endpoint
curl -X POST http://localhost:8000/api/v1/user/google-login/ \
  -H "Content-Type: application/json" \
  -d '{"credential": "test"}'

# Test Google register endpoint  
curl -X POST http://localhost:8000/api/v1/user/google-register/ \
  -H "Content-Type: application/json" \
  -d '{"credential": "test"}'
```

Expected response: `{"success":false,"error":"Invalid Google token"}` (this is expected for test tokens)

## Production Deployment

When deploying to production:

1. Update the Google OAuth credentials with your production domain
2. Set the correct `VITE_API_BASE_URL` for production
3. Ensure HTTPS is enabled (required for Google OAuth in production)
4. Update CORS settings in Django for your production domain
5. Remove or update the proxy configuration for production

## Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check the Django server logs for backend errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Test the API endpoints directly using curl

For additional help, refer to:
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Django REST Framework Documentation](https://www.django-rest-framework.org/) 