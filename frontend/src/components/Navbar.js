import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ search, setSearch, maxPrice, setMaxPrice, category, setCategory }) {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm px-8 py-3 flex items-center justify-between">

      {/* LOGO */}
      <h1
        className="text-xl font-semibold text-gray-900 cursor-pointer tracking-tight hover:opacity-80 transition"
        onClick={() => navigate("/")}
      >
        MyShop
      </h1>

      {/* SEARCH BAR */}
      <div className="relative w-[40%]">

        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-black">

          {/* 🔍 Icon */}
          <span className="text-gray-500 mr-2">🔍</span>

          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* ⚙️ Filter */}
          <button
            className="ml-2 text-gray-600 hover:text-black transition"
            onClick={() => setShowFilter(!showFilter)}
          >
            ⚙️
          </button>
        </div>

        {/* FILTER DROPDOWN */}
        {showFilter && (
          <div className="absolute right-0 mt-3 bg-white border shadow-xl p-4 rounded-xl w-56 z-50">

            <select
              value={category}
              className="border p-2 w-full mt-2 rounded"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home</option>
            </select>

            <label className="text-sm text-gray-600">Max Price</label>

            <input
              type="number"
              value={maxPrice}
              placeholder="Enter price"
              className="border mt-2 p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-5 text-sm text-gray-700">

        {user ? (
          <>
            {/* USER */}
            <span className="text-gray-500">
              Hello, <span className="font-medium text-gray-800">{user.name}</span>
            </span>

            {/* ADMIN */}
            {user.isAdmin && (
              <>
                <button
                  onClick={() => navigate("/admin")}
                  className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                >
                  Admin
                </button>

                <button
                  onClick={() => navigate("/admin/orders")}
                  className="hover:text-black transition"
                >
                  Orders ⚙️
                </button>
              </>
            )}

            {/* USER NAV */}
            <button
              onClick={() => navigate("/cart")}
              className="hover:text-black transition"
            >
              🛒 Cart
            </button>

            <button
              onClick={() => navigate("/orders")}
              className="hover:text-black transition"
            >
              📦 Orders
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="hover:text-black transition"
            >
              ❤️ Wishlist
            </button>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1 bg-black text-white rounded-lg hover:bg-gray-900 transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-4 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}