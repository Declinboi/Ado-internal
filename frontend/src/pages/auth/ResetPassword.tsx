import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useResetPasswordMutation } from "../slices/userApiSlice"; // adjust as needed
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../../redux/api/userApiSlice";

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword({
        token: token!,
        newPassword: password,
      }).unwrap();

      toast.success(res.message || "Password reset successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to reset password. Try again later."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded bg-white">
      <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full border rounded px-3 py-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full border rounded px-3 py-2 mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
