"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
        // Set the token as a cookie
        Cookies.set("token", response.data.token, { expires: 1, path: "/" });
        router.push("/dashboard");
      } else {
        setError("Login berhasil, tetapi token tidak ditemukan.");
      }
    } catch (err: any) {
      setError("Email atau password salah.");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-[900px] bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Kiri - Background dengan Gradient */}
        <div className="w-1/2 bg-gradient-to-r from-purple-600 to-orange-400 flex flex-col justify-center items-center text-white p-10">
          <h1 className="text-3xl font-bold">Warung Waregggggg!</h1>
        </div>

        {/* Kanan - Form Login */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Login
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Halo Ayo login dulu sebelum maem.
          </p>

          {error && (
            <p className="text-red-500 text-center bg-red-100 p-2 rounded-lg mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                title="Email"
                placeholder="username@gmail.com"
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
                title="Password"
                placeholder="**********"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" title="Remember Me" />
                <span>Remember Me</span>
              </div>
              <a href="#" className="text-purple-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4">
            New User?{" "}
            <a href="/register" className="text-purple-600 font-semibold">
              Signup
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
