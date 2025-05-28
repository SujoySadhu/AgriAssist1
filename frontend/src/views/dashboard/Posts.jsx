import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useNavigate } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import moment from "moment";
import Swal from "sweetalert2";
import Toast from "../../plugin/Toast";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const userId = useUserData()?.user_id;
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            const post_res = await apiInstance.get(`author/dashboard/post-list/${userId}/`);
            setPosts(post_res?.data);
            setFilteredPosts(post_res?.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            Toast.error("Failed to fetch posts");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        if (query === "") {
            setFilteredPosts(posts);
        } else {
            const filtered = posts.filter((p) => {
                return p.title.toLowerCase().includes(query);
            });
            setFilteredPosts(filtered);
        }
    };

    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        let sortedPosts = [...filteredPosts];

        if (sortValue === "Newest") {
            sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortValue === "Oldest") {
            sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortValue === "Active" || sortValue === "Draft" || sortValue === "Disabled") {
            sortedPosts = posts.filter((post) => post.status === sortValue);
        } else if (sortValue === "") {
            setFilteredPosts(posts);
            return;
        }

        setFilteredPosts(sortedPosts);
    };

    const handleDeletePost = async (postId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await apiInstance.delete(`author/dashboard/post-detail/${userId}/${postId}/`);
                setFilteredPosts(filteredPosts.filter(post => post.id !== postId));
                setPosts(posts.filter(post => post.id !== postId));
                
                Swal.fire(
                    'Deleted!',
                    'Your post has been deleted.',
                    'success'
                );
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            Toast.error("Failed to delete post");
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1">
                <section className="py-4">
                    <div className="container">
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="card border bg-transparent rounded-3">
                                    <div className="card-header bg-transparent border-bottom p-3">
                                        <div className="d-sm-flex justify-content-between align-items-center">
                                            <h5 className="mb-2 mb-sm-0">
                                                All Blog Posts <span className="badge bg-primary bg-opacity-10 text-primary">{filteredPosts?.length}</span>
                                            </h5>
                                            <Link to="/add-post/" className="btn btn-primary mb-0">
                                                <i className="fas fa-plus me-2"></i>Add New Post
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3 align-items-center justify-content-between mb-3">
                                            <div className="col-md-8">
                                                <form className="rounded position-relative">
                                                    <input 
                                                        onChange={handleSearch} 
                                                        className="form-control pe-5 bg-transparent" 
                                                        type="search" 
                                                        placeholder="Search Articles" 
                                                        aria-label="Search" 
                                                    />
                                                    <button className="btn bg-transparent border-0 px-2 py-0 position-absolute top-50 end-0 translate-middle-y" type="submit">
                                                        <i className="fas fa-search fs-6" />
                                                    </button>
                                                </form>
                                            </div>
                                            <div className="col-md-3">
                                                <select 
                                                    onChange={handleSortChange} 
                                                    className="form-select z-index-9 bg-transparent" 
                                                    aria-label=".form-select-sm"
                                                >
                                                    <option value="">Sort by</option>
                                                    <option value="Newest">Newest</option>
                                                    <option value="Oldest">Oldest</option>
                                                    <option value="Active">Active</option>
                                                    <option value="Draft">Draft</option>
                                                    <option value="Disabled">Disabled</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="table-responsive border-0">
                                            <table className="table align-middle p-4 mb-0 table-hover table-shrink">
                                                <thead className="table-dark">
                                                    <tr>
                                                        <th scope="col" className="border-0 rounded-start">Image</th>
                                                        <th scope="col" className="border-0">Title</th>
                                                        <th scope="col" className="border-0">Views</th>
                                                        <th scope="col" className="border-0">Published Date</th>
                                                        <th scope="col" className="border-0">Category</th>
                                                        <th scope="col" className="border-0">Status</th>
                                                        <th scope="col" className="border-0 rounded-end">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="border-top-0">
                                                    {filteredPosts?.map((post) => (
                                                        <tr key={post.id}>
                                                            <td>
                                                                <Link to={`/detail/${post?.slug}/`}>
                                                                    <img 
                                                                        src={post?.image} 
                                                                        style={{ 
                                                                            width: "100px", 
                                                                            height: "100px", 
                                                                            objectFit: "cover", 
                                                                            borderRadius: "10px" 
                                                                        }} 
                                                                        alt={post.title} 
                                                                    />
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <h6 className="mt-2 mt-md-0 mb-0">
                                                                    <Link to={`/detail/${post?.slug}/`} className="text-dark text-decoration-none">
                                                                        {post?.title}
                                                                    </Link>
                                                                </h6>
                                                            </td>
                                                            <td>
                                                                <h6 className="mb-0">
                                                                    <span className="text-dark">
                                                                        {post?.view} Views
                                                                    </span>
                                                                </h6>
                                                            </td>
                                                            <td>{moment(post.date).format("DD MMM, YYYY")}</td>
                                                            <td>{post?.category?.title}</td>
                                                            <td>
                                                                <span className={`badge ${
                                                                    post?.status === 'Active' ? 'bg-success' :
                                                                    post?.status === 'Draft' ? 'bg-warning' :
                                                                    'bg-danger'
                                                                } bg-opacity-10 text-dark mb-2`}>
                                                                    {post?.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex gap-2">
                                                                    <Link 
                                                                        to={`/edit-post/${post?.id}/`} 
                                                                        className="btn btn-primary btn-round mb-0" 
                                                                        data-bs-toggle="tooltip" 
                                                                        data-bs-placement="top" 
                                                                        title="Edit"
                                                                    >
                                                                        <i className="bi bi-pencil-square" />
                                                                    </Link>
                                                                    <button 
                                                                        onClick={() => handleDeletePost(post.id)}
                                                                        className="btn-round mb-0 btn btn-danger" 
                                                                        data-bs-toggle="tooltip" 
                                                                        data-bs-placement="top" 
                                                                        title="Delete"
                                                                    >
                                                                        <i className="bi bi-trash" />
                                                                    </button>
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

export default Posts;
