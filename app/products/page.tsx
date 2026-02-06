// app/products/page.tsx
import { getDocs, collection, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60; // Revalidate every 60 seconds

async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    // Fetch active products (not CLOSED), ordered by creation date
    const q = query(
      productsRef,
      where('status', '!=', 'CLOSED'),
      orderBy('status'), // Firestore requires the first orderBy to match the where filter if using != or range comparison
      orderBy('createdAt', 'desc')
    );
    
    // Note: If you encounter an index error from Firestore, you might need to create a composite index.
    // For now, let's keep it simple and maybe just fetch all and filter in memory if the dataset is small,
    // or just fetch by createdAt if we don't strictly need to filter CLOSED on the server query for this prototype.
    // Let's try a simpler query first to avoid index issues during prototyping.
    
    const simpleQuery = query(productsRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(simpleQuery);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Basic validation or mapping could happen here
      products.push({
        id: doc.id,
        ...data,
      } as Product);
    });

    // Filter out closed products if needed
    return products.filter(p => p.status !== 'CLOSED');
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            所有商品
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            瀏覽我們最新的 TWICE 周邊商品系列。
          </p>
        </div>

        {products.length === 0 ? (
           <div className="text-center py-12">
             <p className="text-gray-500 text-lg">目前沒有商品。</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
