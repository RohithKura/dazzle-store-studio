import { ShoppingBag, Search, Menu, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">E</span>
            </div>
            <span className="text-2xl font-bold text-foreground">EliteShop</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-accent transition-colors font-medium">
              Products
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors font-medium">
              Categories
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors font-medium">
              Brands
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors font-medium">
              About
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 bg-secondary border-0 focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
              <ShoppingBag className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                2
              </Badge>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;