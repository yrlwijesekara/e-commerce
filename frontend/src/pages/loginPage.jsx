import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

   async function login() {
        try {
            console.log(email, password);
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/login", { email, password });
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            toast.success("Login successful!");

            if (response.data.role === 'admin') {
                navigate("/admin/");
            }else {
                navigate("/");
            }
        } catch (error) {
            console.error("There was an error!", error);
            toast.error("Login failed!");
        }
    }
  return (
    <div className="w-full h-screen bg-[url('./loginbg.jpg')] bg-cover bg-center flex justify-center items-center">
      <div className="w-[500px] h-[500px] backdrop-blur-sm shadow-2xl rounded-lg flex flex-col  items-center gap-10 text-white pt-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-sm">Please enter your credentials</p>
        <input
            onChange={(e) => {
              setEmail(e.target.value), console.log("Email changed");
            }}
          type="email"
          placeholder="Email"
          className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
        />
        <input
          onChange={(e) => {
            setPassword(e.target.value), console.log("Password changed");
          }}
          type="password"
          placeholder="Password"
          className="w-[80%] p-3 rounded-lg text-white outline-none hover:border-2"
        />
        <button onClick={login} className="w-[80%] p-3 bg-red-500 rounded-lg font-bold hover:bg-red-600">
          Login
        </button>
        <p className="text-sm">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-red-500 cursor-pointer">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}



/*
{
  "firstname": "Test",
  "lastname": "User",
  "email": "testuser@example.com",
  "password": "TestPassword123"
}

{
  "firstname": "Admin",
  "lastname": "User",
  "email": "admin5@example.com",
  "password": "AdminPassword123",
  "role": "admin"
}
  */