import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ProductCard from './ProductCard';

// Mock products data - replace with your MySQL data
const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 299,
    originalPrice: 399,
    image: '/src/assets/hero-headphones.jpg',
    rating: 4.8,
    reviews: 156,
    category: 'Audio',
    isNew: true,
  },
  {
    id: '2',
    name: 'Mechanical Gaming Keyboard',
    price: 149,
    originalPrice: 199,
    image: '/src/assets/product-keyboard.jpg',
    rating: 4.6,
    reviews: 89,
    category: 'Gaming',
    isNew: false,
  },
  {
    id: '3',
    name: 'Ultrabook Laptop Pro',
    price: 1299,
    image: '/src/assets/product-laptop.jpg',
    rating: 4.9,
    reviews: 234,
    category: 'Computing',
    isNew: true,
  },
  {
    id: '4',
    name: 'Smart Fitness Watch',
    price: 249,
    originalPrice: 299,
    image: '/src/assets/product-watch.jpg',
    rating: 4.5,
    reviews: 178,
    category: 'Wearables',
    isNew: false,
  },
];

const categories = ['All', 'Audio', 'Gaming', 'Computing', 'Wearables'];
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
];

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showNewOnly, setShowNewOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= Number(priceRange.max));
    }

    // New products filter
    if (showNewOnly) {
      filtered = filtered.filter(product => product.isNew);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Keep relevance order
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, priceRange, showNewOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('relevance');
    setPriceRange({ min: '', max: '' });
    setShowNewOnly(false);
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    priceRange.min || priceRange.max,
    showNewOnly,
  ].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Search Products</h1>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Mobile Filter Button */}
          <div className="flex gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-6">
                  {/* Mobile filter content - same as desktop */}
                  <MobileFilters 
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
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block w-64 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Filters</h2>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="text-sm"
              />
              <Input
                placeholder="Max"
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>

          {/* New Products */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showNewOnly}
                onChange={(e) => setShowNewOnly(e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-sm">New Products Only</span>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile Filters Component
const MobileFilters = ({ 
  selectedCategory, 
  setSelectedCategory, 
  priceRange, 
  setPriceRange, 
  showNewOnly, 
  setShowNewOnly, 
  clearFilters 
}: any) => (
  <>
    {/* Categories */}
    <div>
      <h3 className="font-medium mb-3">Category</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <h3 className="font-medium mb-3">Price Range</h3>
      <div className="flex gap-2">
        <Input
          placeholder="Min"
          type="number"
          value={priceRange.min}
          onChange={(e) => setPriceRange((prev: any) => ({ ...prev, min: e.target.value }))}
          className="text-sm"
        />
        <Input
          placeholder="Max"
          type="number"
          value={priceRange.max}
          onChange={(e) => setPriceRange((prev: any) => ({ ...prev, max: e.target.value }))}
          className="text-sm"
        />
      </div>
    </div>

    {/* New Products */}
    <div>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showNewOnly}
          onChange={(e) => setShowNewOnly(e.target.checked)}
          className="rounded border-input"
        />
        <span className="text-sm">New Products Only</span>
      </label>
    </div>

    <Button onClick={clearFilters} variant="outline" className="w-full">
      Clear All Filters
    </Button>
  </>
);

export default ProductSearch;
