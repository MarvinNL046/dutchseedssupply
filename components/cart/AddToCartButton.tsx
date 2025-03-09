'use client';

import { useState } from 'react';
import { useCart } from './CartContext';

type Product = {
  id: number;
  name: string;
  description: string;
};

type ProductVariant = {
  id: string;
  product_id: string;
  domain_id: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  stock_status: string;
  available: boolean;
};

type AddToCartButtonProps = {
  product: Product;
  variant: ProductVariant;
  buttonText?: string;
};

export default function AddToCartButton({ 
  product, 
  variant, 
  buttonText = 'In winkelwagen' 
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = () => {
    setIsAdding(true);
    
    // Add the item to the cart
    addItem({
      productId: product.id,
      variantId: variant.id, // Using variant ID
      name: product.name,
      price: variant.price,
      domainId: variant.domain_id,
    });
    
    // Show feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };
  
  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || variant.stock_quantity <= 0}
      className={`
        px-6 py-3 rounded-md font-medium text-white transition-colors
        ${isAdding 
          ? 'bg-green-500' 
          : variant.stock_quantity > 0 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-400 cursor-not-allowed'
        }
      `}
    >
      {isAdding ? '✓ Toegevoegd!' : buttonText}
    </button>
  );
}
