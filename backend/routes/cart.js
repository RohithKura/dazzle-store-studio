const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get cart items (for guest users using session_id or logged-in users)
router.get('/', async (req, res) => {
  try {
    const { session_id, user_id } = req.query;
    
    if (!session_id && !user_id) {
      return res.status(400).json({ error: 'Session ID or User ID required' });
    }

    let query = `
      SELECT ci.*, p.name, p.price, p.image_url, c.name as category_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 
    `;
    
    const params = [];
    
    if (user_id) {
      query += 'ci.user_id = ?';
      params.push(user_id);
    } else {
      query += 'ci.session_id = ?';
      params.push(session_id);
    }

    const [cartItems] = await db.execute(query, params);
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { product_id, quantity = 1, session_id, user_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    if (!session_id && !user_id) {
      return res.status(400).json({ error: 'Session ID or User ID required' });
    }

    // Check if product exists
    const [products] = await db.execute(
      'SELECT * FROM products WHERE id = ? AND status = "active"',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already exists in cart
    let existingQuery = 'SELECT * FROM cart_items WHERE product_id = ?';
    const existingParams = [product_id];

    if (user_id) {
      existingQuery += ' AND user_id = ?';
      existingParams.push(user_id);
    } else {
      existingQuery += ' AND session_id = ?';
      existingParams.push(session_id);
    }

    const [existingItems] = await db.execute(existingQuery, existingParams);

    if (existingItems.length > 0) {
      // Update quantity
      await db.execute(
        'UPDATE cart_items SET quantity = quantity + ?, updated_at = NOW() WHERE id = ?',
        [quantity, existingItems[0].id]
      );
    } else {
      // Insert new item
      await db.execute(
        'INSERT INTO cart_items (product_id, quantity, user_id, session_id) VALUES (?, ?, ?, ?)',
        [product_id, quantity, user_id, session_id]
      );
    }

    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/update', async (req, res) => {
  try {
    const { product_id, quantity, session_id, user_id } = req.body;

    if (!product_id || quantity === undefined) {
      return res.status(400).json({ error: 'Product ID and quantity required' });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      let deleteQuery = 'DELETE FROM cart_items WHERE product_id = ?';
      const deleteParams = [product_id];

      if (user_id) {
        deleteQuery += ' AND user_id = ?';
        deleteParams.push(user_id);
      } else {
        deleteQuery += ' AND session_id = ?';
        deleteParams.push(session_id);
      }

      await db.execute(deleteQuery, deleteParams);
    } else {
      // Update quantity
      let updateQuery = 'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE product_id = ?';
      const updateParams = [quantity, product_id];

      if (user_id) {
        updateQuery += ' AND user_id = ?';
        updateParams.push(user_id);
      } else {
        updateQuery += ' AND session_id = ?';
        updateParams.push(session_id);
      }

      await db.execute(updateQuery, updateParams);
    }

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
  try {
    const { product_id, session_id, user_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    let query = 'DELETE FROM cart_items WHERE product_id = ?';
    const params = [product_id];

    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    } else {
      query += ' AND session_id = ?';
      params.push(session_id);
    }

    await db.execute(query, params);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/clear', async (req, res) => {
  try {
    const { session_id, user_id } = req.body;

    if (!session_id && !user_id) {
      return res.status(400).json({ error: 'Session ID or User ID required' });
    }

    let query = 'DELETE FROM cart_items WHERE ';
    const params = [];

    if (user_id) {
      query += 'user_id = ?';
      params.push(user_id);
    } else {
      query += 'session_id = ?';
      params.push(session_id);
    }

    await db.execute(query, params);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;