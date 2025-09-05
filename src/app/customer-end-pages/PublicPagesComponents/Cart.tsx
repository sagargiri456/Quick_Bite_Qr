'use client';

import { useState } from 'react';
import { useCartStore } from '@/app/customer-end-pages/store/cartStore';
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

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

export default function Cart({ isOpen, onClose, restaurantId, tableNumber, restaurantSlug }: CartProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState<null | 'online' | 'table'>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApiCall = async (url: string, body: object) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'An unexpected server error occurred.' }));
      throw new Error(errorData.error || 'Server error');
    }
    return res.json();
  };

  // const handlePayOnline = async () => {
  //   if (items.length === 0) {
  //     setErrorMessage('Your cart is empty.');
  //     return;
  //   }

  //   setIsLoading('online');
  //   setErrorMessage(null);

  //   try {
  //     // 1) create order
  //     const createResp = await handleApiCall('/api/checkout', {
  //       cartItems: items,
  //       restaurantId,
  //       tableNumber,
  //       totalAmount: totalPrice(),
  //     });

  //     if (!createResp?.success || !createResp?.orderId) {
  //       // sometimes older response returned trackCode — handle both
  //       if (createResp?.trackCode) {
  //         // fallback: redirect to checkout (old behaviour)
  //         setOrderSuccess(true);
  //         clearCart();
  //         router.push(`/checkout/${createResp.trackCode}?slug=${restaurantSlug}`);
  //         return;
  //       }
  //       throw new Error(createResp?.error || 'Failed to create order.');
  //     }

  //     const orderId = createResp.orderId;

  //     // 2) request magic link
  //     const linkRes = await fetch(`/api/orders/${orderId}/magic-link`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //     });

  //     if (!linkRes.ok) {
  //       const linkErr = await linkRes.json().catch(() => ({}));
  //       // If magic link generation fails, try redirecting to the checkout page directly using trackCode if available
  //       if (createResp.trackCode) {
  //         setOrderSuccess(true);
  //         clearCart();
  //         router.push(`/checkout/${createResp.trackCode}?slug=${restaurantSlug}`);
  //         return;
  //       }
  //       throw new Error(linkErr.error || 'Failed to generate magic link.');
  //     }

  //     const linkData = await linkRes.json();

  //     if (!linkData?.magicUrl) {
  //       // fallback to checkout page if trackCode present
  //       if (createResp.trackCode) {
  //         setOrderSuccess(true);
  //         clearCart();
  //         router.push(`/checkout/${createResp.trackCode}?slug=${restaurantSlug}`);
  //         return;
  //       }
  //       throw new Error('Magic link not returned by server.');
  //     }

  //     // success — clear cart and redirect browser to magic link (full redirect so token is consumed server-side)
  //     setOrderSuccess(true);
  //     clearCart();

  //     // Use full navigation (location.href) because magicUrl might point to an API route that redirects
  //     window.location.href = linkData.magicUrl;
  //   } catch (error: any) {
  //     console.error('Pay online error:', error);
  //     setErrorMessage(error?.message || 'An error occurred while processing payment.');
  //   } finally {
  //     setIsLoading(null);
  //   }
  // };
const handlePayOnline = async () => {
  if (items.length === 0) {
    setErrorMessage('Your cart is empty.');
    return;
  }

  setIsLoading('online');
  setErrorMessage(null);

  try {
    // 1) create order (server will generate upiLink + QR)
    const createResp = await handleApiCall('/api/checkout', {
      cartItems: items,
      restaurantId,
      tableNumber,
      totalAmount: totalPrice(),
    });

    // normalize response
    const orderId = createResp?.orderId;
    const upiLink = createResp?.upiLink || createResp?.upi_link;
    const trackCode = createResp?.trackCode || createResp?.track_code;

    if (!orderId || !trackCode) {
      // fallback if older response shape:
      if (createResp?.trackCode) {
        setOrderSuccess(true);
        clearCart();
        router.push(`/checkout/${createResp.trackCode}?slug=${restaurantSlug}`);
        return;
      }
      throw new Error(createResp?.error || 'Failed to create order.');
    }

    // Clear cart early (customer is moving to UPI app)
    setOrderSuccess(true);
    clearCart();

    // 2) If upiLink present, attempt to open it (mobile UPI app)
    if (upiLink) {
      try {
        const userAgent = navigator.userAgent || '';
        const isAndroid = /Android/i.test(userAgent);

        if (isAndroid) {
          // Try opening UPI scheme first
          window.location.href = upiLink;

          // Then attempt intent fallback after a short delay
          // The intent uses the encoded upi link as data
          const encoded = encodeURIComponent(upiLink);
          const intentUrl = `intent:${encoded}#Intent;scheme=upi;end`;

          setTimeout(() => {
            // This may or may not be necessary depending on browser; it's a harmless fallback
            window.location.href = intentUrl;
          }, 500);
        } else {
          // iOS / other: open UPI scheme
          window.location.href = upiLink;
        }
      } catch (err) {
        console.error('Failed to open UPI link, falling back to checkout page', err);
        router.push(`/checkout/${trackCode}?slug=${restaurantSlug}`);
      }

      // Browser will navigate away. End here.
      return;
    }

    // 3) Fallback: if no upiLink, go to checkout page where we show QR & UPI button
    router.push(`/checkout/${trackCode}?slug=${restaurantSlug}`);
  } catch (error: any) {
    console.error('Pay online error:', error);
    setErrorMessage(error?.message || 'An error occurred while processing payment.');
  } finally {
    setIsLoading(null);
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
      if (data.success && data.trackCode) {
        setOrderSuccess(true);
        clearCart();
        router.push(`/customer-end-pages/${restaurantSlug}/orders/${data.trackCode}`);
      } else {
        throw new Error(data.error || 'Failed to place postpaid order.');
      }
    } catch (error: any) {
      console.error('Pay on table error:', error);
      setErrorMessage(error?.message || 'An error occurred while placing order.');
    } finally {
      setIsLoading(null);
    }
  };
  
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setOrderSuccess(false);
      setErrorMessage(null);
    }, 300);
  };

  const disabled = items.length === 0 || !!isLoading;

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
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
          </div>
          {orderSuccess ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-700 p-6">
              <h3 className="text-2xl font-bold text-green-600">Thank You!</h3>
              <p className="mt-2">Redirecting...</p>
            </div>
          ) : (
            <>
              <div className="flex-grow p-6 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                    <ShoppingCart size={48} className="mb-4" />
                    <p className="font-semibold">Your cart is currently empty.</p>
                  </div>
                ) : (
                  <div className="divide-y">{items.map((item) => <CartItem key={item.id} item={item} />)}</div>
                )}
              </div>
              {items.length > 0 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-800">Subtotal</span>
                    <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice())}</span>
                  </div>
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{errorMessage}</div>
                  )}
                  <div className="space-y-3">
                    <button
                      onClick={handlePayOnline}
                      disabled={disabled}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading === 'online' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                      {isLoading === 'online' ? 'Processing...' : 'Pay Online (Prepaid)'}
                    </button>
                    <button
                      onClick={handlePayOnTable}
                      disabled={disabled}
                      className="w-full bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center"
                    >
                      {isLoading === 'table' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Landmark className="mr-2 h-5 w-5" />}
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
