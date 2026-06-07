import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    API.get(`/reviews/${id}`).then(res => setReviews(res.data));
  }, [id]);

  const submitReview = async () => {
  try {
    await API.post("/reviews", {
      productId: id,
      rating,
      comment
    });

    toast.success("Review submitted ⭐");

    setComment("");
    setRating(5);

    const res = await API.get(`/reviews/${id}`);
    setReviews(res.data);

  } catch (err) {
    alert(err.response?.data?.msg || "Error adding review");
  }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      await API.post("/cart/add", {
        productId: product._id,
        quantity: qty
      });
      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Error adding to cart");
    }
  };

  if (!product) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">

      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12">

        {/* LEFT: IMAGE */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[400px] object-contain hover:scale-105 transition"
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div className="bg-white rounded-2xl shadow-sm p-6">

          {/* TITLE */}
          <h1 className="text-2xl font-semibold text-gray-900">
            {product.name}
          </h1>

          {/* RATING */}
          <div className="text-yellow-500 text-sm mt-1">
            {"⭐".repeat(Math.round(product.rating || 0))}
            <span className="text-gray-400 ml-1">
            ({product.numReviews || 0})
            </span>
          </div>

          {/* PRICE */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.price}
            </span>

            <span className="line-through text-gray-400">
              ₹{Math.floor(product.price * 1.2)}
            </span>

            <span className="text-green-600 text-sm font-medium">
              20% off
            </span>
          </div>

          {/* STOCK */}
          <p className="text-green-600 mt-2 font-medium">
            In Stock
          </p>

          {/* DELIVERY INFO */}
          <p className="text-sm text-gray-500 mt-2">
            🚚 Free delivery in 2-4 days
          </p>

          {/* QUANTITY */}
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">
              Quantity
            </p>

            <div className="flex items-center gap-3">

              <button
                className="w-8 h-8 border rounded-full hover:bg-gray-100"
                onClick={() => qty > 1 && setQty(qty - 1)}
              >
                -
              </button>

              <span className="font-medium">{qty}</span>

              <button
                className="w-8 h-8 border rounded-full hover:bg-gray-100"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>

            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex gap-4">

            <button
              className="flex-1 bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition active:scale-95"
              onClick={addToCart}
            >
              Add to Cart
            </button>

            <button
              className="flex-1 border py-3 rounded-xl hover:bg-gray-100 transition active:scale-95"
              onClick={addToCart}
            >
              Buy Now
            </button>

          </div>

          {/* TRUST BADGES */}
          <div className="mt-6 text-sm text-gray-500 space-y-1">
            <p>✔️ 7 Days Replacement</p>
            <p>✔️ Secure Payment</p>
            <p>✔️ Cash on Delivery Available</p>
          </div>

        </div>
      </div>

      {/* DESCRIPTION SECTION */}
      <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-sm">

        <h2 className="text-xl font-semibold mb-3">
          Product Details
        </h2>

        <p className="text-gray-600 leading-relaxed">
          This is a high-quality product designed for everyday use.
          Built with premium materials and modern design, it offers
          excellent performance and durability.
        </p>

      </div>

      <div className="mt-10 border-t pt-6">

        <h2 className="text-xl font-semibold mb-3">
        Write a Review
        </h2>

        <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 rounded mb-3"
        >
            {[1,2,3,4,5].map(n => (
            <option key={n} value={n}>{n} ⭐</option>
            ))}
        </select>

        <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border w-full p-2 rounded mb-3"
        />

        <button
            onClick={submitReview}
            className="bg-black text-white px-4 py-2 rounded"
        >
        Submit Review
        </button>

      </div>

      <div className="mt-10">

        <h2 className="text-xl font-semibold mb-4">
        Customer Reviews
        </h2>

        {reviews.length === 0 ? (
        <p>No reviews yet</p>
        ) : (
        reviews.map((r) => (
        <div key={r._id} className="border p-3 mb-3 rounded">

        <p className="font-semibold">{r.user.name}</p>

        <p className="text-yellow-500">
          {"⭐".repeat(r.rating)}
        </p>

        <p className="text-gray-600">{r.comment}</p>

        </div>
        ))
        )}

      </div>

    </div>
  );
}