import React from "react";
import { Link } from "react-router-dom";
import GoogleLoginButton from "./GoogleLogin";
import GoogleAuthWrapper from "../../components/GoogleWrapper";

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 border p-8 rounded-xl shadow-md">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-black text-center">
          Login to Your Account
        </h2>

        {/* Login Form */}
        <form className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-black font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-black font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 transition"
          >
            Login
          </button>
        </form>

        {/* Links for Register and Forgotten Password */}
        <div className="flex justify-between">
          {/* Register Link */}
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-yellow-600 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>

          {/* Forgotten Password Link */}
          <p className="text-sm text-center text-gray-600">
            Forgotten your password?{" "}
            <Link
              to="/forgotten-password"
              className="text-green-600 font-semibold hover:underline"
            >
              Here
            </Link>
          </p>
        </div>

        {/* Google Login Option */}
        <p className="text-center my-2 text-sm text-gray-700">or login with</p>
        <GoogleAuthWrapper>
          <GoogleLoginButton />
        </GoogleAuthWrapper>
      </div>
    </div>
  );
};

export default Login;
