import { Link } from "react-router-dom";

export default function ProductCard(props) {
    const product = props.product;
    return (
        <Link 
            to={`/overview/${product.productId}`} 
            className="rounded-2xl shadow-md w-full max-w-[300px] sm:max-w-[320px] md:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px] h-auto hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden relative mx-auto"
        >
            {product.image && (
                <img 
                    src={product.image[0]} 
                    alt={product.name} 
                    className="w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] xl:h-[260px] object-cover hover:scale-110 transition-transform duration-300" 
                />
            )}

            <div className="p-3 sm:p-4 md:p-4 lg:p-5">
                <h2 className="text-base sm:text-lg md:text-lg lg:text-xl font-bold mb-2 text-center line-clamp-2 h-12 sm:h-14">
                    {product.name}
                </h2>
                
                {product.altname && product.altname.length > 0 && (
                    <p className="text-xs sm:text-sm text-gray-500 italic text-center mb-2 line-clamp-1">
                        ({product.altname.join(', ')})
                    </p>
                )}
                
                <div className="mb-2">
                    {
                        product.labelledprice > product.price ? (
                            <p className="text-center">
                                <span className="line-through mr-2 text-gray-500 text-xs sm:text-sm md:text-base">
                                    Rs. {product.labelledprice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                                <br className="sm:hidden" />
                                <span className="text-red-600 font-semibold text-sm sm:text-base md:text-lg">
                                    Rs. {product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </span>
                            </p>
                        ) : (
                            <p className="text-center text-sm sm:text-base md:text-lg font-semibold">
                                <span>Rs. {product.price.toFixed(2)}</span>
                            </p>
                        )
                    }
                </div>
               
               
                <p className="text-gray-600 text-xs sm:text-sm md:text-base text-center truncate">
                    Category: {product.category}
                </p>
            </div>
           

        </Link>
    );
}