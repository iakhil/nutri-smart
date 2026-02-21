import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';

const getAuthToken = async () => {
  return await SecureStore.getItemAsync('authToken');
};

export const scanService = {
  async saveScan(scanData) {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/scans/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_name: scanData.productName,
          image_uri: scanData.imageUri,
          analysis_data: scanData.analysis,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.error || 'Failed to save scan';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('Error saving scan:', error);
      throw error;
    }
  },

  async getScans() {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/scans/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.error || 'Failed to fetch scans';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('Error fetching scans:', error);
      throw error;
    }
  },

  async getScan(scanId) {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_BASE_URL}/api/scans/${scanId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || data.error || 'Failed to fetch scan';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('Error fetching scan:', error);
      throw error;
    }
  },
};
