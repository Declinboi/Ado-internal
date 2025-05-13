import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleLoginButton from "./GoogleLogin";
import GoogleAuthWrapper from "../../components/GoogleWrapper";
import { useLoginMutation } from "../../redux/api/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/features/store";
import { setCredentials } from "../../redux/features/authSlice";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import { Loader, Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials(res));
      navigate(redirect);
      toast.success("User successfully login");
    } catch (err: any) {
      toast.error(err?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 border p-8 rounded-xl shadow-md">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-black text-center">
          Login to Your Account
        </h2>

        {/* Login Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          <Input
            label="Email address"
            icon={Mail}
            placeholder="enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            icon={Lock}
            placeholder="enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 transition"
          >
            {isLoading ? (
              <Loader className="animate-spin h-8 w-10 text-center text-green-800" />
            ) : (
              "Login"
            )}
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
