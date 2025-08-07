
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";

function Header() {
    const { isLoggedIn, user } = useAuthStore();
    const { t } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        // Check if current route is home page
        setShowSearch(location.pathname === "/");
        
        const loggedIn = isLoggedIn();
        const userInfo = user();
        setIsUserLoggedIn(loggedIn);
        setUserData(userInfo);

        const urlParams = new URLSearchParams(location.search);
        const query = urlParams.get("query");
        if (query) {
            setSearchQuery(query);
        }
    }, [location, isLoggedIn, user]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Common styles
    const navLinkStyles = {
        color: '#B7E4C7',
        fontWeight: '500',
        borderRadius: '6px',
        transition: 'all 0.2s ease',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const navLinkHoverStyles = {
        backgroundColor: 'rgba(183, 228, 199, 0.15)',
        transform: 'translateY(-1px)'
    };

    // Dropdown toggle function
    const toggleDropdown = (e) => {
        e.preventDefault();
        const menu = e.currentTarget.nextElementSibling;
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
        } else {
            menu.style.display = 'block';
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
        }
    };

    // Dropdown hover handlers
    const handleDropdownEnter = (e) => {
        const menu = e.currentTarget.querySelector('.dropdown-menu');
        menu.style.display = 'block';
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
    };

    const handleDropdownLeave = (e) => {
        const menu = e.currentTarget.querySelector('.dropdown-menu');
        menu.style.display = 'none';
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
    };

    return (
        <header className="navbar-dark" style={{ 
            backgroundColor: '#1B4332', 
            boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
            padding: '12px 0'
        }}>
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    {/* Left Side - Logo */}
                    <div style={{ minWidth: '180px' }}>
                        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ 
                            textDecoration: 'none',
                        }}>
                            <i 
                                className="fas fa-seedling" 
                                style={{ 
                                    fontSize: '2rem',
                                    color: '#74C69D',
                                    marginRight: '12px'
                                }}
                            />
                            <span className="fw-bold text-white" style={{ 
                                fontSize: '1.4rem', 
                                letterSpacing: '0.5px'
                            }}>
                                AgriAssist
                            </span>
                        </Link>
                    </div>

                    {/* Center - Navigation Links (Desktop) */}
                    <div className="d-none d-lg-flex align-items-center flex-grow-1 justify-content-center">
                        <nav className="d-flex align-items-center" style={{ gap: '4px' }}>
                            <Link 
                                className="nav-link" 
                                to="/"
                                style={navLinkStyles}
                                onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyles)}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.transform = 'none';
                                }}
                            >
                                <i className="bi bi-house-door"></i>
                                {t('home')}
                            </Link>
                            <Link 
                                className="nav-link" 
                                to="/category/"
                                style={navLinkStyles}
                                onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyles)}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.transform = 'none';
                                }}
                            >
                                <i className="bi bi-grid"></i>
                                {t('category')}
                            </Link>
                            
                            {/* Combined AI Tools Dropdown */}
                            <div className="dropdown"
                                onMouseEnter={handleDropdownEnter}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <a 
                                    className="nav-link dropdown-toggle" 
                                    href="#" 
                                    id="aiToolsMenu" 
                                    style={{
                                        ...navLinkStyles,
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                    onClick={toggleDropdown}
                                >
                                    <i className="bi bi-robot"></i>
                                    {t('aiTools')}
                                </a>
                                <ul 
                                    className="dropdown-menu shadow-sm border-0" 
                                    aria-labelledby="aiToolsMenu" 
                                    style={{ 
                                        borderRadius: '8px', 
                                        padding: '8px',
                                        backgroundColor: '#2D6A4F',
                                        marginTop: '0',
                                        display: 'none',
                                        opacity: '0',
                                        visibility: 'hidden',
                                        transition: 'all 0.3s ease',
                                        position: 'absolute',
                                        zIndex: '1000'
                                    }}
                                >
                                    <li>
                                        <Link 
                                            className="dropdown-item py-2 px-3" 
                                            to="/chatbot/" 
                                            style={{ 
                                                borderRadius: '6px', 
                                                color: '#D8F3DC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <i className="bi bi-chat-square-text"></i> {t('agriAssist')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            className="dropdown-item py-2 px-3" 
                                            to="/disease-detection" 
                                            style={{ 
                                                borderRadius: '6px', 
                                                color: '#D8F3DC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <i className="bi bi-bug"></i> {t('diseaseDetection')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Pages Dropdown */}
                            <div className="dropdown"
                                onMouseEnter={handleDropdownEnter}
                                onMouseLeave={handleDropdownLeave}
                            >
                                <a 
                                    className="nav-link dropdown-toggle" 
                                    href="#" 
                                    id="pagesMenu" 
                                    style={{
                                        ...navLinkStyles,
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}
                                    onClick={toggleDropdown}
                                >
                                    <i className="bi bi-collection"></i>
                                    {t('pages')}
                                </a>
                                <ul 
                                    className="dropdown-menu shadow-sm border-0" 
                                    aria-labelledby="pagesMenu" 
                                    style={{ 
                                        borderRadius: '8px', 
                                        padding: '8px',
                                        backgroundColor: '#2D6A4F',
                                        marginTop: '0',
                                        display: 'none',
                                        opacity: '0',
                                        visibility: 'hidden',
                                        transition: 'all 0.3s ease',
                                        position: 'absolute',
                                        zIndex: '1000'
                                    }}
                                >
                                    <li>
                                        <Link 
                                            className="dropdown-item py-2 px-3" 
                                            to="/about/" 
                                            style={{ 
                                                borderRadius: '6px', 
                                                color: '#D8F3DC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <i className="bi bi-info-circle"></i> {t('about')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            className="dropdown-item py-2 px-3" 
                                            to="/contact/" 
                                            style={{ 
                                                borderRadius: '6px', 
                                                color: '#D8F3DC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            <i className="bi bi-envelope"></i> {t('contact')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                    {/* Right Side - Search and User Controls (Desktop) */}
                    <div className="d-none d-lg-flex align-items-center" style={{ minWidth: '180px', justifyContent: 'flex-end', gap: '16px' }}>
                        {/* Search Bar - Only shown on home page */}
                        {showSearch && (
                            <form onSubmit={handleSearchSubmit} className="me-2">
                                <div className="input-group">
                                    <input 
                                        className="form-control border-0 shadow-sm" 
                                        type="search" 
                                        placeholder={t('searchPlaceholder')} 
                                        aria-label="Search"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        style={{
                                            height: '36px',
                                            borderRadius: '20px',
                                            paddingLeft: '16px',
                                            fontSize: '0.9rem',
                                            backgroundColor: '#ffffff',
                                            width: '180px'
                                        }}
                                    />
                                    <button 
                                        className="btn bg-transparent border-0 position-absolute end-0 translate-middle-y" 
                                        type="submit"
                                        style={{ 
                                            color: '#1B4332',
                                            right: '12px',
                                            top: '50%'
                                        }}
                                    >
                                        <i className="bi bi-search fs-6"></i>
                                    </button>
                                </div>
                            </form>
                        )}

                        <LanguageSwitcher />

                        {isUserLoggedIn ? (
                            <>
                                <Link 
                                    className="btn btn-success d-flex align-items-center" 
                                    to="/add-post/"
                                    style={{ 
                                        borderRadius: '20px',
                                        padding: '8px 16px',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        gap: '8px',
                                        boxShadow: '0 2px 8px rgba(116, 198, 157, 0.3)',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <i className="fas fa-plus"></i>
                                    <span>{t('createPost')}</span>
                                </Link>
                                
                                {/* User Menu Dropdown */}
                                <div className="dropdown"
                                    onMouseEnter={handleDropdownEnter}
                                    onMouseLeave={handleDropdownLeave}
                                >
                                    <a 
                                        className="d-flex align-items-center text-decoration-none dropdown-toggle" 
                                        href="#" 
                                        id="userMenu" 
                                        style={{
                                            color: '#B7E4C7',
                                            gap: '8px',
                                            padding: '8px 12px',
                                            borderRadius: '20px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={toggleDropdown}
                                    >
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            backgroundColor: '#74C69D',
                                            color: '#1B4332',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '600'
                                        }}>
                                            {userData?.username?.charAt(0).toUpperCase() || userData?.email?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    </a>
                                    <ul 
                                        className="dropdown-menu dropdown-menu-end shadow-sm border-0" 
                                        aria-labelledby="userMenu" 
                                        style={{ 
                                            borderRadius: '8px',
                                            padding: '8px',
                                            backgroundColor: '#2D6A4F',
                                            minWidth: '200px',
                                            marginTop: '0',
                                            display: 'none',
                                            opacity: '0',
                                            visibility: 'hidden',
                                            transition: 'all 0.3s ease',
                                            position: 'absolute',
                                            zIndex: '1000'
                                        }}
                                    >
                                        <li>
                                            <Link 
                                                className="dropdown-item py-2 px-3" 
                                                to="/dashboard/" 
                                                style={{ 
                                                    borderRadius: '6px',
                                                    color: '#D8F3DC',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                <i className="bi bi-speedometer2"></i> {t('dashboard')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link 
                                                className="dropdown-item py-2 px-3" 
                                                to="/profile/" 
                                                style={{ 
                                                    borderRadius: '6px',
                                                    color: '#D8F3DC',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                <i className="bi bi-person"></i> {t('profile')}
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider mx-3 my-2" style={{ borderColor: '#40916C' }} /></li>
                                        <li>
                                            <Link 
                                                className="dropdown-item py-2 px-3" 
                                                to="/logout/" 
                                                style={{ 
                                                    borderRadius: '6px',
                                                    color: '#D8F3DC',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                <i className="bi bi-box-arrow-right"></i> {t('logout')}
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link 
                                    className="nav-link" 
                                    to="/login/" 
                                    style={navLinkStyles}
                                >
                                    <i className="bi bi-box-arrow-in-right"></i>
                                    {t('login')}
                                </Link>
                                <Link 
                                    className="btn btn-outline-light d-flex align-items-center" 
                                    to="/register/" 
                                    style={{ 
                                        borderRadius: '20px',
                                        padding: '8px 16px',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        gap: '8px',
                                        border: '2px solid #B7E4C7',
                                        color: '#B7E4C7',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <i className="bi bi-person-plus"></i>
                                    <span>{t('register')}</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="d-lg-none btn btn-link p-2" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#mobileMenu" 
                        aria-controls="mobileMenu" 
                        aria-expanded="false"
                        style={{ 
                            color: '#B7E4C7',
                            fontSize: '1.5rem'
                        }}
                    >
                        <i className="bi bi-list"></i>
                    </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="collapse d-lg-none mt-3" id="mobileMenu">
                    <div className="d-flex flex-column gap-3">
                        {/* Mobile Search - Only shown on home page */}
                        {location.pathname === "/" && (
                            <form className="position-relative" onSubmit={handleSearchSubmit}>
                                <input 
                                    className="form-control border-0 shadow-sm" 
                                    type="search" 
                                    placeholder={t('searchPlaceholder')} 
                                    aria-label="Search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    style={{
                                        height: '40px',
                                        borderRadius: '20px',
                                        paddingLeft: '16px',
                                        paddingRight: '40px',
                                        fontSize: '0.9rem',
                                        backgroundColor: '#ffffff'
                                    }}
                                />
                                <button 
                                    className="btn bg-transparent border-0 position-absolute top-50 end-0 translate-middle-y" 
                                    type="submit"
                                    style={{ 
                                        color: '#1B4332',
                                        right: '12px'
                                    }}
                                >
                                    <i className="bi bi-search fs-6"></i>
                                </button>
                            </form>
                        )}

                        {/* Mobile Navigation Links */}
                        <div className="d-flex flex-column gap-2">
                            <Link 
                                className="nav-link" 
                                to="/"
                                style={navLinkStyles}
                            >
                                <i className="bi bi-house-door"></i>
                                {t('home')}
                            </Link>
                            <Link 
                                className="nav-link" 
                                to="/category/"
                                style={navLinkStyles}
                            >
                                <i className="bi bi-grid"></i>
                                {t('category')}
                            </Link>
                            <Link 
                                className="nav-link" 
                                to="/chatbot/"
                                style={navLinkStyles}
                            >
                                <i className="bi bi-robot"></i>
                                {t('agriAssist')}
                            </Link>
                            <Link 
                                className="nav-link" 
                                to="/disease-detection"
                                style={navLinkStyles}
                            >
                                <i className="bi bi-bug"></i>
                                {t('diseaseDetection')}
                            </Link>
                            <Link 
                                className="nav-link" 
                                to="/about/"
                                style={navLinkStyles}
                            >
                                <i className="bi bi-info-circle"></i>
                                {t('about')}
                            </Link>
                            <Link 
                                className="nav-link" 
                                to="/contact/"
                                style={navLinkStyles}
                            >
                                <i className="bi bi-envelope"></i>
                                {t('contact')}
                            </Link>
                        </div>

                        {/* Mobile Auth Controls */}
                        <div className="d-flex flex-column gap-2">
                            <LanguageSwitcher />

                            {isUserLoggedIn ? (
                                <>
                                    <Link 
                                        className="btn btn-success d-flex align-items-center justify-content-center" 
                                        to="/add-post/"
                                        style={{ 
                                            borderRadius: '20px',
                                            padding: '10px 16px',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className="fas fa-plus"></i>
                                        {t('createPost')}
                                    </Link>
                                    <Link 
                                        className="btn btn-outline-light d-flex align-items-center justify-content-center" 
                                        to="/dashboard/"
                                        style={{ 
                                            borderRadius: '20px',
                                            padding: '10px 16px',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className="bi bi-speedometer2"></i>
                                        {t('dashboard')}
                                    </Link>
                                    <Link 
                                        className="btn btn-outline-light d-flex align-items-center justify-content-center" 
                                        to="/logout/"
                                        style={{ 
                                            borderRadius: '20px',
                                            padding: '10px 16px',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                        {t('logout')}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        className="btn btn-outline-light d-flex align-items-center justify-content-center" 
                                        to="/login/"
                                        style={{ 
                                            borderRadius: '20px',
                                            padding: '10px 16px',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-in-right"></i>
                                        {t('login')}
                                    </Link>
                                    <Link 
                                        className="btn btn-success d-flex align-items-center justify-content-center" 
                                        to="/register/"
                                        style={{ 
                                            borderRadius: '20px',
                                            padding: '10px 16px',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className="bi bi-person-plus"></i>
                                        {t('register')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;