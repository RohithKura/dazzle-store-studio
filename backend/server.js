import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import errorHandler from './middleware/error.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://dazzle-store.local'], // Allow both dev server and Apache
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EliteShop API is running' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
  console.log(`Health check: http://localhost:5000/api/health`);
});