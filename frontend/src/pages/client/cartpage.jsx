import { useState, useEffect } from "react";
import { addToCart, getCart, calculateCartTotal } from "../../utils/cart";
import { removeFromCart } from "../../utils/cart";
import { FaTrashAlt } from "react-icons/fa";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    setTotal(calculateCartTotal());
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
              className="w-[900px] h-[100px] mb-4 rounded  text-black flex flex-row items-center p-4 shadow-md gap-8 relative"
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
                <button className="w-6 h-8 border border-gray-400 rounded flex items-center justify-center font-bold text-lg bg-white hover:bg-gray-100 transition cursor-pointer"
                onClick={() => {
                  addToCart(item, -1);
                  setCartItems(getCart());
                  setTotal(calculateCartTotal());
                }}> - </button>
                <p className="font-semibold p-2">Quantity: {item.quantity}</p>
                <button className="w-6 h-8 border border-gray-400 rounded flex items-center justify-center font-bold text-lg bg-white hover:bg-gray-200 transition cursor-pointer"
                onClick={() => {
                  addToCart(item, 1);
                  setCartItems(getCart());
                  setTotal(calculateCartTotal());
                }}> + </button>
              </div>
              <div className="w-[200px] flex flex-col justify-center items-center">
                <p className="font-semibold">Price: Rs. {item.price * item.quantity}</p>
              </div>
              <button 
                className="w-6 h-8 border border-gray-400 rounded flex items-center justify-center font-bold text-lg bg-white hover:text-red-400 transition cursor-pointer absolute right-[-40px]"
                onClick={() => {
                  removeFromCart(item.productId);
                  setCartItems(getCart());
                  setTotal(calculateCartTotal());
                }}
              >
                <FaTrashAlt />
              </button>
            </div>
          );
        })
      )}
      {cartItems.length > 0 && (
        <div className="w-[900px] mt-6 p-4 border-t-2 border-gray-300">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Total:</h2>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-bold text-green-600">Rs. {total.toFixed(2)}</p>
              <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-700 transition cursor-pointer">
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
