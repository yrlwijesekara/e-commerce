import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import ImageSlider from "../../components/imageslider";
import { addToCart, getCart } from "../../utils/cart";
export default function ProductOverviewPage() {
    const params = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
       if (status === 'loading') {
        axios.get(import.meta.env.VITE_BACKEND_URL + `/api/products/${params.id}`)
        .then(response => {
            if (response.data && response.data.product) {
                setProduct(response.data.product);
                setStatus('success');
            } else {
                setStatus('error');
            }
        })
        .catch(error => {
            toast.error("Error fetching product: " + error.message);
            setStatus('error');
        });
       }
    }, [status]);


    return (
        <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 flex justify-center items-center"> 
            {status === 'loading' && <Loader />} 
            {status === 'success' && <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 mg:row">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center md:hidden">
                        {product.name}
                        <span className="block sm:inline text-base sm:text-lg text-gray-600 sm:ml-2 mt-1 sm:mt-0">
                            {product.altname.join(", ")}
                        </span>
                    </h1>
                <div className="w-full lg:w-1/2 flex justify-center items-center ">
                    <ImageSlider images={product.image} />
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center gap-3 sm:gap-4 px-2 sm:px-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold hidden md:block">
                        {product.name}
                        <span className="block sm:inline text-base sm:text-lg text-gray-600 sm:ml-2 mt-1 sm:mt-0">
                            {product.altname.join(", ")}
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600">{product.description}</p>  
                    <div className="flex flex-row gap-4">
                          {
                        product.labelledprice > product.price ? (
                            <p className="text-sm sm:text-base md:text-lg">
                                <span className="line-through mr-2 text-black-500">Rs. {product.labelledprice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                <span className="text-red-600 font-semibold">Rs. {product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </p>
                        ) : (
                            <p className="text-sm sm:text-base md:text-lg">
                                <span>Rs. {product.price.toFixed(2)}</span>
                            </p>
                        )
                    }
                    </div>
                     <div className="w-full mt-2 sm:mt-4">
                <button 
                    className="w-full bg-blue-500 border-2 text-white py-2 sm:py-3 text-sm sm:text-base rounded hover:bg-white hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                    onClick={() => {
                        addToCart(product,1);
                        toast.success("Product added to cart");
                        console.log(getCart());
                    }}
                >
                    Add to cart 
                </button>
                <button 
                    className="w-full mt-2 bg-green-500 border-2 text-white py-2 sm:py-3 text-sm sm:text-base rounded hover:bg-white hover:text-green-600 transition-colors duration-300 cursor-pointer"
                    onClick={() => {
                        addToCart(product, 1);
                        navigate('/checkout', { state: { items: getCart() } });
                    }}
                >
                    Buy Now
                </button>
            </div>
                </div>
            </div>}
            {status === 'error' && <div className="text-red-500 flex justify-center">Error loading product.</div>}
        </div>
        
    );
}