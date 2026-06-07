import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Home({ search, maxPrice, category }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products", {
        params: { search, maxPrice, category }
        });
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, [search, maxPrice, category]);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!localStorage.getItem("token")) return;
      const res = await API.get("/wishlist");
      setWishlist(res.data.products);
    };
    fetchWishlist();
  }, []);

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

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    if (wishlist.some((p) => p._id === productId)) {
      const res = await API.post("/wishlist/remove", { productId });
      setWishlist(res.data.products);
    } else {
      const res = await API.post("/wishlist/add", { productId });
      setWishlist(res.data.products);
    }
  };

  const filteredProducts = products;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-8 max-w-7xl mx-auto">

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-20">
            No products found 😕
          </p>
        ) : (

          /* PRODUCTS GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 p-4 cursor-pointer"
              >

                {/* Wishlist */}
                <div className="flex justify-end">
                  <span
                    className="cursor-pointer text-xl transition hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product._id);
                    }}
                  >
                    {wishlist.some((p) => p._id === product._id) ? "❤️" : "🤍"}
                  </span>
                </div>

                {/* Image */}
                <div className="w-full h-52 bg-gray-50 flex items-center justify-center rounded-xl overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* Name */}
                <h2 className="text-md font-medium text-gray-800 line-clamp-2">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="text-yellow-500 text-sm mt-1">
                  ⭐⭐⭐⭐☆ <span className="text-gray-400">(4.2)</span>
                </div>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{product.price}
                  </span>

                  <span className="line-through text-gray-400 text-sm">
                    ₹{Math.floor(product.price * 1.2)}
                  </span>

                  <span className="text-green-600 text-sm font-medium">
                    20% off
                  </span>
                </div>

                {/* Stock */}
                <p className="text-green-600 text-sm mt-1">
                  In Stock
                </p>

                {/* Button */}
                <button
                  className="mt-4 w-full bg-black hover:bg-gray-900 text-white py-2 rounded-lg transition active:scale-95"
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
    </div>
  );
}