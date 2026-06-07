import { useState } from "react";
import API from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return setError("Please enter your email");

    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", { email });

      setMessage(res.data.msg);
      setError("");

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Something went wrong"
      );
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border">

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Forgot Password
        </h1>

        <p className="text-sm text-gray-500 text-center mt-2">
          Enter your email and we’ll send you a reset link
        </p>

        {/* INPUT */}
        <div className="mt-6">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-5 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* SUCCESS */}
        {message && (
          <p className="text-green-600 text-sm text-center mt-4">
            {message}
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-sm text-center mt-4">
            {error}
          </p>
        )}

      </div>

    </div>
  );
}