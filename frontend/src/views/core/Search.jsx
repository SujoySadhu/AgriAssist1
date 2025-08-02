
import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { useSearchParams, Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import { useLanguage } from "../../contexts/LanguageContext";

function Search() {
    const { t } = useLanguage();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Advanced search function
    const performSearch = async (query) => {
        if (!query.trim()) {
            setFilteredPosts([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiInstance.post('post/search/', {
                query: query.trim()
            });
            
            const results = response.data?.results || [];
            setFilteredPosts(results);
        } catch (error) {
            console.error("Error performing search:", error);
            setFilteredPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            performSearch(searchQuery);
            
            // Update URL
            const params = new URLSearchParams();
            params.set("query", searchQuery);
            window.history.replaceState({}, '', `?${params.toString()}`);
        }
    };

    // Handle real-time search (debounced)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) {
                performSearch(searchQuery);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Initialize from URL params
    useEffect(() => {
        const query = searchParams.get("query");
        if (query) {
            setSearchQuery(query);
        }
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

    return (
        <div>
            <Header />

            <section className="search-section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="search-header">
                                <div className="search-icon">
                                    <i className="fas fa-seedling"></i>
                                </div>
                                <h2 className="search-title">
                                    {t('searchArticles')}
                                </h2>
                                <p className="search-subtitle">
                                    {t('searchSubtitle')}
                                </p>
                            </div>
                            
                            <form onSubmit={handleSearch} className="search-form">
                                <div className="search-input-group">
                                    <div className="search-input-wrapper">
                                        <input
                                            type="text"
                                            className="form-control search-input"
                                            placeholder={t('searchPlaceholder')}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button type="submit" className="search-button">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Agriculture-themed decorative elements */}
                            <div className="agriculture-decorations">
                                <div className="decoration-item">
                                    <i className="fas fa-leaf"></i>
                                </div>
                                <div className="decoration-item">
                                    <i className="fas fa-seedling"></i>
                                </div>
                                <div className="decoration-item">
                                    <i className="fas fa-tractor"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="results-section">
                <div className="container">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner">
                                <i className="fas fa-seedling fa-spin"></i>
                            </div>
                            <p>{t('searching')}</p>
                        </div>
                    ) : (
                        <div className="row">
                            {filteredPosts.length > 0 ? (
                                <>
                                    <div className="col-12 mb-4">
                                        <div className="results-info">
                                            <h4>{t('foundResults', { count: filteredPosts.length })}</h4>
                                            {searchQuery && (
                                                <p>{t('searchingFor')} <strong>"{searchQuery}"</strong></p>
                                            )}
                                        </div>
                                    </div>
                                    {filteredPosts.map((post) => (
                                        <div className="col-sm-6 col-lg-4 mb-4" key={post.id}>
                                            <div className="card search-result-card h-100">
                                                <div className="card-image-container">
                                                    <img
                                                        className="card-img-top"
                                                        src={post.image}
                                                        alt={post.title}
                                                    />
                                                    <div className="card-overlay">
                                                        <Link to={post.slug || "#"} className="btn btn-success btn-sm">
                                                            <i className="fas fa-leaf me-1"></i>
                                                            {t('readMore')}
                                                        </Link>
                                                    </div>
                                                    <div className="card-category-badge">
                                                        {post.category?.name}
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title">
                                                        <Link to={post.slug || "#"} className="card-title-link">
                                                            {highlightText(post.title, searchQuery)}
                                                        </Link>
                                                    </h5>
                                                    
                                                    <div className="card-meta">
                                                        <span className="meta-item">
                                                            <i className="fas fa-user"></i> 
                                                            {post?.profile?.full_name || t('anonymous')}
                                                        </span>
                                                        <span className="meta-item">
                                                            <i className="fas fa-calendar"></i> 
                                                            <Moment format="LL">{post.date}</Moment>
                                                        </span>
                                                        <span className="meta-item">
                                                            <i className="fas fa-eye"></i> 
                                                            {post?.view || 0} {t('views')}
                                                        </span>
                                                    </div>

                                                    {post.description && (
                                                        <p className="card-description">
                                                            {highlightText(post.description.substring(0, 150), searchQuery)}
                                                            {post.description.length > 150 && '...'}
                                                        </p>
                                                    )}

                                                    {post.tags && (
                                                        <div className="card-tags">
                                                            {post.tags.split(',').slice(0, 3).map((tag, index) => (
                                                                <span key={index} className="tag">
                                                                    <i className="fas fa-tag me-1"></i>
                                                                    {tag.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : searchQuery ? (
                                <div className="col-12">
                                    <div className="no-results">
                                        <div className="no-results-icon">
                                            <i className="fas fa-seedling"></i>
                                        </div>
                                        <h3>{t('noResultsFound')}</h3>
                                        <p>{t('tryAdjustingSearch')}</p>
                                        <div className="suggestions">
                                            <p>{t('searchSuggestions')}:</p>
                                            <div className="suggestion-tags">
                                                <span className="suggestion-tag">{t('agriculture')}</span>
                                                <span className="suggestion-tag">{t('farming')}</span>
                                                <span className="suggestion-tag">{t('crops')}</span>
                                                <span className="suggestion-tag">{t('fertilizer')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <style>{`
                .search-section {
                    background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 50%, #74a062 100%);
                    padding: 4rem 0;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .search-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="leaves" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 0 Q15 5 10 10 Q5 5 10 0" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23leaves)"/></svg>');
                    opacity: 0.3;
                }

                .search-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    position: relative;
                    z-index: 2;
                }

                .search-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    color: #a8e6cf;
                }

                .search-title {
                    font-size: 3rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }

                .search-subtitle {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .search-form {
                    max-width: 600px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 2;
                }

                .search-input-group {
                    position: relative;
                }

                .search-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-input {
                    padding: 1.2rem 3.5rem 1.2rem 1.5rem;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                }

                .search-button {
                    position: absolute;
                    right: 0.5rem;
                    background: linear-gradient(135deg, #4a7c59, #74a062);
                    border: none;
                    color: white;
                    padding: 0.8rem 1.2rem;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .search-button:hover {
                    background: linear-gradient(135deg, #3d6b4a, #5d8a4f);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
                }

                .agriculture-decorations {
                    display: flex;
                    justify-content: center;
                    gap: 2rem;
                    margin-top: 2rem;
                    position: relative;
                    z-index: 2;
                }

                .decoration-item {
                    font-size: 2rem;
                    color: rgba(255, 255, 255, 0.6);
                    animation: float 3s ease-in-out infinite;
                }

                .decoration-item:nth-child(2) {
                    animation-delay: 1s;
                }

                .decoration-item:nth-child(3) {
                    animation-delay: 2s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .results-section {
                    padding: 3rem 0;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%);
                    min-height: 60vh;
                }

                .loading-container {
                    text-align: center;
                    padding: 4rem;
                }

                .loading-spinner {
                    font-size: 3rem;
                    color: #4a7c59;
                    margin-bottom: 1rem;
                }

                .results-info {
                    background: white;
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    margin-bottom: 2rem;
                    border-left: 5px solid #4a7c59;
                }

                .search-result-card {
                    border: none;
                    border-radius: 15px;
                    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    transition: all 0.3s ease;
                    background: white;
                }

                .search-result-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
                }

                .card-image-container {
                    position: relative;
                    height: 220px;
                    overflow: hidden;
                }

                .card-image-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .search-result-card:hover .card-image-container img {
                    transform: scale(1.1);
                }

                .card-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(45, 90, 39, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .search-result-card:hover .card-overlay {
                    opacity: 1;
                }

                .card-category-badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(45, 90, 39, 0.9);
                    color: white;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .card-title-link {
                    color: #2d5a27;
                    text-decoration: none;
                    font-weight: 600;
                    line-height: 1.4;
                    font-size: 1.1rem;
                }

                .card-title-link:hover {
                    color: #4a7c59;
                }

                .card-meta {
                    display: flex;
                    gap: 1rem;
                    margin: 1rem 0;
                    font-size: 0.85rem;
                    color: #666;
                    flex-wrap: wrap;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .card-description {
                    color: #555;
                    font-size: 0.9rem;
                    line-height: 1.6;
                    margin: 1rem 0;
                }

                .card-tags {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    margin-top: 1rem;
                }

                .tag {
                    background: linear-gradient(135deg, #e8f5e8, #d4edda);
                    color: #2d5a27;
                    padding: 0.3rem 0.8rem;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    border: 1px solid #c3e6cb;
                }

                .no-results {
                    text-align: center;
                    padding: 4rem 2rem;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .no-results-icon {
                    font-size: 4rem;
                    color: #4a7c59;
                    margin-bottom: 1rem;
                }

                .suggestions {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid #e9ecef;
                }

                .suggestion-tags {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-top: 1rem;
                }

                .suggestion-tag {
                    background: linear-gradient(135deg, #4a7c59, #74a062);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .suggestion-tag:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(74, 124, 89, 0.3);
                }

                mark {
                    background-color: #ffeb3b;
                    padding: 0 2px;
                    border-radius: 2px;
                }

                @media (max-width: 768px) {
                    .search-title {
                        font-size: 2rem;
                    }

                    .search-icon {
                        font-size: 3rem;
                    }

                    .card-meta {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .agriculture-decorations {
                        gap: 1rem;
                    }

                    .decoration-item {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default Search;
