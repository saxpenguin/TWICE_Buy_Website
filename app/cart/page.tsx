'use client';

import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPriceStage1, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
            <Link
              href="/products"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.productId} className="p-6 sm:flex sm:items-center">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link href={`/products/${item.productId}`} className="hover:text-pink-600">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="ml-4 text-lg font-bold text-gray-900">
                          NT$ {(item.price_stage1 * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex flex-1 items-end justify-between">
                        <div className="flex items-center space-x-3">
                          <label htmlFor={`quantity-${item.productId}`} className="text-sm text-gray-600">
                            Qty
                          </label>
                          <select
                            id={`quantity-${item.productId}`}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                            className="rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 sm:text-sm"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-sm font-medium text-red-600 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="p-4 bg-gray-50 flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal (Stage 1)</dt>
                  <dd className="text-sm font-medium text-gray-900">NT$ {totalPriceStage1.toLocaleString()}</dd>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Total Stage 1</dt>
                  <dd className="text-xl font-bold text-pink-600">NT$ {totalPriceStage1.toLocaleString()}</dd>
                </div>
              </dl>

              <div className="mt-6">
                 <p className="text-xs text-gray-500 mb-4">
                   * Shipping costs (Stage 2) will be calculated and charged after items arrive at the warehouse.
                 </p>
                <Link
                  href="/checkout"
                  className="w-full flex justify-center items-center bg-gray-900 text-white px-6 py-3 border border-transparent rounded-md text-base font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Proceed to Checkout
                </Link>
              </div>
              
               <div className="mt-4 text-center">
                <Link href="/products" className="text-sm font-medium text-pink-600 hover:text-pink-500">
                  or Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
