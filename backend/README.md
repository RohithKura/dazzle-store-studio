# EliteShop Backend API

A comprehensive Node.js/Express backend for the EliteShop e-commerce application with MySQL database integration.

## Features

- **Product Management**: CRUD operations with categories, images, and filtering
- **User Authentication**: Registration, login with JWT tokens
- **Shopping Cart**: Persistent cart for logged-in and guest users
- **Order Processing**: Complete order workflow with inventory management
- **Reviews System**: Product reviews and ratings
- **Database**: MySQL with proper relationships and indexing

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your environment variables in `.env`:**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=eliteshop
   DB_PORT=3306
   JWT_SECRET=your_super_secret_jwt_key
   PORT=3001
   ```

5. **Initialize the database:**
   ```bash
   npm run init-db
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:3001`

## API Endpoints

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/user/:user_id` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile/:id` - Get user profile

## Database Schema

The database includes the following tables:

- **users**: User accounts and profiles
- **categories**: Product categories
- **products**: Product information
- **product_images**: Multiple images per product
- **cart_items**: Shopping cart persistence
- **orders**: Order information
- **order_items**: Order line items
- **reviews**: Product reviews and ratings

## Frontend Integration

Update your React frontend to use the API endpoints:

```javascript
// Example: Fetch products
const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`http://localhost:3001/api/products?${params}`);
  return response.json();
};

// Example: Add to cart
const addToCart = async (productId, quantity = 1) => {
  const response = await fetch('http://localhost:3001/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      quantity,
      session_id: getSessionId() // Implement session management
    })
  });
  return response.json();
};
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection protection with prepared statements
- Input validation and sanitization
- CORS configuration for frontend integration

## Production Deployment

1. Set up MySQL database on your production server
2. Configure environment variables for production
3. Use PM2 or similar process manager
4. Set up nginx as reverse proxy
5. Enable SSL/HTTPS
6. Configure database backups

## Testing

Test the API endpoints using tools like:
- Postman
- curl commands
- Frontend integration

Example health check:
```bash
curl http://localhost:3001/api/health
```

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation for new endpoints