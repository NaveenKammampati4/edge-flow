import { useState } from "react";
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Login({ onSubmit, error, success }) {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10">
        <h2 className="text-2xl font-semibold text-center mb-8">Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="relative">
            <UserIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="relative">
            <LockClosedIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5"/> : <EyeIcon className="w-5 h-5"/>}
            </button>
          </div>

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don't have an account?
          <Link to="/register" className="text-blue-500 ml-1 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}