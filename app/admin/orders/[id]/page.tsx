'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus } from '@/types';

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // Unwrapping params for Next.js 15+

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [shippingFee, setShippingFee] = useState<number>(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Order;
          setOrder(data);
          // Initialize shipping fee input if it exists, otherwise 0
          setShippingFee(data.total_stage2 || 0);
        } else {
          router.push('/admin/orders');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: Date.now()
      });
      
      // Update local state
      setOrder({ ...order, status: newStatus, updatedAt: Date.now() });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleShippingFeeUpdate = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      
      // If setting shipping fee, we usually want to move to Arrived at TW or Pending Payment 2
      // For now, just update the fee and maybe prompt status change manually
      await updateDoc(orderRef, {
        total_stage2: shippingFee,
        updatedAt: Date.now()
      });
      
      setOrder({ ...order, total_stage2: shippingFee, updatedAt: Date.now() });
      alert('Shipping fee updated successfully');
    } catch (error) {
      console.error('Error updating shipping fee:', error);
      alert('Failed to update shipping fee');
    } finally {
      setUpdating(false);
    }
  };

  // Helper to check if a status transition is logical (optional, simplified for now)
  const availableStatuses: OrderStatus[] = [
    'PENDING_PAYMENT_1',
    'PAID_PAYMENT_1',
    'ARRIVED_TW',
    'PENDING_PAYMENT_2',
    'PAID_PAYMENT_2',
    'SHIPPED',
    'COMPLETED',
    'CANCELLED'
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/orders" className="mr-4 text-gray-500 hover:text-gray-700">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
        </div>
        <div className="text-sm text-gray-500">
            Created: {new Date(order.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content: Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={index} className="px-4 py-4 sm:px-6 flex items-center">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || 'https://placehold.co/100?text=No+Image'}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.name}</h3>
                      <p>NT$ {item.price_stage1.toLocaleString()}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-end">
              <div className="text-right">
                 <p className="text-sm text-gray-500">Stage 1 Total (Products)</p>
                 <p className="text-xl font-bold text-gray-900">NT$ {order.total_stage1.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
             <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Shipping & Receiver</h3>
             </div>
             <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                   <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Receiver Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.shippingInfo.receiverName}</dd>
                   </div>
                   <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.shippingInfo.phone}</dd>
                   </div>
                   <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Address / Store</dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.shippingInfo.address}</dd>
                   </div>
                   <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Delivery Method</dt>
                      <dd className="mt-1 text-sm text-gray-900">{order.shippingInfo.deliveryMethod}</dd>
                   </div>
                </dl>
             </div>
          </div>
        </div>

        {/* Sidebar: Admin Actions */}
        <div className="space-y-6">
           <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-2">
                 <div className="text-sm text-gray-500 mb-2">Current Status: <span className="font-bold text-gray-900">{order.status}</span></div>
                 
                 <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(e.target.value as OrderStatus)}
                    disabled={updating}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                 >
                    {availableStatuses.map(status => (
                       <option key={status} value={status}>{status}</option>
                    ))}
                 </select>
              </div>
           </div>

           <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Stage 2: Shipping Fee</h3>
              <div className="space-y-4">
                 <div>
                    <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700">
                       International + Domestic Shipping (NT$)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                       <input
                          type="number"
                          name="shippingFee"
                          id="shippingFee"
                          className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0"
                          value={shippingFee}
                          onChange={(e) => setShippingFee(Number(e.target.value))}
                       />
                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">NTD</span>
                       </div>
                    </div>
                 </div>
                 <button
                    onClick={handleShippingFeeUpdate}
                    disabled={updating}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                 >
                    {updating ? 'Updating...' : 'Update Fee'}
                 </button>
                 <p className="text-xs text-gray-500 mt-2">
                    Setting this fee does not automatically charge the user. You must also update the status to "PENDING_PAYMENT_2" to notify them.
                 </p>
              </div>
           </div>
           
           <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
               <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Info</h3>
               <dl className="space-y-2 text-sm">
                   <div className="flex justify-between">
                       <dt className="text-gray-500">Stage 1 Paid:</dt>
                       <dd className={`font-medium ${order.stage1_paid ? 'text-green-600' : 'text-red-600'}`}>
                           {order.stage1_paid ? 'Yes' : 'No'}
                       </dd>
                   </div>
                   <div className="flex justify-between">
                       <dt className="text-gray-500">Stage 2 Paid:</dt>
                       <dd className={`font-medium ${order.stage2_paid ? 'text-green-600' : 'text-red-600'}`}>
                           {order.stage2_paid ? 'Yes' : 'No'}
                       </dd>
                   </div>
               </dl>
           </div>
        </div>
      </div>
    </div>
  );
}
