import pool from './config.js';

const createTables = async () => {
  try {
    console.log('Creating database tables...');

    // Create tags table
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE IF NOT EXISTS tags (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL UNIQUE,
        icon_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create restaurants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
        ratings_count VARCHAR(50) NOT NULL DEFAULT '0',
        is_open BOOLEAN NOT NULL DEFAULT false,
        status VARCHAR(100) NOT NULL DEFAULT 'Currently closed',
        promo_text TEXT,
        delivery_info TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS restaurant_tags (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        UNIQUE(restaurant_id, tag_id)
      );
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_restaurants_name ON restaurants(name);
      CREATE INDEX IF NOT EXISTS idx_restaurants_rating ON restaurants(rating DESC);
      CREATE INDEX IF NOT EXISTS idx_restaurants_created_at ON restaurants(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_restaurant_tags_restaurant_id ON restaurant_tags(restaurant_id);
      CREATE INDEX IF NOT EXISTS idx_restaurant_tags_tag_id ON restaurant_tags(tag_id);
    `);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  createTables()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default createTables;