import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">E</span>
              </div>
              <span className="text-2xl font-bold">EliteShop</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Your destination for premium electronics and accessories. 
              We curate only the finest products for discerning customers.
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <nav className="space-y-3">
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                About Us
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Products
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Categories
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Brands
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Contact
              </a>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Customer Service</h3>
            <nav className="space-y-3">
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Shipping Info
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Returns & Exchanges
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Size Guide
              </a>
              <a href="#" className="block text-primary-foreground/80 hover:text-accent transition-colors">
                Track Order
              </a>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Stay Updated</h3>
            <p className="text-primary-foreground/80">
              Subscribe to get special offers and updates.
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="w-full bg-accent hover:bg-accent-hover text-accent-foreground font-semibold">
                Subscribe
              </Button>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@eliteshop.com</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-foreground/80">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/70 text-sm text-center md:text-left">
              © 2024 EliteShop. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-accent text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;