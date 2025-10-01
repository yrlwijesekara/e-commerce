import { Link, useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddProduct() {
    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [alternativeNames, setAlternativeNames] = useState("");
    const [labelledPrice, setLabelledPrice] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState("");
    const [stock, setStock] = useState(0);
    const [isAvailable, setIsAvailable] = useState(true);
    const [category, setCategory] = useState("cosmetics");

     const navigate =useNavigate();

    async function addproduct(e) {
        e.preventDefault();
        
        const alternativeNamesinArray = alternativeNames.split(",").map(s => s.trim()).filter(Boolean);
        const imageArray = images.split(",").map(s => s.trim()).filter(Boolean);
        
        const productData = {   
            productId,
            name: productName,
            altname: alternativeNamesinArray,
            labelledprice: Number(labelledPrice),
            price: Number(price),
            description,
            image: imageArray,
            stock: Number(stock),
            isAvailable: isAvailable,
            category: category
        };
        
        const token = localStorage.getItem("token");
        if (token === null) {
            alert("Please login first");
            window.location.href = "/login";
            return;
        }
        
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products/", productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Product added successfully:", response.data);
            toast.success("Product added successfully!");
            navigate("/admin/products");
        } catch (error) {
            console.error("There was an error!", error);
            toast.error("Error adding product: " + (error.response?.data?.message || error.message));
        }
    }
    
    return (
        <div className="w-full h-full bg-yellow-100 flex justify-center items-center">
            <form className="w-[600px] h-auto p-6 bg-white  shadow-md rounded-2xl relative" onSubmit={addproduct}>
                <div className="gap-2 flex flex-col ">   
                    <label className="font-semibold ">Product ID</label>
                    <input value ={productId} onChange={(e) => {
                        setProductId(e.target.value);
                    }} type="text" className="w-full border-1 p-2 rounded-lg " placeholder="Enter Product ID" required />
                </div>
                <div className="gap-2 flex flex-col ">   
                    <label className="font-semibold ">Product Name</label>
                    <input value={productName} onChange={(e) => {
                        setProductName(e.target.value);
                    }} type="text" className="w-full border-1 p-2 rounded-lg " placeholder="Enter Product Name" required />
                </div>
                <div className="gap-2 flex flex-col ">   
                    <label className="font-semibold ">Alternative Names</label>
                    <input value={alternativeNames} onChange={(e) => {
                        setAlternativeNames(e.target.value);
                    }} type="text" className="w-full border-1 p-2 rounded-lg " placeholder="Enter Alternative Names (comma separated)" />
                </div>
                <div className="gap-2 flex flex-col ">
                    <label className="font-semibold ">Labelled Price</label>
                    <input value={labelledPrice} onChange={(e) => {
                        setLabelledPrice(e.target.value);
                    }} type="number" className="w-full border-1 p-2 rounded-lg " placeholder="Enter Labelled Price" required />
                </div>
                <div className="gap-2 flex flex-col ">
                    <label className="font-semibold ">Price</label>
                    <input value={price} onChange={(e) => {
                        setPrice(e.target.value);
                    }} type="number" className="w-full border-1 p-2 rounded-lg " placeholder="Enter Price" required />
                </div>
                <div className="gap-2 flex flex-col ">   
                    <label className="font-semibold ">Images</label>
                    <input value={images} onChange={(e) => {
                        setImages(e.target.value);
                    }} type="text" className="w-full border-1 p-2 rounded-lg " placeholder="Enter Images (comma separated)" />
                </div>
                <div className="gap-2 flex flex-col">   
                    <label className="font-semibold ">Description</label>
                    <input value={description} onChange={(e) => {
                        setDescription(e.target.value);
                    }} type="text" className="w-full border-1 p-2 rounded-lg " placeholder="Enter Description" required />
                </div>
                <div className="gap-2 flex flex-col ">
                    <label className="font-semibold ">STOCK</label>
                    <input value={stock} onChange={(e) => {
                        setStock(e.target.value);
                    }} type="number" className="w-full border-1 p-2 rounded-lg " placeholder="Enter Stock" required />
                </div>
                <div className="gap-2 flex flex-col ">
                    <label className="font-semibold ">isAvailable</label>
                    <select value={isAvailable} onChange={(e) => {
                        setIsAvailable(e.target.value === "true");
                    }} className="w-full border-1 p-2 rounded-lg ">
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                    </select>
                </div>
                  <div className="gap-2 flex flex-col ">
                    <label className="font-semibold ">category</label>
                    <select value={category} onChange={(e) => {
                        setCategory(e.target.value);
                    }} className="w-full border-1 p-2 rounded-lg ">
                        <option value="cosmetics">Cosmetics</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="home_appliances">Home Appliances</option>
                    </select>
                </div>
                <div className="gap-2 flex flex-col p-2 mt-4">   
                    <Link onClick={addproduct} className="w-full bg-blue-500 text-white p-2 rounded-lg text-center hover:bg-blue-600">
                        Add Product
                    </Link>
                </div>
                  
                  <div className="flex flex-col absolute top-3 right-5">   
                    <Link to="/admin/products" className=" bg-red-500 text-white p-2 rounded-full text-center hover:bg-red-600">
                        <MdCancel />
                    </Link>
                </div>
                
            </form>
        </div>
    );
}


