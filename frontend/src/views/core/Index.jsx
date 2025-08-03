import React from "react";
import { useState, useEffect, useCallback } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";

import Moment from "../../plugin/Moment";

import apiInstance from "../../utils/axios";

import Toast from "../../plugin/Toast";


function Index() {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const [trendingPosts, setTrendingPosts] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

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

    // Search function with useCallback for better performance
    const performSearch = useCallback(async (query) => {
        if (!query || !query.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await apiInstance.post('post/search/', {
                query: query.trim()
            });
            
            const results = response.data?.results || [];
            setSearchResults(results);
            setShowSearchResults(true);
        } catch (error) {
            console.error("Error performing search:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            performSearch(searchQuery);
        }
    };

    // Initialize from URL params
    useEffect(() => {
        const query = searchParams.get("query");
        if (query) {
            setSearchQuery(query);
            performSearch(query);
        }
    }, [searchParams, performSearch]);

    // Handle real-time search (debounced)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch(searchQuery);
            } else {
                setShowSearchResults(false);
                setSearchResults([]);
            }
        }, 800); // Increased debounce time for smoother experience

        return () => clearTimeout(timeoutId);
    }, [searchQuery, performSearch]);

    useEffect(() => {
        fetchPosts();
    }, []);

    // Highlight search terms in text
    const highlightText = (text, query) => {
        if (!query || !text) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);
        
        return parts.map((part, index) => 
            regex.test(part) ? (
                <mark key={index} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }}>
                    {part}
                </mark>
            ) : part
        );
    };

    // Clear search function
    const clearSearch = () => {
        setSearchQuery("");
        setShowSearchResults(false);
        setSearchResults([]);
        // Update URL to remove query parameter
        window.history.replaceState({}, '', '/');
    };

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
                {/* Search Section */}
                {showSearchResults && (
                    <section className="py-4 bg-light">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="mb-0">
                                            {t('searchArticles')} - {t('foundResults', { count: searchResults.length })}
                                        </h4>
                                        <button 
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={clearSearch}
                                        >
                                            <i className="fas fa-times me-1"></i>
                                            Clear Search
                                        </button>
                                    </div>
                                    
                                    {/* Search Input */}
                                    <form onSubmit={handleSearch} className="mb-3">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={t('searchPlaceholder')}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <button type="submit" className="btn btn-primary">
                                                <i className="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </form>

                                    {/* Search Results */}
                                    {isSearching ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            <p className="mt-2">{t('searching')}</p>
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="row g-4">
                                            {searchResults.map((post) => (
                                                <div className="col-sm-6 col-lg-4" key={post.id}>
                                                    <div className="card h-100 shadow-sm">
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
                                                                    {highlightText(post.title, searchQuery)}
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
                                                                    <span className="text-muted"><Moment date={post.date} /></span>
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
                                    ) : searchQuery ? (
                                        <div className="text-center py-4">
                                            <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                            <h5>{t('noResultsFound')}</h5>
                                            <p className="text-muted">{t('tryAdjustingSearch')}</p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Regular Content - Only show when not searching */}
                {!showSearchResults && (
                    <>
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
                                                            <span className="text-muted"><Moment date={post.date} /></span>
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
                                                            <span className="text-muted"><Moment date={post.date} /></span>
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
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Index;
