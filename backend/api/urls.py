from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api import views as api_views

urlpatterns = [
    # Userauths API Endpoints
    path('user/token/', api_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', api_views.RegisterView.as_view(), name='auth_register'),
    path('user/profile/<user_id>/', api_views.ProfileView.as_view(), name='user_profile'),
    path('user/verify-email/', api_views.VerifyEmailView.as_view(),name='email-verify'),
    path('user/password-reset-request/', api_views.PasswordResetRequestView.as_view(),name='password-reset-request'),
    path('user/password-reset-confirm/', api_views.PasswordResetConfirmView.as_view(),name='password-reset-confirm'),
    path('user/validate-otp/', api_views.ValidateOTPView.as_view(), name='validate-otp'),

    # Post Endpoints
    path('post/category/list/', api_views.CategoryListAPIView.as_view()),
    path('post/category/posts/<category_slug>/', api_views.PostCategoryListAPIView.as_view()),
    path('post/lists/', api_views.PostListAPIView.as_view()),
    path('post/latest/', api_views.LatestPostListAPIView.as_view()),
    path('post/detail/<slug>/', api_views.PostDetailAPIView.as_view()), 
    path('post/like-post/', api_views.LikePostAPIView.as_view()),
    path('post/bookmark-post/', api_views.BookmarkPostAPIView.as_view()),
    
    # Comment Endpoints
    path('comments/', api_views.CommentListAPIView.as_view(), name='comment-list'),
    path('comments/create/', api_views.PostCommentAPIView.as_view(), name='comment-create'),
    path('comments/<int:pk>/', api_views.CommentDetailAPIView.as_view(), name='comment-detail'),
    path('comments/<int:pk>/like/', api_views.LikeCommentAPIView.as_view(), name='comment-like'),

    # Dashboard APIS
    path('author/dashboard/stats/<user_id>/', api_views.DashboardStats.as_view()),
    path('author/dashboard/post-list/<user_id>/', api_views.DashboardPostLists.as_view()),
    path('author/dashboard/comment-list/', api_views.DashboardCommentLists.as_view()),
    path('author/dashboard/noti-list/<user_id>/', api_views.DashboardNotificationLists.as_view()),
    path('author/dashboard/noti-mark-seen/', api_views.DashboardMarkNotiSeenAPIView.as_view()),
    path('author/dashboard/reply-comment/', api_views.DashboardPostCommentAPIView.as_view()),
    path('author/dashboard/post-create/', api_views.DashboardPostCreateAPIView.as_view()),
    path('author/dashboard/post-detail/<user_id>/<post_id>/', api_views.DashboardPostEditAPIView.as_view()),
]