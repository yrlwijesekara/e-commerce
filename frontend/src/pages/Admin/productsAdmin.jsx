import { FaPlus } from "react-icons/fa6";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AddProduct from "./addproduct";
import { use, useEffect, useState} from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../../components/loader";



export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return; // Skip if already initialized

    setLoading(true);
    setInitialized(true); // Mark as initialized to prevent multiple calls

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products/")
      .then((response) => {
        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        }
      })
      .catch((error) => {
        console.log("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialized]);

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-full p-8 bg-gray-50">
      <div className="w-full mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory</p>
          </div>
          <Link
            to="/admin/Add-Product"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
          >
            <FaPlus />
            Add Product
          </Link>
        </div>

        {loading ? (
          <Loader/>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No products found</p>
            <Link
              to="/admin/Add-Product"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Product ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {product.image && product.image.length > 0 ? (
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-600">{product.productId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{product.name}</span>
                          {product.labelledprice > product.price && (
                            <span className="text-xs text-gray-500 line-through">Rs. {product.labelledprice}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                          {product.category.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-green-600">Rs. {product.price}</span>
                          {product.labelledprice > product.price && (
                            <span className="text-xs text-red-500 font-medium">
                              {Math.round(((product.labelledprice - product.price) / product.labelledprice) * 100)}% OFF
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => navigate("/admin/update-product", { state: { product } })}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              const token = localStorage.getItem("token");
                              if (!token) {
                                toast.error("No token found. Please log in.");
                                navigate("/login");
                                return;
                              }
                              if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/products/${product.productId}`, { 
                                  headers: { Authorization: `Bearer ${token}` } 
                                })
                                .then((response) => {
                                  toast.success("Product deleted successfully");
                                  setProducts((prevProducts) => prevProducts.filter((p) => p.productId !== product.productId));
                                })
                                .catch((error) => {
                                  toast.error("Failed to delete product");
                                });
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <FaTrashAlt size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
