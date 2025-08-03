// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuthStore } from "../../store/auth";
// import { useLanguage } from "../../contexts/LanguageContext";
// import LanguageSwitcher from "../../components/LanguageSwitcher";

// function Header() {
//     const { isLoggedIn, user } = useAuthStore();
//     const { t } = useLanguage();

//     const [searchQuery, setSearchQuery] = useState("");
//     const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
//     const [userData, setUserData] = useState(null);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Update authentication state when it changes
//     useEffect(() => {
//         const loggedIn = isLoggedIn();
//         const userInfo = user();
//         setIsUserLoggedIn(loggedIn);
//         setUserData(userInfo);
//     }, [isLoggedIn, user]);

//     // Initialize search query from URL params
//     useEffect(() => {
//         const urlParams = new URLSearchParams(location.search);
//         const query = urlParams.get("query");
//         if (query) {
//             setSearchQuery(query);
//         }
//     }, [location.search]);

//     const handleSearchSubmit = (e) => {
//         e.preventDefault();
//         if (searchQuery.trim()) {
//             // Navigate to home page with search query
//             navigate(`/?query=${encodeURIComponent(searchQuery.trim())}`);
//         }
//     };

//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//     };

//     return (
//         <header className="navbar-dark navbar-sticky header-static" style={{ backgroundColor: '#1B4332', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
//             <nav className="navbar navbar-expand-lg">
//                 <div className="container">
//                     {/* Brand/Logo Section */}
//                     <div className="navbar-brand-container d-flex align-items-center">
//                         <Link className="navbar-brand d-flex align-items-center" to="/" style={{ textDecoration: 'none' }}>
//                             <i 
//                                 className="fas fa-seedling" 
//                                 style={{ 
//                                     fontSize: '2rem',
//                                     color: '#74C69D',
//                                     marginRight: '12px'
//                                 }}
//                             ></i>
//                             <span className="fw-bold text-white" style={{ fontSize: '1.4rem', letterSpacing: '0.5px' }}>AgriAssist</span>
//                         </Link>
//                     </div>

//                     {/* Mobile Toggle Button */}
//                     <button 
//                         className="navbar-toggler border-0" 
//                         type="button" 
//                         data-bs-toggle="collapse" 
//                         data-bs-target="#navbarCollapse" 
//                         aria-controls="navbarCollapse" 
//                         aria-expanded="false" 
//                         aria-label="Toggle navigation"
//                         style={{ padding: '8px 12px' }}
//                     >
//                         <span className="navbar-toggler-icon"></span>
//                     </button>

//                     {/* Collapsible Content */}
//                     <div className="collapse navbar-collapse" id="navbarCollapse">
//                         {/* Search Bar - Centered on Desktop */}
//                         <div className="navbar-nav mx-auto d-none d-lg-flex" style={{ maxWidth: '400px', width: '100%' }}>
//                             <div className="nav-item w-100">
//                                 <form className="position-relative" onSubmit={handleSearchSubmit}>
//                                     <input 
//                                         className="form-control border-0 shadow-sm" 
//                                         type="search" 
//                                         placeholder={t('searchPlaceholder')} 
//                                         aria-label="Search"
//                                         value={searchQuery}
//                                         onChange={handleSearchChange}
//                                         style={{
//                                             height: '42px',
//                                             borderRadius: '25px',
//                                             paddingLeft: '20px',
//                                             paddingRight: '50px',
//                                             fontSize: '0.95rem',
//                                             backgroundColor: '#ffffff'
//                                         }}
//                                     />
//                                     <button 
//                                         className="btn bg-transparent border-0 position-absolute top-50 end-0 translate-middle-y" 
//                                         type="submit"
//                                         style={{ 
//                                             color: '#1B4332',
//                                             right: '15px',
//                                             padding: '8px'
//                                         }}
//                                     >
//                                         <i className="bi bi-search fs-6"></i>
//                                     </button>
//                                 </form>
//                             </div>
//                         </div>

//                         {/* Navigation Links */}
//                         <ul className="navbar-nav ms-auto align-items-center" style={{ gap: '0.25rem' }}>
//                             {/* Main Navigation Items */}
//                             <li className="nav-item">
//                                 <Link 
//                                     className="nav-link px-3 py-2" 
//                                     to="/" 
//                                     style={{ 
//                                         color: '#B7E4C7', 
//                                         fontWeight: '500',
//                                         borderRadius: '8px',
//                                         transition: 'all 0.3s ease'
//                                     }}
//                                     onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.1)'}
//                                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                                 >
//                                     {t('home')}
//                                 </Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link 
//                                     className="nav-link px-3 py-2" 
//                                     to="/category/" 
//                                     style={{ 
//                                         color: '#B7E4C7', 
//                                         fontWeight: '500',
//                                         borderRadius: '8px',
//                                         transition: 'all 0.3s ease'
//                                     }}
//                                     onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.1)'}
//                                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                                 >
//                                     {t('category')}
//                                 </Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link 
//                                     className="nav-link px-3 py-2" 
//                                     to="/chatbot/" 
//                                     style={{ 
//                                         color: '#B7E4C7', 
//                                         fontWeight: '500',
//                                         borderRadius: '8px',
//                                         transition: 'all 0.3s ease'
//                                     }}
//                                     onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.1)'}
//                                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                                 >
//                                     {t('agriAssist')}
//                                 </Link>
//                             </li>
//                             <li className="nav-item">
//                                 <Link 
//                                     className="nav-link px-3 py-2" 
//                                     to="/disease-detection" 
//                                     style={{ 
//                                         color: '#B7E4C7', 
//                                         fontWeight: '500',
//                                         borderRadius: '8px',
//                                         transition: 'all 0.3s ease'
//                                     }}
//                                     onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.1)'}
//                                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                                 >
//                                     {t('diseaseDetection')}
//                                 </Link>
//                             </li>
                            
//                             {/* Pages Dropdown */}
//                             <li className="nav-item dropdown">
//                                 <a 
//                                     className="nav-link dropdown-toggle px-3 py-2" 
//                                     href="#" 
//                                     id="pagesMenu" 
//                                     data-bs-toggle="dropdown" 
//                                     aria-haspopup="true" 
//                                     aria-expanded="false" 
//                                     style={{ 
//                                         color: '#B7E4C7', 
//                                         fontWeight: '500',
//                                         borderRadius: '8px',
//                                         transition: 'all 0.3s ease'
//                                     }}
//                                     onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.1)'}
//                                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                                 >
//                                     {t('pages')}
//                                 </a>
//                                 <ul className="dropdown-menu shadow-sm border-0" aria-labelledby="pagesMenu" style={{ borderRadius: '12px', marginTop: '8px' }}>
//                                     <li>
//                                         <Link className="dropdown-item py-2 px-3" to="/about/" style={{ borderRadius: '8px', margin: '2px 8px' }}>
//                                             <i className="bi bi-person-lines-fill me-2"></i> {t('about')}
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link className="dropdown-item py-2 px-3" to="/contact/" style={{ borderRadius: '8px', margin: '2px 8px' }}>
//                                             <i className="bi bi-envelope me-2"></i> {t('contact')}
//                                         </Link>
//                                     </li>
//                                 </ul>
//                             </li>
                            
//                             {/* Language Switcher */}
//                             <li className="nav-item ms-2">
//                                 <LanguageSwitcher />
//                             </li>

//                             {/* Authentication Section */}
//                             {isUserLoggedIn ? (
//                                 <>
//                                     {/* Create Post Button */}
//                                     <li className="nav-item ms-3">
//                                         <Link 
//                                             className="btn btn-success px-4 py-2" 
//                                             to="/add-post/"
//                                             style={{ 
//                                                 borderRadius: '25px',
//                                                 fontSize: '0.9rem',
//                                                 fontWeight: '600',
//                                                 textDecoration: 'none',
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 gap: '0.5rem',
//                                                 boxShadow: '0 2px 8px rgba(116, 198, 157, 0.3)',
//                                                 transition: 'all 0.3s ease'
//                                             }}
//                                             onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
//                                             onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
//                                         >
//                                             <i className="fas fa-plus"></i>
//                                             {t('createPost')}
//                                         </Link>
//                                     </li>
                                    
//                                     {/* User Menu */}
//                                     <li className="nav-item dropdown ms-3">
//                                         <a 
//                                             className="nav-link dropdown-toggle px-3 py-2" 
//                                             href="#" 
//                                             id="userMenu" 
//                                             data-bs-toggle="dropdown" 
//                                             aria-haspopup="true" 
//                                             aria-expanded="false" 
//                                             style={{ 
//                                                 color: '#B7E4C7', 
//                                                 fontWeight: '500',
//                                                 borderRadius: '8px',
//                                                 transition: 'all 0.3s ease',
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 gap: '0.5rem'
//                                             }}
//                                             onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.1)'}
//                                             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                                         >
//                                             <i className="bi bi-person-circle fs-5"></i>
//                                             <span className="d-none d-md-inline">
//                                                 {userData?.username || userData?.email || t('user')}
//                                             </span>
//                                         </a>
//                                         <ul className="dropdown-menu shadow-sm border-0" aria-labelledby="userMenu" style={{ borderRadius: '12px', marginTop: '8px', minWidth: '200px' }}>
//                                             <li>
//                                                 <Link className="dropdown-item py-2 px-3" to="/dashboard/" style={{ borderRadius: '8px', margin: '2px 8px' }}>
//                                                     <i className="bi bi-speedometer2 me-2"></i> {t('dashboard')}
//                                                 </Link>
//                                             </li>
//                                             <li>
//                                                 <Link className="dropdown-item py-2 px-3" to="/profile/" style={{ borderRadius: '8px', margin: '2px 8px' }}>
//                                                     <i className="bi bi-person me-2"></i> {t('profile')}
//                                                 </Link>
//                                             </li>
//                                             <li><hr className="dropdown-divider mx-3" /></li>
//                                             <li>
//                                                 <Link className="dropdown-item py-2 px-3" to="/logout/" style={{ borderRadius: '8px', margin: '2px 8px' }}>
//                                                     <i className="bi bi-box-arrow-right me-2"></i> {t('logout')}
//                                                 </Link>
//                                             </li>
//                                         </ul>
//                                     </li>
//                                 </>
//                             ) : (
//                                 <>
//                                     {/* Login/Register for non-authenticated users */}
//                                     <li className="nav-item ms-3">
//                                         <Link 
//                                             className="nav-link px-3 py-2" 
//                                             to="/login/" 
//                                             style={{ 
//                                                 color: '#B7E4C7', 
//                                                 fontWeight: '500',
//                                                 borderRadius: '8px',
//                                                 transition: 'all 0.3s ease'
//                                             }}
//                                             onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.1)'}
//                                             onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
//                                         >
//                                             {t('login')}
//                                         </Link>
//                                     </li>
//                                     <li className="nav-item ms-2">
//                                         <Link 
//                                             className="btn btn-outline-light px-4 py-2" 
//                                             to="/register/" 
//                                             style={{ 
//                                                 borderRadius: '25px',
//                                                 fontSize: '0.9rem',
//                                                 fontWeight: '600',
//                                                 textDecoration: 'none',
//                                                 border: '2px solid #B7E4C7',
//                                                 transition: 'all 0.3s ease'
//                                             }}
//                                             onMouseEnter={(e) => {
//                                                 e.target.style.backgroundColor = '#B7E4C7';
//                                                 e.target.style.color = '#1B4332';
//                                             }}
//                                             onMouseLeave={(e) => {
//                                                 e.target.style.backgroundColor = 'transparent';
//                                                 e.target.style.color = '#B7E4C7';
//                                             }}
//                                         >
//                                             {t('register')}
//                                         </Link>
//                                     </li>
//                                 </>
//                             )}
//                         </ul>

//                         {/* Mobile Search Bar */}
//                         <div className="d-lg-none mt-3">
//                             <form className="position-relative" onSubmit={handleSearchSubmit}>
//                                 <input 
//                                     className="form-control border-0 shadow-sm" 
//                                     type="search" 
//                                     placeholder={t('searchPlaceholder')} 
//                                     aria-label="Search"
//                                     value={searchQuery}
//                                     onChange={handleSearchChange}
//                                     style={{
//                                         height: '42px',
//                                         borderRadius: '25px',
//                                         paddingLeft: '20px',
//                                         paddingRight: '50px',
//                                         fontSize: '0.95rem',
//                                         backgroundColor: '#ffffff'
//                                     }}
//                                 />
//                                 <button 
//                                     className="btn bg-transparent border-0 position-absolute top-50 end-0 translate-middle-y" 
//                                     type="submit"
//                                     style={{ 
//                                         color: '#1B4332',
//                                         right: '15px',
//                                         padding: '8px'
//                                     }}
//                                 >
//                                     <i className="bi bi-search fs-6"></i>
//                                 </button>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//         </header>
//     );
// }

// export default Header;
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

    useEffect(() => {
        const loggedIn = isLoggedIn();
        const userInfo = user();
        setIsUserLoggedIn(loggedIn);
        setUserData(userInfo);
    }, [isLoggedIn, user]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const query = urlParams.get("query");
        if (query) {
            setSearchQuery(query);
        }
    }, [location.search]);

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

    return (
        <header className="navbar-dark" style={{ 
            backgroundColor: '#1B4332', 
            boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
            padding: '12px 0'
        }}>
            <div className="container">
                <div className="d-flex align-items-center justify-content-between">
                    {/* Left Side - Logo */}
                    <div className="d-flex align-items-center" style={{ width: '180px' }}>
                        <Link className="navbar-brand d-flex align-items-center" to="/" style={{ 
                            textDecoration: 'none',
                            marginRight: '40px'
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
                            <Link 
                                className="nav-link" 
                                to="/chatbot/"
                                style={navLinkStyles}
                                onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyles)}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.transform = 'none';
                                }}
                            >
                                <i className="bi bi-robot"></i>
                                {t('agriAssist')}
                            </Link>
                            <Link 
                                className="nav-link" 
                                to="/disease-detection"
                                style={navLinkStyles}
                                onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyles)}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.transform = 'none';
                                }}
                            >
                                <i className="bi bi-bug"></i>
                                {t('diseaseDetection')}
                            </Link>
                            
                            <div className="dropdown">
                                <a 
                                    className="nav-link dropdown-toggle" 
                                    href="#" 
                                    id="pagesMenu" 
                                    data-bs-toggle="dropdown" 
                                    aria-haspopup="true" 
                                    aria-expanded="false"
                                    style={navLinkStyles}
                                    onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyles)}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.transform = 'none';
                                    }}
                                >
                                    <i className="bi bi-collection"></i>
                                    {t('pages')}
                                </a>
                                <ul className="dropdown-menu shadow-sm border-0" aria-labelledby="pagesMenu" style={{ 
                                    borderRadius: '8px', 
                                    padding: '8px',
                                    backgroundColor: '#2D6A4F'
                                }}>
                                    <li>
                                        <Link className="dropdown-item py-2 px-3" to="/about/" style={{ 
                                            borderRadius: '6px', 
                                            color: '#D8F3DC',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <i className="bi bi-info-circle"></i> {t('about')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item py-2 px-3" to="/contact/" style={{ 
                                            borderRadius: '6px', 
                                            color: '#D8F3DC',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <i className="bi bi-envelope"></i> {t('contact')}
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                    {/* Right Side - User Controls (Desktop) */}
                    <div className="d-none d-lg-flex align-items-center" style={{ width: '180px', justifyContent: 'flex-end', gap: '16px' }}>
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
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'none'}
                                >
                                    <i className="fas fa-plus"></i>
                                    <span>{t('createPost')}</span>
                                </Link>
                                
                                <div className="dropdown">
                                    <a 
                                        className="d-flex align-items-center text-decoration-none dropdown-toggle" 
                                        href="#" 
                                        id="userMenu" 
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false"
                                        style={{
                                            color: '#B7E4C7',
                                            gap: '8px',
                                            padding: '8px 12px',
                                            borderRadius: '20px',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(183, 228, 199, 0.15)'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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
                                    <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0" aria-labelledby="userMenu" style={{ 
                                        borderRadius: '8px',
                                        padding: '8px',
                                        backgroundColor: '#2D6A4F',
                                        minWidth: '200px'
                                    }}>
                                        <li>
                                            <Link className="dropdown-item py-2 px-3" to="/dashboard/" style={{ 
                                                borderRadius: '6px',
                                                color: '#D8F3DC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <i className="bi bi-speedometer2"></i> {t('dashboard')}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2 px-3" to="/profile/" style={{ 
                                                borderRadius: '6px',
                                                color: '#D8F3DC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <i className="bi bi-person"></i> {t('profile')}
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider mx-3 my-2" style={{ borderColor: '#40916C' }} /></li>
                                        <li>
                                            <Link className="dropdown-item py-2 px-3" to="/logout/" style={{ 
                                                borderRadius: '6px',
                                                color: '#D8F3DC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
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
                                    onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyles)}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.transform = 'none';
                                    }}
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
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#B7E4C7';
                                        e.target.style.color = '#1B4332';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = '#B7E4C7';
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

                        {/* Mobile Search */}
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