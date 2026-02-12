const pool = require('../config/database');

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created users table');

    // Create user_profiles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        allergies TEXT[] DEFAULT '{}',
        goals VARCHAR(50),
        dietary_restrictions TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);
    console.log('✅ Created user_profiles table');

    // Create food_scans table (for storing scan history)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS food_scans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_name VARCHAR(255),
        image_uri TEXT,
        analysis_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created food_scans table');

    // Create index on user_id for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_food_scans_user_id ON food_scans(user_id)
    `);
    console.log('✅ Created indexes');

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrate();
