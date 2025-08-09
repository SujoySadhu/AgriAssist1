import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import apiInstance from "../../utils/axios";
import moment from "moment";
import Toast from "../../plugin/Toast";
import { useAuthStore } from "../../store/auth";
import useAxios from '../../utils/useAxios';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
const BACKEND_URL = "http://localhost:8000";
const defaultPostImage = "https://placehold.co/600x400?text=No+Image+Available";

// Image Gallery Component
const ImageGallery = ({ images, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToImage = (index) => {
        setCurrentIndex(index);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return defaultPostImage;
        if (imagePath.startsWith('http')) return imagePath;
        const fullUrl = `${BACKEND_URL}${imagePath}`;
        return fullUrl;
    };

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="image-gallery-container mb-4">
            <div className="gallery-main">
                <div className="gallery-image-container">
                    <img
                        src={getImageUrl(images[currentIndex].image)}
                        alt={`${title} - Image ${currentIndex + 1}`}
                        className="gallery-main-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultPostImage;
                        }}
                    />
                    <div className="gallery-overlay">
                        <div className="gallery-caption">
                            {images[currentIndex].caption && (
                                <p className="caption-text">{images[currentIndex].caption}</p>
                            )}
                            <p className="image-counter">{currentIndex + 1} / {images.length}</p>
                        </div>
                    </div>
                </div>
                
                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        <button 
                            className="gallery-nav-btn gallery-prev" 
                            onClick={prevImage}
                            aria-label="Previous image"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button 
                            className="gallery-nav-btn gallery-next" 
                            onClick={nextImage}
                            aria-label="Next image"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="gallery-thumbnails">
                    {images.map((image, index) => (
                        <div 
                            key={index} 
                            className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToImage(index)}
                        >
                            <img
                                src={getImageUrl(image.image)}
                                alt={`Thumbnail ${index + 1}`}
                                className="thumbnail-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultPostImage;
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .image-gallery-container {
                    position: relative;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e9ecef;
                    max-width: 800px;
                    margin: 0 auto;
                }

                                 .gallery-main {
                     position: relative;
                     height: 500px;
                     background: #f8f9fa;
                     border-radius: 15px;
                 }

                .gallery-image-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .gallery-main-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .gallery-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
                    color: white;
                    padding: 20px;
                }

                .gallery-caption {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .caption-text {
                    margin: 0;
                    font-size: 0.9rem;
                    opacity: 0.9;
                }

                .image-counter {
                    margin: 0;
                    font-size: 0.8rem;
                    opacity: 0.7;
                }

                .gallery-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                }

                .gallery-nav-btn:hover {
                    background: rgba(255, 255, 255, 1);
                    transform: translateY(-50%) scale(1.1);
                }

                .gallery-prev {
                    left: 20px;
                }

                .gallery-next {
                    right: 20px;
                }

                .gallery-thumbnails {
                    display: flex;
                    gap: 10px;
                    padding: 15px;
                    background: white;
                    overflow-x: auto;
                    scrollbar-width: thin;
                }

                .thumbnail-item {
                    flex-shrink: 0;
                    width: 80px;
                    height: 60px;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 3px solid transparent;
                    transition: all 0.3s ease;
                }

                .thumbnail-item.active {
                    border-color: #007bff;
                }

                .thumbnail-item:hover {
                    transform: scale(1.05);
                }

                .thumbnail-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                @media (max-width: 768px) {
                    .gallery-main {
                        height: 250px;
                    }

                    .gallery-nav-btn {
                        width: 40px;
                        height: 40px;
                    }

                    .gallery-thumbnails {
                        padding: 10px;
                    }

                    .thumbnail-item {
                        width: 60px;
                        height: 45px;
                    }
                }
            `}</style>
        </div>
    );
};

const Comment = ({ comment, postId, onCommentUpdate, depth = 0, isLoggedIn, setPost }) => {
  const [localComment, setLocalComment] = useState(comment);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment);
  const { allUserData } = useAuthStore();
  const navigate = useNavigate();
  const api = useAxios();

  // Limit nesting depth to 5 levels
  if (depth >= 5) return null;

  useEffect(() => {
    setLocalComment(comment);
  }, [comment]);

  const handleReply = async () => {
    if (!allUserData) {
      Toast("warning", "Please login to reply");
      return;
    }

    if (!replyText.trim()) return;

    try {
      const response = await api.post(
        `comments/create/`,
        {
          post: postId,
          comment: replyText,
          parent: localComment.id
        }
      );

      // Create a complete reply object with all required fields
      const newReply = {
        ...response.data,
        user_profile: {
          username: allUserData.username,
          profile_picture: allUserData.profile?.image || null,
          full_name: allUserData.profile?.full_name || allUserData.username
        },
        replies: [],
        is_liked: false,
        likes_count: 0,
        date: new Date().toISOString()
      };

      // Update the local state with the new reply
      setLocalComment(prev => ({
        ...prev,
        replies: [...(prev.replies || []), newReply]
      }));
      
      // Update the post's comments count
      setPost(prev => ({
        ...prev,
        comments_count: (prev.comments_count || 0) + 1
      }));
      
      // Clear the reply input and hide it
      setReplyText("");
      setShowReplyInput(false);
      
      Toast("success", "Reply posted successfully");
    } catch (error) {
      console.error("Reply error:", error);
      if(error.response?.status === 401) {
        Toast("error", "Session expired. Please login again.");
      } else {
        Toast("error", error.response?.data?.detail || "Failed to post reply");
      }
    }
  };

  const handleLike = async (commentToLike = localComment) => {
    if (!allUserData) {
      Toast("warning", "Please login to like comments");
      return;
    }

    try {
      const response = await api.post(
        `comments/${commentToLike.id}/like/`,
        { user_id: allUserData.user_id }
      );

      // Update the local state with the new like status
      if (commentToLike.id === localComment.id) {
        setLocalComment(prev => ({
          ...prev,
          is_liked: response.data.is_liked,
          likes_count: response.data.likes_count
        }));
      } else {
        // Update the reply's like status in the replies array
        setLocalComment(prev => ({
          ...prev,
          replies: prev.replies.map(reply => 
            reply.id === commentToLike.id 
              ? { ...reply, is_liked: response.data.is_liked, likes_count: response.data.likes_count }
              : reply
          )
        }));
      }
    } catch (error) {
      console.error("Like error:", error);
      if(error.response?.status === 401) {
        Toast("error", "Session expired. Please login again.");
      } else {
        Toast("error", error.response?.data?.detail || "Failed to like comment");
      }
    }
  };

  const handleEdit = async (commentToEdit = localComment) => {
    if (!editText.trim()) return;

    try {
      const response = await api.put(
        `comments/${commentToEdit.id}/`,
        { comment: editText }
      );

      // Update the local state with the edited comment
      if (commentToEdit.id === localComment.id) {
        setLocalComment(prev => ({
          ...prev,
          comment: editText
        }));
      } else {
        // Update the reply's content in the replies array
        setLocalComment(prev => ({
          ...prev,
          replies: prev.replies.map(reply => 
            reply.id === commentToEdit.id 
              ? { ...reply, comment: editText }
              : reply
          )
        }));
      }
      
      setIsEditing(false);
      Toast("success", "Comment updated successfully");
    } catch (error) {
      console.error("Edit error:", error);
      if(error.response?.status === 401) {
        Toast("error", "Session expired. Please login again.");
      } else {
        Toast("error", error.response?.data?.detail || "Failed to update comment");
      }
    }
  };

  const handleDelete = async (commentToDelete = localComment) => {
    // Create a custom confirmation dialog
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'modal fade';
    confirmDialog.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this comment?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(confirmDialog);
    const modal = new bootstrap.Modal(confirmDialog);
    modal.show();

    // Handle confirmation
    confirmDialog.querySelector('#confirmDelete').addEventListener('click', async () => {
      try {
        await api.delete(`/comments/${commentToDelete.id}/`);
        
        // Update the post's comments count locally
        setPost(prev => ({
          ...prev,
          comments_count: Math.max(0, (prev.comments_count || 0) - 1)
        }));
        
        // If it's a reply, remove it from the replies array
        if (commentToDelete.parent) {
          setLocalComment(prev => ({
            ...prev,
            replies: prev.replies.filter(reply => reply.id !== commentToDelete.id)
          }));
        } else {
          // If it's a main comment, remove it from the comments list
          // We need to update the parent component's comments state
          // This will be handled by the parent component through the onCommentUpdate callback
          // but we'll pass a flag to indicate it's a deletion, not a full refresh
          onCommentUpdate('deleted', commentToDelete.id);
        }
        
        Toast("success", "Comment deleted successfully");
        modal.hide();
      } catch (error) {
        console.error("Delete error:", error);
        if(error.response?.status === 401) {
          Toast("error", "Session expired. Please login again.");
        } else {
          Toast("error", error.response?.data?.detail || "Failed to delete comment");
        }
        modal.hide();
      }
    });

    // Clean up the modal when it's hidden
    confirmDialog.addEventListener('hidden.bs.modal', () => {
      document.body.removeChild(confirmDialog);
    });
  };

  return (
    <div className="my-2" style={{ marginLeft: `${depth * 30}px` }}>
      <div className={`card p-3 mb-2 ${depth > 0 ? 'border-start border-primary' : ''}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <img
              src={localComment.user_profile?.profile_picture ? `${BACKEND_URL}${localComment.user_profile.profile_picture}` : defaultAvatar}
              className="rounded-circle"
              style={{ width: 40, height: 40, objectFit: "cover" }}
              alt={localComment.user_profile?.username}
              onClick={() => navigate(`/profile/${localComment.user}`)}
              role="button"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <div>
              <h6 className="m-0 fw-bold">{localComment.user_profile?.username}</h6>
              <small className="text-muted">
                {moment(localComment.date).fromNow()}
              </small>
            </div>
          </div>

          {allUserData?.user_id === localComment.user && (
            <div className="dropdown">
              <button 
                className="btn btn-link btn-sm text-muted p-0" 
                type="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => {
                      setEditText(localComment.comment);
                      setIsEditing(true);
                    }}
                  >
                    <i className="fas fa-edit me-2"></i>Edit
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item text-danger" 
                    onClick={() => handleDelete(localComment)}
                  >
                    <i className="fas fa-trash-alt me-2"></i>Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              className="form-control form-control-sm"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows="2"
            />
            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleEdit(localComment)}
              >
                Save
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(localComment.comment);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 mb-0">{localComment.comment}</p>
            <div className="d-flex align-items-center gap-3 mt-2">
              <button
                className={`btn btn-link ${localComment.is_liked ? 'text-danger' : 'text-muted'} p-0`}
                onClick={() => handleLike(localComment)}
              >
                <i className={`fas fa-heart ${localComment.is_liked ? 'text-danger' : ''}`}></i>
                <span className="ms-1">{localComment.likes_count}</span>
              </button>
              {/* Only show reply button if depth is less than 4 (to allow one more level) */}
              {depth < 4 && (
                <button
                  className="btn btn-link text-muted p-0"
                  onClick={() => setShowReplyInput(!showReplyInput)}
                >
                  <i className="fas fa-reply"></i>
                  <span className="ms-1">Reply</span>
                </button>
              )}
            </div>
          </>
        )}

        {showReplyInput && depth < 4 && (
          <div className="mt-3">
            <div className="d-flex gap-3">
              <img
                src={allUserData?.profile?.image || defaultAvatar}
                className="rounded-circle"
                style={{ width: 35, height: 35, objectFit: "cover" }}
                alt={allUserData?.username}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
              <div className="flex-grow-1">
                <textarea
                  className="form-control form-control-sm mb-2"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  rows="2"
                />
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                  >
                    <i className="fas fa-paper-plane me-1"></i>
                    Reply
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setShowReplyInput(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {localComment.replies?.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            postId={postId}
            onCommentUpdate={onCommentUpdate}
            depth={depth + 1}
            isLoggedIn={isLoggedIn}
            setPost={setPost}
          />
        ))}
      </div>
    </div>
  );
};

function Detail() {
  const { slug } = useParams();
  const [post, setPost] = useState({});
  const [commentContent, setCommentContent] = useState("");
  const { allUserData, isLoggedIn } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const api = useAxios();
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data } = await apiInstance.get(`post/detail/${slug}/`);
      
      // Ensure comments have their replies properly structured
      const processedData = {
        ...data,
        comments: data.comments.map(comment => ({
          ...comment,
          replies: comment.replies || []
        }))
      };
      setPost(processedData);
    } catch (error) {
      console.error('Error fetching post:', error);
      Toast("error", "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) return Toast("warning", "Please login to comment");
    if (!commentContent.trim()) return Toast("warning", "Comment cannot be empty");

    try {
      const response = await api.post("comments/create/", {
        post: post?.id,
        comment: commentContent,
      });
      
      // Create a complete comment object with all required fields
      const newComment = {
        ...response.data,
        id: response.data.id || `temp_${Date.now()}`, // Fallback ID if server doesn't provide one
        user_profile: {
          username: allUserData.username,
          profile_picture: allUserData.profile?.image || null,
          full_name: allUserData.profile?.full_name || allUserData.username
        },
        replies: [],
        is_liked: false,
        likes_count: 0,
        date: new Date().toISOString()
      };
      
      // Add the new comment to the local state using handleCommentUpdate
      handleCommentUpdate('added', null, newComment);
      
      setCommentContent("");
      Toast("success", "Comment posted!");
      
      // Fallback: Refresh the post after a short delay to ensure comment appears
      setTimeout(() => {
        fetchPost();
      }, 1000);
    } catch (error) {
      console.error("Comment error:", error);
      if(error.response?.status === 401) {
        Toast("error", "Session expired. Please login again.");
      } else {
        Toast("error", error.response?.data?.detail || "Comment failed");
      }
    }
  };

  const handleLikePost = async () => {
    if (!isLoggedIn()) {
      Toast("warning", "Please login to like posts");
      return;
    }
    
    try {
      // Optimistic update
      const newLikeState = !post.is_liked;
      const currentLikeCount = post.likes_count || 0;
      const newLikeCount = currentLikeCount + (newLikeState ? 1 : -1);
      
      setPost(prev => ({
        ...prev,
        is_liked: newLikeState,
        likes_count: Math.max(0, newLikeCount) // Ensure count never goes below 0
      }));

      await api.post('post/like-post/', {
        user_id: allUserData.user_id,
        post_id: post.id
      });

    } catch (error) {
      // Revert optimistic update on error
      setPost(prev => ({
        ...prev,
        is_liked: !prev.is_liked,
        likes_count: Math.max(0, (prev.likes_count || 0) + (prev.is_liked ? 1 : -1))
      }));
      if(error.response?.status === 401) {
        Toast("error", "Session expired. Please login again.");
      } else {
        Toast("error", error.response?.data?.detail || "Like action failed");
      }
    }
  };

  const handleBookmarkPost = async () => {
    if (!isLoggedIn()) {
      Toast("warning", "Please login to bookmark");
      return;
    }
    
    try {
      // Optimistic update
      const newBookmarkState = !post.is_bookmarked;
      
      setPost(prev => ({
        ...prev,
        is_bookmarked: newBookmarkState
      }));

      await apiInstance.post('post/bookmark-post/', {
        user_id: allUserData.user_id,
        post_id: post.id
      });

      Toast("success", newBookmarkState ? "Post bookmarked!" : "Post unbookmarked!");
    } catch (error) {
      // Revert optimistic update on error
      setPost(prev => ({
        ...prev,
        is_bookmarked: !prev.is_bookmarked
      }));
      if(error.response?.status === 401) {
        Toast("error", "Session expired. Please login again.");
      } else {
        Toast("error", error.response?.data?.detail || "Bookmark failed");
      }
    }
  };

  const handleCommentUpdate = (action = 'refresh', commentId = null, newComment = null) => {
    if (action === 'deleted' && commentId) {
      // Handle comment deletion locally without full post reload
      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.filter(comment => comment.id !== commentId)
      }));
    } else if (action === 'added' && newComment) {
      // Handle comment addition locally
      setPost(prevPost => ({
        ...prevPost,
        comments: [...(prevPost.comments || []), newComment],
        comments_count: (prevPost.comments_count || 0) + 1
      }));
    } else {
      // Full refresh for other cases (edit, etc.)
      fetchPost();
    }
  };

  useEffect(() => {
    fetchPost();
    const interval = setInterval(fetchPost, 300000);
    return () => clearInterval(interval);
  }, [slug]);

  // Add styles to head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .comment-section {
        background: #ffffff;
        border-radius: 16px;
        padding: 2rem;
        margin-top: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      }
      .comment-header {
        border-bottom: 2px solid #f0f2f5;
        padding-bottom: 1.5rem;
        margin-bottom: 2rem;
      }
      .comment-header h3 {
        color: #1a1a1a;
        font-weight: 600;
      }
      .comment-input {
        background: #f8f9fa;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
      }
      .comment-input:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .comment-card {
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
        margin-bottom: 1.5rem;
      }
      .comment-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }
      .nested-comment {
        background: #f8f9fa;
        border-left: 3px solid #0d6efd;
        margin-left: 2.5rem;
        position: relative;
      }
      .nested-comment::before {
        content: '';
        position: absolute;
        left: -2.5rem;
        top: 1.5rem;
        width: 2rem;
        height: 2px;
        background: #dee2e6;
      }
      .user-avatar {
        border: 2px solid #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .comment-actions {
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .comment-card:hover .comment-actions {
        opacity: 1;
      }
      .action-btn {
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        transition: all 0.2s ease;
      }
      .action-btn:hover {
        transform: translateY(-1px);
      }
      .action-btn.like-btn {
        background: #fff5f5;
        color: #dc3545;
        border: 1px solid #ffcdd2;
      }
      .action-btn.like-btn.active {
        background: #dc3545;
        color: white;
      }
      .action-btn.reply-btn {
        background: #f0f7ff;
        color: #0d6efd;
        border: 1px solid #bbdefb;
      }
      .action-btn.reply-btn:hover {
        background: #e3f2fd;
      }
      .comment-text {
        font-size: 1rem;
        line-height: 1.6;
        color: #2c3e50;
      }
      .comment-meta {
        font-size: 0.9rem;
        color: #6c757d;
      }
      .reply-form {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1rem;
        margin-top: 1rem;
      }
      .reply-form textarea {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 0.75rem;
        resize: none;
      }
      .reply-form textarea:focus {
        border-color: #0d6efd;
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
      }
      .post-reactions {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 12px;
        margin: 2rem 0;
      }
      .reaction-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        border-radius: 25px;
        font-weight: 500;
        transition: all 0.3s ease;
        border: 1px solid #e9ecef;
        background: white;
      }
      .reaction-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .reaction-btn.liked {
        background: #fff5f5;
        border-color: #ffcdd2;
        color: #dc3545;
      }
      .reaction-btn.bookmarked {
        background: #f0f7ff;
        border-color: #bbdefb;
        color: #0d6efd;
      }
      .reaction-btn .icon {
        font-size: 1.1rem;
        transition: transform 0.3s ease;
      }
      .reaction-btn:hover .icon {
        transform: scale(1.2);
      }
      .reaction-btn.liked .icon {
        color: #dc3545;
      }
      .reaction-btn.bookmarked .icon {
        color: #0d6efd;
      }
      .reaction-count {
        font-weight: 600;
        color: #495057;
      }
      .reaction-btn.liked .reaction-count {
        color: #dc3545;
      }
      .reaction-btn.bookmarked .reaction-count {
        color: #0d6efd;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) return (
    <div className="container my-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="flex-grow-1">
        <div className="container my-5">
          <article className="bg-white p-4 rounded-4 shadow">
            <header className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={post.user_profile?.profile_picture ? `${BACKEND_URL}${post.user_profile.profile_picture}` : defaultAvatar}
                    className="rounded-circle shadow"
                    style={{ width: 70, height: 70, objectFit: "cover" }}
                    alt={post.user_profile?.full_name || post.user_profile?.username}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div>
                    <h1 className="fw-bold mb-1 display-6">{post.title}</h1>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted">
                        By {post.user_profile?.full_name || post.user_profile?.username}
                      </span>
                      <span className="text-muted">·</span>
                      <span className="text-muted">
                        {moment(post.date).format("MMM D, YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="badge bg-primary bg-gradient fs-6">
                  {post.category?.title}
                </span>
              </div>
            </header>

            <section className="mb-5">
              {/* Use ImageGallery if post has multiple images, otherwise show single image */}
              {post.all_images && post.all_images.length > 0 ? (
                <ImageGallery images={post.all_images} title={post.title} />
              ) : post.image ? (
                <div className="position-relative rounded-3 overflow-hidden mb-4 shadow-lg" style={{ maxWidth: "800px", margin: "0 auto" }}>
                  <img
                    src={post.image.startsWith('http') ? post.image : `${BACKEND_URL}${post.image}`}
                    alt={post.title}
                    className="img-fluid w-100"
                                         style={{ 
                       maxHeight: "500px", 
                       objectFit: "cover",
                       objectPosition: "center",
                       borderRadius: "12px"
                     }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultPostImage;
                    }}
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-50 text-white rounded-bottom">
                    <small className="d-block text-white-50">Featured Image</small>
                  </div>
                </div>
              ) : null}
              <div 
                className="fs-5 line-height-lg" 
                dangerouslySetInnerHTML={{ __html: post.description }} 
              />
            </section>

            <div className="post-reactions">
              <button 
                className={`reaction-btn ${post.is_liked ? 'liked' : ''}`}
                onClick={handleLikePost}
                title={!isLoggedIn() ? "Login to like" : ""}
              >
                <i className="fas fa-heart icon"></i>
                <span className="reaction-count">{post.likes_count || 0}</span>
              </button>
              <button
                className={`reaction-btn ${post.is_bookmarked ? 'bookmarked' : ''}`}
                onClick={handleBookmarkPost}
                title={!isLoggedIn() ? "Login to bookmark" : ""}
              >
                <i className="fas fa-bookmark icon"></i>
                <span className="reaction-count">Bookmark</span>
              </button>
              <div className="d-flex align-items-center gap-2 text-muted">
                <i className="fas fa-comment fa-lg"></i>
                <span className="reaction-count">{post.comments_count || 0}</span>
              </div>
            </div>

            <section className="comment-section">
              <div className="comment-header">
                <h3 className="m-0 d-flex align-items-center gap-2">
                  <i className="fas fa-comments text-primary"></i>
                  Discussion {post.comments_count ? `(${post.comments_count})` : ''}
                </h3>
              </div>

              {isLoggedIn() ? (
                <div className="comment-input mb-4">
                  <div className="card-body p-4">
                    <form onSubmit={handleCommentSubmit}>
                      <div className="d-flex gap-3 align-items-start">
                        <img
                          src={allUserData.profile?.image || defaultAvatar}
                          className="rounded-circle shadow-sm"
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                          alt={allUserData.username}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = defaultAvatar;
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="form-floating mb-3">
                            <textarea
                              className="form-control"
                              value={commentContent}
                              onChange={(e) => setCommentContent(e.target.value)}
                              placeholder="Write your comment..."
                              id="commentTextarea"
                              style={{ height: "100px", resize: "none" }}
                              required
                            />
                            <label htmlFor="commentTextarea">Share your thoughts...</label>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                              {commentContent.length > 0 ? `${commentContent.length} characters` : "Minimum 1 character required"}
                            </small>
                            <button 
                              type="submit" 
                              className="btn btn-primary px-4 rounded-pill d-flex align-items-center gap-2"
                              disabled={!commentContent.trim()}
                            >
                              <i className="fas fa-paper-plane"></i>
                              Post Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning mb-4 d-flex align-items-center gap-2">
                  <i className="fas fa-exclamation-circle fa-lg"></i>
                  <div>
                    Please <Link to="/login" className="alert-link fw-bold">login</Link> to join the discussion
                  </div>
                </div>
              )}

              <div>
                {post.comments?.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    postId={post.id}
                    onCommentUpdate={handleCommentUpdate}
                    isLoggedIn={isLoggedIn()}
                    setPost={setPost}
                  />
                ))}
              </div>
            </section>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Detail;