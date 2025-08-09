// import React, { useState, useEffect } from "react";
// import Header from "../partials/Header";
// import Footer from "../partials/Footer";
// import { Link } from "react-router-dom";

// import apiInstance from "../../utils/axios";
// import useUserData from "../../plugin/useUserData";
// import moment from "moment";
// import Moment from "../../plugin/Moment";
// import Toast from "../../plugin/Toast";

// function Comments() {
//      const [comments, setComments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const userId = useUserData()?.user_id;

//     const fetchComments = async () => {
//         try {
//             const response = await apiInstance.get(`author/dashboard/comment-list/?user_id=${userId}`);
//             setComments(response.data);
//             setLoading(false);
//         } catch (error) {
//             console.error(error);
//             setLoading(false);
//         }
//     };

//     const handleDeleteComment = async (commentId) => {
//         try {
//             await apiInstance.delete(`author/dashboard/comment/${commentId}/`);
//             setComments(comments.filter(comment => comment.id !== commentId));
//             Toast.success("Comment removed permanently");
//         } catch (error) {
//             console.error(error);
//             Toast.error("Failed to remove comment");
//         }
//     };

//     const handleClearAll = async () => {
//         try {
//             await apiInstance.post(`author/clear-comments/`);
//             setComments([]);
//             Toast.success("Comment history cleared");
//         } catch (error) {
//             console.error(error);
//             Toast.error("Failed to clear comment history");
//         }
//     };

//     const handleSubmitReply = async (commentId, replyText) => {
//         try {
//             await apiInstance.post(`author/dashboard/reply-comment/`, {
//                 comment_id: commentId,
//                 reply: replyText,
//             });
//             fetchComments();  // Refresh comments to show reply
//             Toast.success("Reply Sent");
//         } catch (error) {
//             console.log(error);
//             Toast.error("Failed to send reply");
//         }
//     };

//     // Helper function to get display name
//     const getDisplayName = (userProfile) => {
//         // Check if userProfile exists
//         if (!userProfile) {
//             return 'Anonymous User';
//         }
        
//         // Check for full_name first (from Profile model)
//         if (userProfile.full_name && userProfile.full_name.trim() !== '') {
//             return userProfile.full_name;
//         }
        
//         // Check if there's a nested user object with full_name
//         if (userProfile.user && userProfile.user.full_name && userProfile.user.full_name.trim() !== '') {
//             return userProfile.user.full_name;
//         }
        
//         // Fallback to username
//         if (userProfile.username) {
//             return userProfile.username;
//         }
        
//         // Check nested user object for username
//         if (userProfile.user && userProfile.user.username) {
//             return userProfile.user.username;
//         }
        
//         return 'Anonymous User';
//     };

//     useEffect(() => {
//         if (userId) {
//             fetchComments();
//         }
//     }, [userId]);

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
//                                                     <i className="fas fa-comments me-2" style={{ color: '#74C69D' }}></i>
//                                                     Comments
//                                                 </h2>
//                                                 <p className="text-muted mb-0">Manage and view all comments on your posts</p>
//                                             </div>
//                                             {comments.length > 0 && (
//                                                 <button 
//                                                     className="btn btn-outline-danger px-3 py-2"
//                                                     onClick={handleClearAll}
//                                                     style={{ borderRadius: '25px', fontSize: '0.9rem' }}
//                                                 >
//                                                     <i className="fas fa-trash-alt me-2"></i>
//                                                     Clear All
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <div className="card-body p-4">
//                                         {loading ? (
//                                             <div className="text-center py-5">
//                                                 <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
//                                                     <span className="visually-hidden">Loading...</span>
//                                                 </div>
//                                                 <p className="mt-3 text-muted">Loading comments...</p>
//                                             </div>
//                                         ) : comments.length === 0 ? (
//                                             <div className="text-center py-5">
//                                                 <div className="mb-4">
//                                                     <i className="fas fa-comments fa-4x" style={{ color: '#74C69D', opacity: '0.5' }}></i>
//                                                 </div>
//                                                 <h4 style={{ color: '#1B4332', fontWeight: '600' }}>No Comments Yet</h4>
//                                                 <p className="text-muted mb-4">You don't have any comments on your posts yet.</p>
//                                                 <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
//                                                     <i className="fas fa-plus me-2"></i>
//                                                     Create Your First Post
//                                                 </Link>
//                                             </div>
//                                         ) : (
//                                             <div className="row g-4">
//                                                 {comments.map((comment) => (
//                                                     <div className="col-12" key={comment.id}>
//                                                         <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', transition: 'transform 0.2s ease' }}
//                                                              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                                                              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
//                                                             <div className="card-body p-4">
//                                                                 <div className="d-flex justify-content-between align-items-start">
//                                                                     <div className="flex-grow-1">
//                                                                         <div className="d-flex align-items-center mb-3">
//                                                                             <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3"
//                                                                                  style={{ width: '45px', height: '45px' }}>
//                                                                                 <i className="fas fa-user text-white"></i>
//                                                                             </div>
//                                                                             <div>
//                                                                                 <h6 className="mb-1" style={{ color: '#1B4332', fontWeight: '600' }}>
//                                                                                     {getDisplayName(comment.user_profile)}
//                                                                                 </h6>
//                                                                                 <small className="text-muted">
//                                                                                     <i className="fas fa-clock me-1"></i>
//                                                                                     <Moment date={comment.date} />
//                                                                                 </small>
//                                                                             </div>
//                                                                         </div>
//                                                                         <div className="ps-5">
//                                                                             <p className="mb-0" style={{ color: '#495057', lineHeight: '1.6' }}>
//                                                                                 {comment.comment}
//                                                                             </p>
//                                                                         </div>
//                                                                         {comment.post && (
//                                                                             <div className="mt-3 ps-5">
//                                                                                 <small className="text-muted">
//                                                                                     <i className="fas fa-file-alt me-1"></i>
//                                                                                     Comment on: 
//                                                                                     <Link to={`/${comment.post.slug}`} className="text-decoration-none ms-1" style={{ color: '#74C69D' }}>
//                                                                                         {comment.post.title}
//                                                                                     </Link>
//                                                                                 </small>
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//                                                                     <button 
//                                                                         className="btn btn-outline-danger btn-sm ms-3"
//                                                                         onClick={() => handleDeleteComment(comment.id)}
//                                                                         style={{ borderRadius: '20px', padding: '8px 12px' }}
//                                                                         title="Delete Comment"
//                                                                     >
//                                                                         <i className="fas fa-trash-alt"></i>
//                                                                     </button>
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

// export default Comments;
import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";

function Comments() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyTexts, setReplyTexts] = useState({});
    const userId = useUserData()?.user_id;

    const fetchComments = async () => {
        try {
            const response = await apiInstance.get(`author/dashboard/comment-list/?user_id=${userId}`);
            setComments(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            Toast.error("Failed to load comments");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await apiInstance.delete(`comment/${commentId}/`);
            setComments(comments.filter(comment => comment.id !== commentId));
            Toast.success("Comment removed permanently");
        } catch (error) {
            console.error(error);
            Toast.error("Failed to remove comment");
        }
    };

    const handleClearAll = async () => {
        try {
            await apiInstance.post(`author/clear-comments/`);
            setComments([]);
            Toast.success("Comment history cleared");
        } catch (error) {
            console.error(error);
            Toast.error("Failed to clear comment history");
        }
    };

    const handleSubmitReply = async (commentId) => {
        const reply = replyTexts[commentId] || "";
        if (!reply.trim()) {
            Toast.warning("Reply cannot be empty");
            return;
        }

        try {
            await apiInstance.post(`author/dashboard/reply-comment/`, {
                comment_id: commentId,
                reply: reply,
            });
            
            // Update local state instead of refetching
            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return { ...comment, reply: reply };
                }
                return comment;
            }));
            
            // Clear reply input
            setReplyTexts(prev => ({ ...prev, [commentId]: "" }));
            Toast.success("Reply sent successfully");
        } catch (error) {
            console.log(error);
            Toast.error("Failed to send reply");
        }
    };

    const handleReplyChange = (commentId, text) => {
        setReplyTexts(prev => ({ ...prev, [commentId]: text }));
    };

    // Helper function to get display name
    const getDisplayName = (userProfile) => {
        if (!userProfile) return 'Anonymous User';
        if (userProfile.full_name?.trim()) return userProfile.full_name;
        if (userProfile.user?.full_name?.trim()) return userProfile.user.full_name;
        if (userProfile.username) return userProfile.username;
        if (userProfile.user?.username) return userProfile.user.username;
        return 'Anonymous User';
    };

    useEffect(() => {
        if (userId) {
            fetchComments();
        }
    }, [userId]);

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
                                                    <i className="fas fa-comments me-2" style={{ color: '#74C69D' }}></i>
                                                    Comments
                                                </h2>
                                                <p className="text-muted mb-0">Manage and view all comments on your posts</p>
                                            </div>
                                            {comments.length > 0 && (
                                                <button 
                                                    className="btn btn-outline-danger px-3 py-2"
                                                    onClick={handleClearAll}
                                                    style={{ borderRadius: '25px', fontSize: '0.9rem' }}
                                                >
                                                    <i className="fas fa-trash-alt me-2"></i>
                                                    Clear All
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="card-body p-4">
                                        {loading ? (
                                            <div className="text-center py-5">
                                                <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-3 text-muted">Loading comments...</p>
                                            </div>
                                        ) : comments.length === 0 ? (
                                            <div className="text-center py-5">
                                                <div className="mb-4">
                                                    <i className="fas fa-comments fa-4x" style={{ color: '#74C69D', opacity: '0.5' }}></i>
                                                </div>
                                                <h4 style={{ color: '#1B4332', fontWeight: '600' }}>No Comments Yet</h4>
                                                <p className="text-muted mb-4">You don't have any comments on your posts yet.</p>
                                                <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
                                                    <i className="fas fa-plus me-2"></i>
                                                    Create Your First Post
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="row g-4">
                                                {comments.map((comment) => (
                                                    <div className="col-12" key={comment.id}>
                                                        <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', transition: 'transform 0.2s ease' }}
                                                             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                                            <div className="card-body p-4">
                                                                <div className="d-flex justify-content-between align-items-start">
                                                                    <div className="flex-grow-1">
                                                                        <div className="d-flex align-items-center mb-3">
                                                                            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3"
                                                                                 style={{ width: '45px', height: '45px' }}>
                                                                                <i className="fas fa-user text-white"></i>
                                                                            </div>
                                                                            <div>
                                                                                <h6 className="mb-1" style={{ color: '#1B4332', fontWeight: '600' }}>
                                                                                    {getDisplayName(comment.user_profile)}
                                                                                </h6>
                                                                                <small className="text-muted">
                                                                                    <i className="fas fa-clock me-1"></i>
                                                                                    {new Date(comment.date).toLocaleString()}
                                                                                </small>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ps-5">
                                                                            <p className="mb-0" style={{ color: '#495057', lineHeight: '1.6' }}>
                                                                                {comment.comment}
                                                                            </p>
                                                                        </div>
                                                                        {comment.post && (
                                                                            <div className="mt-3 ps-5">
                                                                                <small className="text-muted">
                                                                                    <i className="fas fa-file-alt me-1"></i>
                                                                                    Comment on: 
                                                                                    <Link to={`/${comment.post.slug}`} className="text-decoration-none ms-1" style={{ color: '#74C69D' }}>
                                                                                        {comment.post.title}
                                                                                    </Link>
                                                                                </small>
                                                                            </div>
                                                                        )}
                                                                        
                                                                        {/* Reply Section */}
                                                                        {comment.reply ? (
                                                                            <div className="mt-3 p-3 bg-light rounded">
                                                                                <div className="d-flex align-items-center mb-2">
                                                                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                                                                                         style={{ width: '30px', height: '30px' }}>
                                                                                        <i className="fas fa-user text-white"></i>
                                                                                    </div>
                                                                                    <h6 className="mb-0" style={{ color: '#1B4332', fontWeight: '600' }}>
                                                                                        Your Reply
                                                                                    </h6>
                                                                                </div>
                                                                                <p className="mb-0" style={{ color: '#495057' }}>
                                                                                    {comment.reply}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="mt-3 d-flex">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control me-2"
                                                                                    placeholder="Write a reply..."
                                                                                    value={replyTexts[comment.id] || ""}
                                                                                    onChange={(e) => handleReplyChange(comment.id, e.target.value)}
                                                                                />
                                                                                <button 
                                                                                    className="btn btn-success"
                                                                                    onClick={() => handleSubmitReply(comment.id)}
                                                                                >
                                                                                    Reply
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <button 
                                                                        className="btn btn-outline-danger btn-sm ms-3"
                                                                        onClick={() => handleDeleteComment(comment.id)}
                                                                        style={{ borderRadius: '20px', padding: '8px 12px' }}
                                                                        title="Delete Comment"
                                                                    >
                                                                        <i className="fas fa-trash-alt"></i>
                                                                    </button>
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

export default Comments;