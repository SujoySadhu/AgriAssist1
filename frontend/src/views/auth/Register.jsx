import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { register } from "../../utils/auth";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import apiInstance from "../../utils/axios"
import Swal from "sweetalert2";
import { useLanguage } from "../../contexts/LanguageContext";

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
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleBioDataChange = (event) => {
        setBioData({
            ...bioData,
            [event.target.name]: event.target.value,
        });
    };

    const validateStep1 = () => {
        if (!bioData.full_name || !bioData.email || !bioData.password || !bioData.password2) {
            setError(t('allFieldsRequired'));
            return false;
        }
        if (bioData.password !== bioData.password2) {
            setError(t('passwordsDoNotMatch'));
            return false;
        }
        if (bioData.password.length < 8) {
            setError(t('passwordMinLength'));
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

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
            const errorMessage = err.response?.data?.error?.detail || 
                              err.response?.data?.error ||
                              err.message ||
                              t('anErrorOccurred');
            setError(errorMessage);
            
            // If registration error, reset to step 1
            if (step === 1) {
                setStep(1);
            }
        } finally {
            setIsLoading(false);
        }
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
                                                    className="form-control" 
                                                    name="full_name" 
                                                    placeholder="John Doe" 
                                                    required 
                                                />
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
                                                    className="form-control" 
                                                    name="email" 
                                                    placeholder="john@example.com" 
                                                    required 
                                                />
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
                                                    className="form-control" 
                                                    name="password" 
                                                    placeholder="Enter your password" 
                                                    required 
                                                />
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
                                                    className="form-control" 
                                                    name="password2" 
                                                    placeholder="Confirm your password" 
                                                    required 
                                                />
                                            </div>
                                            <div className="d-grid">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary" 
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? t('loading') : t('signUp')}
                                                </button>
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
                                                />
                                            </div>
                                            <div className="d-grid">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary" 
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? t('loading') : t('verifyEmail')}
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