import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-headphones.jpg';
import { ArrowRight, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">Premium Collection</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                Wireless Audio
                <span className="block text-accent">Perfection</span>
              </h1>
              
              <p className="text-xl text-primary-foreground/80 max-w-lg">
                Experience crystal-clear sound with our premium wireless headphones. 
                Engineered for audiophiles who demand excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent-hover text-accent-foreground px-8 py-6 text-lg font-semibold group"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">5000+</div>
                <div className="text-sm text-primary-foreground/70">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">4.9</div>
                <div className="text-sm text-primary-foreground/70">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">2Y</div>
                <div className="text-sm text-primary-foreground/70">Warranty</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full transform -translate-y-10"></div>
            <img
              src={heroImage}
              alt="Premium Wireless Headphones"
              className="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/5 rounded-full blur-lg animate-pulse delay-1000"></div>
    </section>
  );
};

export default Hero;