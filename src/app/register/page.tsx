"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-[900px] bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Kiri - Background dengan Gradient */}
        <div className="w-1/2 bg-gradient-to-r from-purple-600 to-orange-400 flex flex-col justify-center items-center text-white p-10">
          <h1 className="text-3xl font-bold">Join Us!</h1>
        </div>

        {/* Kanan - Form Register */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Register
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Create your account and start your journey.
          </p>

          {error && (
            <p className="text-red-500 text-center bg-red-100 p-2 rounded-lg mb-4">
              {error}
            </p>
          )}
          {success && (
            <p className="text-green-500 text-center bg-green-100 p-2 rounded-lg mb-4">
              {success}
            </p>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
                placeholder="**********"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium">
                Upload Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                title="Upload Profile Picture"
                onChange={(e) =>
                  setProfilePic(e.target.files ? e.target.files[0] : null)
                }
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
