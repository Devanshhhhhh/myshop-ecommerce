import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";

export default function Admin() {
  const [products, setProducts] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const addProduct = async () => {
    if (!newName || !newPrice || !newCategory) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      await API.post("/admin/add-product", {
        name: newName,
        price: Number(newPrice),
        image: newImage,
        category: newCategory
      });

      toast.success("Product added 🚀");

      setNewName("");
      setNewPrice("");
      setNewImage("");
      setNewCategory("");

      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  // Start edit
  const startEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setImage(product.image);
    setCategory(product.category);
  };

  // Update product
  const updateProduct = async () => {
    try {
      await API.put(`/admin/update-product/${editingProduct._id}`, {
        name,
        price,
        image,
        category
      });

      toast.success("Product updated ✨");
      setEditingProduct(null);
      fetchProducts();
    } catch {
      toast.error("Error updating product");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await API.delete(`/admin/delete-product/${id}`);
      toast.success("Product deleted 🗑️");
      fetchProducts();
    } catch {
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8 max-w-6xl mx-auto">

      {/* TITLE */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">
        Admin Dashboard 🛠️
      </h1>

      {/* ADD PRODUCT */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 max-w-xl">
        <h2 className="text-lg font-medium mb-4">Add Product</h2>

        <input
          className="border p-3 mb-3 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
          placeholder="Product Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <input
          className="border p-3 mb-3 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />

        <select
          className="border p-3 mb-3 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}   // ✅ FIXED
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home</option>
        </select>

        <input
          className="border p-3 mb-3 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
          placeholder="Image URL"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
        />

        {newImage && (
          <img
            src={newImage}
            alt="preview"
            className="h-24 mb-3 object-contain rounded"
          />
        )}

        <button
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 active:scale-95"
          onClick={addProduct}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </div>

      {/* EDIT PRODUCT */}
      {editingProduct && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 max-w-xl">
          <h2 className="text-lg font-medium mb-4">Edit Product</h2>

          <input
            className="border p-3 mb-3 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-3 mb-3 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="border p-3 mb-3 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home</option>
          </select>

          <input
            className="border p-3 mb-3 w-full rounded-lg focus:ring-2 focus:ring-black outline-none"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          {image && (
            <img
              src={image}
              alt="preview"
              className="h-24 mb-3 object-contain rounded"
            />
          )}

          <button
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition active:scale-95"
            onClick={updateProduct}
          >
            Update Product
          </button>
        </div>
      )}

      {/* PRODUCT LIST */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">All Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No products available
          </p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center justify-between border rounded-xl p-4 hover:shadow-md hover:-translate-y-1 transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-contain bg-gray-100 rounded"
                  />

                  <div>
                    <h3 className="font-medium text-gray-800">
                      {product.name}
                    </h3>

                    <p className="text-gray-500">₹{product.price}</p>

                    <p className="text-xs text-gray-400 capitalize">
                      {product.category}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 border rounded-lg hover:bg-gray-100 transition active:scale-95"
                    onClick={() => startEdit(product)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition active:scale-95"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}