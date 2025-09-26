import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { IoSettingsSharp } from "react-icons/io5";


export default function AdminPage() {
    return (
        <div className="w-full h-screen bg-amber-50 flex">
            <div className="w-[400px] h-full flex flex-col justify-start items-center pt-10 border-r">
                <Link to="/" className="p-4 border-b hover:bg-amber-100">Dashboard</Link>
                <Link to="/admin/users" className="p-4 border-b hover:bg-amber-100">User Management</Link>
                <Link to="/admin/settings" className="p-4 border-b hover:bg-amber-100 flex justify-center align-center text-2xl text-amber-300 gap-10"> <IoSettingsSharp className='pt-1 text-red-500 '/>Settings</Link>
                </div>
            <div className="w-[calc(100%-400px)] h-full flex flex-col justify-start items-center pt-10">
                <Routes>
                    <Route path="/" element={<h1>Admin Dashboard</h1>} />
                    <Route path="users" element={<h1>User Management</h1>} />
                    <Route path="settings" element={<h1>Settings</h1>} />
                </Routes>
            </div>
        </div>
        
    );
}
