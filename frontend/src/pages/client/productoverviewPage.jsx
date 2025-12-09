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
        <div className="w-full h-screen p-8"> 
            {status === 'loading' && <Loader />} 
            {status === 'success' && <div className="w-full h-full flex flex-row">
                <div className="w-[49%] h-full flex justify-center">
                    <ImageSlider images={product.image} />
                </div>
                <div className="w-[49%] h-full flex flex-col items-center pt-8 gap-3 px-8">
                    <h1 className="text-3xl font-bold">{product.name}
                        <span className="text-lg text-gray-600">{product.altname.join(", ")}</span>
                    </h1>
                    <p className="text-xl text-gray-600">{product.description}</p>  
                    <div className="flex flex-row gap-4 mt-4">
                          {
                        product.labelledprice > product.price ? (
                            <p>
                                <span className="line-through mr-2 text-black-500">Rs. {product.labelledprice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                <span className="text-red-600 font-semibold">Rs. {product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                            </p>
                        ) : (
                            <p>
                                <span>Rs. {product.price.toFixed(2)}</span>
                            </p>
                        )
                    }
                    </div>
                     <div className="mt-2 p-4 w-full">
                <button 
                    className="w-full bg-blue-500 border-2 text-white py-2 rounded hover:bg-white hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                    onClick={() => {
                        addToCart(product,1);
                        toast.success("Product added to cart");
                        console.log(getCart());
                    }}
                >
                    Add to cart 
                </button>
                <button 
                    className="w-full mt-2 bg-green-500 border-2 text-white py-2 rounded hover:bg-white hover:text-green-600 transition-colors duration-300 cursor-pointer"
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