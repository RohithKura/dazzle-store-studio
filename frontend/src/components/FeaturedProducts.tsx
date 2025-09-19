import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getFeaturedProducts } from '@/data/sampleProducts';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate smooth loading animation
    const timer = setTimeout(() => {
      const featuredProducts = getFeaturedProducts();
      setProducts(featuredProducts);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-surface relative overflow-hidden">
      {/* Subtle Japanese-inspired background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-20 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            ✨ Curated Collection
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Featured
            <span className="block text-accent">Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked selection of premium products, 
            crafted with precision and designed for excellence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-card rounded-3xl p-6 animate-pulse shadow-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-full h-52 bg-muted rounded-2xl mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded-full mb-2"></div>
                  <div className="h-6 bg-muted rounded-full w-4/5"></div>
                  <div className="h-4 bg-muted rounded-full w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            products.map((product, index) => (
              <div
                key={product.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard {...product} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;