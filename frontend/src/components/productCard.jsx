import { Link } from "react-router-dom";

export default function ProductCard(props) {
    const product = props.product;
    return (
        <Link to={`/overview/${product.productId}`} className="rounded-2xl shadow-md w-[500px] h-[420px] shrink-0 hover:shadow-lg transition-shadow duration-300 overflow-hidden relative m-4">
            {product.image && (
                <img src={product.image[0]} alt={product.name} className="w-full h-[250px] object-cover animate-[ping_2s_reverse]" />
            )}

            <div className="p-4">
                <h2 className="text-lg font-bold mb-2 text-center">{product.name}</h2>
                
                <div>
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
               
               
                <p className="text-gray-600">Category: {product.category}</p>
            </div>
           

        </Link>
    );
}