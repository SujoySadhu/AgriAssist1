import React from "react";
import { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

import Moment from "../../plugin/Moment";

import apiInstance from "../../utils/axios";

import Toast from "../../plugin/Toast";


function Index() {
    const { t } = useLanguage();
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            // Fetch trending posts
            const trending_response = await apiInstance.get('post/lists/');
            setTrendingPosts(trending_response.data);

            // Fetch latest posts
            const latest_response = await apiInstance.get('post/latest/');
            setLatestPosts(latest_response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    // Pagination for trending posts
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const trendingPostItems = trendingPosts?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(trendingPosts?.length / itemsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    // Pagination for latest posts
    const [latestCurrentPage, setLatestCurrentPage] = useState(1);
    const latestItemsPerPage = 8; // 8 items per page for latest section
    const indexOfLatestLastItem = latestCurrentPage * latestItemsPerPage;
    const indexOfLatestFirstItem = indexOfLatestLastItem - latestItemsPerPage;
    const latestPostItems = latestPosts?.slice(indexOfLatestFirstItem, indexOfLatestLastItem);
    const latestTotalPages = Math.ceil(latestPosts?.length / latestItemsPerPage);
    const latestPageNumbers = Array.from({ length: latestTotalPages }, (_, index) => index + 1);


    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1">
                <section className="py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h2 className="text-start d-block mb-4">
                                    <i className="fas fa-fire me-2"></i>
                                    {t('trendingPosts')}
                                </h2>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pb-5">
                    <div className="container">
                        <div className="row g-4">
                            {trendingPostItems?.map((post) => (
                                <div className="col-sm-6 col-lg-3" key={post.id}>
                                    <div className="card h-100 shadow-sm hover-shadow">
                                        <div className="card-fold position-relative">
                                            <img 
                                                className="card-img" 
                                                style={{ 
                                                    width: "100%", 
                                                    height: "200px", 
                                                    objectFit: "cover",
                                                    borderTopLeftRadius: "8px",
                                                    borderTopRightRadius: "8px"
                                                }} 
                                                src={post.image} 
                                                alt={post.title} 
                                            />
                                        </div>
                                        <div className="card-body px-3 pt-3 d-flex flex-column">
                                            <h4 className="card-title h5 mb-3">
                                                <Link to={post.slug} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                   {post.title}
                                                </Link>
                                            </h4>
                                            <div className="mt-auto">
                                                <div className="d-flex align-items-center mb-2">
                                                    <button className="btn btn-sm btn-outline-primary">
                                                        <i className="fas fa-heart me-1"></i>
                                                        {post.likes_count || 0}
                                                    </button>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="fas fa-user me-2"></i>
                                                    <span className="text-dark">{post.user_profile?.full_name || post.user_profile?.username}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="fas fa-calendar me-2"></i>
                                                    <span className="text-muted">{Moment(post.date)}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="fas fa-eye me-2"></i>
                                                    <span className="text-muted">{post?.view} {t('views')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <nav className="d-flex mt-4">
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button className="page-link me-1" onClick={() => setCurrentPage(currentPage - 1)}>
                                        <i className="ci-arrow-left me-2" />
                                        {t('previous')}
                                    </button>
                                </li>
                            </ul>
                            <ul className="pagination">
                                {pageNumbers?.map((number) => (
                                    <li key={number} className={`page-item ${currentPage === number ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(number)}>
                                            {number}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <ul className="pagination">
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button className="page-link ms-1" onClick={() => setCurrentPage(currentPage + 1)}>
                                        {t('next')}
                                        <i className="ci-arrow-right ms-3" />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </section>

                <section className="py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h2 className="text-start d-block mb-4">
                                    <i className="fas fa-clock me-2"></i>
                                    {t('latestPosts')}
                                </h2>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pb-5">
                    <div className="container">
                        <div className="row g-4">
                            {latestPostItems?.map((post) => (
                                <div className="col-sm-6 col-lg-3" key={post.id}>
                                    <div className="card h-100 shadow-sm hover-shadow">
                                        <div className="card-fold position-relative">
                                            <img 
                                                className="card-img" 
                                                style={{ 
                                                    width: "100%", 
                                                    height: "200px", 
                                                    objectFit: "cover",
                                                    borderTopLeftRadius: "8px",
                                                    borderTopRightRadius: "8px"
                                                }} 
                                                src={post.image || ""} 
                                                alt={post.title} 
                                            />
                                        </div>
                                        <div className="card-body px-3 pt-3 d-flex flex-column">
                                            <h4 className="card-title h5 mb-3">
                                                <Link 
                                                    to={post.slug} 
                                                    className="btn-link text-reset stretched-link fw-bold text-decoration-none"
                                                >
                                                    {post.title}
                                                </Link>
                                            </h4>
                                            <div className="mt-auto">
                                                <div className="d-flex align-items-center mb-2">
                                                    <button className="btn btn-sm btn-outline-primary">
                                                        <i className="fas fa-heart me-1"></i>
                                                        {post.likes_count || 0}
                                                    </button>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="fas fa-user me-2"></i>
                                                    <span className="text-dark">{post.user_profile?.full_name || post.user_profile?.username}</span>
                                                </div>
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className="fas fa-calendar me-2"></i>
                                                    <span className="text-muted">{Moment(post.date)}</span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="fas fa-eye me-2"></i>
                                                    <span className="text-muted">{post?.view} {t('views')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <nav className="d-flex mt-4">
                            <ul className="pagination">
                                <li className={`page-item ${latestCurrentPage === 1 ? "disabled" : ""}`}>
                                    <button 
                                        className="page-link text-dark fw-bold me-1 rounded" 
                                        onClick={() => setLatestCurrentPage(latestCurrentPage - 1)}
                                    >
                                        <i className="fas fa-arrow-left me-2" />
                                        {t('previous')}
                                    </button>
                                </li>
                            </ul>
                            <ul className="pagination">
                                {latestPageNumbers?.map((number) => (
                                    <li 
                                        key={number} 
                                        className={`page-item ${latestCurrentPage === number ? "active" : ""}`}
                                    >
                                        <button 
                                            className="page-link text-dark fw-bold rounded"
                                            onClick={() => setLatestCurrentPage(number)}
                                        >
                                            {number}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <ul className="pagination">
                                <li className={`page-item ${latestCurrentPage === latestTotalPages ? "disabled" : ""}`}>
                                    <button 
                                        className="page-link text-dark fw-bold ms-1 rounded"
                                        onClick={() => setLatestCurrentPage(latestCurrentPage + 1)}
                                    >
                                        {t('next')}
                                        <i className="fas fa-arrow-right ms-3" />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Index;
