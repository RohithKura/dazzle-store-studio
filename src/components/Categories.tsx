import { Button } from '@/components/ui/button';
import { Laptop, Headphones, Watch, Keyboard, Smartphone, Camera } from 'lucide-react';

const Categories = () => {
  const categories = [
    {
      name: 'Computers',
      icon: Laptop,
      count: '120+ Products',
      color: 'from-blue-500/20 to-blue-600/20',
      textColor: 'text-blue-600'
    },
    {
      name: 'Audio',
      icon: Headphones,
      count: '85+ Products',
      color: 'from-purple-500/20 to-purple-600/20',
      textColor: 'text-purple-600'
    },
    {
      name: 'Wearables',
      icon: Watch,
      count: '64+ Products',
      color: 'from-green-500/20 to-green-600/20',
      textColor: 'text-green-600'
    },
    {
      name: 'Accessories',
      icon: Keyboard,
      count: '95+ Products',
      color: 'from-orange-500/20 to-orange-600/20',
      textColor: 'text-orange-600'
    },
    {
      name: 'Mobile',
      icon: Smartphone,
      count: '78+ Products',
      color: 'from-red-500/20 to-red-600/20',
      textColor: 'text-red-600'
    },
    {
      name: 'Photography',
      icon: Camera,
      count: '42+ Products',
      color: 'from-indigo-500/20 to-indigo-600/20',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of premium products across different categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Button
              key={category.name}
              variant="ghost"
              className={`
                h-auto p-0 group hover:bg-transparent animate-scale-in
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-full p-6 rounded-2xl bg-background hover:shadow-hover transition-all duration-300 transform group-hover:-translate-y-1 border border-border/50 group-hover:border-accent/20">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className={`w-8 h-8 ${category.textColor}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.count}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;