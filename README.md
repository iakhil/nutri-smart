# NutriSmart - Smart Grocery Assistant

A React Native + Expo app that helps users make informed grocery shopping decisions by analyzing food labels based on their personal health profile.

## Features

- 📸 **Food Label Scanning**: Take photos or select images of ingredient and nutrition labels
- 👤 **Personalized Profile**: Set allergies, health goals, and dietary restrictions
- 📊 **Smart Analysis**: Get detailed analysis with pros/cons and scores for health, fulfilling, and taste
- 🎯 **Goal-Based Recommendations**: Tailored suggestions based on your health goals (weight loss, muscle building, etc.)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
- iOS: Press `i` in the terminal or run `npm run ios`
- Android: Press `a` in the terminal or run `npm run android`
- Web: Press `w` in the terminal or run `npm run web`

## Project Structure

```
nutri-smart/
├── App.js                 # Main app component with navigation
├── context/
│   └── UserContext.js     # User profile state management
├── screens/
│   ├── HomeScreen.js      # Welcome/home screen
│   ├── ProfileScreen.js   # User profile management
│   ├── CameraScreen.js    # Camera/image picker for food labels
│   └── ResultsScreen.js   # Display analysis results
└── assets/                # Images and icons
```

## Next Steps

### Backend Integration

Currently, the app uses mock data for food analysis. To make it fully functional, you'll need to:

1. **Set up a backend API** that can:
   - Process images using OCR (Optical Character Recognition) to extract text from food labels
   - Analyze ingredients and nutrition facts
   - Consider user profile (allergies, goals, restrictions)
   - Return structured analysis data

2. **Recommended Services**:
   - **OCR**: Google Cloud Vision API, AWS Textract, or Tesseract.js
   - **Food Database**: USDA FoodData Central API, Open Food Facts API
   - **Nutrition Analysis**: Custom ML model or nutrition analysis API

3. **Update CameraScreen.js**:
   - Replace the mock `analyzeFood` function with actual API calls
   - Add image upload functionality
   - Handle API responses and errors

### Example API Integration

```javascript
const analyzeFood = async () => {
  if (!imageUri) {
    Alert.alert('No Image', 'Please take or select a photo first');
    return;
  }

  setIsProcessing(true);
  
  try {
    // Convert image to base64 or FormData
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'food-label.jpg',
    });
    formData.append('userProfile', JSON.stringify(userProfile));

    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const analysis = await response.json();
    
    navigation.navigate('Results', {
      imageUri,
      analysis,
    });
  } catch (error) {
    Alert.alert('Error', 'Failed to analyze food label');
  } finally {
    setIsProcessing(false);
  }
};
```

## Features to Add

- [ ] History of scanned products
- [ ] Barcode scanning for quick product lookup
- [ ] Comparison between similar products
- [ ] Shopping list integration
- [ ] Nutritional tracking over time
- [ ] Social sharing of analysis results
- [ ] Offline mode with cached analysis

## Technologies Used

- React Native
- Expo
- React Navigation
- Expo Camera
- Expo Image Picker
- Expo Linear Gradient

## License

MIT
