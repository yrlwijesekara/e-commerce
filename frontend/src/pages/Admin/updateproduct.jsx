import { Link, useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { use, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import MediaUpload from "../../utils/mediaupload";
import { useLocation } from "react-router-dom";

export default function updateproduct() {
     const location = useLocation();
    const [productId, setProductId] = useState(location.state?.product?.productId || "");
    const [productName, setProductName] = useState(location.state?.product?.name || "");
    const [alternativeNames, setAlternativeNames] = useState(location.state?.product?.altname.join(", ") || "");
    const [labelledPrice, setLabelledPrice] = useState(location.state?.product?.labelledprice || "");
    const [price, setPrice] = useState(location.state?.product?.price || "");
    const [description, setDescription] = useState(location.state?.product?.description || "");
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [stock, setStock] = useState(location.state?.product?.stock || "");
    const [isAvailable, setIsAvailable] = useState(location.state?.product?.isAvailable || true);
    const [category, setCategory] = useState(location.state?.product?.category || "cosmetics");

     const navigate = useNavigate();
    

    async function addproduct(e) {
        e.preventDefault();
        setUploading(true);

        try {
            // Validate description length
            if (!description || description.length < 20) {
                toast.error("Description must be at least 20 characters");
                setUploading(false);
                return;
            }

            let imageUrls = location.state?.product?.image || [];

            if (images && images.length > 0) {
                toast.loading("Uploading images...");
                const promisesArray = [];
                for (let i = 0; i < images.length; i++) {
                    if (!images[i]) continue;
                    promisesArray.push(MediaUpload(images[i]));
                }
                if (promisesArray.length > 0) {
                    imageUrls = await Promise.all(promisesArray);
                    toast.dismiss();
                    console.log("Uploaded image URLs:", imageUrls);
                }
            }

            const alternativeNamesinArray = alternativeNames.split(",").map(s => s.trim()).filter(Boolean);

            const productData = {   
                productId,
                name: productName,
                altname: alternativeNamesinArray,
                labelledprice: Number(labelledPrice),
                price: Number(price),
                description,
                image: imageUrls,
                stock: Number(stock),
                isAvailable: isAvailable,
                category: category
            };

            const token = localStorage.getItem("token");
            if (token === null) {
                toast.error("Please login first");
                navigate("/login");
                return;
            }

            const response = await axios.put(import.meta.env.VITE_BACKEND_URL + `/api/products/${productId}`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Product updated successfully:", response.data);
            toast.success("Product updated successfully!");
            navigate("/admin/products");

        } catch (error) {
            console.error("There was an error!", error);
            toast.error("Error updating product: " + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    }
    
    return (
        <div className="w-full min-h-full p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Update Product</h1>
                            <p className="text-green-100 text-sm mt-1">Edit product details and save changes</p>
                        </div>
                        <Link 
                            to="/admin/products" 
                            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                        >
                            <MdCancel size={24} />
                        </Link>
                    </div>

                    {/* Form */}
                    <form onSubmit={addproduct} className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product ID */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Product ID <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    disabled 
                                    value={productId} 
                                    onChange={(e) => setProductId(e.target.value)} 
                                    type="text" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600" 
                                    placeholder="e.g., PROD-001" 
                                    required 
                                />
                                <p className="text-xs text-gray-500">Product ID cannot be changed</p>
                            </div>

                            {/* Product Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    value={productName} 
                                    onChange={(e) => setProductName(e.target.value)} 
                                    type="text" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                                    placeholder="e.g., Wireless Headphones" 
                                    required 
                                />
                            </div>

                            {/* Alternative Names */}
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Alternative Names
                                </label>
                                <input 
                                    value={alternativeNames} 
                                    onChange={(e) => setAlternativeNames(e.target.value)} 
                                    type="text" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                                    placeholder="e.g., Earphones, Audio Device (comma separated)" 
                                />
                                <p className="text-xs text-gray-500">Separate multiple names with commas</p>
                            </div>

                            {/* Labelled Price */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Labelled Price (Rs.) <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    value={labelledPrice} 
                                    onChange={(e) => setLabelledPrice(e.target.value)} 
                                    type="number" 
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                                    placeholder="e.g., 15000" 
                                    required 
                                />
                            </div>

                            {/* Actual Price */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Selling Price (Rs.) <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)} 
                                    type="number" 
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                                    placeholder="e.g., 12500" 
                                    required 
                                />
                            </div>
                            {/* Actual Price */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Selling Price (Rs.) <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)} 
                                    type="number" 
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                                    placeholder="e.g., 12500" 
                                    required 
                                />
                            </div>

                            {/* Stock */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    value={stock} 
                                    onChange={(e) => setStock(e.target.value)} 
                                    type="number" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" 
                                    placeholder="e.g., 50" 
                                    required 
                                />
                            </div>

                            {/* Category */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                                >
                                    <option value="cosmetics">Cosmetics</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="home_appliances">Home Appliances</option>
                                </select>
                            </div>

                            {/* Availability */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Availability Status
                                </label>
                                <select 
                                    value={isAvailable} 
                                    onChange={(e) => setIsAvailable(e.target.value === "true")} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                                >
                                    <option value="true">Available</option>
                                    <option value="false">Not Available</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Product Description <span className="text-red-500">*</span>
                                </label>
                                <textarea 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none" 
                                    placeholder="Enter a detailed product description (minimum 20 characters)" 
                                    required 
                                />
                                <p className="text-xs text-gray-500">
                                    {description.length}/20 characters minimum
                                </p>
                            </div>

                            {/* Current Images Display */}
                            {location.state?.product?.image && location.state.product.image.length > 0 && (
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Current Product Images
                                    </label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {location.state.product.image.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <img 
                                                    src={img} 
                                                    alt={`Product ${index + 1}`} 
                                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">Upload new images below to replace existing ones</p>
                                </div>
                            )}

                            {/* Images Upload */}
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Upload New Images (Optional)
                                </label>
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                console.log("Files selected:", e.target.files.length);
                                                const filesArray = Array.from(e.target.files);
                                                console.log("Files converted to array:", filesArray.length);
                                                setImages(filesArray);
                                                toast.success(`${filesArray.length} image(s) selected`);
                                            } else {
                                                console.log("No files selected");
                                                setImages([]);
                                            }
                                        }} 
                                        multiple 
                                        accept="image/*"
                                        className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                    {images && images.length > 0 && (
                                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-sm text-green-700 font-medium">
                                                ✓ {images.length} new image(s) selected and ready to upload
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">Upload new images to replace the existing ones (JPG, PNG, WebP)</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex gap-4">
                            <button 
                                type="submit" 
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </span>
                                ) : (
                                    "Update Product"
                                )}
                            </button>
                            <Link 
                                to="/admin/products" 
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


