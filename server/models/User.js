const pool = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create({ email, password, name }) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email, passwordHash, name]
    );

    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async verifyPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }

  static async updateProfile(userId, { allergies, goals, dietaryRestrictions }) {
    // First, check if profile exists
    const existingProfile = await pool.query(
      'SELECT id FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    if (existingProfile.rows.length === 0) {
      // Create new profile
      await pool.query(
        `INSERT INTO user_profiles (user_id, allergies, goals, dietary_restrictions)
         VALUES ($1, $2, $3, $4)`,
        [userId, allergies || [], goals || null, dietaryRestrictions || []]
      );
    } else {
      // Update existing profile
      await pool.query(
        `UPDATE user_profiles
         SET allergies = $1, goals = $2, dietary_restrictions = $3, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $4`,
        [allergies || [], goals || null, dietaryRestrictions || [], userId]
      );
    }

    return this.getProfile(userId);
  }

  static async getProfile(userId) {
    const result = await pool.query(
      `SELECT allergies, goals, dietary_restrictions
       FROM user_profiles
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || { allergies: [], goals: null, dietaryRestrictions: [] };
  }
}

module.exports = User;
