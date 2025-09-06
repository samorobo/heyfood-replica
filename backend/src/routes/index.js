import express from 'express';
import storageService from '../services/storageService.js';

const router = express.Router();

/**
 * GET /api/restaurants
 * Fetch all restaurants with optional filtering and sorting
 * Query params:
 * - search: string (optional) - search restaurants by name
 * - tags: string (optional) - comma-separated tag IDs to filter by
 * - sort: string (optional) - sort option: "Highest rated", "Newest", "Most Rated", "Most Popular"
 */
router.get('/restaurants', async (req, res) => {
  try {
    const { search, tags, sort } = req.query;
    
    // Parse parameters
    const params = {};
    
    if (search && typeof search === 'string' && search.trim()) {
      params.search = search.trim();
    }
    
    if (tags && typeof tags === 'string') {
      params.tagIds = tags.split(',').filter(tag => tag.trim()).map(tag => tag.trim());
    }
    
    if (sort && typeof sort === 'string') {
      params.sortBy = sort;
    }
    
    const restaurants = await storageService.getRestaurants(params);
    
    res.json({
      success: true,
      data: restaurants,
      count: restaurants.length
    });
    
  } catch (error) {
    console.error('Error in GET /api/restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurants',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/restaurants/:id
 * Fetch a single restaurant by ID
 */
router.get('/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || !id.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID is required'
      });
    }
    
    const restaurant = await storageService.getRestaurantById(id.trim());
    
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    res.json({
      success: true,
      data: restaurant
    });
    
  } catch (error) {
    console.error('Error in GET /api/restaurants/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/tags
 * Fetch all available food category tags
 */
router.get('/tags', async (req, res) => {
  try {
    const tags = await storageService.getTags();
    
    res.json({
      success: true,
      data: tags,
      count: tags.length
    });
    
  } catch (error) {
    console.error('Error in GET /api/tags:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/tags/:id
 * Fetch a single tag by ID
 */
router.get('/tags/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || !id.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tag ID is required'
      });
    }
    
    const tag = await storageService.getTagById(id.trim());
    
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found'
      });
    }
    
    res.json({
      success: true,
      data: tag
    });
    
  } catch (error) {
    console.error('Error in GET /api/tags/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tag',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/restaurants
 * Create a new restaurant (for admin use)
 */
router.post('/restaurants', async (req, res) => {
  try {
    const restaurantData = req.body;
    
    // Basic validation
    if (!restaurantData.name || !restaurantData.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant name and image URL are required'
      });
    }
    
    const restaurant = await storageService.createRestaurant(restaurantData);
    
    res.status(201).json({
      success: true,
      data: restaurant,
      message: 'Restaurant created successfully'
    });
    
  } catch (error) {
    console.error('Error in POST /api/restaurants:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create restaurant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/tags
 * Create a new tag (for admin use)
 */
router.post('/tags', async (req, res) => {
  try {
    const tagData = req.body;
    
    // Basic validation
    if (!tagData.name || !tagData.iconUrl) {
      return res.status(400).json({
        success: false,
        message: 'Tag name and icon URL are required'
      });
    }
    
    const tag = await storageService.createTag(tagData);
    
    res.status(201).json({
      success: true,
      data: tag,
      message: 'Tag created successfully'
    });
    
  } catch (error) {
    console.error('Error in POST /api/tags:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tag',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * POST /api/restaurants/:restaurantId/tags/:tagId
 * Add a tag to a restaurant
 */
router.post('/restaurants/:restaurantId/tags/:tagId', async (req, res) => {
  try {
    const { restaurantId, tagId } = req.params;
    
    if (!restaurantId || !tagId) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID and Tag ID are required'
      });
    }
    
    await storageService.addTagToRestaurant(restaurantId, tagId);
    
    res.json({
      success: true,
      message: 'Tag added to restaurant successfully'
    });
    
  } catch (error) {
    console.error('Error in POST /api/restaurants/:restaurantId/tags/:tagId:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add tag to restaurant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * DELETE /api/restaurants/:restaurantId/tags/:tagId
 * Remove a tag from a restaurant
 */
router.delete('/restaurants/:restaurantId/tags/:tagId', async (req, res) => {
  try {
    const { restaurantId, tagId } = req.params;
    
    if (!restaurantId || !tagId) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID and Tag ID are required'
      });
    }
    
    await storageService.removeTagFromRestaurant(restaurantId, tagId);
    
    res.json({
      success: true,
      message: 'Tag removed from restaurant successfully'
    });
    
  } catch (error) {
    console.error('Error in DELETE /api/restaurants/:restaurantId/tags/:tagId:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove tag from restaurant',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const health = await storageService.healthCheck();
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json({
      success: health.status === 'healthy',
      ...health
    });
    
  } catch (error) {
    console.error('Error in GET /api/health:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});

export default router;