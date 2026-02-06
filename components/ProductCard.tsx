'use client';

import React from 'react';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    // Optional: Add toast or visual feedback here
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 w-full bg-gray-200">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        {product.status === 'PREORDER' && (
          <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">
            預購
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3.5rem]">
          <Link href={`/products/${product.id}`} className="hover:text-pink-600 transition-colors">
            {product.name}
          </Link>
        </h3>
        
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500">第一階段價格</p>
            <p className="text-xl font-bold text-pink-600">
              NT$ {product.price_stage1.toLocaleString()}
            </p>
          </div>
          {product.price_stage2_est && (
             <div className="text-right">
             <p className="text-xs text-gray-400">預估二補</p>
             <p className="text-sm text-gray-600">
               + NT$ {product.price_stage2_est.toLocaleString()}
             </p>
           </div>
          )}
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={product.status === 'CLOSED'}
          className={`mt-4 w-full py-2 px-4 rounded transition-colors ${
            product.status === 'CLOSED'
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {product.status === 'CLOSED' ? '已截單' : '加入購物車'}
        </button>
      </div>
    </div>
  );
}
