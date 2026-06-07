import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate
  const validate = () => {
    if (!password) {
      toast.error("Password is required");
      return false;
    }

    if (password.length < 6) {
      toast.error("Minimum 6 characters required");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleReset = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await API.post(`/auth/reset-password/${token}`, { password });

      toast.success("Password updated successfully 🎉");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      toast.error(
        err.response?.data?.msg || "Invalid or expired link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border">

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Reset Password
        </h1>

        <p className="text-sm text-gray-500 text-center mt-2">
          Enter your new password below
        </p>

        {/* PASSWORD */}
        <div className="mt-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="button"
            className="absolute right-3 top-3 text-sm text-gray-500 hover:text-black"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mt-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {/* BACK TO LOGIN */}
        <p className="text-center text-sm mt-4 text-gray-600">
          Remember your password?{" "}
          <span
            className="text-black font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}