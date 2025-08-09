import random
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.hashers import make_password

from api import models as api_models
from datetime import timedelta
from django.utils import timezone
from api.utils import *

# Define a custom serializer that inherits from TokenObtainPairSerializer
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    '''
    class MyTokenObtainPairSerializer(TokenObtainPairSerializer):: This line creates a new token serializer called MyTokenObtainPairSerializer that is based on an existing one called TokenObtainPairSerializer. Think of it as customizing the way tokens work.
    @classmethod: This line indicates that the following function is a class method, which means it belongs to the class itself and not to an instance (object) of the class.
    def get_token(cls, user):: This is a function (or method) that gets called when we want to create a token for a user. The user is the person who's trying to access something on the website.
    token = super().get_token(user): Here, it's asking for a regular token from the original token serializer (the one it's based on). This regular token is like a key to enter the website.
    token['full_name'] = user.full_name, token['email'] = user.email, token['username'] = user.username: This code is customizing the token by adding extra information to it. For example, it's putting the user's full name, email, and username into the token. These are like special notes attached to the key.
    return token: Finally, the customized token is given back to the user. Now, when this token is used, it not only lets the user in but also carries their full name, email, and username as extra information, which the website can use as needed.
    '''
    @classmethod
    # Define a custom method to get the token for a user
    def get_token(cls, user):
        # Call the parent class's get_token method
        token = super().get_token(user)

        # Add custom claims to the token
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        try:
            token['vendor_id'] = user.vendor.id
        except:
            token['vendor_id'] = 0

        # ...

        # Return the token with custom claims
        return token

# # Define a serializer for user registration, which inherits from serializers.ModelSerializer
# class RegisterSerializer(serializers.ModelSerializer):
#     # Define fields for the serializer, including password and password2
#     password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
#     password2 = serializers.CharField(write_only=True, required=True)

#     class Meta:
#         # Specify the model that this serializer is associated with
#         model = api_models.User
#         # Define the fields from the model that should be included in the serializer
#         fields = ('full_name', 'email',  'password', 'password2')

#     def validate(self, attrs):
#         # Define a validation method to check if the passwords match
#         if attrs['password'] != attrs['password2']:
#             # Raise a validation error if the passwords don't match
#             raise serializers.ValidationError({"password": "Password fields didn't match."})

#         # Return the validated attributes
#         return attrs

#     def create(self, validated_data):
#         # Define a method to create a new user based on validated data
#         user = api_models.User.objects.create(
#             full_name=validated_data['full_name'],
#             email=validated_data['email'],
#             is_active=False
#         )
#         email_username, mobile = user.email.split('@')
#         user.username = email_username

#         # Set the user's password based on the validated data
#         otp = str(random.randint(100000, 999999))
#         user.otp = otp
#         user.otp_created_at = timezone.now()
#         user.set_password(validated_data['password'])
#         user.save()
        
#         send_otp_email(user.email, otp)
#         return user

# serializers.py
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = api_models.PendingUser  # Changed from User to PendingUser
        fields = ('full_name', 'email', 'password', 'password2')

    def validate(self, attrs):
        # Check if email exists in either User or PendingUser
        if api_models.User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({
                "email": ["An account with this email already exists. Please login instead."]
            })
        
        if api_models.PendingUser.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({
                "email": ["Verification already pending for this email. Please check your email or try again later."]
            })

        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password2": ["Password fields didn't match."]
            })

        return attrs

    def create(self, validated_data):
        # Create PendingUser instead of User
        otp = str(random.randint(100000, 999999))
        expires_at = timezone.now() + timedelta(minutes=10)
        
        pending_user = api_models.PendingUser.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
            password=make_password(validated_data['password']),  # Hash password
            otp=otp,
            expires_at=expires_at
        )
        
        send_otp_email(pending_user.email, otp)
        return pending_user    
        

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.User
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = api_models.Profile
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data
        return response

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()



class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    '''
        category.post_set: In Django, when you define a ForeignKey relationship from one model to another 
        (e.g., Post model having a ForeignKey relationship to the Category model), 
        Django creates a reverse relationship from the related model back to the model that has the ForeignKey. 
        By default, this reverse relationship is named <model>_set. In this case, since the Post model has a 
        ForeignKey to the Category model, Django creates a reverse relationship from Category to Post named post_set. 
        This allows you to access all Post objects related to a Category instance.
    '''
    def get_post_count(self, category):
        return category.posts.count()
    
    class Meta:
        model = api_models.Category
        fields = [
            "id",
            "title",
            "image",
            "slug",
            "post_count",
        ]

    def __init__(self, *args, **kwargs):
        super(CategorySerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3


 
class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = api_models.PostImage
        fields = ['id', 'image', 'caption', 'order', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    user_profile = serializers.SerializerMethodField()
    post_images = PostImageSerializer(many=True, read_only=True)
    all_images = serializers.SerializerMethodField()

    class Meta:
        model = api_models.Post
        fields = "__all__"

    def get_user_profile(self, obj):
        try:
            return {
                'id': obj.profile.id,
                'full_name': obj.profile.full_name,
                'image': obj.profile.image.url if obj.profile.image else None,
                'bio': obj.profile.bio,
                'author': obj.profile.author
            }
        except:
            return None

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return api_models.Bookmark.objects.filter(user=request.user, post=obj).exists()
        return False

    def get_comments(self, obj):
        comments = obj.comments.filter(parent=None).order_by('-date')
        return CommentSerializer(comments, many=True, context=self.context).data

    def get_all_images(self, obj):
        """Get all images including main image and additional images"""
        images = []
        if obj.image:
            images.append({
                'id': 'main',
                'image': obj.image.url if obj.image else None,
                'caption': 'Main Image',
                'order': 0
            })
        
        # Add additional images
        for post_image in obj.post_images.all():
            images.append({
                'id': post_image.id,
                'image': post_image.image.url if post_image.image else None,
                'caption': post_image.caption,
                'order': post_image.order + 1
            })
        
        return sorted(images, key=lambda x: x['order'])


class CommentSerializer(serializers.ModelSerializer):
    user_profile = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    parent = serializers.PrimaryKeyRelatedField(queryset=api_models.Comment.objects.all(), required=False)
    depth = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = api_models.Comment
        fields = ['id', 'user', 'user_profile', 'post', 'comment', 'date', 'replies', 
                 'is_liked', 'likes_count', 'parent', 'depth']
        read_only_fields = ['user', 'date']

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get('request')
        if request and request.method in ['PUT', 'PATCH']:
            # Make post field optional for updates
            if 'post' in fields:
                fields['post'].required = False
        return fields

    def get_user_profile(self, obj):
        try:
            profile = api_models.Profile.objects.get(user=obj.user)
            return {
                'username': obj.user.username,  # Get username from User model
                'profile_picture': profile.image.url if profile.image else None,
                'full_name': profile.full_name
            }
        except api_models.Profile.DoesNotExist:
            return None
    def get_replies(self, obj):
        current_depth = self.context.get('current_depth', 0)
        max_depth = self.context.get('max_depth', 5)

        if current_depth >= max_depth:
            return []

        replies = obj.replies.filter(is_deleted=False).order_by('date')

        return CommentSerializer(
            replies,
            many=True,
            context={
                'current_depth': current_depth + 1,
                'max_depth': max_depth,
                'request': self.context.get('request')
            }
        ).data
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_likes_count(self, obj):
        return obj.likes.count()

    def validate(self, data):
        # Ensure post_id is provided when creating a comment, not when updating
        request = self.context.get('request')
        if request and request.method == 'POST' and not data.get('post'):
            raise serializers.ValidationError("post_id is required")
        return data

    def create(self, validated_data):
        # Set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class BookmarkSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = api_models.Bookmark
        fields = "__all__"


    def __init__(self, *args, **kwargs):
        super(BookmarkSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3
    
class NotificationSerializer(serializers.ModelSerializer):  
    user_profile = serializers.SerializerMethodField()
    actor_profile = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()
    date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S.%fZ")

    class Meta:
        model = api_models.Notification
        fields = "__all__"

    def get_user_profile(self, obj):
        try:
            profile = api_models.Profile.objects.get(user=obj.user)
            return {
                'username': obj.user.username,
                'profile_picture': profile.image.url if profile.image else None,
                'full_name': profile.full_name
            }
        except api_models.Profile.DoesNotExist:
            return None

    def get_post(self, obj):
        try:
            return {
                'id': obj.post.id,
                'title': obj.post.title,
                'slug': obj.post.slug
            }
        except:
            return None

    def get_actor_profile(self, obj):
        try:
            if obj.actor:
                profile = api_models.Profile.objects.get(user=obj.actor)
                return {
                    'username': obj.actor.username,
                    'profile_picture': profile.image.url if profile.image else None,
                    'full_name': profile.full_name
                }
            return None
        except api_models.Profile.DoesNotExist:
            return None

    def __init__(self, *args, **kwargs):
        super(NotificationSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and request.method == 'POST':
            self.Meta.depth = 0
        else:
            self.Meta.depth = 3
#author serializer
class AuthorStats(serializers.Serializer):
    views = serializers.IntegerField(default=0)
    posts = serializers.IntegerField(default=0)
    likes = serializers.IntegerField(default=0)
    bookmarks = serializers.IntegerField(default=0)