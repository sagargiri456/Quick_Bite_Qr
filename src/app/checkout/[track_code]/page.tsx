// src/app/checkout/[track_code]/page.tsx
import { createServerClient } from '@/lib/supabase/server';
import CheckoutClient from './CheckoutClient';
import { notFound, redirect } from 'next/navigation';

type PageProps = {
  params: Record<string, any> | Promise<Record<string, any>>;
  searchParams?: Record<string, any>;
};

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const p = (await params) ?? {};
  const s = searchParams ?? {};
  const track_code = p.track_code || p.trackCode || p.code;
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
    redirect(`/customer-end-pages/${slug}/orders/${order.track_code}`);
  }

  const initialData = {
    orderId: order.id,
    totalAmount: order.total_amount,
    status: order.status,
    upiLink: order.upi_link,
    paymentQrUrl: order.payment_qr_url,
    restaurantSlug: slug,
    trackCode: order.track_code,
  };

  return <CheckoutClient initialData={initialData} />;
}
