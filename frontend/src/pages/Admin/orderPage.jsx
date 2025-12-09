import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    console.log("OrderPage component rendered, loading:", loading, "orders:", orders.length);

    useEffect(() => {
        console.log("OrderPage mounted, fetching orders...");
        fetchOrders();
    }, []);

    function fetchOrders() {
        const token = localStorage.getItem('token');
        console.log("Token exists:", !!token);
        
        if (!token) {
            toast.error("Please login as admin");
            setLoading(false);
            return;
        }

        const url = import.meta.env.VITE_BACKEND_URL + '/api/orders';
        console.log("Fetching orders from:", url);
        console.log("Using token:", token.substring(0, 20) + "...");

        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            console.log("Orders response:", response.data);
            const ordersList = response.data.orders || [];
            console.log("Number of orders:", ordersList.length);
            setOrders(ordersList);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching orders:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            toast.error(error.response?.data?.message || "Failed to fetch orders");
            setLoading(false);
        });
    }

    function updateOrderStatus(orderId, newStatus) {
        const token = localStorage.getItem('token');
        
        axios.put(
            import.meta.env.VITE_BACKEND_URL + `/api/orders/${orderId}`,
            { status: newStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then(response => {
            toast.success("Order status updated");
            fetchOrders();
        })
        .catch(error => {
            console.error("Error updating order:", error);
            toast.error("Failed to update order status");
        });
    }

    return (
        <div className="w-full min-h-full p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Order Management</h1>

                {loading ? (
                    <div className="text-center py-10">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No orders found</div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div
                                key={order._id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Order ID</p>
                                        <p className="font-semibold">{order.orderID}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Customer</p>
                                        <p className="font-semibold">{order.name}</p>
                                        <p className="text-sm text-gray-500">{order.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Amount</p>
                                        <p className="font-semibold text-green-600">Rs. {(order.totalAmount || 0).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className={`px-3 py-1 rounded font-semibold ${
                                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-medium">{order.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Delivery Address</p>
                                            <p className="font-medium">{order.address}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                        {selectedOrder === order._id ? 'Hide Items' : 'View Items'}
                                    </button>

                                    {selectedOrder === order._id && order.items && (
                                        <div className="mt-4 space-y-2">
                                            <p className="font-semibold">Order Items:</p>
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4 bg-gray-50 p-3 rounded">
                                                    <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-600">Qty: {item.quantity} × Rs. {(item.price || 0).toFixed(2)}</p>
                                                    </div>
                                                    <p className="font-semibold">Rs. {((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-4 mt-4 text-sm text-gray-500">
                                    <p>Order Date: {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}