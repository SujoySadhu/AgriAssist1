import React, { useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import { logout } from "../../utils/auth";
import { useLanguage } from "../../contexts/LanguageContext";

function Logout() {
    const { t } = useLanguage();

    useEffect(() => {
        logout();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1">
                <section className="container d-flex flex-column" style={{ marginTop: "150px" }}>
                    <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
                        <div className="col-lg-5 col-md-8 py-8 py-xl-0">
                            <div className="card shadow">
                                <div className="card-body p-6">
                                    <div className="mb-4">
                                        <h1 className="mb-1 fw-bold">{t('loggedOut')}</h1>
                                        <span>{t('thanksForVisiting')}</span>
                                    </div>
                                    <form className="needs-validation mt-5" noValidate="">
                                        <div className="d-grid d-flex">
                                            <Link to="/login/" className="btn btn-primary me-2 w-100">
                                                {t('login')} <i className="fas fa-sign-in-alt"></i>
                                            </Link>
                                            <Link to="/register/" className="btn btn-primary w-100">
                                                {t('register')} <i className="fas fa-user-plus"></i>
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Logout;
