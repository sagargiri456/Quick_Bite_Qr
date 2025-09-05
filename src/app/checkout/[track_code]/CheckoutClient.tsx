// src/app/checkout/[track_code]/CheckoutClient.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

type InitialData = {
  orderId: string;
  totalAmount: number;
  status: string;
  upiLink: string | null;
  paymentQrUrl: string | null;
  restaurantSlug: string;
  trackCode: string;
};

export default function CheckoutClient({ initialData }: { initialData: InitialData }) {
  const [currentStatus, setCurrentStatus] = useState(initialData.status);
  const router = useRouter();

  useEffect(() => {
    if (currentStatus !== 'payment_pending') return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/public/orders/${initialData.trackCode}/status`);
        if (res.ok) {
          const { status } = await res.json();
          if (status !== 'payment_pending') {
            setCurrentStatus(status);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Failed to poll for status:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentStatus, initialData.trackCode]);

  useEffect(() => {
    if (currentStatus !== 'payment_pending') {
      router.push(`/customer-end-pages/${initialData.restaurantSlug}/orders/${initialData.trackCode}`);
    }
  }, [currentStatus, router, initialData.restaurantSlug, initialData.trackCode]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-md shadow-2xl animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Complete Your Payment</CardTitle>
          <CardDescription>Scan to pay ₹{initialData.totalAmount?.toFixed?.(2) ?? initialData.totalAmount}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center my-4 h-60 w-60 mx-auto border p-2 rounded-xl bg-white shadow-inner">
            {initialData.paymentQrUrl ? (
              <img src={initialData.paymentQrUrl} alt="UPI QR Code" className="w-full h-full rounded-md" />
            ) : (
              <div className="flex flex-col items-center text-center text-gray-500">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="mt-2 text-sm">Generating QR Code...</p>
              </div>
            )}
          </div>

          <Button asChild className="w-full font-bold py-3 text-lg h-12">
            <a href={initialData.upiLink || '#'}>Pay with UPI App</a>
          </Button>

          <Alert className="mt-6 bg-yellow-50 border-yellow-200">
            <Loader2 className="h-4 w-4 animate-spin text-yellow-800" />
            <AlertDescription className="text-yellow-800">
              Waiting for payment... This page will redirect automatically after confirmation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
