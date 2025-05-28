import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function Header() {
    // const { isLoggedIn, user } = useAuthStore((state) => [state.isLoggedIn,state.user]
    //    );
    const { isLoggedIn, user } = useAuthStore();

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

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
                        <span className="h6 d-none d-sm-inline-block text-white">Menu</span>
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
                                            placeholder="Search Articles..." 
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
                        <ul className="navbar-nav navbar-nav-scroll ms-auto align-items-center">
                            <li className="nav-item">
                                <Link className="nav-link active px-2" to="/" style={{ color: '#B7E4C7' }}>
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active px-2" to="/category/" style={{ color: '#B7E4C7' }}>
                                    Category
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active px-2" to="/chatbot/" style={{ color: '#B7E4C7' }}>
                                    AgriAssist
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle active px-2" href="#" id="pagesMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ color: '#B7E4C7' }}>
                                    Pages
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="pagesMenu">
                                    <li>
                                        <Link className="dropdown-item" to="/about/">
                                            <i className="bi bi-person-lines-fill"></i> About
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/contact/">
                                            <i className="bi bi-telephone-fill"></i> Contact
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle active px-2" href="#" id="pagesMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ color: '#B7E4C7' }}>
                                    Dashboard
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="pagesMenu">
                                    <li>
                                        <Link className="dropdown-item" to="/disease-detection">
                                            <i className="fas fa-microscope fa-fw me-2" />
                                            Plant Disease Detection
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/posts/">
                                            <i className="bi bi-grid-fill"></i> Posts
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/add-post/">
                                            <i className="fas fa-plus-circle"></i> Add Post
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/notifications/">
                                            <i className="fas fa-bell"></i> Notifications
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/profile/">
                                            <i className="fas fa-user-gear"></i> Profile
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item ms-1 d-flex align-items-center">
                                {isLoggedIn() ? (
                                    <div className="d-flex align-items-center">
                                        <Link to={"/dashboard/"} className="btn btn-sm" style={{ backgroundColor: '#74C69D', color: '#1B4332', border: 'none' }}>
                                            My Account  <i className="fas fa-user-circle"></i>
                                        </Link>
                                        <Link to={"/logout/"} className="btn btn-sm ms-1" style={{ backgroundColor: '#D8F3DC', color: '#1B4332', border: 'none' }}>
                                            Logout <i className="fas fa-sign-out-alt"></i>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center">
                                        <Link to={"/register/"} className="btn btn-sm" style={{ backgroundColor: '#74C69D', color: '#1B4332', border: 'none' }}>
                                            Register  <i className="fas fa-user-plus"></i>
                                        </Link>
                                        <Link to={"/login/"} className="btn btn-sm ms-1" style={{ backgroundColor: '#D8F3DC', color: '#1B4332', border: 'none' }}>
                                            Login <i className="fas fa-sign-in-alt"></i>
                                        </Link>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;