import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Import product images
import watchImage from '@/assets/product-watch.jpg';
import keyboardImage from '@/assets/product-keyboard.jpg';
import laptopImage from '@/assets/product-laptop.jpg';
import headphonesImage from '@/assets/hero-headphones.jpg';

const FeaturedProducts = () => {
  const products = [
    {
      id: '1',
      name: 'Luxury Smartwatch Pro',
      price: 599,
      originalPrice: 799,
      image: watchImage,
      rating: 4.8,
      reviews: 324,
      category: 'Wearables',
      isNew: true
    },
    {
      id: '2',
      name: 'Premium Mechanical Keyboard',
      price: 189,
      image: keyboardImage,
      rating: 4.9,
      reviews: 156,
      category: 'Accessories'
    },
    {
      id: '3',
      name: 'Ultra Performance Laptop',
      price: 1299,
      originalPrice: 1599,
      image: laptopImage,
      rating: 4.7,
      reviews: 89,
      category: 'Computers'
    },
    {
      id: '4',
      name: 'Wireless Audio Headphones',
      price: 299,
      image: headphonesImage,
      rating: 4.9,
      reviews: 267,
      category: 'Audio',
      isNew: true
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Featured Products
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our hand-picked selection of premium products, 
            crafted for those who appreciate exceptional quality and design.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-6 text-lg font-semibold group"
          >
            View All Products
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;