// Sample Products Data - 140+ items with varied pricing
import productSmartphone from '@/assets/product-smartphone.jpg';
import productEarbuds from '@/assets/product-earbuds.jpg';
import productGamingKeyboard from '@/assets/product-gaming-keyboard.jpg';
import productTablet from '@/assets/product-tablet.jpg';
import productLaptop from '@/assets/product-laptop.jpg';
import productWatch from '@/assets/product-watch.jpg';
import productKeyboard from '@/assets/product-keyboard.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  rating: number;
  review_count: number;
  category_name: string;
  category_id: string;
  is_new?: boolean;
  description?: string;
  brand?: string;
}

const imageUrls = [
  productSmartphone,
  productEarbuds,
  productGamingKeyboard,
  productTablet,
  productLaptop,
  productWatch,
  productKeyboard,
];

// Generate random price between min and max
const randomPrice = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random rating between 3.5 and 5.0
const randomRating = () => 
  Math.round((3.5 + Math.random() * 1.5) * 10) / 10;

// Generate random review count
const randomReviews = () => 
  Math.floor(Math.random() * 500) + 10;

const categories = [
  { id: '1', name: 'Electronics', count: 45 },
  { id: '2', name: 'Smartphones', count: 25 },
  { id: '3', name: 'Audio', count: 30 },
  { id: '4', name: 'Computing', count: 20 },
  { id: '5', name: 'Gaming', count: 15 },
  { id: '6', name: 'Wearables', count: 12 },
];

const brands = ['Apple', 'Samsung', 'Sony', 'Microsoft', 'Google', 'Nintendo', 'Dell', 'HP', 'Asus', 'Razer'];

const productTemplates = [
  // Electronics
  { name: 'Premium Wireless Headphones', category: 'Audio', minPrice: 99, maxPrice: 399 },
  { name: 'Smart LED TV 55"', category: 'Electronics', minPrice: 399, maxPrice: 899 },
  { name: 'Bluetooth Speaker', category: 'Audio', minPrice: 29, maxPrice: 199 },
  { name: 'Gaming Monitor 27"', category: 'Electronics', minPrice: 199, maxPrice: 599 },
  { name: '4K Webcam', category: 'Electronics', minPrice: 79, maxPrice: 249 },
  
  // Smartphones
  { name: 'iPhone Pro Max', category: 'Smartphones', minPrice: 999, maxPrice: 1299 },
  { name: 'Galaxy S24 Ultra', category: 'Smartphones', minPrice: 899, maxPrice: 1199 },
  { name: 'Pixel 8 Pro', category: 'Smartphones', minPrice: 699, maxPrice: 999 },
  { name: 'OnePlus 12', category: 'Smartphones', minPrice: 599, maxPrice: 899 },
  { name: 'Xiaomi 14 Pro', category: 'Smartphones', minPrice: 499, maxPrice: 799 },
  
  // Audio
  { name: 'Wireless Earbuds Pro', category: 'Audio', minPrice: 149, maxPrice: 349 },
  { name: 'Studio Headphones', category: 'Audio', minPrice: 199, maxPrice: 599 },
  { name: 'Portable Speaker', category: 'Audio', minPrice: 39, maxPrice: 149 },
  { name: 'Sound Bar', category: 'Audio', minPrice: 99, maxPrice: 399 },
  { name: 'Vinyl Record Player', category: 'Audio', minPrice: 149, maxPrice: 499 },
  
  // Computing
  { name: 'MacBook Pro 16"', category: 'Computing', minPrice: 1999, maxPrice: 3499 },
  { name: 'Gaming Laptop RTX 4080', category: 'Computing', minPrice: 1299, maxPrice: 2499 },
  { name: 'Ultrabook 13"', category: 'Computing', minPrice: 699, maxPrice: 1399 },
  { name: 'All-in-One PC', category: 'Computing', minPrice: 899, maxPrice: 1799 },
  { name: 'Mini PC', category: 'Computing', minPrice: 299, maxPrice: 699 },
  
  // Gaming
  { name: 'Gaming Keyboard RGB', category: 'Gaming', minPrice: 79, maxPrice: 199 },
  { name: 'Gaming Mouse Pro', category: 'Gaming', minPrice: 49, maxPrice: 149 },
  { name: 'Gaming Chair', category: 'Gaming', minPrice: 199, maxPrice: 499 },
  { name: 'PlayStation 5', category: 'Gaming', minPrice: 499, maxPrice: 699 },
  { name: 'Xbox Series X', category: 'Gaming', minPrice: 499, maxPrice: 649 },
  
  // Wearables
  { name: 'Apple Watch Ultra', category: 'Wearables', minPrice: 399, maxPrice: 799 },
  { name: 'Samsung Galaxy Watch', category: 'Wearables', minPrice: 199, maxPrice: 449 },
  { name: 'Fitness Tracker', category: 'Wearables', minPrice: 49, maxPrice: 199 },
  { name: 'Smart Ring', category: 'Wearables', minPrice: 199, maxPrice: 399 },
  { name: 'VR Headset', category: 'Wearables', minPrice: 299, maxPrice: 899 },
];

// Generate products by repeating templates with variations
export const sampleProducts: Product[] = [];

// Generate 140+ products
for (let i = 0; i < 150; i++) {
  const template = productTemplates[i % productTemplates.length];
  const category = categories.find(c => c.name === template.category) || categories[0];
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const price = randomPrice(template.minPrice, template.maxPrice);
  const hasDiscount = Math.random() > 0.7; // 30% chance of discount
  const originalPrice = hasDiscount ? price + randomPrice(20, 100) : undefined;
  const isNew = Math.random() > 0.8; // 20% chance of being new
  
  const product: Product = {
    id: `product-${i + 1}`,
    name: `${brand} ${template.name} ${i > 25 ? `V${Math.floor(i / 25) + 1}` : ''}`.trim(),
    price,
    original_price: originalPrice,
    image_url: imageUrls[i % imageUrls.length],
    rating: randomRating(),
    review_count: randomReviews(),
    category_name: category.name,
    category_id: category.id,
    is_new: isNew,
    brand,
    description: `Premium ${template.name.toLowerCase()} from ${brand} featuring cutting-edge technology and superior build quality.`
  };
  
  sampleProducts.push(product);
}

export const sampleCategories = categories;

// Helper functions for filtering and sorting
export const getProductsByCategory = (categoryId: string) => 
  sampleProducts.filter(p => p.category_id === categoryId);

export const getFeaturedProducts = () => 
  sampleProducts.filter(p => p.rating >= 4.5).slice(0, 8);

export const getProductsByPriceRange = (min?: number, max?: number) =>
  sampleProducts.filter(p => {
    if (min && p.price < min) return false;
    if (max && p.price > max) return false;
    return true;
  });

export const searchProducts = (query: string) =>
  sampleProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand?.toLowerCase().includes(query.toLowerCase()) ||
    p.category_name.toLowerCase().includes(query.toLowerCase())
  );

export const sortProducts = (products: Product[], sortBy: string, order: 'ASC' | 'DESC' = 'ASC') => {
  return [...products].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case 'price':
        aVal = a.price;
        bVal = b.price;
        break;
      case 'rating':
        aVal = a.rating;
        bVal = b.rating;
        break;
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (aVal < bVal) return order === 'ASC' ? -1 : 1;
    if (aVal > bVal) return order === 'ASC' ? 1 : -1;
    return 0;
  });
};