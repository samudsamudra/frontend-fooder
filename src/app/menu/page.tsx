"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuItem {
  id: number;
  uuid: string;
  name: string;
  price: number;
  category: string;
  picture: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const MenuPage = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menu/get-menu`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMenu(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setError("Failed to fetch menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddMenu = () => {
    router.push("/menu/add");
  };

  const handleEditMenu = (id: number) => {
    router.push(`/menu/edit/${id}`);
  };

  const handleDeleteMenu = (id: number) => {
    router.push(`/menu/delete/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Menu List</h1>

      <div className="bg-white shadow-md rounded-lg p-4">
        <button
          onClick={handleAddMenu}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Menu
        </button>
        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                menu.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">Rp {item.price.toLocaleString()}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3">{item.description}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEditMenu(item.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
