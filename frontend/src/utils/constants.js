import useUserData from "../plugin/useUserData";

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

// Application Configuration
export const APP_NAME = 'AgriAssist';
export const APP_VERSION = '1.0.0';

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error - please check your connection',
    INVALID_CREDENTIALS: 'Email not found or password is incorrect',
    EMAIL_EXISTS: 'An account with this email already exists. Please login instead.',
    VERIFICATION_PENDING: 'Verification already pending for this email. Please check your email or try again later.',
    PASSWORDS_DONT_MATCH: 'Password fields didn\'t match.',
    GOOGLE_LOGIN_FAILED: 'Google login failed. Please try again.',
    GOOGLE_REGISTER_FAILED: 'Google registration failed. Please try again.',
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    VERIFICATION_FAILED: 'Email verification failed. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful!',
    REGISTRATION_SUCCESS: 'Registration successful! Please log in.',
    GOOGLE_LOGIN_SUCCESS: 'Google login successful!',
    GOOGLE_REGISTER_SUCCESS: 'Google registration successful! Please log in.',
    LOGOUT_SUCCESS: 'You have been logged out.',
    EMAIL_VERIFIED: 'Email verified successfully!',
};

// Validation Messages
export const VALIDATION_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
    PASSWORDS_MUST_MATCH: 'Passwords must match',
    FULL_NAME_REQUIRED: 'Full name is required',
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
};

export const SERVER_URL = "http://127.0.0.1:8000";
export const CLIENT_URL = "http://localhost:5173";
export const PAYPAL_CLIENT_ID = "test";
export const CURRENCY_SIGN = "$";
export const userId = useUserData()?.user_id;
export const teacherId = useUserData()?.teacher_id;
console.log(teacherId);
