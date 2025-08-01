from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
import os
from django.core.files.base import ContentFile
import base64
import numpy as np
from PIL import Image
import io
import tensorflow as tf
import json
import logging
from .predict import load_trained_model, predict_image
from .services import GeminiService

# Set up logging
logger = logging.getLogger(__name__)

# Create your views here.

class DetectDiseaseAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            # Load model and class names when the view is initialized
            self.model, self.class_names = load_trained_model()
            logger.info("Model and class names loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self.model = None
            self.class_names = None
        
        # Initialize Gemini service
        self.gemini_service = GeminiService()

    def post(self, request, *args, **kwargs):
        """Handle image upload and disease prediction"""
        try:
            # Get the image from request
            image = request.FILES.get('image')
            if not image:
                return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get language preference from request (default to 'bn' for Bangla)
            language = request.data.get('language', 'bn')
            if language not in ['en', 'bn']:
                language = 'bn'  # Default to Bangla if invalid language
            
            logger.info(f"Received image: {image.name} with language: {language}")
            
            # Convert image to RGB
            img = Image.open(image)
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize image
            img = img.resize((224, 224))
            
            # Convert to array and normalize
            img_array = np.array(img)
            img_array = img_array.astype('float32') / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            # Make prediction
            predictions = self.model.predict(img_array)
            predicted_class = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class])
            
            # Get class name
            class_name = self.class_names[str(predicted_class)]
            logger.info(f"Predicted class: {class_name} with confidence: {confidence}")
            
            # Parse plant name and disease name
            plant_name, disease_name = class_name.split('___')
            plant_name = plant_name.replace('_', ' ').strip()
            disease_name = disease_name.replace('_', ' ').strip()
            
            # Get top 3 predictions
            top_3_indices = np.argsort(predictions[0])[-3:][::-1]
            top_3_predictions = {
                self.class_names[str(i)].split('___')[1].replace('_', ' ').strip(): float(predictions[0][i])
                for i in top_3_indices
            }
            
            # Determine if plant is healthy
            is_healthy = 'healthy' in disease_name.lower()
            
            # Get additional information from Gemini API with language preference
            if is_healthy:
                # Get care tips for healthy plants
                plant_info = self.gemini_service.get_healthy_plant_info(plant_name, language)
                additional_info = {
                    'description': plant_info.get('description', ''),
                    'care_tips': plant_info.get('care_tips', [])
                }
            else:
                # Get disease description and remedies
                disease_info = self.gemini_service.get_disease_info(plant_name, disease_name, language)
                additional_info = {
                    'description': disease_info.get('description', ''),
                    'remedies': disease_info.get('remedies', [])
                }
            
            # Prepare response
            response_data = {
                'plant_name': plant_name,
                'disease_name': disease_name,
                'confidence': confidence,
                'is_healthy': is_healthy,
                'top_3_predictions': top_3_predictions,
                'additional_info': additional_info
            }
            
            logger.info(f"Response data: {response_data}")
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}", exc_info=True)
            return Response(
                {'error': f'Error processing image: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

