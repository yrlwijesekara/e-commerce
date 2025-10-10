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
    <div className="w-full h-full flex flex-col items-center p-8 overflow-y-auto ">
      {loading ? (
        <Loader/>
      ) : (
        <>
        
          <table className="w-full border-collapse border border-slate-400 ">
            <thead>
              <tr>
                <th className="border border-slate-300 px-4 py-2">
                  Product ID
                </th>
                <th className="border border-slate-300 px-4 py-2">Name</th>
                <th className="border border-slate-300 px-4 py-2">
                  Labelled Price
                </th>
                <th className="border border-slate-300 px-4 py-2">Price</th>
                
                <th className="border border-slate-300 px-4 py-2">Stock</th>
                <th className="border border-slate-300 px-4 py-2">Category</th>
                <th className="border border-slate-300 px-4 py-2">Image</th>
                <th className="border border-slate-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="border border-slate-300 px-4 py-2">
                    {product.productId}
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    {product.name}
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    Rs.{product.labelledprice}
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    Rs.{product.price}
                  </td>
                  
                  <td className="border border-slate-300 px-4 py-2">
                    {product.stock}
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    {product.category}
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    {product.image && product.image.length > 0 ? (
                      <img
                        src={product.image[0]}
                        alt={product.name}
                        className="w-20 h-20 object-cover"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border border-slate-300 px-4 py-2  ">
                    <div className="flex items-center justify-center gap-2">
                    <Link
                      
                      className="text-blue-300 hover:text-blue-500"
                    >
                        <FaEdit className="inline-block mr-1" onClick={
              (e) => {
                e.preventDefault();
                navigate("/admin/update-product", { state: { product } });
              }
                        } />
                    </Link>
                
                 <Link
                   
                    className="text-red-300 hover:text-red-500"
                 >
                    <FaTrashAlt className="inline-block mr-1" onClick={
            (e) => {
              e.preventDefault();
              const token = localStorage.getItem("token");
              if (!token) {
                toast.error("No token found. Please log in.");
                navigate("/login");
                return;
              }
              axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/products/${product.productId}`, { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                  toast.success("Product deleted successfully");
                  setProducts((prevProducts) => prevProducts.filter((p) => p.productId !== product.productId));
                })
                .catch((error) => {
                  toast.error("Failed to delete product");
                });
            }
                    } />
                 </Link>
                 </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </>
      )}
      <Link
        to="/admin/Add-Product"
        className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 mb-5 fixed bottom-5 right-5 shadow-2xl"
      >
        <FaPlus />
      </Link>
    </div>
  );
}
