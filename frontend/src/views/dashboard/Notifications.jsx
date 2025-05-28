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
        const actorName = notification.actor_profile?.username || "Someone";
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
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1">
                <section className="py-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            <div className="card mb-4">
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Notifications</h3>
                                        <span>Manage all your notifications from here</span>
                                    </div>
                                        {notifications.length > 0 && (
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={handleClearAll}
                                            >
                                                <i className="fas fa-trash-alt me-2"></i>
                                                Clear All
                                            </button>
                                        )}
                                </div>
                                <div className="card-body">
                                        {notifications.length === 0 ? (
                                            <div className="text-center py-5">
                                                <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                                                <h4>No Notifications</h4>
                                                <p className="text-muted">You don't have any notifications yet.</p>
                                            </div>
                                        ) : (
                                            <div className="list-group">
                                                {notifications.map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className={`list-group-item list-group-item-action ${
                                                            !notification.seen ? "bg-light" : ""
                                                        }`}
                                                        onClick={() => {
                                                            if (!notification.seen) {
                                                                markAsSeen(notification.id);
                                                            }
                                                        }}
                                                    >
                                                        <div className="d-flex w-100 justify-content-between align-items-start">
                                                            <div className="d-flex align-items-start">
                                                                {notification.actor_profile?.profile_picture && (
                                                                    <img
                                                                        src={notification.actor_profile.profile_picture}
                                                                        alt={notification.actor_profile.username}
                                                                        className="rounded-circle me-3"
                                                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                                    />
                                                                )}
                                                                <div>
                                                                    <p className="mb-1">
                                                                        {getNotificationText(notification)}
                                                                    </p>
                                                                    <small className="text-muted">
                                                                        <Moment date={notification.date} />
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            {notification.post && (
                                                                <Link
                                                                    to={`/${notification.post.slug}`}
                                                                    className="btn btn-sm btn-primary"
                                                                >
                                                                    View Post
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
