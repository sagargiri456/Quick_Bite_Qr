// src/app/customer-end-pages/PublicPagesComponents/Cart.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/app/customer-end-pages/store/cartStore';
import CartItem from './CartItem';
import { X, ShoppingCart, Loader2 } from 'lucide-react';
import { submitOrder } from '@/lib/api/orders';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  tableId: string;
  restaurantSlug: string; // FIXED: Ensure this prop is received
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

export default function Cart({ isOpen, onClose, restaurantId, tableId, restaurantSlug }: CartProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const total = totalPrice();
      // The API call now includes the cart items
      const { success, trackCode, restaurantSlug: slug } = await submitOrder(items, restaurantId, tableId, total);

      if (success && trackCode && slug) {
        clearCart();
        toast.success("Order placed successfully!");
        // Redirect to the order tracking page
        router.push(`/customer-end-pages/${slug}/orders/${trackCode}`);
        return;
      }
      toast.error('Order could not be placed. Please try again.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'There was an error placing your order.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        } z-[1190]`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } z-[1200]`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-grow p-6 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <ShoppingCart size={48} className="mb-4" />
                <p className="font-semibold">Your cart is currently empty.</p>
              </div>
            ) : (
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(totalPrice())}
                </span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isPlacingOrder && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}