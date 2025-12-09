import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    
    // Notes state
    const [editingNotes, setEditingNotes] = useState({});
    const [notesInput, setNotesInput] = useState({});

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

    function updateOrderNotes(orderId, notes) {
        const token = localStorage.getItem('token');
        
        axios.put(
            import.meta.env.VITE_BACKEND_URL + `/api/orders/${orderId}`,
            { notes: notes },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then(response => {
            toast.success("Notes saved successfully");
            setEditingNotes(prev => ({ ...prev, [orderId]: false }));
            fetchOrders();
        })
        .catch(error => {
            console.error("Error updating notes:", error);
            toast.error("Failed to save notes");
        });
    }

    function handleNotesEdit(orderId, currentNotes) {
        setEditingNotes(prev => ({ ...prev, [orderId]: true }));
        setNotesInput(prev => ({ ...prev, [orderId]: currentNotes || "" }));
    }

    function handleNotesSave(orderId) {
        const notes = notesInput[orderId] || "";
        updateOrderNotes(orderId, notes);
    }

    function handleNotesCancel(orderId) {
        setEditingNotes(prev => ({ ...prev, [orderId]: false }));
        setNotesInput(prev => ({ ...prev, [orderId]: "" }));
    }

    // Filter and search logic
    const filteredOrders = orders.filter(order => {
        // Search filter (order ID, customer name, email)
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
            (order.orderID && order.orderID.toLowerCase().includes(searchLower)) ||
            (order.name && order.name.toLowerCase().includes(searchLower)) ||
            (order.email && order.email.toLowerCase().includes(searchLower));

        // Status filter
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;

        // Date filter
        const matchesDate = !dateFilter || 
            new Date(order.date).toISOString().split('T')[0] === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, dateFilter]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full min-h-full p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Order Management</h1>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search Bar */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Order ID, Customer Name, Email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order Date
                            </label>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || statusFilter !== "All" || dateFilter) && (
                        <div className="mt-4">
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("All");
                                    setDateFilter("");
                                }}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                Clear All Filters
                            </button>
                            <span className="ml-4 text-sm text-gray-600">
                                Showing {filteredOrders.length} of {orders.length} orders
                            </span>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-10">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        {orders.length === 0 ? "No orders found" : "No orders match your filters"}
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {currentOrders.map(order => (
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

                                        {/* Admin Notes Section */}
                                        <div className="mt-4 border-t pt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-semibold text-gray-700">Admin Notes:</p>
                                                {!editingNotes[order._id] && (
                                                    <button
                                                        onClick={() => handleNotesEdit(order._id, order.notes)}
                                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        {order.notes && order.notes !== "No additional notes" ? "Edit Notes" : "Add Notes"}
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {editingNotes[order._id] ? (
                                                <div className="space-y-2">
                                                    <textarea
                                                        value={notesInput[order._id] || ""}
                                                        onChange={(e) => setNotesInput(prev => ({ ...prev, [order._id]: e.target.value }))}
                                                        rows="3"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                        placeholder="Add notes about this order..."
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleNotesSave(order._id)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                                        >
                                                            Save Notes
                                                        </button>
                                                        <button
                                                            onClick={() => handleNotesCancel(order._id)}
                                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                        {order.notes && order.notes !== "No additional notes" ? order.notes : "No notes added yet"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 mt-4 text-sm text-gray-500">
                                        <p>Order Date: {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow-md p-4">
                                <div className="text-sm text-gray-600">
                                    Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
                                </div>
                                <div className="flex gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex gap-1">
                                        {[...Array(totalPages)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            // Show first page, last page, current page, and pages around current
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === totalPages ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                            currentPage === pageNumber
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            } else if (
                                                pageNumber === currentPage - 2 ||
                                                pageNumber === currentPage + 2
                                            ) {
                                                return <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}