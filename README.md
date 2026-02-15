# Aisle Scan - Smart Grocery Assistant

A React Native + Expo app that helps users make informed grocery shopping decisions by analyzing food labels based on their personal health profile.

## Features

- 🔐 **Authentication**: Secure login and signup with token-based authentication
- 📸 **Food Label Scanning**: Take photos or select images of ingredient and nutrition labels
- 👤 **Personalized Profile**: Set allergies, health goals, and dietary restrictions
- 📊 **Smart Analysis**: Get detailed analysis with pros/cons and scores for health, fulfilling, and taste
- 🎯 **Goal-Based Recommendations**: Tailored suggestions based on your health goals (weight loss, muscle building, etc.)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- PostgreSQL (v12 or higher)
- iOS Simulator (for Mac) or Android Studio (for Android development)
- **Gemini API Key** - Get a free API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

#### 1. Set Up Backend Server

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **Create Database**:
   ```sql
   CREATE DATABASE nutri_smart;
   ```

3. **Set Up Backend**:
   ```bash
   cd server
   npm install
   ```

4. **Configure Backend Environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `server/.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nutri_smart
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   JWT_SECRET=your_super_secret_jwt_key
   PORT=3000
   ```

5. **Run Database Migrations**:
   ```bash
   npm run migrate
   ```

6. **Start Backend Server**:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000`

#### 2. Set Up Mobile App

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```
   
   **Important**: For mobile devices, replace `localhost` with your computer's IP address:
   - Find your IP: `ifconfig | grep "inet "` (macOS/Linux) or `ipconfig` (Windows)
   - Example: `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000`

3. **Start Expo Development Server**:
   ```bash
   npm start
   ```

4. **Run on Your Preferred Platform**:
   - iOS: Press `i` in the terminal or run `npm run ios`
   - Android: Press `a` in the terminal or run `npm run android`
   - Web: Press `w` in the terminal or run `npm run web`

## Project Structure

```
aisle-scan/
├── App.js                 # Main app component with navigation and auth flow
├── config.js              # API key and backend URL configuration
├── context/
│   ├── AuthContext.js     # Authentication state management
│   └── UserContext.js     # User profile state management
├── services/
│   ├── authService.js     # Authentication service (connects to backend API)
│   ├── profileService.js  # Profile service (connects to backend API)
│   └── geminiService.js   # Gemini API integration for food analysis
├── screens/
│   ├── LoginScreen.js     # User login screen
│   ├── SignupScreen.js    # User signup screen
│   ├── HomeScreen.js      # Welcome/home screen
│   ├── ProfileScreen.js   # User profile management
│   ├── CameraScreen.js    # Camera/image picker for food labels
│   └── ResultsScreen.js   # Display analysis results
├── server/                # Backend server
│   ├── server.js          # Express server entry point
│   ├── config/
│   │   └── database.js    # PostgreSQL connection
│   ├── models/
│   │   └── User.js        # User model
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   └── profile.js     # Profile routes
│   └── scripts/
│       └── migrate.js     # Database migration script
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

## Backend Architecture

The app uses a **PostgreSQL database** with a **Node.js/Express backend**:

### Database Schema

- **users**: Stores user accounts (email, password hash, name)
- **user_profiles**: Stores user preferences (allergies, goals, dietary restrictions)
- **food_scans**: Stores food scan history (for future features)

### API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/profile` - Get user profile (authenticated)
- `PUT /api/profile` - Update user profile (authenticated)

### Authentication

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Protected Routes**: API endpoints require authentication
- **Session Persistence**: Tokens stored securely on device

See `server/README.md` for detailed backend setup instructions.

## Technologies Used

- React Native
- Expo
- React Navigation
- Expo Camera
- Expo Image Picker
- Expo Linear Gradient
- Expo File System
- Expo SecureStore (for secure token storage)
- Expo Crypto (for password hashing)
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
