import React, { useEffect, useState } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
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
    CFormTextarea
} from '@coreui/react';
import axios from 'axios';
import moment from 'moment';

const AdminConcernsScreen = () => {
    const [concerns, setConcerns] = useState([]);
    const [selectedConcern, setSelectedConcern] = useState(null);
    const [selectedConcernView, setSelectedConcernView] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [visibleView, setVisibleView] = useState(false);

    useEffect(() => {
        fetchConcerns();
    }, []);

    const fetchConcerns = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:3555/api/help-concerns/admin/get',
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            if (response.data.success) {
                setConcerns(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching concerns:', error);
        }
    };

    const handleReply = (concern) => {
        setSelectedConcern(concern);
        console.log(concern, "concern");
        setReplyMessage('');
        setVisible(true);
    };

    // const submitReply = async () => {
    //     if (!replyMessage) return;

    //     try {
    //         const response = await axios.post('http://localhost:3555/api/help-concerns/admin/reply-to-concern', {
    //             concernId: selectedConcern,
    //             reply: replyMessage,
    //             adminId: 'Admin',  // Replace with your actual admin ID or session
    //             concernIndex: selectedConcern.index // Pass the index here
    //         });

    //         if (response.data.success) {
    //             // Update the UI without a refetch
    //             await fetchConcerns();
    //             setVisible(false);
    //         }
    //     } catch (error) {
    //         console.error('Error replying to concern:', error);
    //     }
    // };

    const submitReply = async (concernIndex) => {
        if (!replyMessage.trim()) {
            alert("Reply message cannot be empty!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3555/api/help-concerns/admin/reply-to-concern', {
                concernId: selectedConcern,
                concernIndex,
                reply: replyMessage,
                replyBy: "Admin"
            });

            if (response.status === 200) {
                alert("Reply submitted successfully!");
                setVisible(false);
                setReplyMessage("");
                await fetchConcerns();

                // Optionally, you can refresh the list of concerns here
            }

        } catch (error) {
            console.error("Error submitting reply:", error);
            alert("Failed to submit reply. Please try again.");
        }
    };

    // Function to handle the opening of the View Chat Modal
    const handleViewChat = (concern) => {
        setSelectedConcernView(concern);
        setVisibleView(true);
    };

    // Function to handle closing of the modal
    const handleCloseModal = () => {
        setVisibleView(false);
        setSelectedConcernView(null);
    };


    return (
        <CCard className="mb-4">
            <CCardHeader>
                <strong>User Concerns</strong>
            </CCardHeader>
            <CCardBody>
                <CTable hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>User</CTableHeaderCell>
                            <CTableHeaderCell>Concern</CTableHeaderCell>
                            <CTableHeaderCell>Reply</CTableHeaderCell>
                            <CTableHeaderCell>Reply By</CTableHeaderCell>
                            <CTableHeaderCell>Created At</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {concerns.map((concern) => (
                            <CTableRow key={concern._id}>
                                <CTableDataCell>{concern?.userId?.firstName || 'User'}({concern.concernSide})</CTableDataCell>
                                {/* <CTableDataCell>{concern.concern}</CTableDataCell> */}
                                <CTableDataCell>{concern.concern[concern.concern.length - 1]}</CTableDataCell>
                                <CTableDataCell>
                                    {concern.replies.length > 0
                                        ? concern.replies[concern.replies.length - 1].reply
                                        : 'No reply yet.'
                                    }
                                </CTableDataCell>

                                <CTableDataCell>
                                    {concern.replies.length > 0
                                        ? concern.replies[concern.replies.length - 1].replyBy
                                        : 'N/A'
                                    }
                                </CTableDataCell>
                                <CTableDataCell>{moment(concern.createdAt).format('DD MMM YYYY, h:mm A')}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="info" size="sm" onClick={() => handleReply(concern._id)}>
                                        Reply
                                    </CButton>
                                    <CButton color="secondary" size="sm" onClick={() => handleViewChat(concern)}>
                                        View
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCardBody>

            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Reply to Concern</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormTextarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Enter your reply here..."
                        rows="5"
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={() => submitReply(0)}>
                        Submit Reply
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={visibleView} onClose={handleCloseModal} size="lg">
                <CModalHeader>
                    <CModalTitle>Chat History</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className="space-y-3">
                        {selectedConcernView?.concern?.map((msg, index) => (
                            <div key={index} className="bg-gray-100 p-2 rounded-md">
                                <p><strong>User Concern:</strong> {msg}</p>
                            </div>
                        ))}

                        {selectedConcernView?.replies?.map((reply, index) => (
                            <div key={index} className="bg-blue-100 p-2 rounded-md">
                                <p><strong>Admin Reply:</strong> {reply.reply}</p>
                                {/* <p className="text-sm text-gray-500">By: {reply.replyBy} | At: {new Date(reply.repliedAt).toLocaleString()}</p> */}
                            </div>
                        ))}
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={handleCloseModal}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

        </CCard>
    );
};

export default AdminConcernsScreen;
