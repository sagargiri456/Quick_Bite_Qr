'use client';

import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/app/(customer-end-pages)/store/cartStore';
import CartItem from './CartItem';
import { X, ShoppingCart, Loader2, CreditCard, Landmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  tableNumber: string;
  restaurantSlug: string;
}

type LoadingState = null | 'online' | 'table';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

export default function Cart({ isOpen, onClose, restaurantId, tableNumber, restaurantSlug }: CartProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState<LoadingState>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Refs to track component state and prevent memory leaks
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset loading state when user returns from UPI app
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isLoading === 'online') {
        // User returned without completing payment - reset loading state
        setIsLoading(null);
        setErrorMessage('Payment was not completed. Please try again.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isLoading]);

  const handleApiCall = async (url: string, body: object) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ 
          error: `Server error: ${res.status} ${res.statusText}` 
        }));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }
  };

  const safeSetState = (setter: () => void) => {
    if (isMountedRef.current) {
      setter();
    }
  };

  const openUpiApp = async (upiLink: string): Promise<boolean> => {
    try {
      const userAgent = navigator.userAgent || '';
      const isAndroid = /Android/i.test(userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

      if (isAndroid) {
        // For Android, try UPI scheme first
        window.location.href = upiLink;
        
        // Fallback to intent after delay
        setTimeout(() => {
          if (isMountedRef.current) {
            const encoded = encodeURIComponent(upiLink);
            const intentUrl = `intent:${encoded}#Intent;scheme=upi;end`;
            try {
              window.location.href = intentUrl;
            } catch (err) {
              console.warn('Intent fallback failed:', err);
            }
          }
        }, 1000);
        
        return true;
      } else if (isIOS) {
        // For iOS, try UPI scheme
        window.location.href = upiLink;
        return true;
      } else {
        // Desktop or other platforms - go to checkout page
        return false;
      }
    } catch (error) {
      console.error('Failed to open UPI app:', error);
      return false;
    }
  };

  const handlePayOnline = async () => {
    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsLoading('online');
    setErrorMessage(null);

    try {
      // Create order
      const createResp = await handleApiCall('/api/checkout', {
        cartItems: items,
        restaurantId,
        tableNumber,
        totalAmount: totalPrice(),
      });

      // Normalize response structure
      const upiLink = createResp?.upiLink || createResp?.upi_link;
      const trackCode = createResp?.trackCode || createResp?.track_code;

      if (!trackCode) {
        throw new Error(createResp?.error || 'Failed to create order - missing track code.');
      }

      // Clear cart early since we're proceeding with payment
      setOrderSuccess(true);
      clearCart();

      // Try to open UPI app if link is available
      if (upiLink) {
        const upiOpened = await openUpiApp(upiLink);
        if (upiOpened) {
          // UPI app should open, user will return later
          return;
        }
      }

      // Fallback: redirect to checkout page
      router.push(`/checkout/${trackCode}?slug=${restaurantSlug}`);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while processing payment.';
      
      console.error('Pay online error:', error);
      safeSetState(() => setErrorMessage(errorMessage));
    } finally {
      safeSetState(() => setIsLoading(null));
    }
  };

  const handlePayOnTable = async () => {
    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsLoading('table');
    setErrorMessage(null);

    try {
      const data = await handleApiCall('/api/orders/postpaid', {
        cartItems: items,
        restaurantId,
        tableNumber,
        totalAmount: totalPrice(),
      });

      if (data?.success && data?.trackCode) {
        setOrderSuccess(true);
        clearCart();
        router.push(`/(customer-end-pages)/restaurnat/${restaurantSlug}/orders/${data.trackCode}`);
      } else {
        throw new Error(data?.error || 'Failed to place postpaid order.');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred while placing your order.';
      
      console.error('Pay on table error:', error);
      safeSetState(() => setErrorMessage(errorMessage));
    } finally {
      safeSetState(() => setIsLoading(null));
    }
  };
  
  const handleClose = () => {
    onClose();
    
    // Clear timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Reset state after animation completes
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setOrderSuccess(false);
        setErrorMessage(null);
        setIsLoading(null);
      }
    }, 300);
  };

  const disabled = items.length === 0 || !!isLoading || orderSuccess;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'} z-[1190]`}
        onClick={handleClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-[1200]`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
            <button 
              onClick={handleClose} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isLoading === 'online'} // Prevent closing during UPI flow
            >
              <X size={24} />
            </button>
          </div>
          
          {orderSuccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-700 p-6">
              <div className="animate-pulse">
                <ShoppingCart size={48} className="mx-auto mb-4 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
              <p className="text-gray-600">Processing your order...</p>
              <div className="mt-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex-grow p-6 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <ShoppingCart size={48} className="mb-4 text-gray-300" />
                    <p className="font-semibold text-lg mb-2">Your cart is empty</p>
                    <p className="text-sm text-gray-400">Add some delicious items to get started!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
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
                  
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-2">⚠️</div>
                        <div>{errorMessage}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <button
                      onClick={handlePayOnline}
                      disabled={disabled}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isLoading === 'online' ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <CreditCard className="mr-2 h-5 w-5" />
                      )}
                      {isLoading === 'online' ? 'Processing...' : 'Pay Online (Prepaid)'}
                    </button>
                    
                    <button
                      onClick={handlePayOnTable}
                      disabled={disabled}
                      className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {isLoading === 'table' ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <Landmark className="mr-2 h-5 w-5" />
                      )}
                      {isLoading === 'table' ? 'Placing Order...' : 'Pay on Table'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}