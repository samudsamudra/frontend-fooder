"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  description: string;
  price: number;
  category: string;
  picture?: string;
}

const EditMenuPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined; // Ambil ID dari URL
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  // Fetch existing data
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/menu/get-menu?id=${id}`
        );
        const data = await response.json();
        if (response.ok) {
          setValue("name", data.name);
          setValue("description", data.description);
          setValue("price", data.price);
          setValue("category", data.category);
        } else {
          setMessage("Failed to fetch menu data");
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    if (id) fetchMenu();
  }, [id, setValue]);

  // Handle form submit
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/menu/patch-menu/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            price: Number(data.price), // Ensure price is sent as a number
          }),
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to update menu");

      setMessage("Menu updated successfully!");
      setTimeout(() => router.push("/menu"), 2000);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Edit Menu</h1>

        {message && (
          <div
            className={`p-3 rounded-md text-white text-center ${
              message.includes("success") ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-600">Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-600">Price</label>
            <input
              type="number"
              {...register("price", {
                required: "Price is required",
                min: 100,
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-600">Category</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              <option value="FOOD">Food</option>
              <option value="DRINK">Drink</option>
              <option value="DESSERT">Dessert</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Updating..." : "Update Menu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMenuPage;
