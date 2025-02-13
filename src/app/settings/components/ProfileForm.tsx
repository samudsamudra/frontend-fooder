"use client";

import Cookies from "js-cookie";
import { useState } from "react";

const ProfileForm = ({ user }: { user: any }) => {
  const [email, setEmail] = useState(user.email);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState(user.profilePic ? `http://localhost:5000${user.profilePic}` : "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfilePic(e.target.files[0]);

      // Preview gambar sebelum di-upload
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const token = Cookies.get("token");

      const res = await fetch("http://localhost:5000/api/user/update-user", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Jangan pakai Content-Type, FormData akan otomatis diatur
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      setMessage("Profile updated successfully!");
      setPreview(`http://localhost:5000${data.data.profilePic}`);
    } catch (error) {
      setMessage("Error updating profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>

      {message && <p className="text-green-500 mb-2">{message}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Profile Picture
        </label>
        {preview && <img src={preview} alt="Profile Preview" className="mb-2 w-24 h-24 object-cover rounded-full" />}
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
          title="Upload your profile picture"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default ProfileForm;
