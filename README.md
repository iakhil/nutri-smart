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
- **Gemini API Key** - Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. Install dependencies:
```bash
npm install
```

2. **Set up your Gemini API Key:**

   Option A: Using environment variable (Recommended)
   - Create a `.env` file in the root directory
   - Add: `EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here`
   - Restart your Expo development server

   Option B: Direct configuration (For testing only)
   - Edit `config.js` and set your API key directly
   - **Note:** Never commit API keys to version control!

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- iOS: Press `i` in the terminal or run `npm run ios`
- Android: Press `a` in the terminal or run `npm run android`
- Web: Press `w` in the terminal or run `npm run web`

## Project Structure

```
nutri-smart/
├── App.js                 # Main app component with navigation
├── config.js              # API key configuration
├── context/
│   └── UserContext.js     # User profile state management
├── services/
│   └── geminiService.js   # Gemini API integration for food analysis
├── screens/
│   ├── HomeScreen.js      # Welcome/home screen
│   ├── ProfileScreen.js   # User profile management
│   ├── CameraScreen.js    # Camera/image picker for food labels
│   └── ResultsScreen.js   # Display analysis results
└── assets/                # Images and icons
```

## How It Works

The app uses **Google Gemini 2.5 Flash** API to analyze food labels:

1. **Image Processing**: When you take or select a photo of a food label, the image is converted to base64 format
2. **AI Analysis**: Gemini's multimodal capabilities analyze both the ingredients list and nutrition facts panel
3. **Personalized Results**: The analysis considers your profile (allergies, goals, dietary restrictions) to provide tailored insights
4. **Structured Output**: Using Gemini's structured output feature, the API returns JSON with:
   - Product name and summary
   - Pros and cons based on nutrition science
   - Scores (0-10) for health, fulfilling, and taste

## API Integration Details

The app uses the `@google/genai` SDK to interact with Gemini API. The `geminiService.js` file handles:
- Image to base64 conversion
- API request formatting with structured JSON schema
- User profile context integration
- Error handling and response parsing

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
- Expo File System
- **Google Gemini 2.5 Flash API** (`@google/genai`)

## Troubleshooting

### API Key Issues

If you see an error about the API key:
1. Make sure you've set `EXPO_PUBLIC_GEMINI_API_KEY` in your `.env` file
2. Restart your Expo development server after adding the environment variable
3. Verify your API key is valid at [Google AI Studio](https://aistudio.google.com/apikey)

### Image Analysis Fails

- Ensure the food label image is clear and well-lit
- Make sure both ingredients and nutrition facts are visible
- Check your internet connection
- Verify you have API quota remaining (free tier has limits)

## License

MIT
