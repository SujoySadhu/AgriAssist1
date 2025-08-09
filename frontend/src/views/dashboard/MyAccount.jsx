import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import moment from "moment";
import Toast from "../../plugin/Toast";
import useAxios from "../../utils/useAxios";
//dashboard


function MyAccount() {
    const [stats, setStats] = useState({});
    const [posts, setPost] = useState([]);
    const [comments, setComment] = useState([]);
    const [noti, setNoti] = useState([]);
    const [showDocModal, setShowDocModal] = useState(false);
    const [docFile, setDocFile] = useState(null);
    const [docStatus, setDocStatus] = useState("");
    const [profileData, setProfileData] = useState(null);

    const userId = useUserData()?.user_id;
    const user = useUserData();
    const isSuperUser = user?.is_superuser;
    
    const axiosInstance = useAxios();

    const fetchDashboardData = async () => {
        try {
            const [stats_res, post_res, comment_res, noti_res, profile_res] = await Promise.all([
                apiInstance.get(`author/dashboard/stats/${userId}/`),
                apiInstance.get(`author/dashboard/post-list/${userId}/`),
                apiInstance.get(`author/dashboard/comment-list/`),
                apiInstance.get(`author/dashboard/noti-list/${userId}/`),
                apiInstance.get(`user/profile/${userId}/`)
            ]);

            setStats(stats_res.data[0] || {});
            setPost(post_res.data || []);
            setComment(comment_res.data || []);
            setNoti(noti_res.data || []);
            setProfileData(profile_res.data || null);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            Toast("error", "Failed to load dashboard data");
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleDocChange = (e) => {
        setDocFile(e.target.files[0]);
        setDocStatus("");
    };

    const handleProcessDoc = async () => {
        if (!docFile) {
            setDocStatus("Please select a Word document.");
            return;
        }
        
        setDocStatus("Processing...");
        const formData = new FormData();
        formData.append("documents", docFile);
        
        try {
            const res = await axiosInstance.post(
                "/chatbot/process-documents/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setDocStatus(res.data.message || "Document processed and saved to vector store!");
            setDocFile(null);
        } catch (err) {
            setDocStatus("Error processing document.");
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <div className="flex-grow-1">
                <section className="py-5">
                    <div className="container">
                        {/* User Profile Section */}
                        <div className="card mb-4 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={profileData?.image || `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}/media/default/default-user.jpg`}
                                        alt={profileData?.full_name || "User"} 
                                        className="rounded-circle me-4 border"
                                        style={{ 
                                            width: "100px", 
                                            height: "100px", 
                                            objectFit: "cover" 
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23CBD5E0'%3E%3Ccircle cx='50' cy='35' r='20'/%3E%3Cpath d='M20 85c0-16.6 13.4-30 30-30s30 13.4 30 30'/%3E%3C/svg%3E";
                                        }}
                                    />
                                    <div>
                                        <h3 className="mb-1 text-dark">{profileData?.full_name || user?.full_name}</h3>
                                        <p className="text-muted mb-1">
                                            <i className="fas fa-user me-2"></i>
                                            {user?.username}
                                        </p>
                                        <p className="text-muted mb-0">
                                            <i className="fas fa-envelope me-2"></i>
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isSuperUser && (
                            <div className="card mb-4 shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-shield-alt me-2"></i>
                                        Admin Options
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="card h-100 border-0 shadow-sm">
                                                <div className="card-body">
                                                    <h6 className="card-title text-primary">
                                                        <i className="fas fa-file-word me-2"></i>
                                                        Document Processing
                                                    </h6>
                                                    <p className="card-text small text-muted mb-3">
                                                        Upload and process Word documents for the chatbot knowledge base.
                                                    </p>
                                                    <button 
                                                        className="btn btn-outline-primary w-100" 
                                                        onClick={() => setShowDocModal(true)}
                                                    >
                                                        <i className="fas fa-upload me-2"></i>
                                                        Upload Document
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card h-100 border-0 shadow-sm">
                                                <div className="card-body">
                                                    <h6 className="card-title text-success">
                                                        <i className="fas fa-users me-2"></i>
                                                        User Management
                                                    </h6>
                                                    <p className="card-text small text-muted mb-3">
                                                        Manage user accounts, permissions, and roles.
                                                    </p>
                                                    <button 
                                                        className="btn btn-outline-success w-100"
                                                        onClick={() => Toast.info("User management feature coming soon!")}
                                                    >
                                                        <i className="fas fa-cog me-2"></i>
                                                        Manage Users
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="row g-4 mb-4">
                            {[
                                { 
                                    title: "Total Views", 
                                    value: stats?.views || 0, 
                                    icon: "bi bi-people-fill", 
                                    color: "success" 
                                },
                                { 
                                    title: "Posts", 
                                    value: stats?.posts || 0, 
                                    icon: "bi bi-file-earmark-text-fill", 
                                    color: "primary" 
                                },
                                { 
                                    title: "Likes", 
                                    value: stats?.likes || 0, 
                                    icon: "bi bi-suit-heart-fill", 
                                    color: "danger" 
                                },
                                { 
                                    title: "Bookmarks", 
                                    value: stats?.bookmarks || 0, 
                                    icon: "bi bi-tag", 
                                    color: "info" 
                                }
                            ].map((stat, index) => (
                                <div className="col-sm-6 col-lg-3" key={index}>
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <div className={`icon-xl fs-1 p-3 bg-${stat.color}-subtle rounded-3 text-${stat.color}`}>
                                                    <i className={stat.icon} />
                                                </div>
                                                <div className="ms-3">
                                                    <h3 className="mb-0">{stat.value}</h3>
                                                    <h6 className="mb-0 text-muted">{stat.title}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="row g-4">
                            {/* Latest Posts */}
                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-header bg-white border-bottom">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Latest Posts</h5>
                                            <Link to="/posts/" className="btn btn-sm btn-outline-primary">
                                                View All
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="list-group list-group-flush">
                                            {posts?.slice(0, 3)?.map((p, index) => (
                                                <div className="list-group-item border-0 px-0 py-3" key={index}>
                                                    <div className="d-flex">
                                                        <img 
                                                            src={p?.image} 
                                                            className="rounded me-3" 
                                                            style={{ 
                                                                width: "80px", 
                                                                height: "80px", 
                                                                objectFit: "cover" 
                                                            }} 
                                                            alt={p.title}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23f8f9fa'%3E%3Crect width='100' height='100'/%3E%3Ctext x='50%' y='50%' font-family='Arial' text-anchor='middle' dominant-baseline='middle' fill='%236c757d'%3ENo Image%3C/text%3E%3C/svg%3E";
                                                            }}
                                                        />
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-1">
                                                                <Link to={`/${p?.slug}/`} className="text-decoration-none text-dark">
                                                                    {p?.title}
                                                                </Link>
                                                            </h6>
                                                            <div className="d-flex flex-wrap gap-2 small text-muted">
                                                                <span>
                                                                    <i className="fas fa-calendar me-1"></i>
                                                                    {moment(p?.date).format("MMM D, YYYY")}
                                                                </span>
                                                                <span>
                                                                    <i className="fas fa-eye me-1"></i>
                                                                    {p?.view || 0} views
                                                                </span>
                                                                <span>
                                                                    <i className="fas fa-heart me-1 text-danger"></i>
                                                                    {p?.likes?.length || 0} likes
                                                                </span>
                                                            </div>
                                                            <div className="mt-2">
                                                                <span className={`badge bg-${p?.status === 'Active' ? 'success' : p?.status === 'Draft' ? 'warning' : 'secondary'}-subtle text-${p?.status === 'Active' ? 'success' : p?.status === 'Draft' ? 'warning' : 'secondary'}`}>
                                                                    {p?.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {posts?.length === 0 && (
                                                <div className="text-center py-4">
                                                    <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
                                                    <p className="text-muted">No posts found</p>
                                                    <Link to="/add-post/" className="btn btn-sm btn-primary">
                                                        Create Your First Post
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-header bg-white border-bottom">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Notifications ({noti?.length})</h5>
                                            <Link to="/notifications/" className="btn btn-sm btn-outline-primary">
                                                View All
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="list-group list-group-flush">
                                            {noti?.slice(0, 5)?.map((n, index) => (
                                                <div className="list-group-item border-0 px-0 py-3" key={index}>
                                                    <div className="d-flex align-items-start">
                                                        <div className={`icon-md rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center bg-${n.type === "Like" ? "primary" : n.type === "Comment" ? "success" : "danger"}-subtle text-${n.type === "Like" ? "primary" : n.type === "Comment" ? "success" : "danger"} me-3`}>
                                                            {n.type === "Like" && <i className="fas fa-thumbs-up fs-5" />}
                                                            {n.type === "Comment" && <i className="bi bi-chat-left-quote-fill fs-5" />}
                                                            {n.type === "Bookmark" && <i className="fas fa-bookmark fs-5" />}
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <h6 className="mb-1">{n.type}</h6>
                                                            <p className="mb-1 small">
                                                                {n.type === "Like" && `Someone liked your post "${n?.post?.title?.slice(0, 30)}..."`}
                                                                {n.type === "Comment" && `New comment on "${n?.post?.title?.slice(0, 30)}..."`}
                                                                {n.type === "Bookmark" && `Your post "${n?.post?.title?.slice(0, 30)}..." was bookmarked`}
                                                            </p>
                                                            <small className="text-muted">
                                                                <i className="fas fa-clock me-1"></i>
                                                                {moment(n.date).fromNow()}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {noti?.length === 0 && (
                                                <div className="text-center py-4">
                                                    <i className="fas fa-bell fa-3x text-muted mb-3"></i>
                                                    <p className="text-muted">No notifications yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Document Processing Modal */}
            {isSuperUser && showDocModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-file-word me-2 text-primary"></i>
                                    Process Word Document
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => { setShowDocModal(false); setDocFile(null); setDocStatus(""); }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Select Word Document</label>
                                    <input 
                                        type="file" 
                                        accept=".docx" 
                                        onChange={handleDocChange} 
                                        className="form-control" 
                                    />
                                </div>
                                {docStatus && (
                                    <div className={`alert ${docStatus.includes('Error') ? 'alert-danger' : 'alert-success'} mb-3`}>
                                        {docStatus}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => { setShowDocModal(false); setDocFile(null); setDocStatus(""); }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleProcessDoc}
                                    disabled={!docFile}
                                >
                                    <i className="fas fa-cog me-2"></i>
                                    Process Document
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default MyAccount;