"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FiUpload, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface FormData {
  name: string;
  description: string;
  price: number;
  category: string;
  picture: FileList;
}

const AddMenuPage = () => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    if (data.picture.length > 0) {
      formData.append("picture", data.picture[0]);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menu/add-menu`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to add menu");

      setMessage("Menu added successfully!");
      reset();
      setTimeout(() => router.push("/menu"), 2000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">Add New Menu</h1>

        {message && (
          <div className={`p-3 rounded-md text-white text-center ${message.includes("success") ? "bg-green-500" : "bg-red-500"}`}>
            {message.includes("success") ? <FiCheckCircle className="inline-block mr-2" /> : <FiXCircle className="inline-block mr-2" />}
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
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-600">Description</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-600">Price</label>
            <input
              type="number"
              {...register("price", { required: "Price is required", min: 100 })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
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
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          {/* Picture Upload */}
          <div>
            <label className="block text-gray-600">Picture</label>
            <input type="file" accept="image/*" {...register("picture")} className="w-full p-2 border border-gray-300 rounded-md" />
            {watch("picture")?.length > 0 && (
              <div className="mt-2 text-gray-500 text-sm flex items-center">
                <FiUpload className="mr-2" />
                {watch("picture")[0]?.name}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Adding..." : "Add Menu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuPage;
