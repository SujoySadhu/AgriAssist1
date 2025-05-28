import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";

function VerifyOTP() {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email; // Get email from previous page

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await apiInstance.post("user/validate-otp/", { email, otp });
            Swal.fire({
                icon: "success",
                title: "OTP Verified!",
            }).then(() => {
                navigate("/create-password", { state: { email, otp } });
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.error || "Invalid OTP",
            });
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
                                    <h1 className="mb-1 fw-bold">Verify OTP</h1>
                                    <span>Check your email for the OTP</span>
                                </div>
                                <form onSubmit={handleOTPSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="otp" className="form-label">
                                            Enter OTP
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="d-grid">
                                        {isLoading ? (
                                            <button disabled className="btn btn-primary">
                                                Verifying... <i className="fas fa-spinner fa-spin"></i>
                                            </button>
                                        ) : (
                                            <button type="submit" className="btn btn-primary">
                                                Verify OTP <i className="fas fa-arrow-right"></i>
                                            </button>
                                        )}
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

export default VerifyOTP;