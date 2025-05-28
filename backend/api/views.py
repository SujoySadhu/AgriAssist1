import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow logging
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN custom operations

from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.db.models import Sum
from datetime import timedelta
from django.utils import timezone
# Restframework
from rest_framework import status
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime

# Others
import json
import random
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import os

# Custom Imports
from api import serializer as api_serializer
from api import models as api_models

from api.utils import *
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from rest_framework import permissions
from django.db.models import Q
from plant_disease.predict import load_trained_model


# Create your views here.
# This code defines a DRF View class called MyTokenObtainPairView, which inherits from TokenObtainPairView.
class MyTokenObtainPairView(TokenObtainPairView):
    # Here, it specifies the serializer class to be used with this view.
    serializer_class = api_serializer.MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    # It sets the queryset for this view to retrieve all User objects.
    queryset = api_models.User.objects.all()
    # It specifies that the view allows any user (no authentication required).
    permission_classes = (AllowAny,)
    # It sets the serializer class to be used with this view.
    serializer_class = api_serializer.RegisterSerializer


# This code defines another DRF View class called ProfileView, which inherits from generics.RetrieveAPIView and used to show user profile view.
class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = api_serializer.ProfileSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']

        user = api_models.User.objects.get(id=user_id)
        profile = api_models.Profile.objects.get(user=user)
        return profile

class CategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Category.objects.all()


class PostCategoryListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        category_slug = self.kwargs['category_slug'] 
        category = api_models.Category.objects.get(slug=category_slug)
        return api_models.Post.objects.filter(category=category, status="Active")
    

class PostListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        try:
            # Get only active posts and order by views (most viewed first)
            queryset = api_models.Post.objects.filter(status="Active").order_by("-view")
            return queryset
        except Exception as e:
            print(f"Error fetching posts: {str(e)}")
            return api_models.Post.objects.none()  # Return empty queryset on error

class LatestPostListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        try:
            # Get only active posts and order by date (newest first)
            queryset = api_models.Post.objects.filter(status="Active").order_by("-date")
            return queryset
        except Exception as e:
            print(f"Error fetching latest posts: {str(e)}")
            return api_models.Post.objects.none()  # Return empty queryset on error

class PostDetailAPIView(generics.RetrieveAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs['slug']
        post = api_models.Post.objects.get(slug=slug, status="Active")
        post.view += 1
        post.save()
        return post    


class LikePostAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self, request):
        user_id = request.data['user_id']
        post_id = request.data['post_id']

        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        # Check if post has already been liked by this user
        if user in post.likes.all():
            # If liked, unlike post
            post.likes.remove(user)
            return Response({"message": "Post Disliked"}, status=status.HTTP_200_OK)
        else:
            # If post hasn't been liked, like the post by adding user to set of poeple who have liked the post
            post.likes.add(user)
            
            # Create Notification for Author
            if post.user != user:  # Only create notification if it's not the user's own post
                api_models.Notification.objects.create(
                    user=post.user,  # Post owner receives the notification
                    actor=user,      # User who liked the post
                    post=post,
                    type="Like",
                )
            return Response({"message": "Post Liked"}, status=status.HTTP_201_CREATED)

class PostCommentAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=api_serializer.CommentSerializer,
        responses={201: api_serializer.CommentSerializer}
    )
    def post(self, request):
        serializer = api_serializer.CommentSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            comment = serializer.save()
            # Only create notification if the comment is on someone else's post
            if comment.post.user != request.user:
                # Create notification with the commenter's information
                api_models.Notification.objects.create(
                    user=comment.post.user,  # Post owner receives the notification
                    actor=request.user,      # User who commented
                    post=comment.post,
                    type="Comment",
                )
            return Response(serializer.data, status=201)
        
        return Response(serializer.errors, status=400)



class CommentDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = api_serializer.CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return api_models.Comment.objects.filter(
            Q(user=self.request.user) | 
            Q(post__user=self.request.user)  # Allow post authors to moderate
        )

    def perform_destroy(self, instance):
        # Soft delete implementation example
        instance.is_deleted = True
        instance.save()   


class BookmarkPostAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'post_id': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        user_id = request.data['user_id']
        post_id = request.data['post_id']

        user = api_models.User.objects.get(id=user_id)
        post = api_models.Post.objects.get(id=post_id)

        bookmark = api_models.Bookmark.objects.filter(post=post, user=user).first()
        if bookmark:
            # Remove post from bookmark
            bookmark.delete()
            return Response({"message": "Post Un-Bookmarked"}, status=status.HTTP_200_OK)
        else:
            api_models.Bookmark.objects.create(
                user=user,
                post=post
            )

            # Create notification only if it's not the user's own post
            if post.user != user:
                api_models.Notification.objects.create(
                    user=post.user,  # Post owner receives the notification
                    actor=user,      # User who bookmarked
                    post=post,
                    type="Bookmark",
                )
            return Response({"message": "Post Bookmarked"}, status=status.HTTP_201_CREATED)   
        ######################## Author Dashboard APIs ########################

class DashboardStats(generics.ListAPIView):
    serializer_class = api_serializer.AuthorStats
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        views = api_models.Post.objects.filter(user=user).aggregate(view=Sum("view"))['view']
        posts = api_models.Post.objects.filter(user=user).count()
        likes = api_models.Post.objects.filter(user=user).aggregate(total_likes=Sum("likes"))['total_likes']
        bookmarks = api_models.Bookmark.objects.filter(user=user).count()

        return [{
            "views": views,
            "posts": posts,
            "likes": likes,
            "bookmarks": bookmarks,
        }]
    
    def list(self, request, *args, **kwargs):
        querset = self.get_queryset()
        serializer = self.get_serializer(querset, many=True)
        return Response(serializer.data)

class DashboardPostLists(generics.ListAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        try:
            user = api_models.User.objects.get(id=user_id)
        except api_models.User.DoesNotExist:
            return api_models.Post.objects.none()  # Return empty queryset if user not found

        return api_models.Post.objects.filter(user=user).order_by("-id")

    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        return api_models.Post.objects.filter(user=user).order_by("-id")

class DashboardCommentLists(generics.ListAPIView):
    serializer_class = api_serializer.CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Comment.objects.all()

class DashboardNotificationLists(generics.ListAPIView):
    serializer_class = api_serializer.NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = api_models.User.objects.get(id=user_id)

        # Get all notifications for the user, ordered by most recent first
        return api_models.Notification.objects.filter(
            user=user
        ).order_by('-date')  # Order by most recent first

class DashboardMarkNotiSeenAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'noti_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self, request):
        noti_id = request.data['noti_id']
        noti = api_models.Notification.objects.get(id=noti_id)

        noti.seen = True
        noti.save()

        return Response({"message": "Noti Marked As Seen"}, status=status.HTTP_200_OK)

class DashboardPostCommentAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'comment_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'reply': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    )
    def post(self, request):
        comment_id = request.data['comment_id']
        reply = request.data['reply']

        print("comment_id =======", comment_id)
        print("reply ===========", reply)

        comment = api_models.Comment.objects.get(id=comment_id)
        comment.reply = reply
        comment.save()

        return Response({"message": "Comment Response Sent"}, status=status.HTTP_201_CREATED)

class DashboardPostCreateAPIView(generics.CreateAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print(request.data)
        user_id = request.data.get('user_id')
        
        title = request.data.get('title')
        image = request.data.get('image')
        description = request.data.get('description')
        tags = request.data.get('tags')
        category_id = request.data.get('category')
        post_status = request.data.get('status')
        print("Received status:", request.data.get('status')) 

        print(user_id)
        print(title)
        print(image)
        print(description)
        print(tags)
        print(category_id)
        print(post_status)

        user = api_models.User.objects.get(id=user_id)
        profile = api_models.Profile.objects.get(user=user)
        category = api_models.Category.objects.get(id=category_id)

        post = api_models.Post.objects.create(
            user=user,
            profile=profile,
            title=title,
            image=image,
            description=description,
            tags=tags,
            category=category,
            status=post_status
        )

        return Response({"message": "Post Created Successfully"}, status=status.HTTP_201_CREATED)

class DashboardPostEditAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = api_serializer.PostSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']
        post_id = self.kwargs['post_id']
        user = api_models.User.objects.get(id=user_id)
        return api_models.Post.objects.get(user=user, id=post_id)

    def update(self, request, *args, **kwargs):
        post_instance = self.get_object()

        title = request.data.get('title')
        image = request.data.get('image')
        description = request.data.get('description')
        tags = request.data.get('tags')
        category_id = request.data.get('category')
        post_status = request.data.get('status')

        print(title)
        print(image)
        print(description)
        print(tags)
        print(category_id)
        print(post_status)

        category = api_models.Category.objects.get(id=category_id)

        post_instance.title = title
        if image != "undefined":
            post_instance.image = image
        post_instance.description = description
        post_instance.tags = tags
        post_instance.category = category
        post_instance.status = post_status
        post_instance.save()

        return Response({"message": "Post Updated Successfully"}, status=status.HTTP_200_OK)


{
    "title": "New post",
    "image": "",
    "description": "lorem",
    "tags": "tags, here",
    "category_id": 1,
    "post_status": "Active"
}

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        try:
            pending_user = api_models.PendingUser.objects.get(email=email)
            
            if timezone.now() > pending_user.expires_at:
                return Response({"success": False, "error": "OTP expired"}, status=400)
                
            if pending_user.otp != otp:
                return Response({"success": False, "error": "Invalid OTP"}, status=400)

            # Create actual user
            user = api_models.User.objects.create(
                full_name=pending_user.full_name,
                email=pending_user.email,
                password=pending_user.password,  # Already hashed
                is_active=True
            )
            
            # Cleanup pending user
            pending_user.delete()
            
            return Response({"success": True, "message": "Account activated successfully"})

        except api_models.PendingUser.DoesNotExist:
            return Response({"success": False, "error": "No pending registration found"}, status=404)
class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = api_models.User.objects.get(email=email)
            otp = str(random.randint(100000, 999999))
            user.otp = otp
            user.otp_created_at = timezone.now()
            user.save()
            send_otp_email(email, otp, is_password_reset=True)
            return Response({"success": True, "message": "OTP sent to email"})
        except api_models.User.DoesNotExist:
            return Response({"success": False, "error": "User not found"}, status=404)

# class PasswordResetConfirmView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         email = request.data.get('email')
#         otp = request.data.get('otp')
#         new_password = request.data.get('new_password')

#         try:
#             user = api_models.User.objects.get(email=email)
#             if user.otp == otp and timezone.now() < user.otp_created_at + timedelta(minutes=10):
#                 user.set_password(new_password)
#                 user.otp = None
#                 user.save()
#                 return Response({"success": True, "message": "Password reset successful"})
#             return Response({"success": False, "error": "Invalid or expired OTP"}, status=400)
#         except api_models.User.DoesNotExist:
#             return Response({"success": False, "error": "User not found"}, status=404)
class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        try:
            user = api_models.User.objects.get(email=email)
            
            # First validate OTP
            if not (user.otp == otp and timezone.now() < user.otp_created_at + timedelta(minutes=10)):
                return Response({"success": False, "error": "Invalid or expired OTP"}, status=400)
            
            # Then reset password
            user.set_password(new_password)
            user.otp = None  # Clear OTP after successful reset
            user.save()
            
            return Response({"success": True, "message": "Password reset successful"})
            
        except api_models.User.DoesNotExist:
            return Response({"success": False, "error": "User not found"}, status=404)

class ValidateOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        try:
            user = api_models.User.objects.get(email=email)
            if user.otp == otp and timezone.now() < user.otp_created_at + timedelta(minutes=10):
                return Response({"success": True, "message": "OTP verified"})
            return Response({"success": False, "error": "Invalid or expired OTP"}, status=400)
        except api_models.User.DoesNotExist:
            return Response({"success": False, "error": "User not found"}, status=404)

class LikeCommentAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
    )
    def post(self, request, pk):
        user_id = request.data['user_id']
        comment_id = pk

        user = api_models.User.objects.get(id=user_id)
        comment = api_models.Comment.objects.get(id=comment_id)

        # Check if comment has already been liked by this user
        if user in comment.likes.all():
            # If liked, unlike comment
            comment.likes.remove(user)
            return Response({
                "message": "Comment unliked",
                "is_liked": False,
                "likes_count": comment.likes.count()
            }, status=status.HTTP_200_OK)
        else:
            # If comment hasn't been liked, like the comment
            comment.likes.add(user)
            
            # Create Notification for Comment Author only if it's not the user's own comment
            if comment.user != user:
                api_models.Notification.objects.create(
                    user=comment.user,  # Comment author receives the notification
                    actor=user,         # User who liked the comment
                    post=comment.post,
                    type="Like",
                )
            return Response({
                "message": "Comment liked",
                "is_liked": True,
                "likes_count": comment.likes.count()
            }, status=status.HTTP_201_CREATED)

class CommentListAPIView(generics.ListAPIView):
    serializer_class = api_serializer.CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        post_id = self.request.query_params.get('post_id')
        parent_id = self.request.query_params.get('parent')
        
        queryset = api_models.Comment.objects.filter(is_deleted=False)
        
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
            
        return queryset.order_by('date')

class PlantDiseaseDetectionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def __init__(self):
        super().__init__()
        try:
            import warnings
            warnings.filterwarnings('ignore', category=UserWarning)
            self.model, self.class_names = load_trained_model()
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self.model = None
            self.class_names = None

    def preprocess_image(self, image):
        # Resize image to match model input size
        img = Image.open(image)
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array

    def get_disease_info(self, disease_name):
        # Get disease information from database or return default
        return self.disease_info.get(disease_name, {
            'description': 'A plant disease that affects the health of your plant.',
            'remedies': [
                'Consult with a local agricultural expert',
                'Apply appropriate fungicide or pesticide',
                'Remove infected plant parts',
                'Improve plant care practices'
            ],
            'prevention_tips': [
                'Maintain proper plant hygiene',
                'Monitor plant health regularly',
                'Use disease-resistant varieties',
                'Follow proper watering and fertilization practices'
            ]
        })

    def post(self, request):
        try:
            # Get the image from request
            image = request.FILES.get('image')
            if not image:
                return Response(
                    {'detail': 'No image provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Preprocess the image
            img_array = self.preprocess_image(image)

            # Make prediction
            predictions = self.model.predict(img_array)
            predicted_class = self.class_names[np.argmax(predictions[0])]
            confidence = float(np.max(predictions[0]) * 100)

            # Get disease information
            disease_info = self.get_disease_info(predicted_class)

            # Create response data
            response_data = {
                'disease_name': predicted_class.replace('_', ' ').replace('(', '').replace(')', ''),
                'confidence': round(confidence, 2),
                'description': disease_info['description'],
                'remedies': disease_info['remedies'],
                'prevention_tips': disease_info['prevention_tips']
            }

            # Save the detection result
            PlantDisease.objects.create(
                user=request.user,
                image=image,
                disease_name=response_data['disease_name'],
                confidence=response_data['confidence'],
                description=response_data['description'],
                remedies=response_data['remedies'],
                prevention_tips=response_data['prevention_tips']
            )

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )