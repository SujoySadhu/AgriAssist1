from django.urls import path
from .views import DetectDiseaseAPIView

urlpatterns = [
    path('detect-disease/', DetectDiseaseAPIView.as_view(), name='detect-disease'),
] 