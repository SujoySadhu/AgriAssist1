from django.shortcuts import render
import logging
import traceback
# Create your views here.
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .utils.rag_utils import process_documents, get_answer
import os
from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from django.core.files.storage import default_storage
logger = logging.getLogger(__name__)
api_key = settings.GOOGLE_API_KEY

@api_view(['POST'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([IsAuthenticated])
def process_existing_documents(request):
    try:
        doc_files = request.FILES.getlist('documents')
        
        if not doc_files:
            return Response({"error": "No document files provided"}, status=400)

        # Save documents temporarily and get their paths
        saved_doc_paths = []
        for doc_file in doc_files:
            if not doc_file.name.lower().endswith('.docx'):
                return Response({"error": f"Invalid file type: {doc_file.name}. Only Word documents (.docx) are allowed."}, status=400)
            
            # Save the file
            file_path = default_storage.save(f'chatbot_pdfs/{doc_file.name}', doc_file)
            saved_doc_paths.append(file_path)

        # Process the documents
        process_documents(saved_doc_paths)
        
        return Response({
            "message": f"Processed {len(saved_doc_paths)} documents successfully",
            "files": saved_doc_paths
        }, status=200)
    
    except Exception as e:
        import traceback
        logger.error(f"Document Processing Error: {str(e)}\n{traceback.format_exc()}")
        return Response({
            "error": "Document processing failed",
            "details": str(e)
        }, status=500)
    



@api_view(['POST'])
def ask_question(request):
    try:
        question = request.data.get('question')
        if not question or not question.strip():
            return Response({"error": "Question is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Add request validation
        if len(question) > 500:
            return Response({"error": "Question too long (max 500 chars)"}, status=400)
            
        answer = get_answer(question, api_key)
        return Response({"answer": answer}, status=status.HTTP_200_OK)
    
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        logger.error(f"QA Error: {str(e)}\n{tb}")
        return Response({
            "error": "Failed to process question",
            "details": str(e),
            "trace": tb if settings.DEBUG else "Disabled in production"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
