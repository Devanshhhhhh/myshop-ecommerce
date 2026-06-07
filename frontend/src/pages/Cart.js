import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function Cart() {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    try {
      await API.post("/cart/remove", { productId });
      toast.success("Item removed ❌");
      fetchCart();
    } catch (err) {
      toast.error("Error removing item");
    }
  };

  const updateQty = async (productId, quantity) => {
    try {
      await API.post("/cart/update", { productId, quantity });
      fetchCart();
    } catch (err) {
      toast.error("Error updating quantity");
    }
  };

  const placeOrder = async () => {
    try {
      const { data } = await API.post("/payment/create-order", {
        amount: cart.totalPrice
      });

      const options = {
        key: "rzp_test_SgA9BWhLPhb4MU",
        amount: data.amount,
        currency: data.currency,
        name: "MyShop",
        description: "Order Payment",
        order_id: data.id,

        handler: async function () {
          toast.success("Payment Successful 🎉");
          await API.post("/orders/place");
          fetchCart();
        },

        prefill: {
          name: "User",
          email: "test@example.com"
        },

        theme: {
          color: "#000000"
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      console.log(err);
      toast.error("Payment failed");
    }
  };

  if (!cart) {
    return (
      <div className="text-center mt-20 text-gray-500">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">

      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">

        {/* LEFT: CART ITEMS */}
        <div className="col-span-2 space-y-5">

          {cart.items.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow-sm text-center">
              <h2 className="text-xl font-medium text-gray-700 mb-2">
                Your cart is empty 🛒
              </h2>
              <p className="text-gray-500">
                Start adding products to see them here.
              </p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-5 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition"
              >

                {/* IMAGE */}
                <div className="w-28 h-28 bg-gray-100 rounded-xl flex items-center justify-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full object-contain"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex-1">

                  <h2 className="text-lg font-medium text-gray-800">
                    {item.product.name}
                  </h2>

                  <p className="text-gray-900 font-semibold mt-1">
                    ₹{item.product.price}
                  </p>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 mt-4">

                    <button
                      className="w-8 h-8 border rounded-full hover:bg-gray-100"
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQty(item.product._id, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span className="font-medium">
                      {item.quantity}
                    </span>

                    <button
                      className="w-8 h-8 border rounded-full hover:bg-gray-100"
                      onClick={() =>
                        updateQty(item.product._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>

                  </div>

                  {/* REMOVE */}
                  <button
                    className="text-red-500 text-sm mt-3 hover:underline"
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </button>

                </div>
              </div>
            ))
          )}

        </div>

        {/* RIGHT: SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24">

          <h2 className="text-xl font-semibold mb-5">
            Order Summary
          </h2>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Items</span>
            <span>{cart.items.length}</span>
          </div>

          <div className="flex justify-between text-gray-600 mb-4">
            <span>Total</span>
            <span>₹{cart.totalPrice}</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between font-semibold text-lg mb-5">
            <span>Final</span>
            <span>₹{cart.totalPrice}</span>
          </div>

          <button
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition active:scale-95"
            onClick={placeOrder}
            disabled={cart.items.length === 0}
          >
            Place Order
          </button>

        </div>

      </div>
    </div>
  );
}