import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await API.get("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/update-order/${id}`, { status });
      toast.success(`Marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  // Status color helper
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

      {/* TITLE */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Manage Orders 📦
      </h1>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">
          No orders found
        </p>
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

                {/* STATUS BADGE */}
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(order.status)}`}
                >
                  {order.status}
                </span>

              </div>

              {/* PRODUCTS LIST */}
              <div className="border-t pt-4 space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-12 h-12 object-contain bg-gray-100 rounded"
                      />

                      <span className="text-gray-700">
                        {item.product?.name}
                      </span>
                    </div>

                    <span className="text-gray-500">
                      Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5 flex gap-3">

                <button
                  className="px-4 py-1.5 border rounded-lg hover:bg-gray-100 transition"
                  onClick={() => updateStatus(order._id, "Shipped")}
                >
                  Mark Shipped
                </button>

                <button
                  className="px-4 py-1.5 bg-black text-white rounded-lg hover:bg-gray-900 transition"
                  onClick={() => updateStatus(order._id, "Delivered")}
                >
                  Mark Delivered
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}