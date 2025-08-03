import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Toast from "../../plugin/Toast";
import Moment from "../../plugin/Moment";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = useUserData()?.user_id;

    // Default avatar for users without profile pictures
    const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23CBD5E0'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

    const fetchNotifications = async () => {
        try {
        const response = await apiInstance.get(`author/dashboard/noti-list/${userId}/`);
            setNotifications(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    const markAsSeen = async (notiId) => {
        try {
            await apiInstance.post("author/dashboard/noti-mark-seen/", {
                noti_id: notiId,
            });
            setNotifications(prevNotifications =>
                prevNotifications.map(noti =>
                    noti.id === notiId ? { ...noti, seen: true } : noti
                )
            );
        } catch (error) {
            console.error("Error marking notification as seen:", error);
        }
    };

    const getNotificationText = (notification) => {
        const actorName = notification.actor_profile?.full_name || notification.actor_profile?.username || "Someone";
        const postTitle = notification.post?.title || "a post";

        switch (notification.type) {
            case "Like":
                return `${actorName} liked your post "${postTitle}"`;
            case "Comment":
                return `${actorName} commented on your post "${postTitle}"`;
            case "Bookmark":
                return `${actorName} bookmarked your post "${postTitle}"`;
            default:
                return "New notification";
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "Like":
                return "fas fa-heart text-danger";
            case "Comment":
                return "fas fa-comment text-primary";
            case "Bookmark":
                return "fas fa-bookmark text-warning";
            default:
                return "fas fa-bell text-info";
        }
    };

    const handleClearAll = async () => {
        try {
            const markAllSeen = notifications.map(noti => 
                apiInstance.post("author/dashboard/noti-mark-seen/", {
                    noti_id: noti.id
                })
            );
            await Promise.all(markAllSeen);
            
            setNotifications(prevNotifications =>
                prevNotifications.map(noti => ({ ...noti, seen: true }))
            );
            
            Toast.success("All notifications marked as seen");
        } catch (error) {
            console.error(error);
            Toast.error("Failed to clear notifications");
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
                <Header />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="text-center">
                        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Loading notifications...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

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
                                                    <i className="fas fa-bell me-2" style={{ color: '#74C69D' }}></i>
                                                    Notifications
                                                </h2>
                                                <p className="text-muted mb-0">Stay updated with all your post activities</p>
                                            </div>
                                            {notifications.length > 0 && (
                                                <button 
                                                    className="btn btn-outline-success px-3 py-2"
                                                    onClick={handleClearAll}
                                                    style={{ borderRadius: '25px', fontSize: '0.9rem' }}
                                                >
                                                    <i className="fas fa-check-double me-2"></i>
                                                    Mark All Read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        {notifications.length === 0 ? (
                                            <div className="text-center py-5">
                                                <div className="mb-4">
                                                    <i className="fas fa-bell-slash fa-4x" style={{ color: '#74C69D', opacity: '0.5' }}></i>
                                                </div>
                                                <h4 style={{ color: '#1B4332', fontWeight: '600' }}>No Notifications</h4>
                                                <p className="text-muted mb-4">You're all caught up! No new notifications.</p>
                                                <Link to="/add-post/" className="btn btn-success px-4 py-2" style={{ borderRadius: '25px' }}>
                                                    <i className="fas fa-plus me-2"></i>
                                                    Create New Post
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="list-group list-group-flush">
                                                {notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`list-group-item list-group-item-action border-0 ${
                                                            !notification.seen ? "bg-light" : ""
                                                        }`}
                                                        style={{ 
                                                            padding: '1.5rem',
                                                            transition: 'all 0.3s ease',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => {
                                                            if (!notification.seen) {
                                                                markAsSeen(notification.id);
                                                            }
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = !notification.seen ? '#f8f9fa' : 'transparent'}
                                                    >
                                                        <div className="d-flex w-100 justify-content-between align-items-start">
                                                            <div className="d-flex align-items-start flex-grow-1">
                                                                <div className="position-relative me-3">
                                                                    <img
                                                                        src={notification.actor_profile?.profile_picture || defaultAvatar}
                                                                        alt={notification.actor_profile?.full_name || notification.actor_profile?.username || "User"}
                                                                        className="rounded-circle"
                                                                        style={{ 
                                                                            width: "50px", 
                                                                            height: "50px", 
                                                                            objectFit: "cover",
                                                                            border: '2px solid #e9ecef'
                                                                        }}
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = defaultAvatar;
                                                                        }}
                                                                    />
                                                                    <div className="position-absolute top-0 end-0 bg-success rounded-circle d-flex align-items-center justify-content-center"
                                                                         style={{ width: '20px', height: '20px', transform: 'translate(25%, -25%)' }}>
                                                                        <i className={`${getNotificationIcon(notification.type)} text-white`} style={{ fontSize: '0.7rem' }}></i>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-grow-1">
                                                                    <p className="mb-1" style={{ 
                                                                        color: '#1B4332', 
                                                                        fontWeight: notification.seen ? '400' : '600',
                                                                        fontSize: '0.95rem',
                                                                        lineHeight: '1.5'
                                                                    }}>
                                                                        {getNotificationText(notification)}
                                                                    </p>
                                                                    <small className="text-muted">
                                                                        <i className="fas fa-clock me-1"></i>
                                                                        <Moment date={notification.date} />
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            {notification.post && (
                                                                <Link
                                                                    to={`/${notification.post.slug}`}
                                                                    className="btn btn-outline-primary btn-sm ms-3"
                                                                    style={{ borderRadius: '20px', padding: '8px 16px' }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <i className="fas fa-external-link-alt me-1"></i>
                                                                    View
                                                                </Link>
                                                            )}
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

export default Notifications;
