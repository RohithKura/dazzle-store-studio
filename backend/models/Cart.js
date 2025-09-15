import db from '../config/database.js';

class Cart {
  static async getCartItems(userId, sessionId) {
    try {
      const query = `
        SELECT 
          ci.id,
          ci.product_id,
          ci.quantity,
          ci.created_at,
          ci.updated_at,
          p.name as product_name,
          p.price as unit_price,
          p.image_url,
          c.name as category_name,
          (p.price * ci.quantity) as total_price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE ${userId ? 'ci.user_id = ?' : 'ci.session_id = ?'}
      `;

      const [items] = await db.execute(query, [userId || sessionId]);
      
      const total = items.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
      
      return {
        items,
        total: Number(total.toFixed(2)),
        itemCount: items.length
      };
    } catch (error) {
      throw new Error(`Error fetching cart: ${error.message}`);
    }
  }

  static async addItem(userId, sessionId, productId, quantity) {
    try {
      // Check if product exists and is active
      const [products] = await db.execute(
        'SELECT id, stock_quantity FROM products WHERE id = ? AND status = "active"',
        [productId]
      );

      if (products.length === 0) {
        throw new Error('Product not found or inactive');
      }

      const product = products[0];

      // Check stock availability
      if (product.stock_quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      // Check if item already exists in cart
      const [existingItems] = await db.execute(
        `SELECT id, quantity FROM cart_items 
         WHERE product_id = ? AND ${userId ? 'user_id = ?' : 'session_id = ?'}`,
        [productId, userId || sessionId]
      );

      if (existingItems.length > 0) {
        const newQuantity = existingItems[0].quantity + quantity;
        
        // Check if new total quantity exceeds stock
        if (newQuantity > product.stock_quantity) {
          throw new Error('Requested quantity exceeds available stock');
        }

        await db.execute(
          'UPDATE cart_items SET quantity = ?, updated_at = NOW() WHERE id = ?',
          [newQuantity, existingItems[0].id]
        );
      } else {
        await db.execute(
          'INSERT INTO cart_items (product_id, quantity, user_id, session_id) VALUES (?, ?, ?, ?)',
          [productId, quantity, userId, sessionId]
        );
      }

      return await this.getCartItems(userId, sessionId);
    } catch (error) {
      throw new Error(`Error adding item to cart: ${error.message}`);
    }
  }

  static async updateQuantity(userId, sessionId, productId, quantity) {
    try {
      if (quantity <= 0) {
        return await this.removeItem(userId, sessionId, productId);
      }

      // Check stock availability
      const [products] = await db.execute(
        'SELECT stock_quantity FROM products WHERE id = ? AND status = "active"',
        [productId]
      );

      if (products.length === 0) {
        throw new Error('Product not found or inactive');
      }

      if (products[0].stock_quantity < quantity) {
        throw new Error('Requested quantity exceeds available stock');
      }

      await db.execute(
        `UPDATE cart_items 
         SET quantity = ?, updated_at = NOW() 
         WHERE product_id = ? AND ${userId ? 'user_id = ?' : 'session_id = ?'}`,
        [quantity, productId, userId || sessionId]
      );

      return await this.getCartItems(userId, sessionId);
    } catch (error) {
      throw new Error(`Error updating cart quantity: ${error.message}`);
    }
  }

  static async removeItem(userId, sessionId, productId) {
    try {
      await db.execute(
        `DELETE FROM cart_items 
         WHERE product_id = ? AND ${userId ? 'user_id = ?' : 'session_id = ?'}`,
        [productId, userId || sessionId]
      );

      return await this.getCartItems(userId, sessionId);
    } catch (error) {
      throw new Error(`Error removing item from cart: ${error.message}`);
    }
  }

  static async clearCart(userId, sessionId) {
    try {
      await db.execute(
        `DELETE FROM cart_items WHERE ${userId ? 'user_id = ?' : 'session_id = ?'}`,
        [userId || sessionId]
      );

      return { message: 'Cart cleared successfully' };
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }

  static async mergeAnonymousCart(sessionId, userId) {
    try {
      // Get items from anonymous cart
      const [anonymousItems] = await db.execute(
        'SELECT product_id, quantity FROM cart_items WHERE session_id = ?',
        [sessionId]
      );

      // For each anonymous item
      for (const item of anonymousItems) {
        await this.addItem(userId, null, item.product_id, item.quantity);
      }

      // Clear the anonymous cart
      await db.execute('DELETE FROM cart_items WHERE session_id = ?', [sessionId]);

      return await this.getCartItems(userId, null);
    } catch (error) {
      throw new Error(`Error merging carts: ${error.message}`);
    }
  }
}

export default Cart;