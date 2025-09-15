import express from 'express';
const router = express.Router();
import db from '../config/database.js';

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.execute(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
      GROUP BY c.id 
      ORDER BY c.name
    `);

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [categories] = await db.execute(`
      SELECT * FROM categories WHERE id = ?
    `, [id]);

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(categories[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

export default router;