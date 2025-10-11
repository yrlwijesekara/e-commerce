import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/loader";
export default function Product() {

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
    
    if (loading) {
        axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/')
            .then(response => {
                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }
}, [loading]);
    return (
        loading ? (
            <Loader />
        ) : (
            <div className="w-full h-full flex flex-wrap justify-center items-center">
                {products.length === 0 ? (
                    <p className="text-lg text-gray-500">No products found.</p>
                ) : (
                    products.map(product => (
                        <div key={product.productId || product._id} className="m-4 p-4 border rounded shadow">
                            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                            <p className="text-gray-600">{product.description}</p>
                            <p className="text-gray-600">Price: {product.price}</p>
                            <p className="text-gray-600">Stock: {product.stock}</p>
                            <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mt-2"/>
                        </div>
                    ))
                )}
            </div>
        )
    );
}