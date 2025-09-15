import express from 'express';
const router = express.Router();
import CartController from '../controllers/CartController.js';
import { optionalAuth } from '../middleware/auth.js';

// Apply optional authentication to all cart routes
router.use(optionalAuth);

// Get cart items (for guest users using session_id or logged-in users)
router.get('/', CartController.getCart);

// Add item to cart
router.post('/add', CartController.addToCart);

// Update cart item quantity
router.put('/update', CartController.updateQuantity);

// Remove item from cart
router.delete('/remove', CartController.removeFromCart);

// Clear cart
router.delete('/clear', CartController.clearCart);

// Merge anonymous cart with user's cart after login
router.post('/merge', CartController.mergeAnonymousCart);

export default router;