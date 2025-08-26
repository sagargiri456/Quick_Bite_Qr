import { supabase } from '@/lib/supabase/client';
// Corrected import path for your co-located store
import { CartItem } from '@/app/customer-end-pages/store/cartStore'; 

/**
 * Submits a new order to the database.
 * @param cartItems The items in the shopping cart.
 * @param restaurantId The ID of the restaurant.
 * @param tableId The ID of the table where the order is placed.
 * @param totalAmount The total price of the order.
 */
export const submitOrder = async (
  cartItems: CartItem[],
  restaurantId: string,
  tableId: string,
  totalAmount: number
) => {
  // Step 1: Create the main order record to get an order ID
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      restaurant_id: restaurantId,
      table_id: tableId,
      total_amount: totalAmount,
      status: 'pending', // Initial status
    })
    .select('id')
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error('Could not create the order.');
  }

  const orderId = orderData.id;

  // Step 2: Prepare the list of items for that order
  const itemsToInsert = cartItems.map(item => ({
    order_id: orderId,
    menu_item: item.id,
    quantity: item.quantity,
    price: item.price,
  }));

  // Step 3: Insert all the order items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) {
    console.error('Error inserting order items:', itemsError);
    // In a real app, you might want to delete the order record if this step fails
    throw new Error('Could not save the items for the order.');
  }

  return { success: true, orderId };
};