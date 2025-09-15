import Cart from '../models/Cart.js';
import { v4 as uuidv4 } from 'uuid';

const CartController = {
  async getCart(req, res, next) {
    try {
      const userId = req.user?.user_id;
      const sessionId = req.cookies?.cart_session || req.body.session_id;

      if (!userId && !sessionId) {
        return res.status(400).json({ error: 'Session ID or User ID required' });
      }

      const cart = await Cart.getCartItems(userId, sessionId);
      
      // If this is a new session, set a cart session cookie
      if (!sessionId && !userId) {
        const newSessionId = uuidv4();
        res.cookie('cart_session', newSessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
      }

      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  async addToCart(req, res, next) {
    try {
      const { product_id, quantity = 1 } = req.body;
      const userId = req.user?.user_id;
      const sessionId = req.cookies?.cart_session || req.body.session_id;

      if (!product_id) {
        return res.status(400).json({ error: 'Product ID required' });
      }

      if (!userId && !sessionId) {
        return res.status(400).json({ error: 'Session ID or User ID required' });
      }

      const cart = await Cart.addItem(userId, sessionId, product_id, quantity);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  async updateQuantity(req, res, next) {
    try {
      const { product_id, quantity } = req.body;
      const userId = req.user?.user_id;
      const sessionId = req.cookies?.cart_session || req.body.session_id;

      if (!product_id || quantity === undefined) {
        return res.status(400).json({ error: 'Product ID and quantity required' });
      }

      const cart = await Cart.updateQuantity(userId, sessionId, product_id, quantity);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  async removeFromCart(req, res, next) {
    try {
      const { product_id } = req.body;
      const userId = req.user?.user_id;
      const sessionId = req.cookies?.cart_session || req.body.session_id;

      if (!product_id) {
        return res.status(400).json({ error: 'Product ID required' });
      }

      const cart = await Cart.removeItem(userId, sessionId, product_id);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  async clearCart(req, res, next) {
    try {
      const userId = req.user?.user_id;
      const sessionId = req.cookies?.cart_session || req.body.session_id;

      if (!userId && !sessionId) {
        return res.status(400).json({ error: 'Session ID or User ID required' });
      }

      const result = await Cart.clearCart(userId, sessionId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async mergeAnonymousCart(req, res, next) {
    try {
      const userId = req.user?.user_id;
      const sessionId = req.cookies?.cart_session || req.body.session_id;

      if (!userId || !sessionId) {
        return res.status(400).json({ error: 'Both User ID and Session ID required for merging' });
      }

      const cart = await Cart.mergeAnonymousCart(sessionId, userId);
      
      // Clear the cart session cookie
      res.clearCookie('cart_session');
      
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
};

export default CartController;