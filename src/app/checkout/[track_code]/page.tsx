// src/app/checkout/[track_code]/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import CheckoutClient from './CheckoutClient';
import { notFound, redirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ track_code: string }>;
  searchParams?: Promise<Record<string, unknown>>;
};

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { track_code } = await params;
  const s = searchParams ? await searchParams : {};
  const slug = s.slug || s.restaurantSlug;

  if (!track_code || !slug) return notFound();

  const supabase = await createServerClient();
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, total_amount, status, upi_link, payment_qr_url, track_code')
    .eq('track_code', track_code)
    .single();

  if (error || !order) return notFound();

  if (order.status && order.status !== 'payment_pending') {
    redirect(`/(customer-end-pages)/restaurant/${slug}/orders/${order.track_code}`);
  }

  const initialData = {
    orderId: order.id,
    totalAmount: order.total_amount,
    status: order.status,
    upiLink: order.upi_link,
    paymentQrUrl: order.payment_qr_url,
    restaurantSlug: slug as string,
    trackCode: order.track_code,
  };

  return <CheckoutClient initialData={initialData} />;
}
