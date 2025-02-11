"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
    fetchOrders();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

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

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/order/get-order`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // Format data for charts
  const chartData = orders.map((order) => ({
    date: new Date(order.createdAt).toLocaleDateString(),
    total: order.total_price,
  }));

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
        </nav>

        <button
          className="mt-auto bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-lg"
          onClick={() => {
            localStorage.removeItem("token");
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

        {/* Order Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-lg font-semibold mb-4">Order List</h3>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border border-gray-300 text-left">
                  Order ID
                </th>
                <th className="p-3 border border-gray-300 text-left">UUID</th>
                <th className="p-3 border border-gray-300 text-left">
                  Customer
                </th>
                <th className="p-3 border border-gray-300 text-left">Table</th>
                <th className="p-3 border border-gray-300 text-left">
                  Total Price
                </th>
                <th className="p-3 border border-gray-300 text-left">
                  Payment
                </th>
                <th className="p-3 border border-gray-300 text-left">Status</th>
                <th className="p-3 border border-gray-300 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="p-3 border border-gray-300">{order.id}</td>
                    <td className="p-3 border border-gray-300">
                      {order.uuid || "-"}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {order.customer}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {order.table_number}
                    </td>
                    <td className="p-3 border border-gray-300">
                      Rp{order.total_price}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {order.payment_method}
                    </td>
                    <td
                      className={`p-3 border border-gray-300 font-semibold ${
                        order.status === "NEW"
                          ? "text-blue-600"
                          : order.status === "COMPLETED"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="p-3 border border-gray-300 text-center"
                    colSpan={8}
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sales Report */}
        <div className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Sales Report
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grafik 1: Area Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Grafik 2: Line Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Total Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#ff7300"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
