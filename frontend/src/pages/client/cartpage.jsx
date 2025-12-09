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
    <div className="w-full h-screen flex flex-col  p-4 items-center">
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cartItems.map((item, index) => {
          return (
            <div
              key={item.productId || index}
              className="w-[1200px] h-[120px] mb-4 rounded text-black flex flex-row items-center p-6 shadow-md gap-8 relative"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-[120px] h-[100px] object-cover rounded mr-4"
              />
              <div className="w-[350px] flex flex-col justify-center items-center">
                <h3 className="font-semibold text-xl">{item.name}</h3>
                
                
              </div>
              <div className="w-[250px] flex flex-row justify-center items-center gap-3">
                <button className="w-10 h-10 border border-gray-400 rounded flex items-center justify-center font-bold text-xl bg-white hover:bg-gray-100 transition cursor-pointer"
                onClick={() => {
                  addToCart(item, -1);
                  setCartItems(getCart());
                  setTotal(calculateCartTotal());
                }}> - </button>
                <p className="font-semibold text-lg px-3">Qty: {item.quantity}</p>
                <button className="w-10 h-10 border border-gray-400 rounded flex items-center justify-center font-bold text-xl bg-white hover:bg-gray-200 transition cursor-pointer"
                onClick={() => {
                  addToCart(item, 1);
                  setCartItems(getCart());
                  setTotal(calculateCartTotal());
                }}> + </button>
              </div>
              <div className="w-[250px] flex flex-col justify-center items-center">
                <p className="font-semibold text-lg">Price: Rs. {item.price * item.quantity}</p>
              </div>
              <button 
                className="w-10 h-10 border border-gray-400 rounded flex items-center justify-center font-bold text-lg bg-white hover:text-red-400 transition cursor-pointer absolute right-[-50px]"
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
        <div className="w-[1200px] mt-6 p-6 border-t-2 border-gray-300">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Total:</h2>
            <div className="flex items-center gap-6">
              <p className="text-3xl font-bold text-green-600">Rs. {total.toFixed(2)}</p>
              <button className="px-8 py-3 bg-green-500 text-white font-semibold text-lg rounded hover:bg-green-700 transition cursor-pointer"
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
