import { MOCK_PRODUCTS } from '@/data/mock';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PingPing小舖 - TWICE 代購服務
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            您值得信賴的 TWICE 周邊商品代購夥伴，採用安全的二階段付款系統
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-pink-600 text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold mb-2">二階段付款</h3>
            <p className="text-gray-600">
              第一階段支付商品費用，商品抵達倉庫後支付第二階段運費
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-pink-600 text-3xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">安全可靠</h3>
            <p className="text-gray-600">
              我們會小心處理您的周邊商品，並提供追蹤編號進行運送
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-pink-600 text-3xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold mb-2">獨家商品</h3>
            <p className="text-gray-600">
              協助您購買台灣地區未發售的獨家 TWICE 周邊商品
            </p>
          </div>
        </div>

        {/* Latest Merchandise */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">最新周邊</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">運作方式</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">瀏覽與下單</h3>
                <p className="text-gray-600">
                  選擇您想要的 TWICE 周邊商品並提交預購訂單
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">第一階段付款</h3>
                <p className="text-gray-600">
                  支付商品本體費用 (Stage 1 價格)
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">代購採買</h3>
                <p className="text-gray-600">
                  我們將為您購買商品，並等待商品抵達我們的倉庫
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">第二階段付款</h3>
                <p className="text-gray-600">
                  根據商品實際重量支付國際運費 (Stage 2 價格)
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="font-semibold mb-1">收到商品</h3>
                <p className="text-gray-600">
                  商品將直接寄送到您的收件地址，並附上物流追蹤
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
