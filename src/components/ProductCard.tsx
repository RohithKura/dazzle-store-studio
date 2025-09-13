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
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isNew?: boolean;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  category,
  isNew
}: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    addItem({ id, name, price, image, category });
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart`,
    });
  };

  return (
    <Link to={`/product/${id}`} className="block">
      <div 
        className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2 animate-scale-in"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-card">
          <img
            src={image}
            alt={name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute top-4 right-4 space-y-2">
              <Button
                variant="ghost"
                size="icon"
                className={`bg-background/80 hover:bg-background ${
                  isFavorite ? 'text-red-500' : 'text-muted-foreground'
                }`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 space-y-2">
            {isNew && (
              <Badge className="bg-accent text-accent-foreground font-semibold">
                New
              </Badge>
            )}
            {originalPrice && (
              <Badge variant="destructive" className="font-semibold">
                {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
              {category}
            </div>
            <h3 className="font-bold text-lg text-card-foreground group-hover:text-accent transition-colors line-clamp-2">
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
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {rating} ({reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-foreground">
              ${price}
            </span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;