'use client';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { useEffect, useState } from 'react';

// Force dynamic rendering since we depend on params and live data
export const dynamic = 'force-dynamic';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      const resolvedParams = await params;
      const fetchedProduct = await getProduct(resolvedParams.id);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      } else {
        // Handle not found appropriately in client component
        // For now, we set product to null which will show loading or error
      }
      setLoading(false);
    }
    loadProduct();
  }, [params]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product);
    // Optional: Add toast notification
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-pink-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <Link href="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-pink-600 md:ml-2">
                  Products
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-[200px]">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2 p-8 bg-gray-100 flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-md rounded-lg overflow-hidden bg-white shadow-sm">
                 {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image Available
                  </div>
                )}
                {product.status === 'PREORDER' && (
                  <div className="absolute top-4 right-4 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded shadow-md">
                    PRE-ORDER
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'INSTOCK' ? 'bg-green-100 text-green-800' :
                  product.status === 'PREORDER' ? 'bg-pink-100 text-pink-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.status === 'INSTOCK' ? 'In Stock' : 
                   product.status === 'PREORDER' ? 'Pre-order' : 'Closed'}
                </span>
                {product.releaseDate && (
                   <span className="text-sm text-gray-500">
                     Release: {product.releaseDate}
                   </span>
                )}
              </div>

              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-600 font-medium">Stage 1 Payment (Product)</span>
                  <span className="text-3xl font-bold text-pink-600">NT$ {product.price_stage1.toLocaleString()}</span>
                </div>
                {product.price_stage2_est && (
                  <div className="flex justify-between items-end text-sm text-gray-500">
                     <span>Estimated Stage 2 (Shipping)</span>
                     <span>+ NT$ {product.price_stage2_est.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="prose prose-pink max-w-none mb-8 text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="whitespace-pre-line">{product.description || "No description available."}</p>
              </div>

              <div className="flex flex-col space-y-4">
                 {product.status !== 'CLOSED' ? (
                   <button 
                     onClick={handleAddToCart}
                     className="w-full bg-gray-900 text-white text-lg font-semibold py-4 px-8 rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98] transition-transform"
                   >
                     {product.status === 'PREORDER' ? 'Pre-order Now' : 'Add to Cart'}
                   </button>
                 ) : (
                   <button disabled className="w-full bg-gray-300 text-gray-500 text-lg font-semibold py-4 px-8 rounded-lg cursor-not-allowed">
                     Sales Closed
                   </button>
                 )}
                 <p className="text-xs text-center text-gray-500 mt-2">
                   * Stage 2 payment (shipping) will be calculated and charged after the item arrives at our warehouse.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
