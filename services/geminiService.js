import { GoogleGenAI } from '@google/genai';
import { File } from 'expo-file-system';
import { GEMINI_API_KEY } from '../config';

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file or update config.js');
}

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

/**
 * Get MIME type from image URI
 */
const getImageMimeType = (uri) => {
  const extension = uri.split('.').pop().toLowerCase();
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    heic: 'image/heic',
    heif: 'image/heif',
  };
  return mimeTypes[extension] || 'image/jpeg'; // Default to JPEG
};

/**
 * Convert image URI to base64 string
 */
const imageToBase64 = async (uri) => {
  try {
    // Use the new File API from expo-file-system
    const file = new File(uri);
    const base64 = await file.base64();
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

/**
 * Analyze food label image using Gemini API
 * @param {string} imageUri - URI of the food label image
 * @param {object} userProfile - User profile with allergies, goals, dietary restrictions
 * @returns {Promise<object>} Analysis result with product info, pros, cons, and scores
 */
export const analyzeFoodLabel = async (imageUri, userProfile) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.');
    }

    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);
    const mimeType = getImageMimeType(imageUri);

    // Build user context string
    const userContext = buildUserContext(userProfile);

    // Create the prompt
    const prompt = `You are a nutrition expert analyzing a food product label. Analyze the ingredients list and nutrition facts panel in this image.

${userContext}

Please provide a comprehensive analysis of this food product. Extract all visible information including:
- Product name
- Ingredients list
- Nutrition facts (calories, macronutrients, vitamins, minerals, etc.)
- Any allergen warnings or dietary information

Then provide:
1. A brief summary of the product
2. Pros (positive aspects based on nutrition science)
3. Cons (negative aspects, potential health concerns, allergens based on user profile)
4. Scores out of 10 for:
   - Health: Overall nutritional value and healthiness
   - Fulfilling: How satiating/nutritious this product is
   - Taste: Estimated taste quality (based on ingredients and typical formulations)

Be specific and consider the user's profile when identifying pros and cons.`;

    // Define JSON schema for structured output
    const jsonSchema = {
      type: 'object',
      properties: {
        productName: {
          type: 'string',
          description: 'The name of the product as shown on the label',
        },
        summary: {
          type: 'string',
          description: 'A brief summary of the product and its nutritional profile',
        },
        pros: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of positive aspects of this product',
        },
        cons: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of negative aspects, health concerns, or issues based on user profile',
        },
        scores: {
          type: 'object',
          properties: {
            health: {
              type: 'integer',
              minimum: 0,
              maximum: 10,
              description: 'Health score out of 10',
            },
            fulfilling: {
              type: 'integer',
              minimum: 0,
              maximum: 10,
              description: 'Fulfilling score out of 10',
            },
            taste: {
              type: 'integer',
              minimum: 0,
              maximum: 10,
              description: 'Taste score out of 10',
            },
          },
          required: ['health', 'fulfilling', 'taste'],
        },
      },
      required: ['productName', 'summary', 'pros', 'cons', 'scores'],
    };

    // Call Gemini API with image and prompt
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
        { text: prompt },
      ],
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: jsonSchema,
        temperature: 0.7,
      },
    });

    // Parse the JSON response
    const analysis = JSON.parse(response.text);

    return analysis;
  } catch (error) {
    console.error('Error analyzing food label:', error);
    throw new Error(`Failed to analyze food label: ${error.message}`);
  }
};

/**
 * Build user context string from user profile
 */
const buildUserContext = (userProfile) => {
  if (!userProfile) {
    return 'No user profile information available.';
  }

  let context = 'User Profile:\n';

  if (userProfile.goals) {
    const goalMap = {
      losing_weight: 'losing weight',
      gaining_weight: 'gaining weight',
      building_body: 'building body/muscle',
      maintaining: 'maintaining current weight',
    };
    context += `- Health Goal: ${goalMap[userProfile.goals] || userProfile.goals}\n`;
  }

  if (userProfile.allergies && userProfile.allergies.length > 0) {
    context += `- Allergies: ${userProfile.allergies.join(', ')}\n`;
  }

  if (userProfile.dietaryRestrictions && userProfile.dietaryRestrictions.length > 0) {
    context += `- Dietary Restrictions: ${userProfile.dietaryRestrictions.join(', ')}\n`;
  }

  return context;
};
