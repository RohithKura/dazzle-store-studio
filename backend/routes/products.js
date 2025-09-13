const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all products with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      isNew,
      isFeatured,
      limit = 20,
      offset = 0
    } = req.query;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.status = 'active'
    `;
    const queryParams = [];

    // Apply filters
    if (category && category !== 'All') {
      query += ` AND c.name = ?`;
      queryParams.push(category);
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      query += ` AND p.price >= ?`;
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      query += ` AND p.price <= ?`;
      queryParams.push(maxPrice);
    }

    if (isNew === 'true') {
      query += ` AND p.is_new = 1`;
    }

    if (isFeatured === 'true') {
      query += ` AND p.is_featured = 1`;
    }

    // Apply sorting
    const validSortFields = ['name', 'price', 'rating', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY p.${sortField} ${order}`;
    
    // Apply pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    const [products] = await db.execute(query, queryParams);
    
    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.status = 'active'
    `;
    const countParams = [];
    
    // Apply same filters for count
    if (category && category !== 'All') {
      countQuery += ` AND c.name = ?`;
      countParams.push(category);
    }
    if (search) {
      countQuery += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      countParams.push(`%${search}%`, `%${search}%`);
    }
    if (minPrice) {
      countQuery += ` AND p.price >= ?`;
      countParams.push(minPrice);
    }
    if (maxPrice) {
      countQuery += ` AND p.price <= ?`;
      countParams.push(maxPrice);
    }
    if (isNew === 'true') {
      countQuery += ` AND p.is_new = 1`;
    }
    if (isFeatured === 'true') {
      countQuery += ` AND p.is_featured = 1`;
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      products,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.status = 'active'
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get product images
    const [images] = await db.execute(`
      SELECT * FROM product_images 
      WHERE product_id = ? 
      ORDER BY is_primary DESC, sort_order ASC
    `, [id]);

    // Get recent reviews
    const [reviews] = await db.execute(`
      SELECT r.*, u.first_name, u.last_name 
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = ? 
      ORDER BY r.created_at DESC 
      LIMIT 10
    `, [id]);

    const product = {
      ...products[0],
      images,
      reviews
    };

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_featured = 1 AND p.status = 'active' 
      ORDER BY p.created_at DESC 
      LIMIT 8
    `);

    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

module.exports = router;