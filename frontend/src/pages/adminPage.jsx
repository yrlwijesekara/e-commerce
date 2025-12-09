import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { PiUsersFill } from "react-icons/pi";
import { FaBriefcase } from "react-icons/fa";
import { IoBagHandleSharp } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import ProductsAdmin from "./Admin/productsAdmin";
import AddProduct from "./Admin/addproduct";
import Updateproduct from "./Admin/updateproduct";
import OrderPage from "./Admin/orderPage";
import toast from "react-hot-toast";

export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };
  return (
    <div className="w-full h-screen flex">
      <div className="w-[400px] h-full flex flex-col  pt-10 border-r bg-zinc-500">
        <span className=" text-blue-800 flex justify-center items-center mb-6 text-3xl font-bold">
          Admin Panel
        </span>
        <Link
          to="/admin/products"
          className="p-6 hover:text-red-500 flex  text-2xl text-amber-300 gap-10 border-2"
        >
          <FaBriefcase className="pt-1 text-red-500 " />
          Products
        </Link>
        <Link
          to="/admin/users"
          className="p-6 hover:text-red-500 flex  text-2xl text-amber-300 gap-10 border-2"

        >
          
          <PiUsersFill className="pt-1 text-red-500 " />
          User Management
        </Link>
        <Link
          to="/admin/settings"
          className="p-6 hover:text-red-500 flex  text-2xl text-amber-300 gap-10 border-2"
        >
          
          <IoSettingsSharp className="pt-1 text-red-500 " />
          Settings
        </Link>
        <Link
          to="/admin/orders"
          className="p-6 hover:text-red-500 flex  text-2xl text-amber-300 gap-10 border-2"
        >
          <IoBagHandleSharp className="pt-1 text-red-500 " />
          Orders
        </Link>
        
        {/* Logout Button */}
        <div className="mt-auto mb-6">
          <button
            onClick={handleLogout}
            className="mx-6 p-4 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-lg font-semibold gap-3 rounded-lg transition-colors shadow-lg"
          >
            <IoLogOut className="text-2xl" />
            Logout
          </button>
        </div>
      </div>
      <div className="w-[calc(100%-400px)] h-full flex flex-col justify-start items-center overflow-y-auto">
        <Routes>
          <Route path="/" element={<h1>Admin Panel</h1>} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="users" element={<h4>User Management</h4>} />

          <Route path="settings" element={<h1>Settings</h1>} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="update-product" element={<Updateproduct />} />

        </Routes>
      </div>
    </div>
  );
}
