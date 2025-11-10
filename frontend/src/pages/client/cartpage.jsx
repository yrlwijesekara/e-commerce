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
              className="w-[800px] h-[100px] mb-4 rounded overflow-hidden text-black flex flex-row items-center p-4 shadow-md gap-8"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-[100px] h-full object-cover rounded mr-4 float-left flex "
              />
              <div className="w-[300px] flex flex-col justify-center items-center">
                <h3>{item.name}</h3>
                
                
              </div>
              <div className="w-[200px] flex flex-col justify-center items-center">
                <p>Quantity: {item.quantity}</p>
              </div>
              <div className="w-[200px] flex flex-col justify-center items-center">
                <p>Price: Rs. {item.price}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
