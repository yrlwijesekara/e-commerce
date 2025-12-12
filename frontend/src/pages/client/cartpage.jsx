import { useState, useEffect } from "react";
import { addToCart, getCart, calculateCartTotal } from "../../utils/cart";
import { removeFromCart } from "../../utils/cart";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    setTotal(calculateCartTotal());
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col p-4 sm:p-6 md:p-8 items-center">
      {cartItems.length === 0 ? (
        <p className="text-base sm:text-lg md:text-xl text-gray-500 mt-10">Your cart is empty</p>
      ) : (
        cartItems.map((item, index) => {
          return (
            <div
              key={item.productId || index}
              className="w-full max-w-6xl mb-4 rounded text-black flex flex-col sm:flex-row items-center p-4 sm:p-6 shadow-md gap-4 sm:gap-6 md:gap-8 relative md:mr-12"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded"
              />
              <div className="flex-1 flex flex-col justify-center items-center sm:items-start text-center sm:text-left">
                <h3 className="font-semibold text-lg sm:text-xl md:text-2xl">{item.name}</h3>
              </div>
              <div className="flex flex-row justify-center items-center gap-2 sm:gap-3">
                <button className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-400 rounded flex items-center justify-center font-bold text-lg sm:text-xl bg-white hover:bg-gray-100 transition cursor-pointer"
                onClick={() => {
                  addToCart(item, -1);
                  setCartItems(getCart());
                  setTotal(calculateCartTotal());
                }}> - </button>
                <p className="font-semibold text-sm sm:text-base md:text-lg px-2 sm:px-3">Qty: {item.quantity}</p>
                <button className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-400 rounded flex items-center justify-center font-bold text-lg sm:text-xl bg-white hover:bg-gray-200 transition cursor-pointer"
                onClick={() => {
                  addToCart(item, 1);
                  setCartItems(getCart());
                  setTotal(calculateCartTotal());
                }}> + </button>
              </div>
              <div className="flex flex-col justify-center items-center sm:items-end min-w-[120px] sm:min-w-[150px]">
                <p className="font-semibold text-base sm:text-lg md:text-xl">Rs. {(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button 
                className="w-10 h-10 border border-gray-400 rounded flex items-center justify-center font-bold text-base sm:text-lg  bg-white hover:text-red-400 transition cursor-pointer md:absolute md:right-[-50px] mt-2 md:mt-0"
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
        <div className="w-full max-w-6xl mt-6 p-4 sm:p-6 border-t-2 border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Total:</h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <p className="text-2xl sm:text-3xl font-bold text-green-600">Rs. {total.toFixed(2)}</p>
              <button className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-green-500 text-white font-semibold text-base sm:text-lg rounded hover:bg-green-700 transition cursor-pointer"
                onClick={() => {
                  navigate('/checkout', { state: { items: cartItems } });
                }}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
