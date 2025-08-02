import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";

function Header() {
    const { isLoggedIn, user } = useAuthStore();
    const { t } = useLanguage();

    const [searchQuery, setSearchQuery] = useState("");
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Update authentication state when it changes
    useEffect(() => {
        const loggedIn = isLoggedIn();
        const userInfo = user();
        setIsUserLoggedIn(loggedIn);
        setUserData(userInfo);
    }, [isLoggedIn, user]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search/?query=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    return (
        <header className="navbar-dark navbar-sticky header-static" style={{ backgroundColor: '#1B4332' }}>
            <nav className="navbar navbar-expand-lg py-2">
                <div className="container px-2">
                    <div className="d-flex align-items-center" style={{ marginLeft: '-16px' }}>
                        <Link className="navbar-brand d-flex align-items-center p-0 m-0" to="/" style={{ textDecoration: 'none' }}>
                            <i 
                                className="fas fa-seedling" 
                                style={{ 
                                    fontSize: '2.2rem',
                                    color: '#74C69D',
                                    marginRight: '8px',
                                    marginLeft: '-4px'
                                }}
                            ></i>
                            <span className="fw-bold text-white" style={{ fontSize: '1.3rem', letterSpacing: '0.5px' }}>AgriAssist</span>
                        </Link>
                    </div>
                    <button className="navbar-toggler ms-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="h6 d-none d-sm-inline-block text-white">{t('menu')}</span>
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                        <div className="nav mt-2 mt-lg-0 px-2 flex-nowrap align-items-center">
                            <div className="nav-item w-100">
                                {location.pathname === '/' && (
                                    <form className="rounded position-relative" onSubmit={handleSearchSubmit} style={{ maxWidth: '300px' }}>
                                        <input 
                                            className="form-control pe-5 bg-white border-0 shadow-sm" 
                                            type="search" 
                                            placeholder={t('searchPlaceholder')} 
                                            aria-label="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{
                                                height: '38px',
                                                borderRadius: '20px',
                                                paddingLeft: '15px',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                        <button 
                                            className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y" 
                                            type="submit"
                                            style={{ color: '#1B4332' }}
                                        >
                                            <i className="bi bi-search fs-5"></i>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                        <ul className="navbar-nav navbar-nav-scroll ms-auto align-items-center" style={{ gap: '0.5rem' }}>
                            <li className="nav-item">
                                <Link className="nav-link active px-3" to="/" style={{ color: '#B7E4C7', fontWeight: '500' }}>
                                    {t('home')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active px-3" to="/category/" style={{ color: '#B7E4C7', fontWeight: '500' }}>
                                    {t('category')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active px-3" to="/chatbot/" style={{ color: '#B7E4C7', fontWeight: '500' }}>
                                    {t('agriAssist')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active px-3" to="/disease-detection" style={{ color: '#B7E4C7', fontWeight: '500' }}>
                                    {t('diseaseDetection')}
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle active px-3" href="#" id="pagesMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ color: '#B7E4C7', fontWeight: '500' }}>
                                    {t('pages')}
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="pagesMenu">
                                    <li>
                                        <Link className="dropdown-item" to="/about/">
                                            <i className="bi bi-person-lines-fill me-2"></i> {t('about')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/contact/">
                                            <i className="bi bi-envelope me-2"></i> {t('contact')}
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            
                            {/* Language Switcher */}
                            <li className="nav-item ms-3">
                                <LanguageSwitcher />
                            </li>

                            {/* Authentication Section */}
                            {isUserLoggedIn ? (
                                <>
                                    {/* Create Post Button */}
                                    <li className="nav-item ms-2">
                                        <Link 
                                            className="btn btn-success px-3 py-1" 
                                            to="/add-post/"
                                            style={{ 
                                                borderRadius: '20px',
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            <i className="fas fa-plus"></i>
                                            {t('createPost')}
                                        </Link>
                                    </li>
                                    
                                    <li className="nav-item dropdown ms-2">
                                        <a className="nav-link dropdown-toggle active px-3" href="#" id="userMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ color: '#B7E4C7', fontWeight: '500' }}>
                                            <i className="bi bi-person-circle me-1"></i>
                                            {userData?.username || userData?.email || t('user')}
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="userMenu">
                                            <li>
                                                <Link className="dropdown-item" to="/dashboard/">
                                                    <i className="bi bi-speedometer2 me-2"></i> {t('dashboard')}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/profile/">
                                                    <i className="bi bi-person me-2"></i> {t('profile')}
                                                </Link>
                                            </li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li>
                                                <Link className="dropdown-item" to="/logout/">
                                                    <i className="bi bi-box-arrow-right me-2"></i> {t('logout')}
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item ms-2">
                                        <Link className="nav-link active px-3" to="/login/" style={{ color: '#B7E4C7', fontWeight: '500' }}>
                                            {t('login')}
                                        </Link>
                                    </li>
                                    <li className="nav-item ms-1">
                                        <Link className="nav-link active px-3" to="/register/" style={{ color: '#B7E4C7', fontWeight: '500' }}>
                                            {t('register')}
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;