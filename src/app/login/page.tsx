"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
        { email, password }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard"); // Redirect ke dashboard setelah login
      } else {
        setError("Login berhasil, tetapi token tidak ditemukan.");
      }
    } catch (err: any) {
      setError("Email atau password salah.");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Sign In
        </h2>
        <p className="text-gray-500 text-center mb-4">
          Unlock your world.
        </p>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-center bg-red-100 p-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              title="Email"
              placeholder="Enter your email"
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
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
              title="Password"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
