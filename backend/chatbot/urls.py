from django.urls import path
from . import views
#import nltk

urlpatterns = [
    path('process-documents/', views.process_existing_documents, name='process-documents'),
    path('ask/', views.ask_question, name='chatbot-ask'),
    # path('evaluate/', EvaluationAPIView.as_view(), name='admin-evaluate'),
]

#nltk.data.path.append('E:/systemproject/AgriAssist1/backend/nltk_data')