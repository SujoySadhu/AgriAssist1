import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import Moment from "../../plugin/Moment";
import apiInstance from "../../utils/axios";

function Category() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("all"); // "all", "categories", "posts"

    // Pagination state for categories
    const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);
    const categoryItemsPerPage = 8;
    const categoryIndexOfLastItem = categoryCurrentPage * categoryItemsPerPage;
    const categoryIndexOfFirstItem = categoryIndexOfLastItem - categoryItemsPerPage;
    const filteredCategories = categories?.filter(category =>
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const currentCategories = filteredCategories?.slice(categoryIndexOfFirstItem, categoryIndexOfLastItem);
    const categoryTotalPages = Math.ceil((filteredCategories?.length || 0) / categoryItemsPerPage);

    // Pagination state for posts
    const [postCurrentPage, setPostCurrentPage] = useState(1);
    const postItemsPerPage = 12;
    const postIndexOfLastItem = postCurrentPage * postItemsPerPage;
    const postIndexOfFirstItem = postIndexOfLastItem - postItemsPerPage;
    const currentPosts = posts?.slice(postIndexOfFirstItem, postIndexOfLastItem);
    const postTotalPages = Math.ceil(posts?.length / postItemsPerPage);
    const postPageNumbers = Array.from({ length: postTotalPages }, (_, index) => index + 1);

    // Filter categories and posts based on search query
    const filteredPosts = posts?.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await apiInstance.get('post/category/list/');
            setCategories(response.data);
            
            // If there's a slug in the URL, select that category
            if (slug) {
                const category = response.data.find(cat => cat.slug === slug);
                if (category) {
                    setSelectedCategory(category);
                    await fetchCategoryPosts(category.slug);
                }
            }
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
            setPostCurrentPage(1); // Reset post pagination when category changes
        } catch (error) {
            console.error("Error fetching category posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = async (category) => {
        setSelectedCategory(category);
        setPostCurrentPage(1); // Reset post pagination
        navigate(`/category/${category.slug}`);
        await fetchCategoryPosts(category.slug);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCategoryCurrentPage(1);
        setPostCurrentPage(1);
    };

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setCategoryCurrentPage(1);
        setPostCurrentPage(1);
    };

    useEffect(() => {
        fetchCategories();
    }, [slug]);

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container py-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            
            {/* Search Section */}
            <section className="py-4 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search categories and posts..."
                                            value={searchQuery}
                                            onChange={handleSearch}
                                        />
                                        <button className="btn btn-primary" type="button">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                    <div className="btn-group w-100">
                                        <button
                                            className={`btn ${searchType === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => handleSearchTypeChange('all')}
                                        >
                                            All
                                        </button>
                                        <button
                                            className={`btn ${searchType === 'categories' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => handleSearchTypeChange('categories')}
                                        >
                                            Categories
                                        </button>
                                        <button
                                            className={`btn ${searchType === 'posts' ? 'btn-primary' : 'btn-outline-primary'}`}
                                            onClick={() => handleSearchTypeChange('posts')}
                                        >
                                            Posts
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex-grow-1">
                {/* Categories Section */}
                {(searchType === 'all' || searchType === 'categories') && (
                    <>
                        <section className="py-5">
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h2 className="text-start d-block mb-4">
                                            <i className="bi bi-grid-fill me-2"></i>
                                            Categories {searchQuery && `- Search Results for "${searchQuery}"`}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="pb-5">
                            <div className="container">
                                <div className="row g-3">
                                    {currentCategories?.map((category) => (
                                        <div className="col-sm-6 col-lg-3" key={category.id}>
                                            <div 
                                                className={`card h-100 shadow-sm hover-shadow cursor-pointer ${selectedCategory?.id === category.id ? 'border-primary' : ''}`}
                                                onClick={() => handleCategoryClick(category)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="card-fold position-relative">
                                                    <img 
                                                        className="card-img" 
                                                        style={{ 
                                                            width: "100%", 
                                                            height: "150px", 
                                                            objectFit: "cover",
                                                            borderTopLeftRadius: "8px",
                                                            borderTopRightRadius: "8px"
                                                        }} 
                                                        src={category.image || ""} 
                                                        alt={category.title} 
                                                    />
                                                </div>
                                                <div className="card-body px-3 pt-2 pb-2">
                                                    <h4 className="card-title h6 mb-2">
                                                        {category.title}
                                                    </h4>
                                                    <div className="d-flex align-items-center">
                                                        <i className="fas fa-file-alt me-2"></i>
                                                        <span className="text-muted small">{category.post_count} Articles</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Categories Pagination - Only show if there are more than 8 categories */}
                                {filteredCategories?.length > categoryItemsPerPage && (
                                    <nav className="d-flex mt-4">
                                        <ul className="pagination">
                                            <li className={`page-item ${categoryCurrentPage === 1 ? "disabled" : ""}`}>
                                                <button 
                                                    className="page-link text-dark fw-bold me-1 rounded" 
                                                    onClick={() => setCategoryCurrentPage(categoryCurrentPage - 1)}
                                                >
                                                    <i className="fas fa-arrow-left me-2" />
                                                    Previous
                                                </button>
                                            </li>
                                        </ul>
                                        <ul className="pagination">
                                            {Array.from({ length: categoryTotalPages }, (_, index) => index + 1).map((number) => (
                                                <li 
                                                    key={number} 
                                                    className={`page-item ${categoryCurrentPage === number ? "active" : ""}`}
                                                >
                                                    <button 
                                                        className="page-link text-dark fw-bold rounded"
                                                        onClick={() => setCategoryCurrentPage(number)}
                                                    >
                                                        {number}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <ul className="pagination">
                                            <li className={`page-item ${categoryCurrentPage === categoryTotalPages ? "disabled" : ""}`}>
                                                <button 
                                                    className="page-link text-dark fw-bold ms-1 rounded"
                                                    onClick={() => setCategoryCurrentPage(categoryCurrentPage + 1)}
                                                >
                                                    Next
                                                    <i className="fas fa-arrow-right ms-3" />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        </section>
                    </>
                )}

                {/* Posts Section */}
                {(searchType === 'all' || searchType === 'posts') && selectedCategory && (
                    <>
                        <section className="py-5">
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h2 className="text-start d-block mb-4">
                                            <i className="bi bi-file-text me-2"></i>
                                            {selectedCategory.title} Posts {searchQuery && `- Search Results for "${searchQuery}"`}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="pb-5">
                            <div className="container">
                                <div className="row g-4">
                                    {filteredPosts?.map((post) => (
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
                                                            <span className="text-muted">{post?.view} Views</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Posts Pagination - Only show if there are more items than itemsPerPage */}
                                {postTotalPages > 1 && (
                                    <nav className="d-flex mt-4">
                                        <ul className="pagination">
                                            <li className={`page-item ${postCurrentPage === 1 ? "disabled" : ""}`}>
                                                <button 
                                                    className="page-link text-dark fw-bold me-1 rounded" 
                                                    onClick={() => setPostCurrentPage(postCurrentPage - 1)}
                                                >
                                                    <i className="fas fa-arrow-left me-2" />
                                                    Previous
                                                </button>
                                            </li>
                                        </ul>
                                        <ul className="pagination">
                                            {Array.from({ length: postTotalPages }, (_, index) => index + 1).map((number) => (
                                                <li 
                                                    key={number} 
                                                    className={`page-item ${postCurrentPage === number ? "active" : ""}`}
                                                >
                                                    <button 
                                                        className="page-link text-dark fw-bold rounded"
                                                        onClick={() => setPostCurrentPage(number)}
                                                    >
                                                        {number}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <ul className="pagination">
                                            <li className={`page-item ${postCurrentPage === postTotalPages ? "disabled" : ""}`}>
                                                <button 
                                                    className="page-link text-dark fw-bold ms-1 rounded"
                                                    onClick={() => setPostCurrentPage(postCurrentPage + 1)}
                                                >
                                                    Next
                                                    <i className="fas fa-arrow-right ms-3" />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Category;
