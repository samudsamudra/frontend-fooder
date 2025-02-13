import React from 'react';

interface Order {
  id: number;
  uuid?: string;
  customer: string;
  table_number: number;
  total_price: number;
  payment_method: string;
  status: string;
  createdAt: string;
}

interface OrderTableProps {
  orders: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-lg font-semibold mb-4">Order List</h3>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border border-gray-300 text-left">Order ID</th>
            <th className="p-3 border border-gray-300 text-left">UUID</th>
            <th className="p-3 border border-gray-300 text-left">Customer</th>
            <th className="p-3 border border-gray-300 text-left">Table</th>
            <th className="p-3 border border-gray-300 text-left">
              Total Price
            </th>
            <th className="p-3 border border-gray-300 text-left">Payment</th>
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
                <td className="p-3 border border-gray-300">{order.customer}</td>
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
  );
};

export default OrderTable;
