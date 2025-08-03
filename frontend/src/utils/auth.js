// Importing the useAuthStore hook from the '../store/auth' file to manage authentication state
import { useAuthStore } from "../store/auth";

// Importing the axios library for making HTTP requests
import axios from "./axios";

// Importing jwt_decode to decode JSON Web Tokens
import jwt_decode from "jwt-decode";

// Importing the Cookies library to handle browser cookies
import Cookies from "js-cookie";

// Importing Swal (SweetAlert2) for displaying toast notifications
import Swal from "sweetalert2";

// Configuring global toast notifications using Swal.mixin
const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
});

// Enhanced login function with better error handling
export const login = async (email, password, rememberMe = false) => {
    try {
        const { data, status } = await axios.post("user/token/", { email, password });

        if (status === 200) {
            setAuthUser(data.access, data.refresh);
            Toast.fire({ icon: "success", title: "Signed in successfully" });
            return { success: true, error: null, fieldErrors: {} };
        }
    } catch (error) {
        let errorMessage = "Something went wrong";
        const response = error.response;
        const fieldErrors = {};

        if (!response) {
            errorMessage = "Network error - please check your connection";
        } else {
            const data = response.data;

            if (data.detail) {
                errorMessage = data.detail;
                if (data.detail.toLowerCase().includes("no active account")) {
                    errorMessage = "Email not found or password is incorrect";
                }
            } else if (data.non_field_errors) {
                errorMessage = data.non_field_errors[0];
            } else if (data.email) {
                fieldErrors.email = data.email.join(" ");
                errorMessage = "Please fix the errors below";
            } else if (data.password) {
                fieldErrors.password = data.password.join(" ");
                errorMessage = "Please fix the errors below";
            } else {
                // Handle field-specific errors
                for (const [field, messages] of Object.entries(data)) {
                    if (Array.isArray(messages)) {
                        fieldErrors[field] = messages.join(" ");
                    } else {
                        fieldErrors[field] = messages;
                    }
                }
                errorMessage = Object.values(fieldErrors)[0] || "Invalid credentials";
            }
        }

        Toast.fire({ icon: "error", title: errorMessage });

        return {
            success: false,
            error: errorMessage,
            fieldErrors,
        };
    }
};

// Enhanced register function with better error handling
export const register = async (full_name, email, password, password2) => {
    try {
        const { data } = await axios.post("user/register/", {
            full_name,
            email,
            password,
            password2,
        });

        return { data, error: null, fieldErrors: {} };
    } catch (error) {
        const responseData = error.response?.data;
        let errorMessage = "Registration failed. Please try again.";
        const fieldErrors = {};

        if (responseData) {
            if (responseData.error?.detail) {
                if (typeof responseData.error.detail === 'object') {
                    // Handle field-specific errors
                    Object.assign(fieldErrors, responseData.error.detail);
                    errorMessage = "Please fix the errors below";
                } else {
                    errorMessage = responseData.error.detail;
                }
            } else if (responseData.error) {
                errorMessage = responseData.error;
            } else if (responseData.email) {
                fieldErrors.email = responseData.email.join(" ");
                errorMessage = "Please fix the errors below";
            } else if (responseData.password) {
                fieldErrors.password = responseData.password.join(" ");
                errorMessage = "Please fix the errors below";
            } else if (responseData.password2) {
                fieldErrors.password2 = responseData.password2.join(" ");
                errorMessage = "Please fix the errors below";
            } else if (responseData.full_name) {
                fieldErrors.full_name = responseData.full_name.join(" ");
                errorMessage = "Please fix the errors below";
            } else {
                // Handle other field errors
                for (const [field, messages] of Object.entries(responseData)) {
                    if (Array.isArray(messages)) {
                        fieldErrors[field] = messages.join(" ");
                    } else {
                        fieldErrors[field] = messages;
                    }
                }
                errorMessage = Object.values(fieldErrors)[0] || "Registration failed";
            }
        }

        return {
            data: null,
            error: errorMessage,
            fieldErrors,
        };
    }
};

// Function to handle user logout
export const logout = () => {
    // Removing access and refresh tokens from cookies, resetting user state, and displaying success toast
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    useAuthStore.getState().logout(); // Use the store's logout method

    // Displaying a success toast notification
    Toast.fire({
        icon: "success",
        title: "You have been logged out.",
    });
};

// Function to set the authenticated user on page load
export const setUser = async () => {
    // Retrieving access and refresh tokens from cookies
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    // Checking if tokens are present
    if (!accessToken || !refreshToken) {
        return;
    }

    // If access token is expired, refresh it; otherwise, set the authenticated user
    if (isAccessTokenExpired(accessToken)) {
        const response = await getRefreshToken(refreshToken);
        setAuthUser(response.access, response.refresh);
    } else {
        setAuthUser(accessToken, refreshToken);
    }
};

// Function to set the authenticated user and update user state
export const setAuthUser = (access_token, refresh_token) => {
    // Setting access and refresh tokens in cookies with expiration dates
    Cookies.set("access_token", access_token, {
        expires: 1, // Access token expires in 1 day
        secure: true,
    });

    Cookies.set("refresh_token", refresh_token, {
        expires: 7, // Refresh token expires in 7 days
        secure: true,
    });

    // Decoding access token to get user information
    const user = jwt_decode(access_token) ?? null;

    // If user information is present, update user state; otherwise, set loading state to false
    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

// Function to refresh the access token using the refresh token
export const getRefreshToken = async () => {
    // Retrieving refresh token from cookies and making a POST request to refresh the access token
    const refresh_token = Cookies.get("refresh_token");
    const response = await axios.post("user/token/refresh/", {
        refresh: refresh_token,
    });

    // Returning the refreshed access token
    return response.data;
};

// Function to check if the access token is expired
export const isAccessTokenExpired = (accessToken) => {
    try {
        // Decoding the access token and checking if it has expired
        const decodedToken = jwt_decode(accessToken);
        return decodedToken.exp < Date.now() / 1000;
    } catch (err) {
        // Returning true if the token is invalid or expired
        return true;
    }
};

// Google OAuth functions
export const handleGoogleLogin = async (credential) => {
    try {
        const response = await axios.post("user/google-login/", {
            credential: credential
        });

        if (response.data.success) {
            setAuthUser(response.data.access, response.data.refresh);
            Toast.fire({ icon: "success", title: "Google login successful!" });
            return { success: true, error: null, fieldErrors: {} };
        } else {
            return { 
                success: false, 
                error: response.data.error || "Google login failed", 
                fieldErrors: {} 
            };
        }
    } catch (error) {
        const responseData = error.response?.data;
        let errorMessage = "Google login failed. Please try again.";
        const fieldErrors = {};

        if (responseData?.error?.detail) {
            errorMessage = responseData.error.detail;
        } else if (responseData?.error) {
            errorMessage = responseData.error;
        }

        return {
            success: false,
            error: errorMessage,
            fieldErrors,
        };
    }
};

export const handleGoogleRegister = async (credential) => {
    try {
        const response = await axios.post("user/google-register/", {
            credential: credential
        });

        if (response.data.success) {
            return { success: true, error: null, fieldErrors: {} };
        } else {
            return { 
                success: false, 
                error: response.data.error || "Google registration failed", 
                fieldErrors: {} 
            };
        }
    } catch (error) {
        const responseData = error.response?.data;
        let errorMessage = "Google registration failed. Please try again.";
        const fieldErrors = {};

        if (responseData?.error?.detail) {
            errorMessage = responseData.error.detail;
        } else if (responseData?.error) {
            errorMessage = responseData.error;
        }

        return {
            success: false,
            error: errorMessage,
            fieldErrors,
        };
    }
};
