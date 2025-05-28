import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { register } from "../../utils/auth";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import apiInstance from "../../utils/axios"
import Swal from "sweetalert2";

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

    const handleBioDataChange = (event) => {
        setBioData({
            ...bioData,
            [event.target.name]: event.target.value,
        });
    };

    const validateStep1 = () => {
        if (!bioData.full_name || !bioData.email || !bioData.password || !bioData.password2) {
            setError("All fields are required");
            return false;
        }
        if (bioData.password !== bioData.password2) {
            setError("Passwords do not match");
            return false;
        }
        if (bioData.password.length < 8) {
            setError("Password must be at least 8 characters");
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
                        title: "Account Created Successfully!",
                        text: "Your account has been verified. Please login to continue."
                    }).then(() => {
                        // Redirect to login with success state
                        navigate("/login", { 
                            state: { 
                                registrationSuccess: true,
                                message: "Registration successful! Please login." 
                            } 
                        });
                    });
                } else {
                    throw new Error(verificationResponse.data.error || "Verification failed");
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error?.detail || 
                              err.response?.data?.error ||
                              err.message ||
                              "An error occurred. Please try again.";
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
                                    <h1 className="mb-1 fw-bold">Sign up</h1>
                                    <span>
                                        Already have an account?
                                        <Link to="/login/" className="ms-1">
                                            Sign In
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
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                 )}

                                <form onSubmit={handleRegister} className="needs-validation" noValidate="">
                                    {step === 1 ? (
                                        <>
                                            <div className="mb-3">
                                                <label htmlFor="full_name" className="form-label">
                                                    Full Name
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
                                                    Email Address
                                                </label>
                                                <input 
                                                    type="email" 
                                                    onChange={handleBioDataChange} 
                                                    value={bioData.email} 
                                                    id="email" 
                                                    className="form-control" 
                                                    name="email" 
                                                    placeholder="johndoe@gmail.com" 
                                                    required 
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="password" className="form-label">
                                                    Password
                                                </label>
                                                <input 
                                                    type="password" 
                                                    onChange={handleBioDataChange} 
                                                    value={bioData.password} 
                                                    id="password" 
                                                    className="form-control" 
                                                    name="password" 
                                                    placeholder="**************" 
                                                    required 
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="password2" className="form-label">
                                                    Confirm Password
                                                </label>
                                                <input 
                                                    type="password" 
                                                    onChange={handleBioDataChange} 
                                                    value={bioData.password2} 
                                                    id="password2" 
                                                    className="form-control" 
                                                    name="password2" 
                                                    placeholder="**************" 
                                                    required 
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="mb-3">
                                            <label htmlFor="otp" className="form-label">
                                                Verification OTP
                                            </label>
                                            <input 
                                                type="text" 
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="form-control"
                                                placeholder="Enter OTP sent to your email"
                                                required
                                            />
                                            <small className="text-muted">
                                                Check your email for the verification code
                                            </small>
                                        </div>
                                    )}

                                    <div className="d-grid">
                                        <button 
                                            className="btn btn-primary w-100" 
                                            type="submit" 
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="mr-2">Processing...</span>
                                                    <i className="fas fa-spinner fa-spin" />
                                                </>
                                            ) : (
                                                <>
                                                    <span className="mr-2">
                                                        {step === 1 ? 'Sign Up' : 'Verify Email'}
                                                    </span>
                                                    <i className={step === 1 ? "fas fa-user-plus" : "fas fa-check-circle"} />
                                                </>
                                            )}
                                        </button>
                                    </div>
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