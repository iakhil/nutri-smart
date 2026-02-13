import { API_BASE_URL } from '../config';
import * as SecureStore from 'expo-secure-store';

/**
 * Profile service for managing user profile data
 */
export const profileService = {
  /**
   * Get user profile from backend
   */
  async getProfile() {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // FastAPI returns errors in "detail" field
        throw new Error(data.detail || data.error || 'Failed to fetch profile');
      }

      return {
        success: true,
        profile: data.profile,
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch profile',
      };
    }
  },

  /**
   * Update user profile on backend
   */
  async updateProfile({ allergies, goals, dietaryRestrictions }) {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          allergies: allergies || [],
          goals: goals || null,
          dietaryRestrictions: dietaryRestrictions || [],
        }),
      });

      // Check if response is OK before parsing
      if (!response.ok) {
        // Try to parse error response
        let errorMessage = 'Failed to update profile';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch (e) {
          // If not JSON, get text
          const text = await response.text();
          console.error('Non-JSON error response:', text);
          errorMessage = text.substring(0, 200) || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      return {
        success: true,
        profile: data.profile,
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile',
      };
    }
  },
};
