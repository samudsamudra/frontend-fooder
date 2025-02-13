"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

const MenuPage = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
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

  const handleAddMenu = () => router.push("/add-menu");
  const handleEditMenu = (id: number) => router.push(`/menu/edit/${id}`);
  const handleDeleteMenu = (id: number) => router.push(`/menu/delete/${id}`);

  const filteredMenu = menu.filter((item) => {
    if (searchCriteria === "name") {
      return item.name.toLowerCase().includes(search.toLowerCase());
    } else if (searchCriteria === "category") {
      return item.category.toLowerCase().includes(search.toLowerCase());
    }
    return false;
  });

  const columns: ColumnDef<MenuItem>[] = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => `Rp ${Number(getValue()).toLocaleString()}`,
    },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "description", header: "Description" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            title="Edit Menu"
            className="text-blue-500 hover:text-blue-700 p-2 rounded-md bg-gray-100"
            onClick={() => handleEditMenu(row.original.id)}
          >
            <FiEdit className="inline-block" />
          </button>
          <button
            title="Delete Menu"
            className="text-red-500 hover:text-red-700 p-2 rounded-md bg-gray-100"
            onClick={() => handleDeleteMenu(row.original.id)}
          >
            <FiTrash2 className="inline-block" />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredMenu,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-700">Menu List</h1>
          <button
            onClick={handleAddMenu}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
          >
            <FiPlus className="mr-2" /> Add Menu
          </button>
        </div>

        <div className="flex mb-4">
          <label htmlFor="searchCriteria" className="sr-only">Search Criteria</label>
          <select
            id="searchCriteria"
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mr-2"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
          </select>
          <input
            type="text"
            placeholder={`Search menu by ${searchCriteria}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg">
              <thead className="bg-gray-100">
                <tr className="text-left border-b">
                  <th className="p-3 font-semibold text-gray-600">Name</th>
                  <th className="p-3 font-semibold text-gray-600">Price</th>
                  <th className="p-3 font-semibold text-gray-600">Category</th>
                  <th className="p-3 font-semibold text-gray-600">
                    Description
                  </th>
                  <th className="p-3 font-semibold text-gray-600 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMenu.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-gray-500">
                      No menu items found.
                    </td>
                  </tr>
                ) : (
                  filteredMenu.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">Rp {item.price.toLocaleString()}</td>
                      <td className="p-3">{item.category}</td>
                      <td className="p-3">{item.description}</td>
                      <td className="p-3 text-center">
                        <button
                          title="Edit Menu"
                          className="text-blue-500 hover:text-blue-700 mr-2"
                          onClick={() => handleEditMenu(item.id)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          title="Delete Menu"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteMenu(item.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
