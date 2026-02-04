import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-pink-600">
                TWICE Proxy
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-pink-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/orders"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
              >
                My Orders
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
