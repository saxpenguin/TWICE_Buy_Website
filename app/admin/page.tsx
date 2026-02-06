'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, Product } from '@/types';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingStage1: number;
  pendingStage2: number;
  totalProducts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingStage1: 0,
    pendingStage2: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Orders for calculations
        const ordersRef = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersRef);
        
        let revenue = 0;
        let pendingS1 = 0;
        let pendingS2 = 0;
        
        ordersSnapshot.forEach(doc => {
          const order = doc.data() as Order;
          
          // Calculate Revenue (Only count paid stages)
          if (order.stage1_paid) revenue += order.total_stage1;
          if (order.stage2_paid) revenue += order.total_stage2;

          // Count Pending Tasks
          if (order.status === 'PENDING_PAYMENT_1') pendingS1++;
          if (order.status === 'PENDING_PAYMENT_2' || order.status === 'ARRIVED_TW') pendingS2++;
        });

        // 2. Fetch Recent Orders (Limit 5)
        const recentOrdersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(5));
        const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
        const recentOrdersData: Order[] = [];
        recentOrdersSnapshot.forEach(doc => {
          recentOrdersData.push(doc.data() as Order);
        });

        // 3. Fetch Products Count
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getDocs(productsRef);

        setStats({
          totalOrders: ordersSnapshot.size,
          totalRevenue: revenue,
          pendingStage1: pendingS1,
          pendingStage2: pendingS2,
          totalProducts: productsSnapshot.size,
        });

        setRecentOrders(recentOrdersData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">NT$ {stats.totalRevenue.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Pending Stage 1</h3>
          <p className="text-2xl font-bold text-orange-600 mt-2">{stats.pendingStage1}</p>
          <p className="text-xs text-gray-400 mt-1">Need Payment</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Action Required (Stage 2)</h3>
          <p className="text-2xl font-bold text-pink-600 mt-2">{stats.pendingStage2}</p>
          <p className="text-xs text-gray-400 mt-1">Weighing / Shipping</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-pink-600 hover:text-pink-700">View All</Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No recent orders found.</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        by {order.shippingInfo.receiverName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.status.includes('PENDING') ? 'bg-yellow-100 text-yellow-800' : 
                          order.status.includes('PAID') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link 
              href="/admin/products/add"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700"
            >
              Add New Product
            </Link>
            <Link 
              href="/admin/orders"
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Manage Orders
            </Link>
             <Link 
              href="/admin/users"
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Manage Users
            </Link>
            <div className="pt-4 border-t border-gray-100">
               <div className="text-sm text-gray-500">
                 Total Products: <span className="font-medium text-gray-900">{stats.totalProducts}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
