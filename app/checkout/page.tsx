'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/hooks/useAuth';
import { ShippingInfo } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, totalPriceStage1, totalItems } = useCart();
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<ShippingInfo>({
    receiverName: '',
    phone: '',
    address: '',
    deliveryMethod: 'HOME',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with saved info if available
  useEffect(() => {
    if (profile?.savedShippingInfo) {
      setFormData(profile.savedShippingInfo);
    }
  }, [profile]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      // Store current path to redirect back after login? 
      // For now just go to login
      router.push('/login?redirect=/checkout');
    }
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Handle order creation logic in next step
    // For now, we will simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Checkout Form Data:', formData);
    console.log('Cart Items:', items);
    
    // alert('Proceeding to payment... (Mock)');
    setIsSubmitting(false);
  };

  if (loading) {
     return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (items.length === 0) {
     return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7">
             <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Delivery Method */}
                  <div>
                    <label htmlFor="deliveryMethod" className="block text-sm font-medium text-gray-700">
                      Delivery Method
                    </label>
                    <select
                      id="deliveryMethod"
                      name="deliveryMethod"
                      value={formData.deliveryMethod}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-2 px-3 border"
                    >
                      <option value="HOME">Home Delivery (宅配)</option>
                      <option value="CVS">Convenience Store Pickup (超商取貨)</option>
                    </select>
                  </div>

                  {/* Receiver Name */}
                  <div>
                    <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
                      Receiver Name
                    </label>
                    <input
                      type="text"
                      name="receiverName"
                      id="receiverName"
                      required
                      value={formData.receiverName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-2 px-3 border"
                      placeholder="Full Name"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-2 px-3 border"
                      placeholder="0912345678"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      {formData.deliveryMethod === 'HOME' ? 'Shipping Address' : 'Store Info (Code/Name)'}
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      required
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-2 px-3 border"
                      placeholder={formData.deliveryMethod === 'HOME' ? "123 Main St, City, Country" : "e.g. 7-11 Ximen Store (123456)"}
                    />
                  </div>
                  
                  {/* Warning Note */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Please ensure your shipping information is correct. Changes might not be possible after payment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-pink-600 border border-transparent rounded-md shadow-sm py-3 px-6 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>

                </form>
             </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <ul className="divide-y divide-gray-200 mb-6 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <li key={item.productId} className="py-4 flex">
                     <div className="flex-shrink-0 h-16 w-16 border border-gray-200 rounded-md overflow-hidden relative">
                        {item.image ? (
                           <div className="relative h-full w-full">
                              <Image 
                                src={item.image} 
                                alt={item.name} 
                                fill
                                className="object-cover object-center"
                              />
                           </div>
                        ) : (
                          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                     </div>
                     <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3 className="line-clamp-1">{item.name}</h3>
                            <p className="ml-2">NT$ {(item.price_stage1 * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                        </div>
                     </div>
                  </li>
                ))}
              </ul>

              <dl className="space-y-4 border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal (Stage 1)</dt>
                  <dd className="text-sm font-medium text-gray-900">NT$ {totalPriceStage1.toLocaleString()}</dd>
                </div>
                
                 <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Items</dt>
                  <dd className="text-sm font-medium text-gray-900">{totalItems}</dd>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-bold text-gray-900">Total Due (Stage 1)</dt>
                  <dd className="text-xl font-bold text-pink-600">NT$ {totalPriceStage1.toLocaleString()}</dd>
                </div>
              </dl>
              
              <div className="mt-4 text-xs text-gray-500">
                 * You are paying for the product cost only. Shipping fees (Stage 2) will be calculated and charged when items arrive at our warehouse.
              </div>

               <div className="mt-6 text-center">
                 <Link href="/cart" className="text-sm font-medium text-pink-600 hover:text-pink-500">
                   Return to Cart
                 </Link>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
