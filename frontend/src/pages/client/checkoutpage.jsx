import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addToCart, getCart, calculateCartTotal } from "../../utils/cart";
import { removeFromCart } from "../../utils/cart";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  useEffect(() => {
    const items = location.state?.items || getCart();
    setCartItems(items);
    setTotal(calculateTotal(items));

    if(!items || items.length === 0){
        toast.error("No items in cart");
        navigate('/products');
    }
  }, [location, navigate]);

  async function placeOrder() {
    const token = localStorage.getItem('token');
    if (!token) {
        toast.error("Please login to place order");
        navigate('/login');
        return;
    }

    if (cartItems.length === 0) {
        toast.error("Cart is empty");
        return;
    }

    const order = {
      items: []
    };
    
    cartItems.forEach(item => {
      order.items.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    });
    
    console.log("Placing order with:", order);
    console.log("Using token:", token.substring(0, 20) + "...");
    
    try {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/orders', order, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Order response:", response.data);
      toast.success("Order placed successfully");
      localStorage.setItem('cart', JSON.stringify([]));
      navigate('/orders');
    } catch (error) {
      console.error("Order error details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || "Failed to place order");
      }
    }
  }

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
                  const newCart = [...cartItems];
                  if (newCart[index].quantity > 1) {
                    newCart[index].quantity -= 1;
                    setCartItems(newCart);
                    setTotal(calculateTotal(newCart));
                  }
                }}> - </button>
                <p className="font-semibold p-2">Quantity: {item.quantity}</p>
                <button className="w-6 h-8 border border-gray-400 rounded flex items-center justify-center font-bold text-lg bg-white hover:bg-gray-200 transition cursor-pointer"
                onClick={() => {
                  const newCart = [...cartItems];
                  newCart[index].quantity += 1;
                  setCartItems(newCart);
                  setTotal(calculateTotal(newCart));
                }}> + </button>
              </div>
              <div className="w-[200px] flex flex-col justify-center items-center">
                <p className="font-semibold">Price: Rs. {item.price * item.quantity}</p>
              </div>
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
              <button 
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-700 transition cursor-pointer"
                onClick={placeOrder}
              >
               Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
