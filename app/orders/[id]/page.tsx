'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';
import { useAuth } from '@/lib/hooks/useAuth';

export default function OrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const orderDocRef = doc(db, 'orders', id);
        const orderSnap = await getDoc(orderDocRef);

        if (orderSnap.exists()) {
          const orderData = orderSnap.data() as Order;
          
          // Security check: ensure order belongs to current user
          if (orderData.userId !== user.uid) {
            setError('Unauthorized access to this order.');
            setOrder(null);
          } else {
            setOrder(orderData);
          }
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, authLoading, router]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT_1': return '待付第一階段款項';
      case 'PAID_PAYMENT_1': return '已付第一階段款項';
      case 'ARRIVED_TW': return '已抵台 (計算運費中)';
      case 'PENDING_PAYMENT_2': return '待付二補運費';
      case 'PAID_PAYMENT_2': return '已付二補運費';
      case 'SHIPPED': return '已出貨';
      case 'COMPLETED': return '訂單完成';
      case 'CANCELLED': return '已取消';
      default: return status;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
        <Link href="/" className="text-pink-600 hover:text-pink-500">
          返回首頁
        </Link>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">訂單詳情</h1>
            <p className="mt-2 text-sm text-gray-500">訂單編號: {order.id}</p>
          </div>
          <div className="mt-4 md:mt-0">
             <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border
               ${order.status === 'PENDING_PAYMENT_1' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                 order.status === 'PAID_PAYMENT_1' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                 'bg-gray-100 text-gray-800 border-gray-200'}`}>
               {getStatusText(order.status)}
             </span>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
           {/* Order Items */}
           <div className="p-6">
             <h2 className="text-lg font-medium text-gray-900 mb-4">商品項目</h2>
             <ul className="divide-y divide-gray-200">
               {order.items.map((item) => (
                 <li key={item.productId} className="py-4 flex">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                       {item.image ? (
                           <Image 
                             src={item.image} 
                             alt={item.name} 
                             fill
                             className="object-cover object-center"
                           />
                       ) : (
                          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">無圖片</div>
                       )}
                    </div>
                    <div className="ml-4 flex-1 flex flex-col justify-between">
                       <div className="flex justify-between">
                         <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                         <p className="text-base font-medium text-gray-900">NT$ {(item.price_stage1 * item.quantity).toLocaleString()}</p>
                       </div>
                       <p className="text-sm text-gray-500">數量: {item.quantity}</p>
                    </div>
                 </li>
               ))}
             </ul>
           </div>

           {/* Summary Totals */}
           <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                 <span className="text-gray-600">小計 (第一階段)</span>
                 <span className="text-gray-900 font-medium">NT$ {order.total_stage1.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-4">
                 <span className="text-gray-600">運費 (二補)</span>
                 <span className="text-gray-900 font-medium">
                   {order.total_stage2 > 0 ? `NT$ ${order.total_stage2.toLocaleString()}` : '尚未計算'}
                 </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                 <span className="text-lg font-bold text-gray-900">已付總額</span>
                 <span className="text-lg font-bold text-pink-600">
                   NT$ {((order.stage1_paid ? order.total_stage1 : 0) + (order.stage2_paid ? order.total_stage2 : 0)).toLocaleString()}
                 </span>
              </div>
           </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">收件資訊</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div>
               <p className="text-gray-500">收件人</p>
               <p className="font-medium">{order.shippingInfo.receiverName}</p>
             </div>
             <div>
               <p className="text-gray-500">電話</p>
               <p className="font-medium">{order.shippingInfo.phone}</p>
             </div>
             <div className="md:col-span-2">
               <p className="text-gray-500">地址 / 門市</p>
               <p className="font-medium">{order.shippingInfo.address}</p>
             </div>
             <div>
               <p className="text-gray-500">寄送方式</p>
               <p className="font-medium">{order.shippingInfo.deliveryMethod === 'HOME' ? '宅配' : '超商取貨'}</p>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center">
           {order.status === 'PENDING_PAYMENT_1' && (
             <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-pink-700 shadow-lg transform transition hover:scale-105">
               立即付款 (第一階段)
             </button>
           )}
           
           <Link href="/products" className="ml-4 inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
             繼續購物
           </Link>
        </div>

      </div>
    </div>
  );
}
