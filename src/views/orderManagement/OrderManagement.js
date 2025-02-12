import React, { useEffect, useState } from "react";
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CTooltip
} from "@coreui/react";
import axios from "axios";
import { Eye, PackageCheck, XCircle, CheckCircle } from "lucide-react";


const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://44.196.64.110:3555/api/order/all-orders",
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setOrders(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axios.post(`http://44.196.64.110:3555/api/order/update-status/${orderId}`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
        }

    };

    const handleCancelOrder = async (orderId) => {
        try {
            await axios.put(`http://44.196.64.110:3555/api/orders/${orderId}`, { orderStatus: "Cancelled" });
            fetchOrders();
        } catch (error) {
            console.error("Error cancelling order:", error);
        }
    };

    return (
        <div>
            <h2>Order Management</h2>
            <CTable striped hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Order ID</CTableHeaderCell>
                        <CTableHeaderCell>User</CTableHeaderCell>
                        {/* <CTableHeaderCell>Status</CTableHeaderCell> */}
                        <CTableHeaderCell>Total Price</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {orders.map((order) => (
                        <CTableRow key={order._id}>
                            <CTableDataCell>{order._id}</CTableDataCell>
                            <CTableDataCell>{order.user?.firstName || "Guest"}</CTableDataCell>
                            {/* <CTableDataCell>{order.orderStatus}</CTableDataCell> */}
                            <CTableDataCell>${order.totalPrice}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info" size="sm" onClick={() => handleViewOrder(order)}>
                                    <Eye size={15} />
                                </CButton>
                                {order.orderStatus === "delivered" ? (
                                    <CButton className="p-2">
                                        <CTooltip content="Delivered">
                                            <CheckCircle size={20} color="green" style={{ cursor: 'pointer' }} />
                                        </CTooltip>
                                    </CButton>

                                ) : (
                                    <CButton color="warning" size="sm" onClick={() => handleUpdateStatus(order._id, "delivered")}>
                                        <CTooltip content="Mark as Delivered">
                                            <PackageCheck size={20} color="green" style={{ cursor: 'pointer' }} />
                                        </CTooltip>
                                    </CButton>
                                )}
                                {/* <CTooltip content="Cancel Order">
                                    <XCircle size={20} color="red" style={{ cursor: 'pointer' }} />
                                </CTooltip> */}
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* Order Details Modal */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader>Order Details</CModalHeader>
                <CModalBody>
                    {selectedOrder && (
                        <>
                            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                            <p><strong>User:</strong> {selectedOrder.user?.firstName || "Guest"}</p>
                            {/* <p><strong>Status:</strong> {selectedOrder?.orderStatus || "Pending"}</p> */}
                            <p><strong>Total Price:</strong> ${selectedOrder.totalPrice}</p>
                            <p><strong>Payment Method:</strong> {selectedOrder.paymentDetails?.paymentMethod}</p>
                            <p><strong>Last 4 Digits:</strong> {selectedOrder.paymentDetails?.transactionDetails?.payment_method?.card?.last4 || 'N/A'}</p>
                            <p><strong>Total Price:</strong> ₹{selectedOrder.totalPrice}</p>
                            <p><strong>Items:</strong></p>
                            <ul>
                                {selectedOrder.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - {item.quantity} x ${item.price}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default OrderManagement;
