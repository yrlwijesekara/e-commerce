import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { IoSettingsSharp } from "react-icons/io5";
import { PiUsersFill } from "react-icons/pi";
import { FaBriefcase } from "react-icons/fa";
import { IoBagHandleSharp } from "react-icons/io5";


export default function AdminPage() {
    return (
        <div className="w-full h-screen bg-amber-50 flex">
            <div className="w-[400px] h-full flex flex-col  pt-10 border-r">
                <span className="text-2xl text-amber-300 flex justify-center items-center">Admin Panel</span>
                <Link to="/admin/products" className="p-6 hover:text-red-500 flex  text-2xl text-amber-300 gap-10 border-2"><FaBriefcase className='pt-1 text-red-500 '/>Products</Link>
                <Link to="/admin/users" className="p-6 hover:text-red-500 flex  text-2xl text-amber-300 gap-10 border-2"> <PiUsersFill className='pt-1 text-red-500 '/>User Management</Link>
                <Link to="/admin/settings" className="p-6 hover:text-red-500 flex  text-2xl text-amber-300 gap-10 border-2"> <IoSettingsSharp className='pt-1 text-red-500 '/>Settings</Link>
                <Link to="/admin/orders" className="p-6 hover:text-red-500 flex  text-2xl text-amber-300 gap-10 border-2"> <IoBagHandleSharp className='pt-1 text-red-500 '/>Orders</Link>
                </div>
            <div className="w-[calc(100%-400px)] h-full flex flex-col justify-start items-center pt-10">
                <Routes>
                    <Route path="/" element={<h1>Admin Panel</h1>} />
                    <Route path="products" element={<h2>Product Management</h2>} />
                    <Route path="users" element={<h4>User Management</h4>} />
                    <Route path="settings" element={<h1>Settings</h1>} />
                    <Route path="orders" element={<h3>Order Management</h3>} />
                </Routes>
            </div>
        </div>
        
    );
}
