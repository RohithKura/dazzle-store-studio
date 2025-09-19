import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartAPI } from '../services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthProvider';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  category_name: string;
  product_id: string;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (productId: string, productData?: any) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, token } = useAuth();

  // Load cart items on mount and when user/token changes
  useEffect(() => {
    const refreshCart = async () => {
      try {
        setLoading(true);
        let cartItems;
        if (user && token) {
          cartItems = await cartAPI.getItems({ userId: user.id, token });
        } else {
          cartItems = await cartAPI.getItems();
        }
        setItems(cartItems);
      } catch (error) {
        console.error('Error loading cart:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load cart items"
        });
      } finally {
        setLoading(false);
      }
    };
    refreshCart();
    // eslint-disable-next-line
  }, [user, token]);

  const refreshCart = async () => {
    try {
      setLoading(true);
      let cartItems;
      if (user && token) {
        cartItems = await cartAPI.getItems({ userId: user.id, token });
      } else {
        cartItems = await cartAPI.getItems();
      }
      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart items"
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, productData?: any) => {
    try {
      setLoading(true);
      if (user && token) {
        await cartAPI.addItem(productId, 1, { userId: user.id, token });
      } else {
        await cartAPI.addItem(productId, 1);
      }
      await refreshCart();
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart"
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setLoading(true);
      await cartAPI.removeItem(productId);
      await refreshCart();
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart"
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      await cartAPI.updateQuantity(productId, quantity);
      await refreshCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update cart"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      await refreshCart();
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart"
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};