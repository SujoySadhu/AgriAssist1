# Language Switching Feature

This application now supports both English and Bangla (Bengali) languages with a dynamic language switcher.

## Features

### 🌐 **Language Switcher**
- **Location**: Top navigation bar (next to user menu)
- **Languages**: English (EN) and Bangla (বাং)
- **Default**: English
- **Persistence**: Language preference is saved in localStorage

### 🎯 **Translated Content**
- **Navigation**: All menu items and navigation links
- **Disease Detection**: Complete interface including:
  - Page titles and descriptions
  - Upload instructions
  - Analysis results
  - Disease descriptions and remedies
  - Care tips for healthy plants
  - Caution messages
- **Authentication**: Login, register, and user management
- **Common UI**: Buttons, alerts, and general interface elements

### 🔧 **Technical Implementation**

#### Frontend (React)
- **Language Context**: `src/contexts/LanguageContext.jsx`
- **Language Switcher Component**: `src/components/LanguageSwitcher.jsx`
- **Translation Hook**: `useLanguage()` provides `t()` function and `language` state
- **Local Storage**: Language preference persists across browser sessions

#### Backend (Django)
- **API Integration**: Disease detection API accepts `language` parameter
- **Gemini Service**: Supports both English and Bangla responses
- **Default Language**: Bangla (bn) for disease descriptions

## Usage

### For Users
1. **Switch Language**: Click the language switcher in the top navigation
2. **Select Language**: Choose between English (🇺🇸) or Bangla (🇧🇩)
3. **Automatic Update**: All content updates immediately
4. **Persistent**: Your choice is remembered for future visits

### For Developers

#### Adding New Translations
1. **Update Language Context**: Add new keys to `translations` object in `LanguageContext.jsx`
2. **Use Translation Hook**: Import and use `useLanguage()` in components
3. **Apply Translations**: Replace hardcoded text with `t('key')`

```jsx
import { useLanguage } from '../../contexts/LanguageContext';

const MyComponent = () => {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t('myTitle')}</h1>
      <p>{t('myDescription')}</p>
    </div>
  );
};
```

#### Backend Language Support
1. **API Parameters**: Send `language` parameter with requests
2. **Gemini Service**: Pass language to service methods
3. **Response Handling**: Handle language-specific responses

```python
# In views.py
language = request.data.get('language', 'bn')
disease_info = gemini_service.get_disease_info(plant_name, disease_name, language)
```

## Translation Keys

### Navigation
- `home`, `category`, `agriAssist`, `pages`, `about`, `contact`
- `diseaseDetection`, `login`, `register`, `logout`, `dashboard`

### Disease Detection
- `plantDiseaseDetection`, `uploadDescription`, `dragDropText`
- `selectImage`, `analyzeImage`, `analyzing`
- `healthyPlant`, `diseaseDetected`, `plantInformation`
- `careInformation`, `diseaseInformation`, `description`
- `careTips`, `treatmentRemedies`, `cautionMessage`

### Authentication
- `email`, `password`, `confirmPassword`, `forgotPassword`
- `signIn`, `signUp`, `alreadyHaveAccount`, `dontHaveAccount`

### Common
- `loading`, `error`, `success`, `warning`, `info`
- `save`, `cancel`, `edit`, `delete`, `submit`

## Testing

### Frontend Testing
```bash
# Start the development server
npm run dev

# Test language switching
# 1. Open browser
# 2. Click language switcher
# 3. Verify content changes
# 4. Refresh page to test persistence
```

### Backend Testing
```bash
# Test language functionality
cd backend
python plant_disease/test_language.py

# Test disease detection with different languages
python plant_disease/test_gemini.py
```

## Language Codes
- **English**: `en`
- **Bangla**: `bn`

## Browser Support
- **Local Storage**: Required for language persistence
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: Responsive design works on mobile devices

## Future Enhancements
- [ ] Add more languages (Hindi, Arabic, etc.)
- [ ] RTL (Right-to-Left) language support
- [ ] Language-specific date/time formatting
- [ ] Number formatting based on locale
- [ ] Currency formatting for different regions

## Troubleshooting

### Common Issues
1. **Language not switching**: Check if localStorage is enabled
2. **Missing translations**: Verify translation keys exist in LanguageContext
3. **Backend errors**: Ensure language parameter is being sent correctly
4. **Gemini API errors**: Check API key and network connectivity

### Debug Mode
```javascript
// In browser console
console.log('Current language:', localStorage.getItem('language'));
console.log('Available translations:', window.translations);
```

## Contributing
When adding new features:
1. Always include translations for both languages
2. Test language switching functionality
3. Update this documentation
4. Follow the existing translation key naming convention 