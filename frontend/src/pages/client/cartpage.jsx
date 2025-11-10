import { useState, useEffect } from "react";
import { getCart } from "../../utils/cart";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col  p-4 items-center">
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cartItems.map((item, index) => {
          return (
            <div
              key={item.productId || index}
              className="w-[900px] h-[100px] mb-4 rounded overflow-hidden text-black flex flex-row items-center p-4 shadow-md gap-8 relative"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-[100px] h-full object-cover rounded mr-4 float-left flex "
              />
              <div className="w-[300px] flex flex-col justify-center items-center t-bold">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                
                
              </div>
              <div className="w-[200px] flex flex-row justify-center items-center">
                <button className="w-6 h-8 border border-gray-400 rounded flex items-center justify-center font-bold text-lg bg-white hover:bg-gray-100 transition"> + </button>
                <p className="font-semibold p-2">Quantity: {item.quantity}</p>
                <button className="w-6 h-8 border border-gray-400 rounded flex items-center justify-center font-bold text-lg bg-white hover:bg-gray-200 transition cursor-pointer"> - </button>
              </div>
              <div className="w-[200px] flex flex-col justify-center items-center">
                <p className="font-semibold">Price: Rs. {item.price * item.quantity}</p>
              </div>
              
            </div>
          );
        })
      )}
    </div>
  );
}
