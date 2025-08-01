import google.generativeai as genai
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = settings.GOOGLE_API_KEY
        if not self.api_key:
            logger.error("GOOGLE_API_KEY not found in settings")
            return
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def get_disease_info(self, plant_name, disease_name, language='bn'):
        """
        Get disease description and remedies using Gemini API
        """
        try:
            if not self.api_key:
                return {
                    'description': 'API key not configured',
                    'remedies': ['Please configure Gemini API key']
                }
            
            # Set language instruction based on parameter
            language_instruction = "IMPORTANT: Please provide all information in Bangla (Bengali) language." if language == 'bn' else "IMPORTANT: Please provide all information in English language."
            
            prompt = f"""
            Provide detailed information about {disease_name} in {plant_name} plants.
            
            Please provide the response in the following JSON format:
            {{
                "description": "A detailed description of the disease, its symptoms, and causes",
                "remedies": [
                    "Remedy 1 description",
                    "Remedy 2 description", 
                    "Remedy 3 description"
                ]
            }}
            
            Focus on:
            1. Clear description of the disease and its symptoms
            2. Practical and effective treatment methods
            3. Prevention strategies
            4. Organic and chemical treatment options
            
            Keep the description informative but concise, and provide 3-5 practical remedies as simple strings.
            
            {language_instruction}
            """
            
            response = self.model.generate_content(prompt)
            
            # Try to parse JSON response
            try:
                import json
                # Extract JSON from the response text
                response_text = response.text
                # Find JSON content between curly braces
                start = response_text.find('{')
                end = response_text.rfind('}') + 1
                if start != -1 and end != 0:
                    json_str = response_text[start:end]
                    result = json.loads(json_str)
                    
                    # Ensure remedies are in the correct format
                    if 'remedies' in result:
                        formatted_remedies = []
                        for remedy in result['remedies']:
                            if isinstance(remedy, str):
                                formatted_remedies.append(remedy)
                            elif isinstance(remedy, dict):
                                # If it's an object, extract the details
                                if 'details' in remedy:
                                    formatted_remedies.append(remedy['details'])
                                elif 'method' in remedy:
                                    formatted_remedies.append(remedy['method'])
                                else:
                                    formatted_remedies.append(str(remedy))
                            else:
                                formatted_remedies.append(str(remedy))
                        result['remedies'] = formatted_remedies
                    
                    return result
                else:
                    # Fallback if JSON parsing fails
                    fallback_message = 'দয়া করে উদ্ভিদ বিশেষজ্ঞের সাথে পরামর্শ করুন' if language == 'bn' else 'Please consult a plant expert for specific treatment'
                    return {
                        'description': response.text,
                        'remedies': [fallback_message]
                    }
            except json.JSONDecodeError:
                # If JSON parsing fails, return the raw response
                fallback_message = 'দয়া করে উদ্ভিদ বিশেষজ্ঞের সাথে পরামর্শ করুন' if language == 'bn' else 'Please consult a plant expert for specific treatment'
                return {
                    'description': response.text,
                    'remedies': [fallback_message]
                }
                
        except Exception as e:
            logger.error(f"Error getting disease info from Gemini: {str(e)}")
            error_message = f'তথ্য পাওয়ার সময় ত্রুটি: {str(e)}' if language == 'bn' else f'Error retrieving information: {str(e)}'
            fallback_message = 'দয়া করে উদ্ভিদ বিশেষজ্ঞের সাথে পরামর্শ করুন' if language == 'bn' else 'Please consult a plant expert for treatment'
            return {
                'description': error_message,
                'remedies': [fallback_message]
            }
    
    def get_healthy_plant_info(self, plant_name, language='bn'):
        """
        Get care tips for healthy plants
        """
        try:
            if not self.api_key:
                return {
                    'description': 'API key not configured',
                    'care_tips': ['Please configure Gemini API key']
                }
            
            # Set language instruction based on parameter
            language_instruction = "IMPORTANT: Please provide all information in Bangla (Bengali) language." if language == 'bn' else "IMPORTANT: Please provide all information in English language."
            
            prompt = f"""
            Provide care tips and best practices for maintaining healthy {plant_name} plants.
            
            Please provide the response in the following JSON format:
            {{
                "description": "General care information for healthy {plant_name} plants",
                "care_tips": [
                    "Care tip 1 description",
                    "Care tip 2 description",
                    "Care tip 3 description"
                ]
            }}
            
            Focus on:
            1. Optimal growing conditions
            2. Watering requirements
            3. Sunlight needs
            4. Fertilization tips
            5. General maintenance
            
            Keep the description informative but concise, and provide 3-5 practical care tips as simple strings.
            
            {language_instruction}
            """
            
            response = self.model.generate_content(prompt)
            
            try:
                import json
                response_text = response.text
                start = response_text.find('{')
                end = response_text.rfind('}') + 1
                if start != -1 and end != 0:
                    json_str = response_text[start:end]
                    result = json.loads(json_str)
                    
                    # Ensure care_tips are in the correct format
                    if 'care_tips' in result:
                        formatted_tips = []
                        for tip in result['care_tips']:
                            if isinstance(tip, str):
                                formatted_tips.append(tip)
                            elif isinstance(tip, dict):
                                # If it's an object, extract the details
                                if 'details' in tip:
                                    formatted_tips.append(tip['details'])
                                else:
                                    formatted_tips.append(str(tip))
                            else:
                                formatted_tips.append(str(tip))
                        result['care_tips'] = formatted_tips
                    
                    return result
                else:
                    fallback_message = 'বর্তমান যত্নের রুটিন চালিয়ে যান' if language == 'bn' else 'Continue with current care routine'
                    return {
                        'description': response.text,
                        'care_tips': [fallback_message]
                    }
            except json.JSONDecodeError:
                fallback_message = 'বর্তমান যত্নের রুটিন চালিয়ে যান' if language == 'bn' else 'Continue with current care routine'
                return {
                    'description': response.text,
                    'care_tips': [fallback_message]
                }
                
        except Exception as e:
            logger.error(f"Error getting healthy plant info from Gemini: {str(e)}")
            error_message = f'তথ্য পাওয়ার সময় ত্রুটি: {str(e)}' if language == 'bn' else f'Error retrieving information: {str(e)}'
            fallback_message = 'বর্তমান যত্নের রুটিন চালিয়ে যান' if language == 'bn' else 'Continue with current care routine'
            return {
                'description': error_message,
                'care_tips': [fallback_message]
            } 