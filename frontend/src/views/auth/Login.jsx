import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { login, handleGoogleLogin } from "../../utils/auth";
import { useLanguage } from "../../contexts/LanguageContext";
import { GoogleLogin } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../utils/constants";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    // Check if Google Client ID is properly configured
    const isGoogleClientIdConfigured = GOOGLE_CLIENT_ID && 
      GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' && 
      GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

    // Check for registration success message
    useEffect(() => {
        if (location.state?.registrationSuccess) {
            setMessage(location.state.message || "Registration successful! Please log in.");
            setErrors({});
        }
    }, [location.state]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        setMessage("");

        try {
            const { success, error, fieldErrors } = await login(email, password, rememberMe);

            if (success) {
                setErrors({});
                setMessage("Login successful!");
                navigate("/");
            } else {
                setErrors(fieldErrors || {});
                setMessage(error || "Login failed. Please try again.");
            }
        } catch (err) {
            setErrors({});
            setMessage("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);
            setErrors({});
            setMessage("");

            const { success, error, fieldErrors } = await handleGoogleLogin(credentialResponse.credential);

            if (success) {
                setMessage("Google login successful!");
                navigate("/");
            } else {
                setErrors(fieldErrors || {});
                setMessage(error || "Google login failed. Please try again.");
            }
        } catch (err) {
            setErrors({});
            setMessage("Google login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setMessage("Google login failed. Please try again.");
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h1 className="mb-4 text-center" style={{ fontWeight: 700, fontSize: '2.2rem', letterSpacing: '1px' }}>
                <span style={{ color: '#1B4332' }}>Agri</span><span style={{ color: '#74C69D' }}>Assist</span>
            </h1>
            
            {message && (
                <div className={`alert ${errors && Object.keys(errors).length === 0 ? "alert-success" : "alert-danger"}`}>
                    {message}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">{t('email')}</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                                setErrors(prev => ({ ...prev, email: null }));
                            }
                        }}
                        required
                        disabled={isLoading}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mb-1">
                    <label htmlFor="password" className="form-label">{t('password')}</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) {
                                    setErrors(prev => ({ ...prev, password: null }));
                                }
                            }}
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex="-1"
                            disabled={isLoading}
                        >
                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </button>
                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>
                </div>
                
                {/* Remember Me and Forgot Password on the same line */}
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div className="form-check m-0">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={isLoading}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">{t('rememberMe')}</label>
                    </div>
                    <Link to="/forgot-password/" style={{ color: '#40916C', textDecoration: 'underline', fontWeight: 500, fontSize: '0.98rem' }}>{t('forgotPassword')}</Link>
                </div>

                {/* Submit */}
                <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {t('signingIn') || 'Signing in...'}
                        </>
                    ) : (
                        t('signIn')
                    )}
                </button>

                {/* Divider */}
                <div className="text-center mb-3">
                    <span className="text-muted">or</span>
                </div>

                {/* Google Sign In */}
                <div className="d-grid mb-3">
                    {isGoogleClientIdConfigured ? (
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                            theme="outline"
                            size="large"
                            text="signin_with"
                            shape="rectangular"
                            locale="en"
                            disabled={isLoading}
                        />
                    ) : (
                        <div className="alert alert-warning text-center">
                            <small>
                                Google Sign-In is not configured. Please set up your Google OAuth Client ID.
                                <br />
                                <a href="/GOOGLE_OAUTH_SETUP.md" target="_blank" className="text-decoration-none">
                                    View Setup Guide
                                </a>
                            </small>
                        </div>
                    )}
                </div>
            </form>
            
            <div className="mt-3 text-center">
                <span>{t('dontHaveAccount')} </span>
                <a href="/register" style={{ color: '#40916C', textDecoration: 'underline', fontWeight: 500 }}>{t('signUp')}</a>
            </div>
        </div>
    );
};

export default Login;
