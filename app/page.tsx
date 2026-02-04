export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TWICE Proxy Buying Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for purchasing TWICE merchandise with our secure two-stage payment system
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-pink-600 text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold mb-2">Two-Stage Payment</h3>
            <p className="text-gray-600">
              Pay for the product first, then pay for shipping when it arrives at our warehouse
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-pink-600 text-3xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
            <p className="text-gray-600">
              Your merchandise is carefully handled and shipped with tracking
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-pink-600 text-3xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold mb-2">Exclusive Access</h3>
            <p className="text-gray-600">
              Get access to exclusive TWICE merchandise not available in your region
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Browse & Order</h3>
                <p className="text-gray-600">
                  Choose your TWICE merchandise and place a pre-order
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Stage 1 Payment</h3>
                <p className="text-gray-600">
                  Pay for the product cost (price_stage1)
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">We Purchase</h3>
                <p className="text-gray-600">
                  We buy the item and it arrives at our warehouse
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Stage 2 Payment</h3>
                <p className="text-gray-600">
                  Pay for shipping costs (price_stage2) based on actual weight
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="font-semibold mb-1">Receive Your Item</h3>
                <p className="text-gray-600">
                  Your merchandise is shipped directly to you with tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
