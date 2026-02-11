import * as Crypto from 'expo-crypto';

// In-memory storage for demo purposes
// In production, this would connect to your backend API
const users = [];

/**
 * Mock authentication service
 * In production, replace this with actual API calls to your backend
 */
export const authService = {
  /**
   * Login user with email and password
   */
  async login(email, password) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // In production, passwords should be hashed and compared securely
    // For demo, we're storing a simple hash
    const passwordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid password' };
    }

    // Generate a simple token (in production, use JWT from your backend)
    const token = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${email}-${Date.now()}`
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },

  /**
   * Sign up a new user
   */
  async signup(email, password, name) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // Validate input
    if (!email || !password || !name) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Hash password
    const passwordHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      passwordHash,
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Generate token
    const token = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${email}-${Date.now()}`
    );

    return {
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  },

  /**
   * Verify token (for protected routes)
   */
  async verifyToken(token) {
    // In production, verify token with your backend
    // For demo, just check if token exists
    return token !== null;
  },
};
