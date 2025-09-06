import pool from '../database/config.js';

class StorageService {
  
  /**
   * Get restaurants with optional filtering and sorting
   */
  async getRestaurants({ search, tagIds, sortBy } = {}) {
    try {
      let query = `
        SELECT 
          r.id,
          r.name,
          r.image_url,
          r.rating,
          r.ratings_count,
          r.is_open,
          r.status,
          r.promo_text,
          r.delivery_info,
          r.created_at,
          COALESCE(
            JSON_AGG(
              CASE WHEN t.id IS NOT NULL 
              THEN JSON_BUILD_OBJECT('id', t.id, 'name', t.name, 'iconUrl', t.icon_url)
              ELSE NULL END
            ) FILTER (WHERE t.id IS NOT NULL), 
            '[]'
          ) as tags
        FROM restaurants r
        LEFT JOIN restaurant_tags rt ON r.id = rt.restaurant_id
        LEFT JOIN tags t ON rt.tag_id = t.id
      `;
      
      const conditions = [];
      const params = [];
      let paramIndex = 1;

      // Add search condition
      if (search && search.trim()) {
        conditions.push(`r.name ILIKE $${paramIndex}`);
        params.push(`%${search.trim()}%`);
        paramIndex++;
      }

      // Add tag filtering - this is more complex as we need restaurants that have ALL specified tags
      if (tagIds && tagIds.length > 0) {
        // Filter out empty strings and ensure we have valid UUIDs
        const validTagIds = tagIds.filter(id => id && id.trim()).map(id => id.trim());
        if (validTagIds.length > 0) {
          conditions.push(`
            r.id IN (
              SELECT rt2.restaurant_id 
              FROM restaurant_tags rt2 
              WHERE rt2.tag_id = ANY($${paramIndex}::uuid[])
            )
          `);
          params.push(validTagIds);
          paramIndex++;
        }
      }

      // Add WHERE clause if we have conditions
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      // Add GROUP BY
      query += ` 
        GROUP BY r.id, r.name, r.image_url, r.rating, r.ratings_count, 
                 r.is_open, r.status, r.promo_text, r.delivery_info, r.created_at
      `;

      // Add sorting
      switch (sortBy) {
        case "Highest rated":
          query += ' ORDER BY r.rating DESC, r.ratings_count DESC';
          break;
        case "Newest":
          query += ' ORDER BY r.created_at DESC';
          break;
        case "Most Rated":
          // Extract numeric part from ratings_count for sorting
          query += ` ORDER BY 
            CAST(REGEXP_REPLACE(r.ratings_count, '[^0-9]', '', 'g') AS INTEGER) DESC NULLS LAST,
            r.rating DESC`;
          break;
        case "Most Popular":
        default:
          query += ' ORDER BY r.rating DESC, r.created_at DESC';
      }

      const result = await pool.query(query, params);
      
      // Transform the results to match expected format
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        imageUrl: row.image_url,
        rating: parseFloat(row.rating),
        ratingsCount: row.ratings_count,
        isOpen: row.is_open,
        status: row.status,
        promoText: row.promo_text,
        deliveryInfo: row.delivery_info,
        createdAt: row.created_at,
        tags: row.tags || []
      }));

    } catch (error) {
      console.error('Error in getRestaurants:', error);
      throw new Error('Failed to fetch restaurants');
    }
  }

  /**
   * Get a single restaurant by ID
   */
  async getRestaurantById(id) {
    try {
      const query = `
        SELECT 
          r.id,
          r.name,
          r.image_url,
          r.rating,
          r.ratings_count,
          r.is_open,
          r.status,
          r.promo_text,
          r.delivery_info,
          r.created_at,
          COALESCE(
            JSON_AGG(
              CASE WHEN t.id IS NOT NULL 
              THEN JSON_BUILD_OBJECT('id', t.id, 'name', t.name, 'iconUrl', t.icon_url)
              ELSE NULL END
            ) FILTER (WHERE t.id IS NOT NULL), 
            '[]'
          ) as tags
        FROM restaurants r
        LEFT JOIN restaurant_tags rt ON r.id = rt.restaurant_id
        LEFT JOIN tags t ON rt.tag_id = t.id
        WHERE r.id = $1
        GROUP BY r.id, r.name, r.image_url, r.rating, r.ratings_count, 
                 r.is_open, r.status, r.promo_text, r.delivery_info, r.created_at
      `;

      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        imageUrl: row.image_url,
        rating: parseFloat(row.rating),
        ratingsCount: row.ratings_count,
        isOpen: row.is_open,
        status: row.status,
        promoText: row.promo_text,
        deliveryInfo: row.delivery_info,
        createdAt: row.created_at,
        tags: row.tags || []
      };

    } catch (error) {
      console.error('Error in getRestaurantById:', error);
      throw new Error('Failed to fetch restaurant');
    }
  }

  /**
   * Get all available tags
   */
  async getTags() {
    try {
      const query = 'SELECT id, name, icon_url as "iconUrl", created_at as "createdAt" FROM tags ORDER BY name ASC';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in getTags:', error);
      throw new Error('Failed to fetch tags');
    }
  }

  /**
   * Get a single tag by ID
   */
  async getTagById(id) {
    try {
      const query = 'SELECT id, name, icon_url as "iconUrl", created_at as "createdAt" FROM tags WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error in getTagById:', error);
      throw new Error('Failed to fetch tag');
    }
  }

  /**
   * Create a new restaurant
   */
  async createRestaurant(restaurantData) {
    try {
      const {
        name,
        imageUrl,
        rating = 0.0,
        ratingsCount = '0',
        isOpen = false,
        status = 'Currently closed',
        promoText = null,
        deliveryInfo = null
      } = restaurantData;

      const query = `
        INSERT INTO restaurants (name, image_url, rating, ratings_count, is_open, status, promo_text, delivery_info)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, name, image_url as "imageUrl", rating, ratings_count as "ratingsCount", 
                  is_open as "isOpen", status, promo_text as "promoText", 
                  delivery_info as "deliveryInfo", created_at as "createdAt"
      `;

      const result = await pool.query(query, [
        name, imageUrl, rating, ratingsCount, isOpen, status, promoText, deliveryInfo
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Error in createRestaurant:', error);
      throw new Error('Failed to create restaurant');
    }
  }

  /**
   * Create a new tag
   */
  async createTag(tagData) {
    try {
      const { name, iconUrl } = tagData;
      const query = `
        INSERT INTO tags (name, icon_url)
        VALUES ($1, $2)
        RETURNING id, name, icon_url as "iconUrl", created_at as "createdAt"
      `;

      const result = await pool.query(query, [name, iconUrl]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in createTag:', error);
      throw new Error('Failed to create tag');
    }
  }

  /**
   * Add a tag to a restaurant
   */
  async addTagToRestaurant(restaurantId, tagId) {
    try {
      const query = 'INSERT INTO restaurant_tags (restaurant_id, tag_id) VALUES ($1, $2)';
      await pool.query(query, [restaurantId, tagId]);
    } catch (error) {
      console.error('Error in addTagToRestaurant:', error);
      throw new Error('Failed to add tag to restaurant');
    }
  }

  /**
   * Remove a tag from a restaurant
   */
  async removeTagFromRestaurant(restaurantId, tagId) {
    try {
      const query = 'DELETE FROM restaurant_tags WHERE restaurant_id = $1 AND tag_id = $2';
      await pool.query(query, [restaurantId, tagId]);
    } catch (error) {
      console.error('Error in removeTagFromRestaurant:', error);
      throw new Error('Failed to remove tag from restaurant');
    }
  }

  /**
   * Health check - test database connection
   */
  async healthCheck() {
    try {
      const result = await pool.query('SELECT NOW() as current_time');
      return {
        status: 'healthy',
        timestamp: result.rows[0].current_time,
        database: 'connected'
      };
    } catch (error) {
      console.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        error: error.message,
        database: 'disconnected'
      };
    }
  }
}

export default new StorageService();