# api/utils.py
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

# def send_otp_email(email, otp, is_password_reset=False):
#     subject = "Password Reset OTP" if is_password_reset else "Email Verification"
#     template = "emails/password_reset.html" if is_password_reset else "emails/verify_email.html"
    
#     context = {'otp': otp, 'is_password_reset': is_password_reset}
#     html_content = render_to_string(template, context)
#     text_content = strip_tags(html_content)
    
#     email_msg = EmailMultiAlternatives(
#         subject,
#         text_content,
#         settings.DEFAULT_FROM_EMAIL,
#         [email]
#     )
#     email_msg.attach_alternative(html_content, "text/html")
#     email_msg.send()
def send_otp_email(email, otp, is_password_reset=False):
    print("Sending email to:", email)
    print("OTP:", otp)

    subject = "Password Reset OTP" if is_password_reset else "Email Verification"
    template = "emails/password_reset.html" if is_password_reset else "emails/verify_email.html"
    
    context = {'otp': otp, 'is_password_reset': is_password_reset}
    html_content = render_to_string(template, context)
    text_content = strip_tags(html_content)
    
    email_msg = EmailMultiAlternatives(
        subject,
        text_content,
        settings.DEFAULT_FROM_EMAIL,
        [email]
    )
    email_msg.attach_alternative(html_content, "text/html")
    
    try:
        email_msg.send()
        print("✅ Email sent successfully!")
    except Exception as e:
        print("❌ Failed to send email:", e)


# # Full Django Backend Code for Email Verification & OTP Password Reset

# # --- settings.py ---
# # Add this to your settings.py
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'your_email@gmail.com'
# EMAIL_HOST_PASSWORD = 'your_app_password'

# # Add 'rest_framework' and 'corsheaders' in INSTALLED_APPS and configure CORS

# # --- models.py ---
# from django.contrib.auth.models import AbstractUser
# from django.db import models
# import random

# class CustomUser(AbstractUser):
#     is_verified = models.BooleanField(default=False)
#     otp = models.CharField(max_length=6, blank=True, null=True)

#     def generate_otp(self):
#         self.otp = ''.join(random.choices('0123456789', k=6))
#         self.save()

# # --- serializers.py ---
# from rest_framework import serializers
# from .models import CustomUser
# from django.contrib.auth.password_validation import validate_password

# class RegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ('username', 'email', 'password')
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = CustomUser.objects.create_user(**validated_data)
#         user.generate_otp()
#         user.save()
#         return user

# class VerifyEmailSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     otp = serializers.CharField(max_length=6)

# class ResetPasswordSerializer(serializers.Serializer):
#     email = serializers.EmailField()

# class ConfirmResetPasswordSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     otp = serializers.CharField(max_length=6)
#     new_password = serializers.CharField(write_only=True)

# # --- views.py ---
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.core.mail import send_mail
# from .models import CustomUser
# from .serializers import *

# class RegisterView(APIView):
#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             send_mail(
#                 'Verify your email',
#                 f'Your verification OTP is {user.otp}',
#                 'from@example.com',
#                 [user.email]
#             )
#             return Response({'message': 'User registered. OTP sent to email.'})
#         return Response(serializer.errors, status=400)

# class VerifyEmailView(APIView):
#     def post(self, request):
#         serializer = VerifyEmailSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 user = CustomUser.objects.get(email=serializer.validated_data['email'])
#                 if user.otp == serializer.validated_data['otp']:
#                     user.is_verified = True
#                     user.otp = ''
#                     user.save()
#                     return Response({'message': 'Email verified successfully'})
#                 else:
#                     return Response({'error': 'Invalid OTP'}, status=400)
#             except CustomUser.DoesNotExist:
#                 return Response({'error': 'User not found'}, status=404)
#         return Response(serializer.errors, status=400)

# class RequestResetPasswordView(APIView):
#     def post(self, request):
#         serializer = ResetPasswordSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 user = CustomUser.objects.get(email=serializer.validated_data['email'])
#                 user.generate_otp()
#                 send_mail('Reset your password', f'Your OTP is {user.otp}', 'from@example.com', [user.email])
#                 return Response({'message': 'OTP sent to email'})
#             except CustomUser.DoesNotExist:
#                 return Response({'error': 'User not found'}, status=404)
#         return Response(serializer.errors, status=400)

# class ConfirmResetPasswordView(APIView):
#     def post(self, request):
#         serializer = ConfirmResetPasswordSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 user = CustomUser.objects.get(email=serializer.validated_data['email'])
#                 if user.otp == serializer.validated_data['otp']:
#                     user.set_password(serializer.validated_data['new_password'])
#                     user.otp = ''
#                     user.save()
#                     return Response({'message': 'Password reset successful'})
#                 else:
#                     return Response({'error': 'Invalid OTP'}, status=400)
#             except CustomUser.DoesNotExist:
#                 return Response({'error': 'User not found'}, status=404)
#         return Response(serializer.errors, status=400)

# # --- urls.py ---
# from django.urls import path
# from .views import *

# urlpatterns = [
#     path('register/', RegisterView.as_view()),
#     path('verify-email/', VerifyEmailView.as_view()),
#     path('request-reset-password/', RequestResetPasswordView.as_view()),
#     path('confirm-reset-password/', ConfirmResetPasswordView.as_view()),
# ]

# # Don't forget to use your CustomUser model in settings.py
# AUTH_USER_MODEL = 'yourapp.CustomUser'
