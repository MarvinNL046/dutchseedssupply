'use client';

import { useState } from 'react';
import { useCart } from './CartContext';

type Product = {
  id: number;
  name: string;
  description: string;
};

type ProductVariant = {
  product_id: number;
  domain_id: string;
  price: number;
  stock: number;
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
      variantId: variant.product_id, // Using product_id as variant ID
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
      disabled={isAdding || variant.stock <= 0}
      className={`
        px-6 py-3 rounded-md font-medium text-white transition-colors
        ${isAdding 
          ? 'bg-green-500' 
          : variant.stock > 0 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-400 cursor-not-allowed'
        }
      `}
    >
      {isAdding ? '✓ Toegevoegd!' : buttonText}
    </button>
  );
}
