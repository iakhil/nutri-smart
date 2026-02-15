// Configuration file for API keys and other settings
// For production, use environment variables or secure storage

// To set your Gemini API key:
// 1. Get your API key from https://aistudio.google.com/apikey
// 2. Create a .env file in the root directory with: EXPO_PUBLIC_GEMINI_API_KEY=your_api_key_here
// 3. Or set it directly here (not recommended for production):
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Backend API URL
// For development, use your local IP address (e.g., http://192.168.1.100:3000)
// For production, use your deployed backend URL
// IMPORTANT: Mobile devices cannot access 'localhost', use your computer's IP address
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.67:3000';

// If you prefer to set it directly (for testing only):
// export const GEMINI_API_KEY = 'your_api_key_here';
// export const API_BASE_URL = 'http://your-ip-address:3000';
