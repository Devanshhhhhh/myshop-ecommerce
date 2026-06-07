import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      if (!localStorage.getItem("token")) return;

      const res = await API.get("/wishlist");
      setWishlist(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const res = await API.post("/wishlist/remove", { productId });
      setWishlist(res.data.products);
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Error removing item");
    }
  };

  // Add to cart
  const addToCart = async (productId) => {
    try {
      await API.post("/cart/add", {
        productId,
        quantity: 1,
      });
      toast.success("Added to cart 🛒");
    } catch (err) {
      toast.error("Error adding to cart");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        My Wishlist ❤️
      </h1>

      {/* EMPTY STATE */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <p className="text-lg">Your wishlist is empty</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >

              {/* REMOVE BUTTON */}
              <div className="flex justify-end">
                <button
                  className="text-gray-400 hover:text-red-500 text-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product._id);
                  }}
                >
                  ✖
                </button>
              </div>

              {/* IMAGE */}
              <div className="h-40 bg-gray-100 flex items-center justify-center rounded mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain"
                />
              </div>

              {/* NAME */}
              <h2 className="text-sm font-medium text-gray-800 line-clamp-2">
                {product.name}
              </h2>

              {/* PRICE */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  ₹{product.price}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  ₹{Math.floor(product.price * 1.2)}
                </span>

                <span className="text-green-500 text-xs">
                  20% off
                </span>
              </div>

              {/* BUTTON */}
              <button
                className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id);
                }}
              >
                Add to Cart
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}