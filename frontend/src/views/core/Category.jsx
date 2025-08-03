import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import Moment from "../../plugin/Moment";
import apiInstance from "../../utils/axios";
import { useLanguage } from "../../contexts/LanguageContext";

function Category() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categorySearchQuery, setCategorySearchQuery] = useState("");
    const [postSearchQuery, setPostSearchQuery] = useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await apiInstance.get('post/category/list/');
            setCategories(response.data);
            setFilteredCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryPosts = async (categorySlug) => {
        try {
            setLoading(true);
            const response = await apiInstance.get(`post/category/posts/${categorySlug}/`);
            setPosts(response.data);
            setFilteredPosts(response.data);
        } catch (error) {
            console.error("Error fetching category posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        setPostSearchQuery(""); // Clear post search when category changes
        await fetchCategoryPosts(category.slug);
        // Update URL
        navigate(`/category/${category.slug}`);
    };

    const handleCategorySearch = (e) => {
        const query = e.target.value;
        setCategorySearchQuery(query);
        
        if (!query.trim()) {
            setFilteredCategories(categories);
        } else {
            const filtered = categories.filter(category =>
                category.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    };

    const handlePostSearch = (e) => {
        const query = e.target.value;
        setPostSearchQuery(query);
        
        if (!query.trim()) {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.description.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    };

    const clearCategorySearch = () => {
        setCategorySearchQuery("");
        setFilteredCategories(categories);
    };

    const clearPostSearch = () => {
        setPostSearchQuery("");
        setFilteredPosts(posts);
    };

    // Initialize from URL params
    useEffect(() => {
        fetchCategories();
        if (slug) {
            const category = categories.find(cat => cat.slug === slug);
            if (category) {
                setSelectedCategory(category);
                fetchCategoryPosts(slug);
            }
        }
    }, [slug]);

    // Update filtered posts when posts change
    useEffect(() => {
        setFilteredPosts(posts);
    }, [posts]);

    // Update filtered categories when categories change
    useEffect(() => {
        setFilteredCategories(categories);
    }, [categories]);

    if (loading) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">{t('loading')}</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container my-5">
                    <div className="row">
                        {/* Categories Section */}
                        <div className="col-lg-4 mb-4">
                            <div className="card shadow-sm border-0" style={{ backgroundColor: '#ffffff' }}>
                                <div className="card-header text-white" style={{ backgroundColor: '#28a745', borderBottom: 'none' }}>
                                    <h5 className="mb-0">
                                        <i className="fas fa-tags me-2"></i>
                                        {t('categories')}
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {/* Category Search */}
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={t('searchCategories')}
                                                value={categorySearchQuery}
                                                onChange={handleCategorySearch}
                                                style={{ borderColor: '#dee2e6' }}
                                            />
                                            {categorySearchQuery && (
                                                <button
                                                    className="btn"
                                                    type="button"
                                                    onClick={clearCategorySearch}
                                                    style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: 'white' }}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Categories List */}
                                    <div className="list-group list-group-flush">
                                        {filteredCategories.map((category) => (
                                            <button
                                                key={category.id}
                                                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 ${
                                                    selectedCategory?.id === category.id ? 'active' : ''
                                                }`}
                                                onClick={() => handleCategoryClick(category)}
                                                style={{
                                                    backgroundColor: selectedCategory?.id === category.id ? '#e8f5e8' : 'transparent',
                                                    color: selectedCategory?.id === category.id ? '#155724' : '#495057',
                                                    borderLeft: selectedCategory?.id === category.id ? '4px solid #28a745' : 'none'
                                                }}
                                            >
                                                <div>
                                                    <h6 className="mb-1" style={{ fontWeight: selectedCategory?.id === category.id ? '600' : '400' }}>
                                                        {category.title}
                                                    </h6>
                                                    <small style={{ color: selectedCategory?.id === category.id ? '#155724' : '#6c757d' }}>
                                                        {category.post_count || 0} {t('posts')}
                                                    </small>
                                                </div>
                                                <span className="badge rounded-pill" style={{ 
                                                    backgroundColor: selectedCategory?.id === category.id ? '#28a745' : '#6c757d',
                                                    color: 'white'
                                                }}>
                                                    {category.post_count || 0}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Posts Section */}
                        <div className="col-lg-8">
                            {selectedCategory ? (
                                <div>
                                    {/* Category Header */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <h2 className="mb-1" style={{ color: '#2c3e50' }}>
                                                <i className="fas fa-folder me-2" style={{ color: '#28a745' }}></i>
                                                {selectedCategory.title}
                                            </h2>
                                            <p className="text-muted mb-0">
                                                {posts.length} {t('posts')} {t('found')}
                                            </p>
                                        </div>
                                        <button
                                            className="btn"
                                            onClick={() => {
                                                setSelectedCategory(null);
                                                setPosts([]);
                                                setFilteredPosts([]);
                                                setPostSearchQuery("");
                                                navigate('/category');
                                            }}
                                            style={{ 
                                                backgroundColor: '#6c757d', 
                                                borderColor: '#6c757d', 
                                                color: 'white' 
                                            }}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            {t('backToCategories')}
                                        </button>
                                    </div>

                                    {/* Post Search */}
                                    <div className="card mb-4 border-0 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
                                        <div className="card-body">
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder={t('searchPostsInCategory')}
                                                    value={postSearchQuery}
                                                    onChange={handlePostSearch}
                                                    style={{ borderColor: '#dee2e6' }}
                                                />
                                                {postSearchQuery && (
                                                    <button
                                                        className="btn"
                                                        type="button"
                                                        onClick={clearPostSearch}
                                                        style={{ backgroundColor: '#6c757d', borderColor: '#6c757d', color: 'white' }}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Posts Grid */}
                                    {filteredPosts.length > 0 ? (
                                        <div className="row g-4">
                                            {filteredPosts.map((post) => (
                                                <div className="col-md-6 col-lg-4" key={post.id}>
                                                    <div className="card h-100 border-0 shadow-sm" style={{ 
                                                        backgroundColor: '#ffffff',
                                                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
                                                    }}
                                                    >
                                                        <div className="position-relative">
                                                            <img 
                                                                className="card-img-top" 
                                                                style={{ 
                                                                    width: "100%", 
                                                                    height: "200px", 
                                                                    objectFit: "cover"
                                                                }} 
                                                                src={post.image} 
                                                                alt={post.title} 
                                                            />
                                                            <div className="position-absolute top-0 end-0 m-2">
                                                                <span className="badge" style={{ backgroundColor: '#28a745', color: 'white' }}>
                                                                    {post.category?.title}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="card-body d-flex flex-column">
                                                            <h5 className="card-title">
                                                                <Link 
                                                                    to={`/${post.slug}`} 
                                                                    className="text-decoration-none stretched-link"
                                                                    style={{ color: '#2c3e50' }}
                                                                >
                                                                    {post.title}
                                                                </Link>
                                                            </h5>
                                                            <p className="card-text small" style={{ color: '#6c757d' }}>
                                                                {post.description?.substring(0, 100)}...
                                                            </p>
                                                            <div className="mt-auto">
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <i className="fas fa-user me-2" style={{ color: '#28a745' }}></i>
                                                                    <small style={{ color: '#6c757d' }}>
                                                                        {post.user_profile?.full_name || post.user_profile?.username}
                                                                    </small>
                                                                </div>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <i className="fas fa-calendar me-2" style={{ color: '#28a745' }}></i>
                                                                    <small style={{ color: '#6c757d' }}>
                                                                        <Moment date={post.date} />
                                                                    </small>
                                                                </div>
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <div className="d-flex align-items-center">
                                                                        <i className="fas fa-heart me-1" style={{ color: '#dc3545' }}></i>
                                                                        <small style={{ color: '#6c757d' }}>{post.likes_count || 0}</small>
                                                                    </div>
                                                                    <div className="d-flex align-items-center">
                                                                        <i className="fas fa-eye me-1" style={{ color: '#28a745' }}></i>
                                                                        <small style={{ color: '#6c757d' }}>{post.view || 0}</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fas fa-search fa-3x mb-3" style={{ color: '#6c757d' }}></i>
                                            <h5 style={{ color: '#2c3e50' }}>{postSearchQuery ? t('noPostsFound') : t('noPostsInCategory')}</h5>
                                            <p style={{ color: '#6c757d' }}>
                                                {postSearchQuery ? t('tryAdjustingSearch') : t('selectAnotherCategory')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <i className="fas fa-folder-open fa-3x mb-3" style={{ color: '#6c757d' }}></i>
                                    <h5 style={{ color: '#2c3e50' }}>{t('selectCategory')}</h5>
                                    <p style={{ color: '#6c757d' }}>{t('selectCategoryToViewPosts')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Category;
