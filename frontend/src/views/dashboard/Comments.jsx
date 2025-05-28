import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import moment from "moment";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";

function Comments() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState("");

    const fetchComments = async () => {
        try {
            const response = await apiInstance.get('author/dashboard/comment-list/');
            setComments(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            // Remove comment from local state only
            setComments(comments.filter(comment => comment.id !== commentId));
            Toast.success("Comment removed from history");
        } catch (error) {
            console.error(error);
            Toast.error("Failed to remove comment");
        }
    };

    const handleClearAll = async () => {
        try {
            // Clear all comments from local state only
            setComments([]);
            Toast.success("Comment history cleared");
        } catch (error) {
            console.error(error);
            Toast.error("Failed to clear comment history");
        }
    };

    const handleSubmitReply = async (commentId) => {
        try {
            const response = await apiInstance.post(`author/dashboard/reply-comment/`, {
                comment_id: commentId,
                reply: reply,
            });
            console.log(response.data);
            fetchComments();
            Toast("success", "Reply Sent.", "");
            setReply("");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1">
                <section className="py-4">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="text-start d-block mb-0">Comments</h2>
                                    {comments.length > 0 && (
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={handleClearAll}
                                        >
                                            <i className="fas fa-trash-alt me-2"></i>
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="pb-5">
                    <div className="container">
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                                <h4>No Comments</h4>
                                <p className="text-muted">You don't have any comments yet.</p>
                            </div>
                        ) : (
                            <div className="row">
                                {comments.map((comment) => (
                                    <div className="col-12 mb-3" key={comment.id}>
                                        <div className="card shadow-sm">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h5 className="card-title mb-1">
                                                            <i className="fas fa-user me-2"></i>
                                                            {comment.user_profile?.full_name || comment.user_profile?.username}
                                                        </h5>
                                                        <p className="card-text mb-2">{comment.comment}</p>
                                                        <small className="text-muted">
                                                            <i className="fas fa-clock me-1"></i>
                                                            {new Date(comment.date).toLocaleString()}
                                                        </small>
                                                    </div>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDeleteComment(comment.id)}
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
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Comments;
