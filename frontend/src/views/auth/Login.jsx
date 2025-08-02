import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../utils/auth";
import { useLanguage } from "../../contexts/LanguageContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { success, error, fieldErrors } = await login(email, password, rememberMe);

        if (success) {
            setErrors({});
            setMessage("Login successful!");
            navigate("/");
        } else {
            setErrors(fieldErrors || {});
            setMessage(error || "Login failed. Please try again.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h1 className="mb-4 text-center" style={{ fontWeight: 700, fontSize: '2.2rem', letterSpacing: '1px' }}>
                <span style={{ color: '#1B4332' }}>Agri</span><span style={{ color: '#74C69D' }}>Assist</span>
            </h1>
            {message && (
                <div className={`alert ${errors && !Object.keys(errors).length ? "alert-success" : "alert-danger"}`}>
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex="-1"
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
                        />
                        <label className="form-check-label" htmlFor="rememberMe">{t('rememberMe')}</label>
                    </div>
                    <Link to="/forgot-password/" style={{ color: '#40916C', textDecoration: 'underline', fontWeight: 500, fontSize: '0.98rem' }}>{t('forgotPassword')}</Link>
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-100">{t('signIn')}</button>
            </form>
            <div className="mt-3 text-center">
                <span>{t('dontHaveAccount')} </span>
                <a href="/register" style={{ color: '#40916C', textDecoration: 'underline', fontWeight: 500 }}>{t('signUp')}</a>
            </div>
        </div>
    );
};

export default Login;
