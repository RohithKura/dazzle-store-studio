import express from 'express';
const router = express.Router();
import db from '../config/database.js';

// Create new order
router.post('/create', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      user_id,
      session_id,
      shipping_address,
      billing_address,
      payment_method,
      items // Array of { product_id, quantity, price }
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, total_amount, shipping_address, billing_address, payment_method)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, orderNumber, totalAmount, shipping_address, billing_address, payment_method]
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );

      // Update product stock
      await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart after successful order
    if (user_id) {
      await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [user_id]);
    } else if (session_id) {
      await connection.execute('DELETE FROM cart_items WHERE session_id = ?', [session_id]);
    }

    await connection.commit();

    res.json({
      message: 'Order created successfully',
      order_id: orderId,
      order_number: orderNumber,
      total_amount: totalAmount
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    connection.release();
  }
});

// Get user orders
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const [orders] = await db.execute(
      `SELECT * FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [user_id, parseInt(limit), parseInt(offset)]
    );

    // Get order items for each order
    for (let order of orders) {
      const [items] = await db.execute(
        `SELECT oi.*, p.name as product_name, p.image_url 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await db.execute(
      `SELECT oi.*, p.name as product_name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );

    order.items = items;
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;