import React from 'react'
import LiveOrders from './LiveOrders'
import OrderHistory from './OrderHistory'

const Orders = () => {
  return (
    <div>
        <div className='flex justify-around'>
            <div className='border-2 border-red-600'>
                <LiveOrders></LiveOrders>
            </div>
            <div className='border-2 border-red-600'>
                <OrderHistory></OrderHistory>
            </div>
        </div>
    </div>
  )
}

export default Orders