import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer" style={{ backgroundColor: '#1B4332', color: '#B7E4C7', padding: '8px 0' }}>
            <div className="container" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="footer-about">
                            <h5 className="text-white mb-4">About AgriAssist</h5>
                            <p className="mb-4" style={{ color: '#D8F3DC' }}>
                                Empowering farmers with AI-driven insights and sustainable agricultural practices.
                            </p>
                            <div className="footer-social">
                                <a className="btn btn-square rounded-circle me-2" href="#" style={{ backgroundColor: '#74C69D', color: '#1B4332' }}>
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a className="btn btn-square rounded-circle me-2" href="#" style={{ backgroundColor: '#74C69D', color: '#1B4332' }}>
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a className="btn btn-square rounded-circle me-2" href="#" style={{ backgroundColor: '#74C69D', color: '#1B4332' }}>
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a className="btn btn-square rounded-circle" href="#" style={{ backgroundColor: '#74C69D', color: '#1B4332' }}>
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="footer-links">
                            <h5 className="text-white mb-4">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><Link to="/" style={{ color: '#D8F3DC' }}>Home</Link></li>
                                <li><Link to="/about" style={{ color: '#D8F3DC' }}>About Us</Link></li>
                                <li><Link to="/services" style={{ color: '#D8F3DC' }}>Services</Link></li>
                                <li><Link to="/contact" style={{ color: '#D8F3DC' }}>Contact</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="footer-contact">
                            <h5 className="text-white mb-4">Contact Us</h5>
                            <p className="mb-2" style={{ color: '#D8F3DC' }}>
                                <i className="fas fa-map-marker-alt me-2"></i>
                                123 Agriculture Street, Farming City, Country
                            </p>
                            <p className="mb-2" style={{ color: '#D8F3DC' }}>
                                <i className="fas fa-phone-alt me-2"></i>
                                +123 456 7890
                            </p>
                            <p className="mb-2" style={{ color: '#D8F3DC' }}>
                                <i className="fas fa-envelope me-2"></i>
                                info@agriassist.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom" style={{ backgroundColor: '#081C15', color: '#B7E4C7' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">&copy; 2024 AgriAssist. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <p className="mb-0">Designed with <i className="fas fa-heart" style={{ color: '#74C69D' }}></i> for farmers</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
