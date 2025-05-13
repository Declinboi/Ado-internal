import React, { useState } from "react";
// import { useForgottenPasswordMutation } from "../slices/userApiSlice"; // adjust path as needed
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForgottenPasswordMutation } from "../../redux/api/userApiSlice";
import { Loader } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgottenPassword, { isLoading }] = useForgottenPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const res = await forgottenPassword({ email }).unwrap();
      toast.success(res.message || "Reset link sent to your email");
      navigate("/check-email"); //route to tell user to check inbox
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Something went wrong. Try again later."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow rounded bg-white">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="w-full border rounded px-3 py-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your registered email"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? <Loader className="animate-spin h-8 w-10 text-green-800" /> : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
