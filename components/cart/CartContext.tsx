'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for cart items
export type CartItem = {
  productId: number;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  domainId: string;
};

// Define the context type
type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

// Create the context with a default value
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart from localStorage if available
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  // Calculate total items and price
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Add an item to the cart
  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Check if the item already exists in the cart
      const existingItemIndex = prevItems.findIndex(item => item.variantId === newItem.variantId);
      
      if (existingItemIndex >= 0) {
        // If it exists, increase the quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += 1;
        return updatedItems;
      } else {
        // If it doesn't exist, add it with quantity 1
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };
  
  // Remove an item from the cart
  const removeItem = (variantId: string) => {
    setItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
  };
  
  // Update the quantity of an item
  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear the cart
  const clearCart = () => {
    setItems([]);
  };
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}
