'use client';

import AddToCartButton from '@/components/cart/AddToCartButton';
import { CartProvider } from '@/components/cart/CartContext';

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

type AddToCartButtonWrapperProps = {
  product: Product;
  variant: ProductVariant;
  buttonText: string;
};

// This wrapper is needed because we need to use the CartProvider
// in a client component, but we want to pass server-side props
export default function AddToCartButtonWrapper({
  product,
  variant,
  buttonText,
}: AddToCartButtonWrapperProps) {
  return (
    <CartProvider>
      <AddToCartButton
        product={product}
        variant={variant}
        buttonText={buttonText}
      />
    </CartProvider>
  );
}
