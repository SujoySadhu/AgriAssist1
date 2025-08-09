import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { register, handleGoogleRegister } from "../../utils/auth";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import apiInstance from "../../utils/axios"
import Swal from "sweetalert2";
import { useLanguage } from "../../contexts/LanguageContext";
import { GoogleLogin } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../../utils/constants";

function Register() {
    const [step, setStep] = useState(1);
    const [bioData, setBioData] = useState({ 
        full_name: "", 
        email: "", 
        password: "", 
        password2: "" 
    });
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Check if Google Client ID is properly configured
    const isGoogleClientIdConfigured = GOOGLE_CLIENT_ID && 
      GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' && 
      GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

    const handleBioDataChange = (event) => {
        const { name, value } = event.target;
        setBioData({
            ...bioData,
            [name]: value,
        });
        
        // Clear field-specific errors when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
        if (error) {
            setError("");
        }
    };

    const validateStep1 = () => {
        const newFieldErrors = {};
        
        if (!bioData.full_name.trim()) {
            newFieldErrors.full_name = "Full name is required";
        }
        
        if (!bioData.email.trim()) {
            newFieldErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(bioData.email)) {
            newFieldErrors.email = "Please enter a valid email address";
        }
        
        if (!bioData.password) {
            newFieldErrors.password = "Password is required";
        } else if (bioData.password.length < 8) {
            newFieldErrors.password = "Password must be at least 8 characters long";
        }
        
        if (!bioData.password2) {
            newFieldErrors.password2 = "Please confirm your password";
        } else if (bioData.password !== bioData.password2) {
            newFieldErrors.password2 = "Passwords do not match";
        }

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            return false;
        }
        
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setFieldErrors({});

        try {
            if (step === 1) {
                if (!validateStep1()) {
                    setIsLoading(false);
                    return;
                }
                
                // First step - send registration data
                const response = await apiInstance.post('/user/register/', bioData);
                
                if (response.data.error) {
                    throw new Error(response.data.error);
                }
                
                setStep(2);
            } else {
                // Second step - verify OTP
                const verificationResponse = await apiInstance.post('/user/verify-email/', {
                    email: bioData.email,
                    otp
                });

                if (verificationResponse.data.success) {
                    // Show success message
                    Swal.fire({
                        icon: "success",
                        title: t('accountCreatedSuccess'),
                        text: t('accountVerifiedMessage')
                    }).then(() => {
                        // Redirect to login with success state
                        navigate("/login", { 
                            state: { 
                                registrationSuccess: true,
                                message: t('registrationSuccess')
                            } 
                        });
                    });
                } else {
                    throw new Error(verificationResponse.data.error || t('verificationFailed'));
                }
            }
        } catch (err) {
            const responseData = err.response?.data;
            
            if (responseData?.error?.detail) {
                // Handle specific field errors
                if (typeof responseData.error.detail === 'object') {
                    setFieldErrors(responseData.error.detail);
                    setError("Please fix the errors below");
                } else {
                    setError(responseData.error.detail);
                }
            } else if (responseData?.error) {
                setError(responseData.error);
            } else if (responseData?.email) {
                // Handle email already exists error
                setFieldErrors({ email: "Email already exists. Please use a different email or try logging in." });
                setError("Registration failed. Please check the errors below.");
            } else {
                setError(err.message || t('anErrorOccurred'));
            }
            
            // If registration error, reset to step 1
            if (step === 1) {
                setStep(1);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setIsLoading(true);
            setError("");
            setFieldErrors({});

            const { success, error, fieldErrors } = await handleGoogleRegister(credentialResponse.credential);

            if (success) {
                Swal.fire({
                    icon: "success",
                    title: "Google registration successful!",
                    text: "Your account has been created successfully."
                }).then(() => {
                    navigate("/login", { 
                        state: { 
                            registrationSuccess: true,
                            message: "Google registration successful! Please log in."
                        } 
                    });
                });
            } else {
                setError(error || "Google registration failed. Please try again.");
            }
        } catch (err) {
            setError("Google registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google registration failed. Please try again.");
    };

    return (
        <>
            <Header />
            <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
                <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                    <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                        <div className="card shadow">
                            <div className="card-body p-6">
                                <div className="mb-4">
                                    <h1 className="mb-1 fw-bold">{t('signUp')}</h1>
                                    <span>
                                        {t('alreadyHaveAccount')}
                                        <Link to="/login/" className="ms-1">
                                            {t('signIn')}
                                        </Link>
                                    </span>
                                </div>
                                
                                {error && (
                                    <div className="alert alert-danger mt-3">
                                        {error}
                                        {error.includes("OTP") && (
                                            <button 
                                                type="button" 
                                                className="btn btn-link p-0 ms-2"
                                                onClick={() => setStep(1)}
                                            >
                                                {t('resendOTP')}
                                            </button>
                                        )}
                                    </div>
                                )}

                                <form onSubmit={handleRegister} className="needs-validation" noValidate="">
                                    {step === 1 ? (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="full_name" className="form-label">
                                                    {t('fullName')}
                                                </label>
                                                <input 
                                                    type="text" 
                                                    onChange={handleBioDataChange} 
                                                    value={bioData.full_name} 
                                                    id="full_name" 
                                                    className={`form-control ${fieldErrors.full_name ? "is-invalid" : ""}`}
                                                    name="full_name" 
                                                    placeholder="John Doe" 
                                                    required 
                                                    disabled={isLoading}
                                                />
                                                {fieldErrors.full_name && (
                                                    <div className="invalid-feedback">{fieldErrors.full_name}</div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">
                                                    {t('email')}
                                                </label>
                                                <input 
                                                    type="email" 
                                                    onChange={handleBioDataChange} 
                                                    value={bioData.email} 
                                                    id="email" 
                                                    className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
                                                    name="email" 
                                                    placeholder="john@example.com" 
                                                    required 
                                                    disabled={isLoading}
                                                />
                                                {fieldErrors.email && (
                                                    <div className="invalid-feedback">{fieldErrors.email}</div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="password" className="form-label">
                                                    {t('password')}
                                                </label>
                                                <input 
                                                    type="password" 
                                                    onChange={handleBioDataChange} 
                                                    value={bioData.password} 
                                                    id="password" 
                                                    className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
                                                    name="password" 
                                                    placeholder="Enter your password" 
                                                    required 
                                                    disabled={isLoading}
                                                />
                                                {fieldErrors.password && (
                                                    <div className="invalid-feedback">{fieldErrors.password}</div>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="password2" className="form-label">
                                                    {t('confirmPassword')}
                                                </label>
                                                <input 
                                                    type="password" 
                                                    onChange={handleBioDataChange} 
                                                    value={bioData.password2} 
                                                    id="password2" 
                                                    className={`form-control ${fieldErrors.password2 ? "is-invalid" : ""}`}
                                                    name="password2" 
                                                    placeholder="Confirm your password" 
                                                    required 
                                                    disabled={isLoading}
                                                />
                                                {fieldErrors.password2 && (
                                                    <div className="invalid-feedback">{fieldErrors.password2}</div>
                                                )}
                                            </div>
                                            <div className="d-grid mb-3">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary" 
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            {t('loading')}
                                                        </>
                                                    ) : (
                                                        t('signUp')
                                                    )}
                                                </button>
                                            </div>

                                            {/* Divider */}
                                            <div className="text-center mb-3">
                                                <span className="text-muted">or</span>
                                            </div>

                                            {/* Google Sign Up */}
                                            <div className="d-grid">
                                                {isGoogleClientIdConfigured ? (
                                                    <GoogleLogin
                                                        onSuccess={handleGoogleSuccess}
                                                        onError={handleGoogleError}
                                                        useOneTap
                                                        theme="outline"
                                                        size="large"
                                                        text="signup_with"
                                                        shape="rectangular"
                                                        locale="en"
                                                        disabled={isLoading}
                                                    />
                                                ) : (
                                                    <div className="alert alert-warning text-center">
                                                        <small>
                                                            Google Sign-Up is not configured. Please set up your Google OAuth Client ID.
                                                            <br />
                                                            <a href="/GOOGLE_OAUTH_SETUP.md" target="_blank" className="text-decoration-none">
                                                                View Setup Guide
                                                            </a>
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="otp" className="form-label">
                                                    {t('enterOTP')}
                                                </label>
                                                <input 
                                                    type="text" 
                                                    onChange={(e) => setOtp(e.target.value)} 
                                                    value={otp} 
                                                    id="otp" 
                                                    className="form-control" 
                                                    placeholder="Enter OTP" 
                                                    required 
                                                    disabled={isLoading}
                                                />
                                            </div>
                                            <div className="d-grid">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary" 
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            {t('loading')}
                                                        </>
                                                    ) : (
                                                        t('verifyEmail')
                                                    )}
                                                </button>
                                            </div>
                                            <div className="text-center mt-3">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-link" 
                                                    onClick={() => setStep(1)}
                                                >
                                                    {t('backToLogin')}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Register;
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../store/auth";
// import { register, handleGoogleRegister } from "../../utils/auth";
// import Header from "../partials/Header";
// import Footer from "../partials/Footer";
// import apiInstance from "../../utils/axios";
// import Swal from "sweetalert2";
// import { useLanguage } from "../../contexts/LanguageContext";
// import { GoogleLogin } from "@react-oauth/google";
// import { GOOGLE_CLIENT_ID } from "../../utils/constants";

// function Register() {
//     const [step, setStep] = useState(1);
//     const [bioData, setBioData] = useState({ 
//         full_name: "", 
//         email: "", 
//         password: "", 
//         password2: "" 
//     });
//     const [otp, setOtp] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [googleLoading, setGoogleLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [fieldErrors, setFieldErrors] = useState({});
//     const navigate = useNavigate();
//     const { t } = useLanguage();

//     const isGoogleClientIdConfigured = GOOGLE_CLIENT_ID && 
//         GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' && 
//         GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

//     const handleBioDataChange = (event) => {
//         const { name, value } = event.target;
//         setBioData({
//             ...bioData,
//             [name]: value,
//         });
        
//         if (fieldErrors[name]) {
//             setFieldErrors(prev => ({ ...prev, [name]: null }));
//         }
//         if (error) {
//             setError("");
//         }
//     };

//     const validateStep1 = () => {
//         const newFieldErrors = {};
        
//         if (!bioData.full_name.trim()) {
//             newFieldErrors.full_name = "Full name is required";
//         }
        
//         if (!bioData.email.trim()) {
//             newFieldErrors.email = "Email is required";
//         } else if (!/\S+@\S+\.\S+/.test(bioData.email)) {
//             newFieldErrors.email = "Please enter a valid email address";
//         }
        
//         if (!bioData.password) {
//             newFieldErrors.password = "Password is required";
//         } else if (bioData.password.length < 8) {
//             newFieldErrors.password = "Password must be at least 8 characters long";
//         }
        
//         if (!bioData.password2) {
//             newFieldErrors.password2 = "Please confirm your password";
//         } else if (bioData.password !== bioData.password2) {
//             newFieldErrors.password2 = "Passwords do not match";
//         }

//         if (Object.keys(newFieldErrors).length > 0) {
//             setFieldErrors(newFieldErrors);
//             return false;
//         }
        
//         return true;
//     };

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError("");
//         setFieldErrors({});

//         try {
//             if (step === 1) {
//                 if (!validateStep1()) {
//                     setIsLoading(false);
//                     return;
//                 }
                
//                 const response = await apiInstance.post('/user/register/', bioData);
                
//                 if (response.data.error) {
//                     throw new Error(response.data.error);
//                 }
                
//                 setStep(2);
//             } else {
//                 const verificationResponse = await apiInstance.post('/user/verify-email/', {
//                     email: bioData.email,
//                     otp
//                 });

//                 if (verificationResponse.data.success) {
//                     Swal.fire({
//                         icon: "success",
//                         title: t('accountCreatedSuccess'),
//                         text: t('accountVerifiedMessage')
//                     }).then(() => {
//                         navigate("/login", { 
//                             state: { 
//                                 registrationSuccess: true,
//                                 message: t('registrationSuccess')
//                             } 
//                         });
//                     });
//                 } else {
//                     throw new Error(verificationResponse.data.error || t('verificationFailed'));
//                 }
//             }
//         } catch (err) {
//             const responseData = err.response?.data;
            
//             if (responseData?.error?.detail) {
//                 if (typeof responseData.error.detail === 'object') {
//                     setFieldErrors(responseData.error.detail);
//                     setError("Please fix the errors below");
//                 } else {
//                     setError(responseData.error.detail);
//                 }
//             } else if (responseData?.error) {
//                 setError(responseData.error);
//             } else if (responseData?.email) {
//                 setFieldErrors({ email: "Email already exists. Please use a different email or try logging in." });
//                 setError("Registration failed. Please check the errors below.");
//             } else {
//                 setError(err.message || t('anErrorOccurred'));
//             }
            
//             if (step === 1) {
//                 setStep(1);
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleGoogleSuccess = async (credentialResponse) => {
//         try {
//             setGoogleLoading(true);
//             setError("");
//             setFieldErrors({});

//             const result = await handleGoogleRegister(credentialResponse.credential);

//             if (result.success) {
//                 Swal.fire({
//                     icon: "success",
//                     title: t('googleRegistrationSuccess'),
//                     text: t('googleAccountCreated')
//                 }).then(() => {
//                     navigate("/login", { 
//                         state: { 
//                             registrationSuccess: true,
//                             message: t('googleRegistrationSuccessLogin')
//                         } 
//                     });
//                 });
//             } else {
//                 if (result.fieldErrors) {
//                     setFieldErrors(result.fieldErrors);
//                 }
//                 setError(result.error || t('googleRegistrationFailed'));
//             }
//         } catch (err) {
//             console.error("Google registration error:", err);
//             setError(t('googleRegistrationFailed'));
//         } finally {
//             setGoogleLoading(false);
//         }
//     };

//     const handleGoogleError = () => {
//         setError(t('googleSignInFailed'));
//     };

//     return (
//         <>
//             <Header />
//             <section className="container d-flex flex-column vh-100" style={{ marginTop: "150px" }}>
//                 <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
//                     <div className="col-lg-5 col-md-8 py-8 py-xl-0">
//                         <div className="card shadow">
//                             <div className="card-body p-6">
//                                 <div className="mb-4">
//                                     <h1 className="mb-1 fw-bold">{t('signUp')}</h1>
//                                     <span>
//                                         {t('alreadyHaveAccount')}
//                                         <Link to="/login/" className="ms-1">
//                                             {t('signIn')}
//                                         </Link>
//                                     </span>
//                                 </div>
                                
//                                 {error && (
//                                     <div className="alert alert-danger mt-3">
//                                         {error}
//                                         {error.includes("OTP") && (
//                                             <button 
//                                                 type="button" 
//                                                 className="btn btn-link p-0 ms-2"
//                                                 onClick={() => setStep(1)}
//                                             >
//                                                 {t('resendOTP')}
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}

//                                 <form onSubmit={handleRegister} className="needs-validation" noValidate="">
//                                     {step === 1 ? (
//                                         <>
//                                             <div className="mb-3">
//                                                 <label htmlFor="full_name" className="form-label">
//                                                     {t('fullName')}
//                                                 </label>
//                                                 <input 
//                                                     type="text" 
//                                                     onChange={handleBioDataChange} 
//                                                     value={bioData.full_name} 
//                                                     id="full_name" 
//                                                     className={`form-control ${fieldErrors.full_name ? "is-invalid" : ""}`}
//                                                     name="full_name" 
//                                                     placeholder="John Doe" 
//                                                     required 
//                                                     disabled={isLoading || googleLoading}
//                                                 />
//                                                 {fieldErrors.full_name && (
//                                                     <div className="invalid-feedback">{fieldErrors.full_name}</div>
//                                                 )}
//                                             </div>
//                                             <div className="mb-3">
//                                                 <label htmlFor="email" className="form-label">
//                                                     {t('email')}
//                                                 </label>
//                                                 <input 
//                                                     type="email" 
//                                                     onChange={handleBioDataChange} 
//                                                     value={bioData.email} 
//                                                     id="email" 
//                                                     className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
//                                                     name="email" 
//                                                     placeholder="john@example.com" 
//                                                     required 
//                                                     disabled={isLoading || googleLoading}
//                                                 />
//                                                 {fieldErrors.email && (
//                                                     <div className="invalid-feedback">{fieldErrors.email}</div>
//                                                 )}
//                                             </div>
//                                             <div className="mb-3">
//                                                 <label htmlFor="password" className="form-label">
//                                                     {t('password')}
//                                                 </label>
//                                                 <input 
//                                                     type="password" 
//                                                     onChange={handleBioDataChange} 
//                                                     value={bioData.password} 
//                                                     id="password" 
//                                                     className={`form-control ${fieldErrors.password ? "is-invalid" : ""}`}
//                                                     name="password" 
//                                                     placeholder="Enter your password" 
//                                                     required 
//                                                     disabled={isLoading || googleLoading}
//                                                 />
//                                                 {fieldErrors.password && (
//                                                     <div className="invalid-feedback">{fieldErrors.password}</div>
//                                                 )}
//                                             </div>
//                                             <div className="mb-3">
//                                                 <label htmlFor="password2" className="form-label">
//                                                     {t('confirmPassword')}
//                                                 </label>
//                                                 <input 
//                                                     type="password" 
//                                                     onChange={handleBioDataChange} 
//                                                     value={bioData.password2} 
//                                                     id="password2" 
//                                                     className={`form-control ${fieldErrors.password2 ? "is-invalid" : ""}`}
//                                                     name="password2" 
//                                                     placeholder="Confirm your password" 
//                                                     required 
//                                                     disabled={isLoading || googleLoading}
//                                                 />
//                                                 {fieldErrors.password2 && (
//                                                     <div className="invalid-feedback">{fieldErrors.password2}</div>
//                                                 )}
//                                             </div>
//                                             <div className="d-grid mb-3">
//                                                 <button 
//                                                     type="submit" 
//                                                     className="btn btn-primary" 
//                                                     disabled={isLoading || googleLoading}
//                                                 >
//                                                     {isLoading ? (
//                                                         <>
//                                                             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                                             {t('loading')}
//                                                         </>
//                                                     ) : (
//                                                         t('signUp')
//                                                     )}
//                                                 </button>
//                                             </div>

//                                             <div className="text-center mb-3">
//                                                 <span className="text-muted">or</span>
//                                             </div>

//                                             <div className="d-grid">
//                                                 {isGoogleClientIdConfigured ? (
//                                                     <div className="d-flex justify-content-center">
//                                                         <GoogleLogin
//                                                             onSuccess={handleGoogleSuccess}
//                                                             onError={handleGoogleError}
//                                                             useOneTap
//                                                             theme="outline"
//                                                             size="large"
//                                                             text={googleLoading ? "signing_up" : "signup_with"}
//                                                             shape="rectangular"
//                                                             locale="en"
//                                                             disabled={isLoading || googleLoading}
//                                                         />
//                                                     </div>
//                                                 ) : (
//                                                     <div className="alert alert-warning text-center">
//                                                         <small>
//                                                             Google Sign-Up is not configured. Please set up your Google OAuth Client ID.
//                                                             <br />
//                                                             <a href="/GOOGLE_OAUTH_SETUP.md" target="_blank" className="text-decoration-none">
//                                                                 View Setup Guide
//                                                             </a>
//                                                         </small>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <div className="mb-3">
//                                                 <label htmlFor="otp" className="form-label">
//                                                     {t('enterOTP')}
//                                                 </label>
//                                                 <input 
//                                                     type="text" 
//                                                     onChange={(e) => setOtp(e.target.value)} 
//                                                     value={otp} 
//                                                     id="otp" 
//                                                     className="form-control" 
//                                                     placeholder="Enter OTP" 
//                                                     required 
//                                                     disabled={isLoading}
//                                                 />
//                                             </div>
//                                             <div className="d-grid">
//                                                 <button 
//                                                     type="submit" 
//                                                     className="btn btn-primary" 
//                                                     disabled={isLoading}
//                                                 >
//                                                     {isLoading ? (
//                                                         <>
//                                                             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                                             {t('loading')}
//                                                         </>
//                                                     ) : (
//                                                         t('verifyEmail')
//                                                     )}
//                                                 </button>
//                                             </div>
//                                             <div className="text-center mt-3">
//                                                 <button 
//                                                     type="button" 
//                                                     className="btn btn-link" 
//                                                     onClick={() => setStep(1)}
//                                                 >
//                                                     {t('backToLogin')}
//                                                 </button>
//                                             </div>
//                                         </>
//                                     )}
//                                 </form>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <Footer />
//         </>
//     );
// }

// export default Register;