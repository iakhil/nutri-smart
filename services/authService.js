import { API_BASE_URL } from '../config';

/**
 * Authentication service that connects to the backend API
 */
export const authService = {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // FastAPI returns errors in "detail" field
        return { success: false, error: data.detail || data.error || 'Login failed' };
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check if the server is running.',
      };
    }
  },

  /**
   * Sign up a new user
   */
  async signup(email, password, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        // FastAPI returns errors in "detail" field
        return { success: false, error: data.detail || data.error || 'Signup failed' };
      }

      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'Network error. Please check if the server is running.',
      };
    }
  },

  /**
   * Verify token (for protected routes)
   */
  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },
};
