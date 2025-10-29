import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import ImageSlider from "../../components/imageslider";
export default function ProductOverviewPage() {
    const params = useParams();
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
        <div className="w-full h-screen ">
            {status === 'loading' && <Loader />} 
            {status === 'success' && <div className="w-full h-full p-8 flex flex-row">
                <div className="w-[49%] h-full bg-blue-100">
                    <ImageSlider images={product.image} />
                </div>
                <div className="w-[49%] h-full bg-red-300 flex flex-col p-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-xl text-gray-600">{product.description}</p>  
                </div>
            </div>}
            {status === 'error' && <div className="text-red-500 flex justify-center">Error loading product.</div>}
        </div>
    );
}