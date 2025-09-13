import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ProductCard from './ProductCard';
import { 
  sampleProducts, 
  sampleCategories, 
  searchProducts, 
  sortProducts, 
  getProductsByCategory, 
  getProductsByPriceRange 
} from '@/data/sampleProducts';

const sortOptions = [
  { value: 'created_at', label: 'Newest' },
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'rating', label: 'Rating' },
];

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showNewOnly, setShowNewOnly] = useState(false);
  
  const [products, setProducts] = useState(sampleProducts.slice(0, 12)); // Show first 12 products initially
  const [categories, setCategories] = useState([{ name: 'All' }, ...sampleCategories]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(sampleProducts.length);

  // Load categories on mount - now using sample data
  useEffect(() => {
    // Categories are already set in the state, no need to fetch
  }, []);

  // Filter and search products with smooth animations
  useEffect(() => {
    const filterProducts = () => {
      setLoading(true);
      
      // Start with all products
      let filtered = [...sampleProducts];
      
      // Apply search filter
      if (searchQuery.trim()) {
        filtered = searchProducts(searchQuery.trim());
      }
      
      // Apply category filter
      if (selectedCategory !== 'All') {
        const category = sampleCategories.find(c => c.name === selectedCategory);
        if (category) {
          filtered = filtered.filter(p => p.category_name === selectedCategory);
        }
      }
      
      // Apply price range filter
      if (priceRange.min || priceRange.max) {
        const minPrice = priceRange.min ? parseInt(priceRange.min) : undefined;
        const maxPrice = priceRange.max ? parseInt(priceRange.max) : undefined;
        filtered = getProductsByPriceRange(minPrice, maxPrice)
          .filter(p => {
            // Also apply other filters
            if (searchQuery.trim() && !searchProducts(searchQuery.trim()).find(sp => sp.id === p.id)) return false;
            if (selectedCategory !== 'All' && p.category_name !== selectedCategory) return false;
            return true;
          });
      }
      
      // Apply new only filter
      if (showNewOnly) {
        filtered = filtered.filter(p => p.is_new);
      }
      
      // Apply sorting
      if (sortBy && sortBy !== 'created_at') {
        const order: 'ASC' | 'DESC' = sortBy === 'price' ? 'ASC' : (sortOrder as 'ASC' | 'DESC');
        filtered = sortProducts(filtered, sortBy, order);
      }
      
      setProducts(filtered.slice(0, 24)); // Show up to 24 products
      setTotal(filtered.length);
      
      // Smooth loading animation
      setTimeout(() => setLoading(false), 300);
    };

    // Debounce for ultra smooth UX
    const timeoutId = setTimeout(filterProducts, 200);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, sortBy, sortOrder, priceRange, showNewOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('created_at');
    setPriceRange({ min: '', max: '' });
    setShowNewOnly(false);
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    priceRange.min || priceRange.max,
    showNewOnly,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-12">
        {/* Japanese-inspired Search Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
            🔍 Product Discovery
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Discover
            <span className="block text-accent">Excellence</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our carefully curated collection of premium products
          </p>
          
          <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
            {/* Ultra smooth search input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg rounded-2xl border-0 bg-background/50 backdrop-blur-sm shadow-card focus:shadow-hover transition-all duration-300"
              />
            </div>

            {/* Mobile Filter Button */}
            <div className="flex gap-2 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="relative h-14 px-6 rounded-2xl bg-background/50 backdrop-blur-sm shadow-card hover:shadow-hover transition-all duration-300"
                  >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-background/95 backdrop-blur-md">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <MobileFilters 
                      categories={categories}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      showNewOnly={showNewOnly}
                      setShowNewOnly={setShowNewOnly}
                      clearFilters={clearFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-64 h-14 rounded-2xl bg-background/50 backdrop-blur-sm shadow-card hover:shadow-hover transition-all duration-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-background/95 backdrop-blur-md">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="rounded-xl">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-72 space-y-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl text-foreground">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-4 text-foreground">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category.name
                            ? 'bg-accent text-accent-foreground shadow-accent'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-4 text-foreground">Price Range</h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="rounded-xl bg-background/50 border-0 shadow-card focus:shadow-hover transition-all duration-300"
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="rounded-xl bg-background/50 border-0 shadow-card focus:shadow-hover transition-all duration-300"
                    />
                  </div>
                </div>

                {/* New Products */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showNewOnly}
                      onChange={(e) => setShowNewOnly(e.target.checked)}
                      className="w-5 h-5 rounded-lg border-2 border-muted-foreground/30 text-accent focus:ring-accent focus:ring-2 focus:ring-offset-2"
                    />
                    <span className="font-medium text-foreground">New Products Only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold text-accent">{total}</span> product{total !== 1 ? 's' : ''} found
              </p>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 animate-pulse shadow-card"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="w-full h-52 bg-muted rounded-2xl mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded-full"></div>
                      <div className="h-6 bg-muted rounded-full w-4/5"></div>
                      <div className="h-4 bg-muted rounded-full w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-12 shadow-card max-w-md mx-auto">
                  <Search className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">No products found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search criteria or explore different categories</p>
                  <Button 
                    onClick={clearFilters}
                    className="bg-accent hover:bg-accent-hover text-accent-foreground px-6 py-3 rounded-xl font-semibold"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Filters Component with Japanese design
const MobileFilters = ({ 
  categories,
  selectedCategory, 
  setSelectedCategory, 
  priceRange, 
  setPriceRange, 
  showNewOnly, 
  setShowNewOnly, 
  clearFilters 
}: any) => (
  <div className="space-y-8">
    {/* Categories */}
    <div>
      <h3 className="font-semibold mb-4 text-foreground">Category</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedCategory === category.name
                ? 'bg-accent text-accent-foreground shadow-accent'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <h3 className="font-semibold mb-4 text-foreground">Price Range</h3>
      <div className="flex gap-3">
        <Input
          placeholder="Min"
          type="number"
          value={priceRange.min}
          onChange={(e) => setPriceRange((prev: any) => ({ ...prev, min: e.target.value }))}
          className="rounded-xl bg-background/50 border-0 shadow-card focus:shadow-hover transition-all duration-300"
        />
        <Input
          placeholder="Max"
          type="number"
          value={priceRange.max}
          onChange={(e) => setPriceRange((prev: any) => ({ ...prev, max: e.target.value }))}
          className="rounded-xl bg-background/50 border-0 shadow-card focus:shadow-hover transition-all duration-300"
        />
      </div>
    </div>

    {/* New Products */}
    <div>
      <label className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={showNewOnly}
          onChange={(e) => setShowNewOnly(e.target.checked)}
          className="w-5 h-5 rounded-lg border-2 border-muted-foreground/30 text-accent focus:ring-accent focus:ring-2 focus:ring-offset-2"
        />
        <span className="font-medium text-foreground">New Products Only</span>
      </label>
    </div>

    <Button 
      onClick={clearFilters} 
      variant="outline" 
      className="w-full h-12 rounded-xl bg-background/50 border-accent/20 hover:bg-accent/10 transition-all duration-300"
    >
      Clear All Filters
    </Button>
  </div>
);

export default ProductSearch;
