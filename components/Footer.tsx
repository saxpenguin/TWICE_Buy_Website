import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold tracking-wider text-pink-400 uppercase">PingPing小舖</h3>
            <p className="mt-4 text-base text-gray-300">
              專為 ONCE 打造的專業代購服務。我們協助您購買來自韓國和日本的周邊商品。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-wider text-pink-400 uppercase">聯絡我們</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center">
                <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:saxpenguin+twice@gmail.com" className="text-base text-gray-300 hover:text-white">
                  saxpenguin+twice@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0960513949" className="text-base text-gray-300 hover:text-white">
                  0960513949
                </a>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-base text-gray-300">
                  LINE: ping19830307
                </span>
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <a href="https://www.threads.net/@pingping37" target="_blank" rel="noopener noreferrer" className="text-base text-gray-300 hover:text-white">
                  Threads: @pingping37
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-wider text-pink-400 uppercase">連結</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/products" className="text-base text-gray-300 hover:text-white">
                  所有商品
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-base text-gray-300 hover:text-white">
                  我的購物車
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-base text-gray-300 hover:text-white">
                  我的訂單
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} PingPing小舖. 版權所有.
          </p>
        </div>
      </div>
    </footer>
  );
}
