import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartProvider';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  rating: number;
  review_count: number;
  category_name: string;
  is_new?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  original_price,
  image_url,
  rating,
  review_count,
  category_name,
  is_new
}: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    await addItem(id);
  };

  return (
    <Link to={`/product/${id}`} className="block group">
      <div 
        className="relative bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-card hover:shadow-float transition-all duration-500 transform hover:-translate-y-3 animate-scale-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-card">
          <img
            src={image_url}
            alt={name}
            className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Zen-like Overlay */}
          <div className={`absolute inset-0 bg-primary/10 backdrop-blur-sm transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className={`bg-background/90 backdrop-blur-sm hover:bg-background rounded-full transition-all duration-300 ${
                  isFavorite ? 'text-red-500' : 'text-muted-foreground hover:text-accent'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsFavorite(!isFavorite);
                }}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold rounded-2xl h-12 shadow-accent transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Premium Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {is_new && (
              <Badge className="bg-accent text-accent-foreground font-semibold rounded-full px-3 py-1 shadow-accent">
                ✨ New
              </Badge>
            )}
            {original_price && (
              <Badge variant="destructive" className="font-semibold rounded-full px-3 py-1">
                {Math.round(((original_price - price) / original_price) * 100)}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="text-xs text-accent font-medium uppercase tracking-wider">
              {category_name}
            </div>
            <h3 className="font-bold text-xl text-card-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight">
              {name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'text-accent fill-current'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {rating} ({review_count})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-accent">
              ${price}
            </span>
            {original_price && (
              <span className="text-lg text-muted-foreground line-through">
                ${original_price}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;