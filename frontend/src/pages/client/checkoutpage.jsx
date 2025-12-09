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
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");

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

    // Fetch user details
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(import.meta.env.VITE_BACKEND_URL + '/api/users/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log("User data received:", response.data);
        const userData = response.data.user;
        setUser(userData);
        // Pre-fill form with user data
        if (userData) {
          const fullName = `${userData.firstname || ''} ${userData.lastname || ''}`.trim();
          const phone = userData.phone === 'not provided' ? '' : (userData.phone || '');
          const address = userData.address === 'not provided' ? '' : (userData.address || '');
          
          console.log("Setting form values:", { fullName, address, phone });
          console.log("Raw user data:", { firstname: userData.firstname, lastname: userData.lastname, phone: userData.phone, address: userData.address });
          
          setDeliveryName(fullName);
          setDeliveryAddress(address);
          setDeliveryPhone(phone);
        }
        setLoadingUser(false);
      })
      .catch(error => {
        console.error("Error fetching user:", error);
        setLoadingUser(false);
        if (error.response?.status === 401) {
          toast.error("Please login again");
          navigate('/login');
        }
      });
    } else {
      setLoadingUser(false);
      toast.error("Please login to continue");
      navigate('/login');
    }
  }, [location, navigate]);

  // Debug effect to monitor state changes
  useEffect(() => {
    console.log("Current form state:", {
      deliveryName,
      deliveryPhone,
      deliveryAddress,
      user
    });
  }, [deliveryName, deliveryPhone, deliveryAddress, user]);

  async function saveUserDetails() {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please login to save details");
      return;
    }

    if (!deliveryName.trim() || !deliveryPhone.trim() || !deliveryAddress.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    const [firstname, ...lastnameArr] = deliveryName.trim().split(' ');
    const lastname = lastnameArr.join(' ') || '';

    const updateData = {
      firstname,
      lastname,
      phone: deliveryPhone,
      address: deliveryAddress,
    };

    console.log("Saving user details:", updateData);
    console.log("Using token:", token.substring(0, 20) + "...");

    try {
      const response = await axios.put(
        import.meta.env.VITE_BACKEND_URL + '/api/users/user',
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Save response:", response.data);
      toast.success("Details saved successfully");
      setUser(response.data.user);
    } catch (error) {
      console.error("Error saving user details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error(error.response?.data?.message || "Failed to save details");
    }
  }

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

    // Validate delivery details
    if (!deliveryName.trim()) {
        toast.error("Please enter your name");
        return;
    }
    if (!deliveryPhone.trim()) {
        toast.error("Please enter your phone number");
        return;
    }
    if (!deliveryAddress.trim()) {
        toast.error("Please enter your delivery address");
        return;
    }

    // Check if user details have changed and need to be saved
    const currentName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim();
    const detailsChanged = 
      deliveryName !== currentName || 
      deliveryPhone !== (user?.phone || '') || 
      deliveryAddress !== (user?.address || '');

    if (detailsChanged) {
      toast.error("Please save your delivery details before placing order");
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
    console.log("Delivery details will be taken from user profile");
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
    <div className="w-full min-h-screen flex flex-col p-4 items-center">
      {/* Delivery Details Form */}
      {cartItems.length > 0 && (
        <div className="w-[900px] mb-6 p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Delivery Details</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={deliveryName}
                onChange={(e) => setDeliveryName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <input
                type="tel"
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Delivery Address</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter your complete delivery address"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
          <button
            onClick={saveUserDetails}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer font-semibold"
          >
            Save Details
          </button>
        </div>
      )}

      {/* Cart Items */}
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
