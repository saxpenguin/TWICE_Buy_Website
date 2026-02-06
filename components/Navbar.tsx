'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/context/CartContext';

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-pink-600">
                PingPing小舖
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-pink-600 transition-colors"
              >
                首頁
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
              >
                商品列表
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
              >
                我的訂單
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/cart" 
              className="relative text-gray-700 hover:text-pink-600 transition-colors p-2"
              aria-label="購物車"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-pink-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

            {loading ? (
              <div className="h-9 w-20 bg-gray-100 rounded-md animate-pulse"></div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-700 hidden md:inline">
                  嗨, {user.displayName || user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  登出
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition-colors"
              >
                登入
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
