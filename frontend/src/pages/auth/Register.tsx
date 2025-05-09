import { Link, useLocation, useNavigate } from "react-router-dom";
import GoogleAuthWrapper from "../../components/GoogleWrapper";
import GoogleLoginButton from "./GoogleLogin";
import { useEffect, useState } from "react";
import { useCreateUserMutation } from "../../redux/api/userApiSlice";
import Input from "../../components/Input";
import { Lock, Mail, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/features/store";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const [createUser, { isLoading, error }] = useCreateUserMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/verify-email";
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const userData = { name, email, password };

    try {
      const res = await createUser(userData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("User successfully registered");
      navigate(redirect);
    } catch (err: any) {
      console.error("Registration Error:", err);
      toast.error(
        err?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 border p-8 rounded-xl shadow-md">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-black text-center">
          Create Your Account
        </h2>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Field */}

          <Input
            label="Full Name"
            icon={User}
            placeholder="your name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* Email Address Field */}

          <Input
            label="Email address"
            icon={Mail}
            placeholder="enter your email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Field */}

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            icon={Lock}
            placeholder="enter password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 transition"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Link to Login Page */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 text-sm hover:underline">
            Login
          </Link>
        </p>

        {/* Divider */}
        <p className="text-center my-2 text-sm text-gray-700">or login with</p>

        {/* Google Login Button */}
        <GoogleAuthWrapper>
          <GoogleLoginButton />
        </GoogleAuthWrapper>
      </div>
    </div>
  );
};

export default Register;
