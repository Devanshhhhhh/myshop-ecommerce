import { useEffect, useState } from "react";
import API from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, []);

  // Status styling
  const getStatusStyle = (status) => {
    if (status === "Pending")
      return "bg-yellow-100 text-yellow-700";
    if (status === "Shipped")
      return "bg-blue-100 text-blue-700";
    if (status === "Delivered")
      return "bg-green-100 text-green-700";

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">

      <div className="max-w-5xl mx-auto">

        {/* TITLE */}
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          My Orders 📦
        </h1>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center">
            <h2 className="text-lg font-medium text-gray-700">
              No orders yet
            </h2>
            <p className="text-gray-500 mt-2">
              Start shopping to see your orders here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
              >

                {/* TOP SECTION */}
                <div className="flex justify-between items-center mb-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>
                    <p className="font-medium text-gray-800">
                      {order._id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-semibold text-gray-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* ITEMS */}
                <div className="border-t pt-4 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">

                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 object-contain bg-gray-100 rounded"
                        />

                        <span className="text-gray-700">
                          {item.product.name}
                        </span>

                      </div>

                      <span className="text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}