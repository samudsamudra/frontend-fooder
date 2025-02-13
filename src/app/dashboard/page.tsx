"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OutstandingChart, RevenueChart } from "./components/Charts";
import OrderTable from "./components/OrderTable";
import RevenueCard from "./components/RevenueCard";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserProfile(token);
    fetchOrders(token);
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      router.push("/login");
    }
  };

  const fetchOrders = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/order/get-order`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // Filter orders from exactly 2 months ago up to today
  const today = new Date();
  const twoMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 2,
    today.getDate()
  );

  const filteredOrders = orders.filter(
    (order) =>
      new Date(order.createdAt) >= twoMonthsAgo &&
      new Date(order.createdAt) <= today
  );

  // Format data for charts
  interface ChartData {
    date: string;
    totalRevenue: number;
    totalOrders: number;
  }

  const generateEmptyChartData = (
    startDate: Date,
    endDate: Date
  ): ChartData[] => {
    const data: ChartData[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      data.push({
        date: currentDate.toLocaleDateString(),
        totalRevenue: 0,
        totalOrders: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  };

  const emptyChartData = generateEmptyChartData(twoMonthsAgo, today);

  const chartData: ChartData[] = filteredOrders.reduce(
    (acc: ChartData[], order: any) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const existingData = acc.find((data: ChartData) => data.date === date);

      if (existingData) {
        existingData.totalRevenue += order.total_price;
        existingData.totalOrders += 1;
      } else {
        acc.push({
          date,
          totalRevenue: order.total_price,
          totalOrders: 1,
        });
      }

      return acc;
    },
    emptyChartData
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Sidebar */}
      <aside className="h-full w-64 bg-white shadow-lg p-6 flex flex-col overflow-y-auto">
        <h1 className="text-2xl font-bold text-blue-600">Warung Wareg</h1>
        <div className="mt-6 flex items-center gap-4">
          <img
            src={`${user?.profilePic || "avatar-placeholder.png"}`}
            alt="Profile Picture"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{user?.email || "User"}</p>
            <p className="text-sm text-gray-500">{user?.role || "Guest"}</p>
          </div>
        </div>

        <nav className="mt-6 space-y-2">
          <a
            href="/dashboard"
            className="block p-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
          >
            Dashboard
          </a>
          <a href="/orders" className="block p-3 rounded-lg hover:bg-gray-200">
            Orders
          </a>
          <a
            href="/settings"
            className="block p-3 rounded-lg hover:bg-gray-200"
          >
            Settings
          </a>
          <a href="/menu" className="block p-3 rounded-lg hover:bg-gray-200">
            Menu
          </a>
        </nav>

        <button
          className="mt-auto bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg"
          onClick={() => {
            Cookies.remove("token");
            router.push("/login");
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Dashboard Content */}
        <div className="p-6 bg-gray-100 min-h-screen">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <RevenueCard
              title="Total Revenue"
              value={`Rp${filteredOrders
                .reduce((sum, order) => sum + order.total_price, 0)
                .toFixed(2)}`}
              chart={<RevenueChart data={chartData} />}
            />
            <RevenueCard
              title="Total Orders"
              value={filteredOrders.length}
              chart={<OutstandingChart data={chartData} />}
            />
          </div>

          <OrderTable orders={filteredOrders} />
        </div>
      </main>
    </div>
  );
}
