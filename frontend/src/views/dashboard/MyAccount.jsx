import React,{ useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import moment from "moment";
import Toast from "../../plugin/Toast";
import useAxios from "../../utils/useAxios";
import Cookies from "js-cookie";

function MyAccount() {
    const [stats, setStats] = useState([]);
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
            const stats_res = await apiInstance.get(`author/dashboard/stats/${userId}/`);
            setStats(stats_res.data[0]);

            const post_res = await apiInstance.get(`author/dashboard/post-list/${userId}/`);
            setPost(post_res.data);

            const comment_res = await apiInstance.get(`author/dashboard/comment-list/`);
            setComment(comment_res.data);

            const noti_res = await apiInstance.get(`author/dashboard/noti-list/${userId}/`);
            setNoti(noti_res.data);

            // Fetch user profile data
            const profile_res = await apiInstance.get(`user/profile/${userId}/`);
            setProfileData(profile_res.data);
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
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1">
                <section className="py-4">
                    <div className="container">
                        {/* User Profile Section */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={profileData?.image || "default/default-user.jpg"} 
                                        alt={profileData?.full_name || "User"} 
                                        className="rounded-circle me-4"
                                        style={{ 
                                            width: "100px", 
                                            height: "100px", 
                                            objectFit: "cover" 
                                        }}
                                    />
                                    <div>
                                        <h3 className="mb-1">{profileData?.full_name || user?.full_name}</h3>
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
                            <div className="card mb-4">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-shield-alt me-2"></i>
                                        Admin Options
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="card h-100 border">
                                                <div className="card-body">
                                                    <h6 className="card-title">
                                                        <i className="fas fa-file-word me-2 text-primary"></i>
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
                                            <div className="card h-100 border">
                                                <div className="card-body">
                                                    <h6 className="card-title">
                                                        <i className="fas fa-users me-2 text-success"></i>
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

                        {isSuperUser && showDocModal && (
                            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
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

                        <div className="row g-4">
                            <div className="col-12">
                                <div className="row g-4">
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body border p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="icon-xl fs-1 p-3 bg-success bg-opacity-10 rounded-3 text-success">
                                                    <i className="bi bi-people-fill" />
                                                </div>
                                                <div className="ms-3">
                                                    <h3>{stats?.views||0}</h3>
                                                    <h6 className="mb-0">Total Views</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body border p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="icon-xl fs-1 p-3 bg-primary bg-opacity-10 rounded-3 text-primary">
                                                    <i className="bi bi-file-earmark-text-fill" />
                                                </div>
                                                <div className="ms-3">
                                                    <h3>{stats?.posts}</h3>
                                                    <h6 className="mb-0">Posts</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body border p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="icon-xl fs-1 p-3 bg-danger bg-opacity-10 rounded-3 text-danger">
                                                    <i className="bi bi-suit-heart-fill" />
                                                </div>
                                                <div className="ms-3">
                                                    <h3>{stats?.likes||0}</h3>
                                                    <h6 className="mb-0">Likes</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-3">
                                        <div className="card card-body border p-3">
                                            <div className="d-flex align-items-center">
                                                <div className="icon-xl fs-1 p-3 bg-info bg-opacity-10 rounded-3 text-info">
                                                    <i className="bi bi-tag" />
                                                </div>
                                                <div className="ms-3">
                                                    <h3>{stats?.bookmarks||0}</h3>
                                                    <h6 className="mb-0">Bookmarks</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 col-xxl-4">
                                <div className="card border h-100">
                                    <div className="card-header border-bottom d-flex justify-content-between align-items-center  p-3">
                                        <h5 className="card-header-title mb-0">Latest Posts</h5>
                                        <div className="dropdown text-end">
                                            <a href="#" className="btn border-0 p-0 mb-0" role="button" id="dropdownShare3" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bi bi-grid-fill text-danger fa-fw" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="card-body p-3">
                                        <div className="row">
                                            {posts?.slice(0,3)?.map((p, index) => (
                                                <>
                                                    <div className="col-12">
                                                        <div className="d-flex position-relative">
                                                            <img className="w-60 rounded" src={p?.image} style={{ width: "100px", height: "110px", objectFit: "cover", borderRadius: "10px" }} alt="product" />
                                                            <div className="ms-3">
                                                                <a href="#" className="h6 stretched-link text-decoration-none text-dark">
                                                                    {p?.title}
                                                                </a>
                                                                <p className="small mb-0 mt-3">
                                                                    <i className="fas fa-calendar me-2"></i>
                                                                    {moment(p?.date).format("DD MMM, YYYY")}
                                                                </p>
                                                                <p className="small mb-0">
                                                                    <i className="fas fa-eye me-2"></i>
                                                                    {p?.view} Views
                                                                </p>
                                                                <p className="small mb-0">
                                                                    <i className="fas fa-thumbs-up me-2"></i>
                                                                    {p?.likes?.length} Likes
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <hr className="my-3" />
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="card-footer border-top text-center p-3">
                                        <Link to="/posts/" className="fw-bold text-decoration-none text-dark">
                                            View all Posts
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xxl-4">
                                <div className="card border h-100">
                                    <div className="card-header border-bottom d-flex justify-content-between align-items-center  p-3">
                                        <h5 className="card-header-title mb-0">Notifications ({noti?.length})</h5>
                                        <div className="dropdown text-end">
                                            <a href="#" className="btn border-0 p-0 mb-0" role="button" id="dropdownShare3" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="bi bi-bell-fill text-primary fa-fw" />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="card-body p-3">
                                        <div className="custom-scrollbar h-350">
                                            <div className="row">
                                                {noti?.slice(0, 3)?.map((n, index) => (
                                                    <>
                                                        <div className="col-12">
                                                            <div className="d-flex justify-content-between position-relative">
                                                                <div className="d-sm-flex">
                                                                    <div className="icon-lg bg-opacity-15 rounded-2 flex-shrink-0">{n.type === "Like" && <i className="fas fa-thumbs-up text-primary fs-5" />}</div>
                                                                    <div className="icon-lg bg-opacity-15 rounded-2 flex-shrink-0">{n.type === "Comment" && <i className="bi bi-chat-left-quote-fill  text-success fs-5" />}</div>
                                                                    <div className="icon-lg bg-opacity-15 rounded-2 flex-shrink-0">{n.type === "Bookmark" && <i className="fas fa-bookmark text-danger fs-5" />}</div>
                                                                    <div className="ms-0 ms-sm-3 mt-2 mt-sm-0">
                                                                        <h6 className="mb-0">{n?.type}</h6>
                                                                        <p className="mb-0">
                                                                            {n.type === "Like" && (
                                                                                <p>
                                                                                    Someone liked your post <b>{n?.post?.title?.slice(0, 30) + "..."}</b>
                                                                                </p>
                                                                            )}
                                                                            {n.type === "Comment" && (
                                                                                <p>
                                                                                    You have a new comment on <b>{n?.post?.title?.slice(0, 30) + "..."}</b>
                                                                                </p>
                                                                            )}
                                                                            {n.type === "Bookmark" && (
                                                                                <p>
                                                                                    Someone bookmarked your post <b>{n?.post?.title?.slice(0, 30) + "..."}</b>
                                                                                </p>
                                                                            )}
                                                                        </p>
                                                                        <span className="small">{moment(n.date).format("DD MMM, YYYY")}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr className="my-3" />
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-footer border-top text-center p-3">
                                        <Link to="/notifications/" className="fw-bold text-decoration-none text-dark">
                                            View all Notifications
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="card border bg-transparent rounded-3">
                                    <div className="card-header bg-transparent border-bottom p-3">
                                        <div className="d-sm-flex justify-content-between align-items-center">
                                            <h5 className="mb-2 mb-sm-0">
                                                All Blog Posts <span className="badge bg-primary bg-opacity-10 text-primary">5</span>
                                            </h5>
                                            <Link to="/add-post/" className="btn btn-sm btn-primary mb-0">
                                                Add New <i className="fas fa-plus"></i>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3 align-items-center justify-content-between mb-3">
                                            <div className="col-md-8">
                                                <form className="rounded position-relative">
                                                    <input className="form-control pe-5 bg-transparent" type="search" placeholder="Search Articles" aria-label="Search" />
                                                    <button className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit">
                                                        <i className="fas fa-search fs-6 " />
                                                    </button>
                                                </form>
                                            </div>
                                            <div className="col-md-3">
                                                <form>
                                                    <select className="form-select z-index-9 bg-transparent" aria-label=".form-select-sm">
                                                        <option value="">Sort by</option>
                                                        <option>Newest</option>
                                                        <option>Oldest</option>
                                                        <option>------</option>
                                                        <option>Active</option>
                                                        <option>Draft</option>
                                                        <option>Disabled</option>
                                                    </select>
                                                </form>
                                            </div>
                                        </div>
                                        {/* Search and select END */}
                                        {/* Blog list table START */}
                                        <div className="table-responsive border-0">
                                            <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                                                {/* Table head */}
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th scope="col" className="border-0 rounded-start">
                                                            Article Name
                                                        </th>
                                                        <th scope="col" className="border-0">
                                                            Views
                                                        </th>
                                                        <th scope="col" className="border-0">
                                                            Published Date
                                                        </th>
                                                        <th scope="col" className="border-0">
                                                            Category
                                                        </th>
                                                        <th scope="col" className="border-0">
                                                            Status
                                                        </th>
                                                        <th scope="col" className="border-0 rounded-end">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="border-top-0">
                                                    {posts?.map((p, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <h6 className="mt-2 mt-md-0 mb-0 ">
                                                                    <a href="#" className="text-dark text-decoration-none">
                                                                        {p?.title}
                                                                    </a>
                                                                </h6>
                                                            </td>
                                                            <td>
                                                                <h6 className="mb-0">
                                                                    <a href="#" className="text-dark text-decoration-none">
                                                                        {p?.view} Views
                                                                    </a>
                                                                </h6>
                                                            </td>
                                                            <td>{moment(p.date).format("DD MMM, YYYY")}</td>
                                                            <td>{p?.category?.title}</td>
                                                            <td>
                                                                <span className="badge bg-dark bg-opacity-10 text-dark mb-2">{p?.status}</span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <a href="#" className="btn-round mb-0 btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
                                                                        <i className="bi bi-trash" />
                                                                    </a>
                                                                    <a href="dashboard-post-edit.html" className="btn btn-primary btn-round mb-0" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
                                                                        <i className="bi bi-pencil-square" />
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default MyAccount;
