// import React, { useState, useEffect } from "react";
// import Header from "../partials/Header";
// import Footer from "../partials/Footer";
// import { Link, useNavigate } from "react-router-dom";

// import apiInstance from "../../utils/axios";
// import useUserData from "../../plugin/useUserData";
// import moment from "moment";
// import Swal from "sweetalert2";
// import Toast from "../../plugin/Toast";

// function Posts() {
//     const [posts, setPosts] = useState([]);
//     const [filteredPosts, setFilteredPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const userId = useUserData()?.user_id;
//     const navigate = useNavigate();

//     const fetchPosts = async () => {
//         try {
//             setLoading(true);
//             const post_res = await apiInstance.get(`author/dashboard/post-list/${userId}/`);
//             setPosts(post_res?.data);
//             setFilteredPosts(post_res?.data);
//         } catch (error) {
//             console.error("Error fetching posts:", error);
//             Toast.error("Failed to fetch posts");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//     }, []);

//     const handleSearch = (e) => {
//         const query = e.target.value.toLowerCase();
//         if (query === "") {
//             setFilteredPosts(posts);
//         } else {
//             const filtered = posts.filter((p) => {
//                 return p.title.toLowerCase().includes(query);
//             });
//             setFilteredPosts(filtered);
//         }
//     };

//     const handleSortChange = (e) => {
//         const sortValue = e.target.value;
//         let sortedPosts = [...filteredPosts];

//         if (sortValue === "Newest") {
//             sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
//         } else if (sortValue === "Oldest") {
//             sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
//         } else if (sortValue === "Active" || sortValue === "Draft" || sortValue === "Disabled") {
//             sortedPosts = posts.filter((post) => post.status === sortValue);
//         } else if (sortValue === "") {
//             setFilteredPosts(posts);
//             return;
//         }

//         setFilteredPosts(sortedPosts);
//     };

//     const handleDeletePost = async (postId) => {
//         try {
//             const result = await Swal.fire({
//                 title: 'Are you sure?',
//                 text: "You won't be able to revert this!",
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: 'Yes, delete it!'
//             });

//             if (result.isConfirmed) {
//                 await apiInstance.delete(`author/dashboard/post-detail/${userId}/${postId}/`);
//                 setFilteredPosts(filteredPosts.filter(post => post.id !== postId));
//                 setPosts(posts.filter(post => post.id !== postId));
                
//                 Swal.fire(
//                     'Deleted!',
//                     'Your post has been deleted.',
//                     'success'
//                 );
//             }
//         } catch (error) {
//             console.error("Error deleting post:", error);
//             Toast.error("Failed to delete post");
//         }
//     };

//     const getStatusBadge = (status) => {
//         const statusConfig = {
//             'Active': { color: 'success', icon: 'fas fa-check-circle' },
//             'Draft': { color: 'warning', icon: 'fas fa-edit' },
//             'Disabled': { color: 'danger', icon: 'fas fa-ban' }
//         };
        
//         const config = statusConfig[status] || { color: 'secondary', icon: 'fas fa-question-circle' };
        
//         return (
//             <span className={`badge bg-${config.color} bg-opacity-10 text-${config.color} px-3 py-2`} 
//                   style={{ borderRadius: '20px', fontSize: '0.85rem' }}>
//                 <i className={`${config.icon} me-1`}></i>
//                 {status}
//             </span>
//         );
//     };

//     return (
//         <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
//             <Header />
//             <div className="flex-grow-1">
//                 <section className="py-5">
//                     <div className="container">
//                         <div className="row">
//                             <div className="col-12">
//                                 <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
//                                     <div className="card-header bg-white border-0 py-4" style={{ borderRadius: '16px 16px 0 0' }}>
//                                         <div className="d-flex justify-content-between align-items-center">
//                                             <div>
//                                                 <h2 className="mb-1" style={{ color: '#1B4332', fontWeight: '600' }}>
//                                                     <i className="fas fa-newspaper me-2" style={{ color: '#74C69D' }}></i>
//                                                     My Posts
//                                                 </h2>
//                                                 <p className="text-muted mb-0">Manage and organize all your blog posts</p>
//                                             </div>
//                                             <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
//                                                 <i className="fas fa-plus me-2"></i>
//                                                 Create New Post
//                                             </Link>
//                                         </div>
//                                     </div>
//                                     <div className="card-body p-4">
//                                         {/* Search and Filter Section */}
//                                         <div className="row g-3 mb-4">
//                                             <div className="col-md-8">
//                                                 <div className="position-relative">
//                                                     <input 
//                                                         onChange={handleSearch} 
//                                                         className="form-control border-0 shadow-sm" 
//                                                         type="search" 
//                                                         placeholder="Search your posts..." 
//                                                         aria-label="Search"
//                                                         style={{ 
//                                                             height: '45px',
//                                                             borderRadius: '25px',
//                                                             paddingLeft: '20px',
//                                                             paddingRight: '50px',
//                                                             backgroundColor: '#ffffff'
//                                                         }}
//                                                     />
//                                                     <button className="btn bg-transparent border-0 position-absolute top-50 end-0 translate-middle-y" 
//                                                             style={{ right: '15px', color: '#6c757d' }}>
//                                                         <i className="fas fa-search"></i>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <select 
//                                                     onChange={handleSortChange} 
//                                                     className="form-select border-0 shadow-sm" 
//                                                     aria-label="Sort posts"
//                                                     style={{ 
//                                                         height: '45px',
//                                                         borderRadius: '25px',
//                                                         backgroundColor: '#ffffff'
//                                                     }}
//                                                 >
//                                                     <option value="">Sort by</option>
//                                                     <option value="Newest">Newest First</option>
//                                                     <option value="Oldest">Oldest First</option>
//                                                     <option value="Active">Active Posts</option>
//                                                     <option value="Draft">Draft Posts</option>
//                                                     <option value="Disabled">Disabled Posts</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Posts Count */}
//                                         <div className="mb-4">
//                                             <div className="d-flex align-items-center">
//                                                 <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 me-2" 
//                                                       style={{ borderRadius: '20px' }}>
//                                                     {filteredPosts?.length} Posts
//                                                 </span>
//                                                 <span className="text-muted small">
//                                                     {posts.filter(p => p.status === 'Active').length} published, 
//                                                     {posts.filter(p => p.status === 'Draft').length} drafts
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         {/* Loading State */}
//                                         {loading ? (
//                                             <div className="text-center py-5">
//                                                 <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
//                                                     <span className="visually-hidden">Loading...</span>
//                                                 </div>
//                                                 <p className="mt-3 text-muted">Loading your posts...</p>
//                                             </div>
//                                         ) : filteredPosts?.length === 0 ? (
//                                             <div className="text-center py-5">
//                                                 <div className="mb-4">
//                                                     <i className="fas fa-newspaper fa-4x" style={{ color: '#74C69D', opacity: '0.5' }}></i>
//                                                 </div>
//                                                 <h4 style={{ color: '#1B4332', fontWeight: '600' }}>No Posts Found</h4>
//                                                 <p className="text-muted mb-4">Start creating your first blog post to get started!</p>
//                                                 <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
//                                                     <i className="fas fa-plus me-2"></i>
//                                                     Create Your First Post
//                                                 </Link>
//                                             </div>
//                                         ) : (
//                                             <div className="row g-4">
//                                                 {filteredPosts?.map((post) => (
//                                                     <div className="col-12" key={post.id}>
//                                                         <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', transition: 'transform 0.2s ease' }}
//                                                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                                                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
//                                                             <div className="card-body p-4">
//                                                                 <div className="row align-items-center">
//                                                                     {/* Post Image */}
//                                                                     <div className="col-md-2 col-4 mb-3 mb-md-0">
//                                                                         <Link to={`/detail/${post?.slug}/`}>
//                                                                             <img 
//                                                                                 src={post?.image} 
//                                                                                 style={{ 
//                                                                                     width: "100%", 
//                                                                                     height: "120px", 
//                                                                                     objectFit: "cover", 
//                                                                                     borderRadius: "12px" 
//                                                                                 }} 
//                                                                                 alt={post.title}
//                                                                                 onError={(e) => {
//                                                                                     e.target.onerror = null;
//                                                                                     e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' fill='%23f8f9fa'%3E%3Crect width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236c757d' font-family='Arial' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
//                                                                                 }}
//                                                                             />
//                                                                         </Link>
//                                                                     </div>
                                                                    
//                                                                     {/* Post Content */}
//                                                                     <div className="col-md-6 col-8 mb-3 mb-md-0">
//                                                                         <h5 className="mb-2">
//                                                                             <Link to={`/detail/${post?.slug}/`} 
//                                                                                   className="text-decoration-none" 
//                                                                                   style={{ color: '#1B4332', fontWeight: '600' }}>
//                                                                                 {post?.title}
//                                                                             </Link>
//                                                                         </h5>
//                                                                         <p className="text-muted mb-2 small" style={{ lineHeight: '1.4' }}>
//                                                                             {post?.description?.substring(0, 100)}...
//                                                                         </p>
//                                                                         <div className="d-flex align-items-center gap-3 mb-2">
//                                                                             <small className="text-muted">
//                                                                                 <i className="fas fa-eye me-1"></i>
//                                                                                 {post?.view || 0} views
//                                                                             </small>
//                                                                             <small className="text-muted">
//                                                                                 <i className="fas fa-calendar me-1"></i>
//                                                                                 {moment(post.date).format("MMM DD, YYYY")}
//                                                                             </small>
//                                                                             {post?.category && (
//                                                                                 <small className="text-muted">
//                                                                                     <i className="fas fa-tag me-1"></i>
//                                                                                     {post.category.title}
//                                                                                 </small>
//                                                                             )}
//                                                                         </div>
//                                                                         {getStatusBadge(post?.status)}
//                                                                     </div>
                                                                    
//                                                                     {/* Actions */}
//                                                                     <div className="col-md-4 text-md-end">
//                                                                         <div className="d-flex gap-2 justify-content-md-end">
//                                                                             <Link 
//                                                                                 to={`/edit-post/${post?.id}/`} 
//                                                                                 className="btn btn-outline-primary btn-sm px-3 py-2" 
//                                                                                 style={{ borderRadius: '20px' }}
//                                                                                 title="Edit Post"
//                                                                             >
//                                                                                 <i className="fas fa-edit me-1"></i>
//                                                                                 Edit
//                                                                             </Link>
//                                                                             <Link 
//                                                                                 to={`/${post?.slug}/`}  // Changed this line
//                                                                                 className="btn btn-outline-info btn-sm px-3 py-2" 
//                                                                                 style={{ borderRadius: '20px' }}
//                                                                                 title="View Post"
//                                                                                 >
//                                                                                 <i className="fas fa-external-link-alt me-1"></i>
//                                                                                 View
//                                                                             </Link>
//                                                                             <button 
//                                                                                 onClick={() => handleDeletePost(post.id)}
//                                                                                 className="btn btn-outline-danger btn-sm px-3 py-2" 
//                                                                                 style={{ borderRadius: '20px' }}
//                                                                                 title="Delete Post"
//                                                                             >
//                                                                                 <i className="fas fa-trash-alt me-1"></i>
//                                                                                 Delete
//                                                                             </button>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//             <Footer />
//         </div>
//     );
// // }

// export default Posts;
// import React, { useState, useEffect } from "react";
// import Header from "../partials/Header";
// import Footer from "../partials/Footer";
// import { Link, useNavigate } from "react-router-dom";
// import apiInstance from "../../utils/axios";
// import useUserData from "../../plugin/useUserData";
// import moment from "moment";
// import Swal from "sweetalert2";
// import Toast from "../../plugin/Toast";

// function Posts() {
//     const [posts, setPosts] = useState([]);
//     const [filteredPosts, setFilteredPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const userId = useUserData()?.user_id;
//     const navigate = useNavigate();

//     const fetchPosts = async () => {
//         try {
//             setLoading(true);
//             const post_res = await apiInstance.get(`author/dashboard/post-list/${userId}/`);
//             setPosts(post_res?.data);
//             setFilteredPosts(post_res?.data);
//         } catch (error) {
//             console.error("Error fetching posts:", error);
//             Toast.error("Failed to fetch posts");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//     }, []);

//     const handleSearch = (e) => {
//         const query = e.target.value.toLowerCase();
//         if (query === "") {
//             setFilteredPosts(posts);
//         } else {
//             const filtered = posts.filter((p) => {
//                 return p.title.toLowerCase().includes(query);
//             });
//             setFilteredPosts(filtered);
//         }
//     };

//     const handleSortChange = (e) => {
//         const sortValue = e.target.value;
//         let sortedPosts = [...filteredPosts];

//         if (sortValue === "Newest") {
//             sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
//         } else if (sortValue === "Oldest") {
//             sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
//         } else if (sortValue === "Active" || sortValue === "Draft" || sortValue === "Disabled") {
//             sortedPosts = posts.filter((post) => post.status === sortValue);
//         } else if (sortValue === "") {
//             setFilteredPosts(posts);
//             return;
//         }

//         setFilteredPosts(sortedPosts);
//     };

//     const handleDeletePost = async (postId) => {
//         try {
//             const result = await Swal.fire({
//                 title: 'Are you sure?',
//                 text: "You won't be able to revert this!",
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: 'Yes, delete it!'
//             });

//             if (result.isConfirmed) {
//                 await apiInstance.delete(`author/dashboard/post-detail/${userId}/${postId}/`);
//                 setFilteredPosts(filteredPosts.filter(post => post.id !== postId));
//                 setPosts(posts.filter(post => post.id !== postId));
                
//                 Swal.fire(
//                     'Deleted!',
//                     'Your post has been deleted.',
//                     'success'
//                 );
//             }
//         } catch (error) {
//             console.error("Error deleting post:", error);
//             Toast.error("Failed to delete post");
//         }
//     };

//     const getStatusBadge = (status) => {
//         const statusConfig = {
//             'Active': { color: 'success', icon: 'fas fa-check-circle' },
//             'Draft': { color: 'warning', icon: 'fas fa-edit' },
//             'Disabled': { color: 'danger', icon: 'fas fa-ban' }
//         };
        
//         const config = statusConfig[status] || { color: 'secondary', icon: 'fas fa-question-circle' };
        
//         return (
//             <span className={`badge bg-${config.color} bg-opacity-10 text-${config.color} px-3 py-2`} 
//                   style={{ borderRadius: '20px', fontSize: '0.85rem' }}>
//                 <i className={`${config.icon} me-1`}></i>
//                 {status}
//             </span>
//         );
//     };

//     return (
//         <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
//             <Header />
//             <div className="flex-grow-1">
//                 <section className="py-5">
//                     <div className="container">
//                         <div className="row">
//                             <div className="col-12">
//                                 <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
//                                     <div className="card-header bg-white border-0 py-4" style={{ borderRadius: '16px 16px 0 0' }}>
//                                         <div className="d-flex justify-content-between align-items-center">
//                                             <div>
//                                                 <h2 className="mb-1" style={{ color: '#1B4332', fontWeight: '600' }}>
//                                                     <i className="fas fa-newspaper me-2" style={{ color: '#74C69D' }}></i>
//                                                     My Posts
//                                                 </h2>
//                                                 <p className="text-muted mb-0">Manage and organize all your blog posts</p>
//                                             </div>
//                                             <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
//                                                 <i className="fas fa-plus me-2"></i>
//                                                 Create New Post
//                                             </Link>
//                                         </div>
//                                     </div>
//                                     <div className="card-body p-4">
//                                         {/* Search and Filter Section */}
//                                         <div className="row g-3 mb-4">
//                                             <div className="col-md-8">
//                                                 <div className="position-relative">
//                                                     <input 
//                                                         onChange={handleSearch} 
//                                                         className="form-control border-0 shadow-sm" 
//                                                         type="search" 
//                                                         placeholder="Search your posts..." 
//                                                         aria-label="Search"
//                                                         style={{ 
//                                                             height: '45px',
//                                                             borderRadius: '25px',
//                                                             paddingLeft: '20px',
//                                                             paddingRight: '50px',
//                                                             backgroundColor: '#ffffff'
//                                                         }}
//                                                     />
//                                                     <button className="btn bg-transparent border-0 position-absolute top-50 end-0 translate-middle-y" 
//                                                             style={{ right: '15px', color: '#6c757d' }}>
//                                                         <i className="fas fa-search"></i>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <select 
//                                                     onChange={handleSortChange} 
//                                                     className="form-select border-0 shadow-sm" 
//                                                     aria-label="Sort posts"
//                                                     style={{ 
//                                                         height: '45px',
//                                                         borderRadius: '25px',
//                                                         backgroundColor: '#ffffff'
//                                                     }}
//                                                 >
//                                                     <option value="">Sort by</option>
//                                                     <option value="Newest">Newest First</option>
//                                                     <option value="Oldest">Oldest First</option>
//                                                     <option value="Active">Active Posts</option>
//                                                     <option value="Draft">Draft Posts</option>
//                                                     <option value="Disabled">Disabled Posts</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Posts Count */}
//                                         <div className="mb-4">
//                                             <div className="d-flex align-items-center">
//                                                 <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 me-2" 
//                                                       style={{ borderRadius: '20px' }}>
//                                                     {filteredPosts?.length} Posts
//                                                 </span>
//                                                 <span className="text-muted small">
//                                                     {posts.filter(p => p.status === 'Active').length} published, 
//                                                     {posts.filter(p => p.status === 'Draft').length} drafts
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         {/* Loading State */}
//                                         {loading ? (
//                                             <div className="text-center py-5">
//                                                 <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
//                                                     <span className="visually-hidden">Loading...</span>
//                                                 </div>
//                                                 <p className="mt-3 text-muted">Loading your posts...</p>
//                                             </div>
//                                         ) : filteredPosts?.length === 0 ? (
//                                             <div className="text-center py-5">
//                                                 <div className="mb-4">
//                                                     <i className="fas fa-newspaper fa-4x" style={{ color: '#74C69D', opacity: '0.5' }}></i>
//                                                 </div>
//                                                 <h4 style={{ color: '#1B4332', fontWeight: '600' }}>No Posts Found</h4>
//                                                 <p className="text-muted mb-4">Start creating your first blog post to get started!</p>
//                                                 <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
//                                                     <i className="fas fa-plus me-2"></i>
//                                                     Create Your First Post
//                                                 </Link>
//                                             </div>
//                                         ) : (
//                                             <div className="row g-4">
//                                                 {filteredPosts?.map((post) => (
//                                                     <div className="col-12" key={post.id}>
//                                                         <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', transition: 'transform 0.2s ease' }}
//                                                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                                                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
//                                                             <div className="card-body p-4">
//                                                                 <div className="row align-items-center">
//                                                                     {/* Post Image */}
//                                                                     <div className="col-md-2 col-4 mb-3 mb-md-0">
//                                                                         {post.status === 'Draft' ? (
//                                                                             <img 
//                                                                                 src={post?.image} 
//                                                                                 style={{ 
//                                                                                     width: "100%", 
//                                                                                     height: "120px", 
//                                                                                     objectFit: "cover", 
//                                                                                     borderRadius: "12px" 
//                                                                                 }} 
//                                                                                 alt={post.title}
//                                                                                 onError={(e) => {
//                                                                                     e.target.onerror = null;
//                                                                                     e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' fill='%23f8f9fa'%3E%3Crect width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236c757d' font-family='Arial' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
//                                                                                 }}
//                                                                             />
//                                                                         ) : (
//                                                                             <Link to={`/detail/${post?.slug}/`}>
//                                                                                 <img 
//                                                                                     src={post?.image} 
//                                                                                     style={{ 
//                                                                                         width: "100%", 
//                                                                                         height: "120px", 
//                                                                                         objectFit: "cover", 
//                                                                                         borderRadius: "12px" 
//                                                                                     }} 
//                                                                                     alt={post.title}
//                                                                                     onError={(e) => {
//                                                                                         e.target.onerror = null;
//                                                                                         e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' fill='%23f8f9fa'%3E%3Crect width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236c757d' font-family='Arial' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
//                                                                                     }}
//                                                                                 />
//                                                                             </Link>
//                                                                         )}
//                                                                     </div>
                                                                    
//                                                                     {/* Post Content */}
//                                                                     <div className="col-md-6 col-8 mb-3 mb-md-0">
//                                                                         {post.status === 'Draft' ? (
//                                                                             <h5 className="mb-2" style={{ color: '#1B4332', fontWeight: '600' }}>
//                                                                                 {post?.title}
//                                                                             </h5>
//                                                                         ) : (
//                                                                             <h5 className="mb-2">
//                                                                                 <Link to={`/detail/${post?.slug}/`} 
//                                                                                       className="text-decoration-none" 
//                                                                                       style={{ color: '#1B4332', fontWeight: '600' }}>
//                                                                                     {post?.title}
//                                                                                 </Link>
//                                                                             </h5>
//                                                                         )}
//                                                                         <p className="text-muted mb-2 small" style={{ lineHeight: '1.4' }}>
//                                                                             {post?.description?.substring(0, 100)}...
//                                                                         </p>
//                                                                         <div className="d-flex align-items-center gap-3 mb-2">
//                                                                             <small className="text-muted">
//                                                                                 <i className="fas fa-eye me-1"></i>
//                                                                                 {post?.view || 0} views
//                                                                             </small>
//                                                                             <small className="text-muted">
//                                                                                 <i className="fas fa-calendar me-1"></i>
//                                                                                 {moment(post.date).format("MMM DD, YYYY")}
//                                                                             </small>
//                                                                             {post?.category && (
//                                                                                 <small className="text-muted">
//                                                                                     <i className="fas fa-tag me-1"></i>
//                                                                                     {post.category.title}
//                                                                                 </small>
//                                                                             )}
//                                                                         </div>
//                                                                         {getStatusBadge(post?.status)}
//                                                                     </div>
                                                                    
//                                                                     {/* Actions */}
//                                                                     <div className="col-md-4 text-md-end">
//                                                                         <div className="d-flex gap-2 justify-content-md-end">
//                                                                             <Link 
//                                                                                 to={`/edit-post/${post?.id}/`} 
//                                                                                 className="btn btn-outline-primary btn-sm px-3 py-2" 
//                                                                                 style={{ borderRadius: '20px' }}
//                                                                                 title="Edit Post"
//                                                                             >
//                                                                                 <i className="fas fa-edit me-1"></i>
//                                                                                 Edit
//                                                                             </Link>
//                                                                             {/* View button - disabled for draft posts */}
//                                                                             {post.status === 'Draft' ? (
//                                                                                 <button 
//                                                                                     className="btn btn-outline-secondary btn-sm px-3 py-2" 
//                                                                                     style={{ borderRadius: '20px' }}
//                                                                                     disabled
//                                                                                     title="Preview not available for draft posts"
//                                                                                 >
//                                                                                     <i className="fas fa-external-link-alt me-1"></i>
//                                                                                     View
//                                                                                 </button>
//                                                                             ) : (
//                                                                                 <Link 
//                                                                                     to={`/detail/${post?.slug}/`}
//                                                                                     className="btn btn-outline-info btn-sm px-3 py-2" 
//                                                                                     style={{ borderRadius: '20px' }}
//                                                                                     title="View Post"
//                                                                                 >
//                                                                                     <i className="fas fa-external-link-alt me-1"></i>
//                                                                                     View
//                                                                                 </Link>
//                                                                             )}
//                                                                             <button 
//                                                                                 onClick={() => handleDeletePost(post.id)}
//                                                                                 className="btn btn-outline-danger btn-sm px-3 py-2" 
//                                                                                 style={{ borderRadius: '20px' }}
//                                                                                 title="Delete Post"
//                                                                             >
//                                                                                 <i className="fas fa-trash-alt me-1"></i>
//                                                                                 Delete
//                                                                             </button>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// export default Posts;
// import React, { useState, useEffect } from "react";
// import Header from "../partials/Header";
// import Footer from "../partials/Footer";
// import { Link, useNavigate } from "react-router-dom";
// import apiInstance from "../../utils/axios";
// import useUserData from "../../plugin/useUserData";
// import moment from "moment";
// import Swal from "sweetalert2";
// import Toast from "../../plugin/Toast";

// function Posts() {
//     const [posts, setPosts] = useState([]);
//     const [filteredPosts, setFilteredPosts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const userId = useUserData()?.user_id;
//     const navigate = useNavigate();

//     const fetchPosts = async () => {
//         try {
//             setLoading(true);
//             const post_res = await apiInstance.get(`author/dashboard/post-list/${userId}/`);
//             setPosts(post_res?.data);
//             setFilteredPosts(post_res?.data);
//         } catch (error) {
//             console.error("Error fetching posts:", error);
//             Toast.error("Failed to fetch posts");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPosts();
//     }, []);

//     const handleSearch = (e) => {
//         const query = e.target.value.toLowerCase();
//         if (query === "") {
//             setFilteredPosts(posts);
//         } else {
//             const filtered = posts.filter((p) => {
//                 return p.title.toLowerCase().includes(query);
//             });
//             setFilteredPosts(filtered);
//         }
//     };

//     const handleSortChange = (e) => {
//         const sortValue = e.target.value;
//         let sortedPosts = [...filteredPosts];

//         if (sortValue === "Newest") {
//             sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
//         } else if (sortValue === "Oldest") {
//             sortedPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
//         } else if (sortValue === "Active" || sortValue === "Draft" || sortValue === "Disabled") {
//             sortedPosts = posts.filter((post) => post.status === sortValue);
//         } else if (sortValue === "") {
//             setFilteredPosts(posts);
//             return;
//         }

//         setFilteredPosts(sortedPosts);
//     };

//     const handleDeletePost = async (postId) => {
//         try {
//             const result = await Swal.fire({
//                 title: 'Are you sure?',
//                 text: "You won't be able to revert this!",
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: 'Yes, delete it!'
//             });

//             if (result.isConfirmed) {
//                 await apiInstance.delete(`author/dashboard/post-detail/${userId}/${postId}/`);
//                 setFilteredPosts(filteredPosts.filter(post => post.id !== postId));
//                 setPosts(posts.filter(post => post.id !== postId));
                
//                 Swal.fire(
//                     'Deleted!',
//                     'Your post has been deleted.',
//                     'success'
//                 );
//             }
//         } catch (error) {
//             console.error("Error deleting post:", error);
//             Toast.error("Failed to delete post");
//         }
//     };

//     const getStatusBadge = (status) => {
//         const statusConfig = {
//             'Active': { color: 'success', icon: 'fas fa-check-circle' },
//             'Draft': { color: 'warning', icon: 'fas fa-edit' },
//             'Disabled': { color: 'danger', icon: 'fas fa-ban' }
//         };
        
//         const config = statusConfig[status] || { color: 'secondary', icon: 'fas fa-question-circle' };
        
//         return (
//             <span className={`badge bg-${config.color} bg-opacity-10 text-${config.color} px-3 py-2`} 
//                   style={{ borderRadius: '20px', fontSize: '0.85rem' }}>
//                 <i className={`${config.icon} me-1`}></i>
//                 {status}
//             </span>
//         );
//     };

//     return (
//         <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
//             <Header />
//             <div className="flex-grow-1">
//                 <section className="py-5">
//                     <div className="container">
//                         <div className="row">
//                             <div className="col-12">
//                                 <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
//                                     <div className="card-header bg-white border-0 py-4" style={{ borderRadius: '16px 16px 0 0' }}>
//                                         <div className="d-flex justify-content-between align-items-center">
//                                             <div>
//                                                 <h2 className="mb-1" style={{ color: '#1B4332', fontWeight: '600' }}>
//                                                     <i className="fas fa-newspaper me-2" style={{ color: '#74C69D' }}></i>
//                                                     My Posts
//                                                 </h2>
//                                                 <p className="text-muted mb-0">Manage and organize all your blog posts</p>
//                                             </div>
//                                             <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
//                                                 <i className="fas fa-plus me-2"></i>
//                                                 Create New Post
//                                             </Link>
//                                         </div>
//                                     </div>
//                                     <div className="card-body p-4">
//                                         {/* Search and Filter Section */}
//                                         <div className="row g-3 mb-4">
//                                             <div className="col-md-8">
//                                                 <div className="position-relative">
//                                                     <input 
//                                                         onChange={handleSearch} 
//                                                         className="form-control border-0 shadow-sm" 
//                                                         type="search" 
//                                                         placeholder="Search your posts..." 
//                                                         aria-label="Search"
//                                                         style={{ 
//                                                             height: '45px',
//                                                             borderRadius: '25px',
//                                                             paddingLeft: '20px',
//                                                             paddingRight: '50px',
//                                                             backgroundColor: '#ffffff'
//                                                         }}
//                                                     />
//                                                     <button className="btn bg-transparent border-0 position-absolute top-50 end-0 translate-middle-y" 
//                                                             style={{ right: '15px', color: '#6c757d' }}>
//                                                         <i className="fas fa-search"></i>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-4">
//                                                 <select 
//                                                     onChange={handleSortChange} 
//                                                     className="form-select border-0 shadow-sm" 
//                                                     aria-label="Sort posts"
//                                                     style={{ 
//                                                         height: '45px',
//                                                         borderRadius: '25px',
//                                                         backgroundColor: '#ffffff'
//                                                     }}
//                                                 >
//                                                     <option value="">Sort by</option>
//                                                     <option value="Newest">Newest First</option>
//                                                     <option value="Oldest">Oldest First</option>
//                                                     <option value="Active">Active Posts</option>
//                                                     <option value="Draft">Draft Posts</option>
//                                                     <option value="Disabled">Disabled Posts</option>
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Posts Count */}
//                                         <div className="mb-4">
//                                             <div className="d-flex align-items-center">
//                                                 <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 me-2" 
//                                                       style={{ borderRadius: '20px' }}>
//                                                     {filteredPosts?.length} Posts
//                                                 </span>
//                                                 <span className="text-muted small">
//                                                     {posts.filter(p => p.status === 'Active').length} published, 
//                                                     {posts.filter(p => p.status === 'Draft').length} drafts
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         {/* Loading State */}
//                                         {loading ? (
//                                             <div className="text-center py-5">
//                                                 <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
//                                                     <span className="visually-hidden">Loading...</span>
//                                                 </div>
//                                                 <p className="mt-3 text-muted">Loading your posts...</p>
//                                             </div>
//                                         ) : filteredPosts?.length === 0 ? (
//                                             <div className="text-center py-5">
//                                                 <div className="mb-4">
//                                                     <i className="fas fa-newspaper fa-4x" style={{ color: '#74C69D', opacity: '0.5' }}></i>
//                                                 </div>
//                                                 <h4 style={{ color: '#1B4332', fontWeight: '600' }}>No Posts Found</h4>
//                                                 <p className="text-muted mb-4">Start creating your first blog post to get started!</p>
//                                                 <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
//                                                     <i className="fas fa-plus me-2"></i>
//                                                     Create Your First Post
//                                                 </Link>
//                                             </div>
//                                         ) : (
//                                             <div className="row g-4">
//                                                 {filteredPosts?.map((post) => (
//                                                     <div className="col-12" key={post.id}>
//                                                         <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', transition: 'transform 0.2s ease' }}
//                                                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                                                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
//                                                             <div className="card-body p-4">
//                                                                 <div className="row align-items-center">
//                                                                     {/* Post Image */}
//                                                                     <div className="col-md-2 col-4 mb-3 mb-md-0">
//                                                                         {post.status === 'Draft' ? (
//                                                                             <img 
//                                                                                 src={post?.image} 
//                                                                                 style={{ 
//                                                                                     width: "100%", 
//                                                                                     height: "120px", 
//                                                                                     objectFit: "cover", 
//                                                                                     borderRadius: "12px" 
//                                                                                 }} 
//                                                                                 alt={post.title}
//                                                                                 onError={(e) => {
//                                                                                     e.target.onerror = null;
//                                                                                     e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' fill='%23f8f9fa'%3E%3Crect width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236c757d' font-family='Arial' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
//                                                                                 }}
//                                                                             />
//                                                                         ) : (
//                                                                             <Link to={`author/dashboard/post-detail/${post?.slug}/`}>
//                                                                                 <img 
//                                                                                     src={post?.image} 
//                                                                                     style={{ 
//                                                                                         width: "100%", 
//                                                                                         height: "120px", 
//                                                                                         objectFit: "cover", 
//                                                                                         borderRadius: "12px" 
//                                                                                     }} 
//                                                                                     alt={post.title}
//                                                                                     onError={(e) => {
//                                                                                         e.target.onerror = null;
//                                                                                         e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' fill='%23f8f9fa'%3E%3Crect width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236c757d' font-family='Arial' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
//                                                                                     }}
//                                                                                 />
//                                                                             </Link>
//                                                                         )}
//                                                                     </div>
                                                                    
//                                                                     {/* Post Content */}
//                                                                     <div className="col-md-6 col-8 mb-3 mb-md-0">
//                                                                         {post.status === 'Draft' ? (
//                                                                             <h5 className="mb-2" style={{ color: '#1B4332', fontWeight: '600' }}>
//                                                                                 {post?.title}
//                                                                             </h5>
//                                                                         ) : (
//                                                                             <h5 className="mb-2">
//                                                                                 <Link to={`author/dashboard/post-detail/${post?.slug}/`} 
//                                                                                       className="text-decoration-none" 
//                                                                                       style={{ color: '#1B4332', fontWeight: '600' }}>
//                                                                                     {post?.title}
//                                                                                 </Link>
//                                                                             </h5>
//                                                                         )}
//                                                                         <p className="text-muted mb-2 small" style={{ lineHeight: '1.4' }}>
//                                                                             {post?.description?.substring(0, 100)}...
//                                                                         </p>
//                                                                         <div className="d-flex align-items-center gap-3 mb-2">
//                                                                             <small className="text-muted">
//                                                                                 <i className="fas fa-eye me-1"></i>
//                                                                                 {post?.view || 0} views
//                                                                             </small>
//                                                                             <small className="text-muted">
//                                                                                 <i className="fas fa-calendar me-1"></i>
//                                                                                 {moment(post.date).format("MMM DD, YYYY")}
//                                                                             </small>
//                                                                             {post?.category && (
//                                                                                 <small className="text-muted">
//                                                                                     <i className="fas fa-tag me-1"></i>
//                                                                                     {post.category.title}
//                                                                                 </small>
//                                                                             )}
//                                                                         </div>
//                                                                         {getStatusBadge(post?.status)}
//                                                                     </div>
                                                                    
//                                                                     {/* Actions */}
//                                                                     <div className="col-md-4 text-md-end">
//                                                                         <div className="d-flex gap-2 justify-content-md-end">
//                                                                             <Link 
//                                                                                 to={`/edit-post/${post?.id}/`} 
//                                                                                 className="btn btn-outline-primary btn-sm px-3 py-2" 
//                                                                                 style={{ borderRadius: '20px' }}
//                                                                                 title="Edit Post"
//                                                                             >
//                                                                                 <i className="fas fa-edit me-1"></i>
//                                                                                 Edit
//                                                                             </Link>
//                                                                             {/* View button - completely hidden for draft posts */}
//                                                                             {post.status !== 'Draft' && (
//                                                                                 <Link 
//                                                                                     to={`author/dashboard/post-detail/${post?.slug}/`}
//                                                                                     className="btn btn-outline-info btn-sm px-3 py-2" 
//                                                                                     style={{ borderRadius: '20px' }}
//                                                                                     title="View Post"
//                                                                                 >
//                                                                                     <i className="fas fa-external-link-alt me-1"></i>
//                                                                                     View
//                                                                                 </Link>
//                                                                             )}
//                                                                             <button 
//                                                                                 onClick={() => handleDeletePost(post.id)}
//                                                                                 className="btn btn-outline-danger btn-sm px-3 py-2" 
//                                                                                 style={{ borderRadius: '20px' }}
//                                                                                 title="Delete Post"
//                                                                             >
//                                                                                 <i className="fas fa-trash-alt me-1"></i>
//                                                                                 Delete
//                                                                             </button>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// export default Posts;
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
    const [loading, setLoading] = useState(true);
    const userId = useUserData()?.user_id;
    const navigate = useNavigate();

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const post_res = await apiInstance.get(`author/dashboard/post-list/${userId}/`);
            setPosts(post_res?.data);
            setFilteredPosts(post_res?.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
            Toast.error("Failed to fetch posts");
        } finally {
            setLoading(false);
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

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Active': { color: 'success', icon: 'fas fa-check-circle' },
            'Draft': { color: 'warning', icon: 'fas fa-edit' },
            'Disabled': { color: 'danger', icon: 'fas fa-ban' }
        };
        
        const config = statusConfig[status] || { color: 'secondary', icon: 'fas fa-question-circle' };
        
        return (
            <span className={`badge bg-${config.color} bg-opacity-10 text-${config.color} px-3 py-2`} 
                  style={{ borderRadius: '20px', fontSize: '0.85rem' }}>
                <i className={`${config.icon} me-1`}></i>
                {status}
            </span>
        );
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            <Header />
            <div className="flex-grow-1">
                <section className="py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
                                    <div className="card-header bg-white border-0 py-4" style={{ borderRadius: '16px 16px 0 0' }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h2 className="mb-1" style={{ color: '#1B4332', fontWeight: '600' }}>
                                                    <i className="fas fa-newspaper me-2" style={{ color: '#74C69D' }}></i>
                                                    My Posts
                                                </h2>
                                                <p className="text-muted mb-0">Manage and organize all your blog posts</p>
                                            </div>
                                            <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
                                                <i className="fas fa-plus me-2"></i>
                                                Create New Post
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        {/* Search and Filter Section */}
                                        <div className="row g-3 mb-4">
                                            <div className="col-md-8">
                                                <div className="position-relative">
                                                    <input 
                                                        onChange={handleSearch} 
                                                        className="form-control border-0 shadow-sm" 
                                                        type="search" 
                                                        placeholder="Search your posts..." 
                                                        aria-label="Search"
                                                        style={{ 
                                                            height: '45px',
                                                            borderRadius: '25px',
                                                            paddingLeft: '20px',
                                                            paddingRight: '50px',
                                                            backgroundColor: '#ffffff'
                                                        }}
                                                    />
                                                    <button className="btn bg-transparent border-0 position-absolute top-50 end-0 translate-middle-y" 
                                                            style={{ right: '15px', color: '#6c757d' }}>
                                                        <i className="fas fa-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <select 
                                                    onChange={handleSortChange} 
                                                    className="form-select border-0 shadow-sm" 
                                                    aria-label="Sort posts"
                                                    style={{ 
                                                        height: '45px',
                                                        borderRadius: '25px',
                                                        backgroundColor: '#ffffff'
                                                    }}
                                                >
                                                    <option value="">Sort by</option>
                                                    <option value="Newest">Newest First</option>
                                                    <option value="Oldest">Oldest First</option>
                                                    <option value="Active">Active Posts</option>
                                                    <option value="Draft">Draft Posts</option>
                                                    <option value="Disabled">Disabled Posts</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Posts Count */}
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center">
                                                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 me-2" 
                                                      style={{ borderRadius: '20px' }}>
                                                    {filteredPosts?.length} Posts
                                                </span>
                                                <span className="text-muted small">
                                                    {posts.filter(p => p.status === 'Active').length} published, 
                                                    {posts.filter(p => p.status === 'Draft').length} drafts
                                                </span>
                                            </div>
                                        </div>

                                        {/* Loading State */}
                                        {loading ? (
                                            <div className="text-center py-5">
                                                <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-3 text-muted">Loading your posts...</p>
                                            </div>
                                        ) : filteredPosts?.length === 0 ? (
                                            <div className="text-center py-5">
                                                <div className="mb-4">
                                                    <i className="fas fa-newspaper fa-4x" style={{ color: '#74C69D', opacity: '0.5' }}></i>
                                                </div>
                                                <h4 style={{ color: '#1B4332', fontWeight: '600' }}>No Posts Found</h4>
                                                <p className="text-muted mb-4">Start creating your first blog post to get started!</p>
                                                <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
                                                    <i className="fas fa-plus me-2"></i>
                                                    Create Your First Post
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="row g-4">
                                                {filteredPosts?.map((post) => (
                                                    <div className="col-12" key={post.id}>
                                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', transition: 'transform 0.2s ease' }}
                                                             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                                            <div className="card-body p-4">
                                                                <div className="row align-items-center">
                                                                    {/* Post Image */}
                                                                    <div className="col-md-2 col-4 mb-3 mb-md-0">
                                                                        {post.status === 'Draft' ? (
                                                                            <img 
                                                                                src={post?.image} 
                                                                                style={{ 
                                                                                    width: "100%", 
                                                                                    height: "120px", 
                                                                                    objectFit: "cover", 
                                                                                    borderRadius: "12px" 
                                                                                }} 
                                                                                alt={post.title}
                                                                                onError={(e) => {
                                                                                    e.target.onerror = null;
                                                                                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' fill='%23f8f9fa'%3E%3Crect width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236c757d' font-family='Arial' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <Link to={`/${post?.slug}/`}>
                                                                                <img 
                                                                                    src={post?.image} 
                                                                                    style={{ 
                                                                                        width: "100%", 
                                                                                        height: "120px", 
                                                                                        objectFit: "cover", 
                                                                                        borderRadius: "12px" 
                                                                                    }} 
                                                                                    alt={post.title}
                                                                                    onError={(e) => {
                                                                                        e.target.onerror = null;
                                                                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200' fill='%23f8f9fa'%3E%3Crect width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236c757d' font-family='Arial' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
                                                                                    }}
                                                                                />
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    {/* Post Content */}
                                                                    <div className="col-md-6 col-8 mb-3 mb-md-0">
                                                                        {post.status === 'Draft' ? (
                                                                            <h5 className="mb-2" style={{ color: '#1B4332', fontWeight: '600' }}>
                                                                                {post?.title}
                                                                            </h5>
                                                                        ) : (
                                                                            <h5 className="mb-2">
                                                                                <Link to={`/${post?.slug}/`} 
                                                                                      className="text-decoration-none" 
                                                                                      style={{ color: '#1B4332', fontWeight: '600' }}>
                                                                                    {post?.title}
                                                                                </Link>
                                                                            </h5>
                                                                        )}
                                                                        <p className="text-muted mb-2 small" style={{ lineHeight: '1.4' }}>
                                                                            {post?.description?.substring(0, 100)}...
                                                                        </p>
                                                                        <div className="d-flex align-items-center gap-3 mb-2">
                                                                            <small className="text-muted">
                                                                                <i className="fas fa-eye me-1"></i>
                                                                                {post?.view || 0} views
                                                                            </small>
                                                                            <small className="text-muted">
                                                                                <i className="fas fa-calendar me-1"></i>
                                                                                {moment(post.date).format("MMM DD, YYYY")}
                                                                            </small>
                                                                            {post?.category && (
                                                                                <small className="text-muted">
                                                                                    <i className="fas fa-tag me-1"></i>
                                                                                    {post.category.title}
                                                                                </small>
                                                                            )}
                                                                        </div>
                                                                        {getStatusBadge(post?.status)}
                                                                    </div>
                                                                    
                                                                    {/* Actions */}
                                                                    <div className="col-md-4 text-md-end">
                                                                        <div className="d-flex gap-2 justify-content-md-end">
                                                                            <Link 
                                                                                to={`/edit-post/${post?.id}/`} 
                                                                                className="btn btn-outline-primary btn-sm px-3 py-2" 
                                                                                style={{ borderRadius: '20px' }}
                                                                                title="Edit Post"
                                                                            >
                                                                                <i className="fas fa-edit me-1"></i>
                                                                                Edit
                                                                            </Link>
                                                                            {/* View button - completely hidden for draft posts */}
                                                                            {post.status !== 'Draft' && (
                                                                                <Link 
                                                                                    to={`/${post?.slug}/`}
                                                                                    className="btn btn-outline-info btn-sm px-3 py-2" 
                                                                                    style={{ borderRadius: '20px' }}
                                                                                    title="View Post"
                                                                                >
                                                                                    <i className="fas fa-external-link-alt me-1"></i>
                                                                                    View
                                                                                </Link>
                                                                            )}
                                                                            <button 
                                                                                onClick={() => handleDeletePost(post.id)}
                                                                                className="btn btn-outline-danger btn-sm px-3 py-2" 
                                                                                style={{ borderRadius: '20px' }}
                                                                                title="Delete Post"
                                                                            >
                                                                                <i className="fas fa-trash-alt me-1"></i>
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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