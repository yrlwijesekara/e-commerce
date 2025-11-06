import { useState, useEffect } from "react";
import { getCart } from "../../utils/cart";

export default function CartPage() { 
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const items = getCart();
        setCartItems(items);
    }, []);

    return (
        <div className="w-full h-screen bg-yellow-100 flex flex-col  p-4 items-center">
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                cartItems.map((item, index) => {
                    return (
                        <div key={item.productId || index} className="w-[800px] h-[100px] bg-amber-800 mb-4 rounded overflow-hidden text-white flex flex-row items-center p-4 shadow-md gap-8">
                            <img src={item.image} alt={item.name} className="w-24 h-full object-cover rounded mr-4 float-left flex " />
                            <h3>{item.name}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: Rs. {item.price}</p>
                            
                            

                        </div>
                    );
                })
            )}
        </div>
    );
}