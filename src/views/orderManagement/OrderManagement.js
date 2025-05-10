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
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormInput,
    CTooltip,
    CFormLabel
} from "@coreui/react";
import axios from "axios";
import { Eye, PackageCheck, XCircle, CheckCircle } from "lucide-react";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [trackingAgentId, setTrackingAgentId] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("delivered");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://18.209.91.97:3555/api/order/all-orders", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOrders(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setDetailsModalVisible(true);
    };

    const handleOpenStatusModal = (order) => {
        setSelectedOrder(order);
        setStatusModalVisible(true);
    };

    const handleUpdateStatus = async () => {
        try {
            setLoading(true);
            await axios.post(
                `http://18.209.91.97:3555/api/order/update-status/${selectedOrder._id}`,
                { 
                    status: selectedStatus,
                    trackingAgentId: trackingAgentId 
                },
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );
            fetchOrders();
            setStatusModalVisible(false);
            setTrackingAgentId("");
        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            setLoading(false);
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
                        <CTableHeaderCell>Status</CTableHeaderCell>
                        <CTableHeaderCell>Total Price</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {orders.map((order) => (
                        <CTableRow key={order._id}>
                            <CTableDataCell>{order._id}</CTableDataCell>
                            <CTableDataCell>{order.user?.firstName || "Guest"}</CTableDataCell>
                            <CTableDataCell>{order.orderStatus}</CTableDataCell>
                            <CTableDataCell>${order.totalPrice}</CTableDataCell>
                            <CTableDataCell>
                                <CButton color="info" size="sm" onClick={() => handleViewOrder(order)}>
                                    <Eye size={15} />
                                </CButton>
                                
                                {order.orderStatus === "delivered" ? (
                                    <CButton className="ms-2" disabled>
                                        <CTooltip content="Already Delivered">
                                            <CheckCircle size={20} color="green" />
                                        </CTooltip>
                                    </CButton>
                                ) : (
                                    <CButton 
                                        color="warning" 
                                        size="sm" 
                                        className="ms-2"
                                        onClick={() => handleOpenStatusModal(order)}
                                    >
                                        <CTooltip content="Update Status">
                                            <PackageCheck size={20} color="green" />
                                        </CTooltip>
                                    </CButton>
                                )}
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* Order Details Modal */}
            <CModal visible={detailsModalVisible} onClose={() => setDetailsModalVisible(false)}>
                <CModalHeader>Order Details</CModalHeader>
                <CModalBody>
                    {selectedOrder && (
                        <>
                            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                            <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                            {selectedOrder.trackingAgentId && (
                                <p><strong>Tracking Agent ID:</strong> {selectedOrder.trackingAgentId}</p>
                            )}
                            {/* ... rest of your details */}
                        </>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setDetailsModalVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* Status Update Modal */}
            <CModal visible={statusModalVisible} onClose={() => setStatusModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Update Order Status</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <div className="mb-3">
                            <CFormLabel>Status</CFormLabel>
                            <select 
                                className="form-select"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="dispatched">Dispatched</option>
                                <option value="outForDelivery">Out for Delivery</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Tracking Agent ID</CFormLabel>
                            <CFormInput
                                type="text"
                                value={trackingAgentId}
                                onChange={(e) => setTrackingAgentId(e.target.value)}
                                placeholder="Enter tracking agent ID"
                            />
                        </div>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setStatusModalVisible(false)}>
                        Cancel
                    </CButton>
                    <CButton 
                        color="primary" 
                        onClick={handleUpdateStatus}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Status"}
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default OrderManagement;