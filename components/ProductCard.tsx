import React from 'react';
import { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
            PRE-ORDER
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>
        
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500">Stage 1 Price</p>
            <p className="text-xl font-bold text-pink-600">
              NT$ {product.price_stage1.toLocaleString()}
            </p>
          </div>
          {product.price_stage2_est && (
             <div className="text-right">
             <p className="text-xs text-gray-400">Est. Stage 2</p>
             <p className="text-sm text-gray-600">
               + NT$ {product.price_stage2_est.toLocaleString()}
             </p>
           </div>
          )}
        </div>

        <button className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
