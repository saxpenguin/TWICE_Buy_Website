'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/login');
      } else if (profile?.role !== 'ADMIN') {
        // Logged in but not admin, redirect to home
        router.push('/');
      } else {
        // Authorized
        setIsAuthorized(true);
      }
    }
  }, [user, profile, loading, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Define navigation items
  const navItems = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Orders', href: '/admin/orders' },
    { name: 'Users', href: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:block flex-shrink-0">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-gray-800">
            <h1 className="text-xl font-bold tracking-wider text-pink-500">ADMIN</h1>
          </div>
          
          <nav className="flex-1 py-6 px-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-pink-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800">
             <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                  {user?.email?.substring(0, 2).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white truncate max-w-[140px]">{user?.email}</p>
                  <Link href="/" className="text-xs text-gray-500 hover:text-gray-300">Exit Admin</Link>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden fixed top-0 w-full bg-gray-900 text-white z-10 h-14 flex items-center justify-between px-4">
         <span className="font-bold text-pink-500">ADMIN PANEL</span>
         <div className="flex space-x-4 text-sm">
            <Link href="/admin/products">Products</Link>
            <Link href="/admin/orders">Orders</Link>
         </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}
