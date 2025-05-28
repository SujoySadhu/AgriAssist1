import os
import json
import numpy as np
from tensorflow.keras.models import load_model, Sequential
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.efficientnet import preprocess_input
from datetime import datetime
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.regularizers import l2
import base64
import io
from PIL import Image
import logging

# Set up logging
logger = logging.getLogger(__name__)

def load_trained_model():
    """Load the trained model and class indices"""
    try:
        # Get the current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        logger.info(f"Current directory: {current_dir}")
        
        # Load the model from the root directory
        model_path = os.path.join(current_dir, 'plant_disease_prediction_model.h5')
        logger.info(f"Looking for model at: {model_path}")
        
        if not os.path.exists(model_path):
            logger.error(f"Model file not found at {model_path}")
            raise FileNotFoundError(f"Model file not found at {model_path}")
        
        logger.info("Model file found, attempting to load...")
        
        # Load the model directly
        model = tf.keras.models.load_model(model_path)
        logger.info("Model loaded successfully")
        
        # Load class indices from JSON file
        class_indices_path = os.path.join(current_dir, 'class_indices.json')
        logger.info(f"Looking for class indices at: {class_indices_path}")
        
        if not os.path.exists(class_indices_path):
            logger.error(f"Class indices file not found at {class_indices_path}")
            raise FileNotFoundError(f"Class indices file not found at {class_indices_path}")
        
        logger.info("Class indices file found, loading...")
        
        with open(class_indices_path, 'r') as f:
            class_indices = json.load(f)
        
        # The class_indices dictionary already maps indices to class names
        # No need to reverse it
        class_names = class_indices
        logger.info(f"Loaded {len(class_names)} classes")
        
        return model, class_names
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}", exc_info=True)
        raise Exception(f"Error loading model: {str(e)}")

def predict_image(image_data, model, class_names):
    """Make prediction for a single image"""
    try:
        # Convert base64 to image
        if isinstance(image_data, str) and image_data.startswith('data:image'):
            # Remove the data URL prefix
            image_data = image_data.split(',')[1]
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Resize and preprocess the image
        image = image.resize((224, 224))
        img_array = np.array(image)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array.astype('float32') / 255.  # Normalize to [0,1]
        
        # Make prediction
        predictions = model.predict(img_array)
        predicted_class = np.argmax(predictions[0])
        
        # Verify the predicted class is valid
        if str(predicted_class) not in class_names:
            raise ValueError(f"Model predicted invalid class index: {predicted_class}")
            
        confidence = predictions[0][predicted_class]
        
        # Get class name
        class_name = class_names[str(predicted_class)]
        
        # Get top 3 predictions
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        top_3_predictions = {
            class_names[str(i)]: float(predictions[0][i])
            for i in top_3_indices
        }
        
        return {
            'class': class_name,
            'confidence': float(confidence),
            'top_3_predictions': top_3_predictions
        }
    except Exception as e:
        raise Exception(f"Error predicting image: {str(e)}")

def process_test_directory():
    """Process all images in the test directory"""
    try:
        # Load model and class names
        print("Loading model and class indices...")
        model, class_names = load_trained_model()
        print("Model loaded successfully!")
        
        # Path to test directory
        test_dir = 'data/test'
        if not os.path.exists(test_dir):
            raise FileNotFoundError(f"Test directory not found at {test_dir}")
        
        # Get all image files
        image_files = [f for f in os.listdir(test_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        if not image_files:
            print(f"No images found in {test_dir}")
            return
        
        # Create results directory
        results_dir = 'results'
        os.makedirs(results_dir, exist_ok=True)
        
        # Dictionary to store all results
        all_results = {}
        
        # Process each image
        total_images = len(image_files)
        print(f"\nFound {total_images} images to process")
        
        for idx, image_file in enumerate(image_files, 1):
            image_path = os.path.join(test_dir, image_file)
            print(f"\nProcessing image {idx}/{total_images}: {image_file}")
            
            try:
                result = predict_image(image_path, model, class_names)
                all_results[image_file] = result
                
                # Print results for this image
                print(f"Predicted Class: {result['class']}")
                print(f"Confidence: {result['confidence']:.2%}")
                print("Top 3 Predictions:")
                # Sort predictions by confidence and get top 3
                sorted_predictions = sorted(result['top_3_predictions'].items(), 
                                         key=lambda x: x[1], 
                                         reverse=True)[:3]
                for class_name, confidence in sorted_predictions:
                    print(f"{class_name}: {confidence:.2%}")
                
            except Exception as e:
                print(f"Error processing {image_file}: {str(e)}")
                all_results[image_file] = {"error": str(e)}
        
        # Save all results to a JSON file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results_file = os.path.join(results_dir, f'prediction_results_{timestamp}.json')
        
        with open(results_file, 'w') as f:
            json.dump(all_results, f, indent=4)
        
        print(f"\nAll results have been saved to: {results_file}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

def main():
    try:
        # Create a test directory if it doesn't exist
        test_dir = 'data/test'
        os.makedirs(test_dir, exist_ok=True)
        
        print("\nTo test the model:")
        print(f"1. Place your test images in the '{test_dir}' directory")
        print("2. Run this script to process all images")
        print("Example: python predict.py")
        
        # Process all images in test directory
        process_test_directory()
    
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main() 