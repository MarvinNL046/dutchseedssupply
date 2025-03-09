'use client';

import { useCart, CartItem } from '@/components/cart/CartContext';
import Link from 'next/link';

type CartContentsProps = {
  translatedTexts: {
    emptyCart: string;
    startShopping: string;
    product: string;
    price: string;
    quantity: string;
    total: string;
    actions: string;
    totalItems: string;
    subtotal: string;
    proceedToCheckout: string;
    remove: string;
  };
};

export default function CartContents({ translatedTexts }: CartContentsProps) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600 mb-6">
          {translatedTexts.emptyCart}
        </p>
        <Link 
          href="/products" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {translatedTexts.startShopping}
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {translatedTexts.product}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {translatedTexts.price}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {translatedTexts.quantity}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {translatedTexts.total}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {translatedTexts.actions}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <CartItemRow 
                key={item.variantId} 
                item={item} 
                removeItem={removeItem}
                updateQuantity={updateQuantity}
                removeText={translatedTexts.remove}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg">
            {translatedTexts.totalItems}: <span className="font-bold">{totalItems}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg">
            {translatedTexts.subtotal}: <span className="font-bold">€{totalPrice.toFixed(2)}</span>
          </p>
          {items.length > 0 && (
            <Link 
              href="/checkout" 
              className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
            >
              {translatedTexts.proceedToCheckout}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function CartItemRow({ 
  item, 
  removeItem, 
  updateQuantity,
  removeText
}: { 
  item: CartItem; 
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeText: string;
}) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {item.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">€{item.price.toFixed(2)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button 
            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-l"
          >
            -
          </button>
          <span className="bg-white dark:bg-gray-800 px-4 py-1 border-t border-b border-gray-300 dark:border-gray-600">
            {item.quantity}
          </span>
          <button 
            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-r"
          >
            +
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">€{(item.price * item.quantity).toFixed(2)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onClick={() => removeItem(item.variantId)}
          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
        >
          {removeText}
        </button>
      </td>
    </tr>
  );
}
