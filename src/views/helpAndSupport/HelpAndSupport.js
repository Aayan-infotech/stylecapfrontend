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
    const [replyMessage, setReplyMessage] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        fetchConcerns();
    }, []);

    const fetchConcerns = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://18.209.91.97:3555/api/help-concerns/admin/get',
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
    //         const response = await axios.post('http://18.209.91.97:3555/api/help-concerns/admin/reply-to-concern', {
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
            const response = await axios.post('http://18.209.91.97:3555/api/help-concerns/admin/reply-to-concern', {
                concernId: selectedConcern,
                concernIndex,
                reply: replyMessage,
                replyBy: "Admin" // Or pass the adminId if available
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
                                <CTableDataCell>{concern.userId}</CTableDataCell>
                                <CTableDataCell>{concern.concern}</CTableDataCell>
                                <CTableDataCell>{concern.reply || 'No reply yet.'}</CTableDataCell>
                                <CTableDataCell>{concern.replyBy || 'N/A'}</CTableDataCell>
                                <CTableDataCell>{moment(concern.createdAt).format('DD MMM YYYY, h:mm A')}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="info" size="sm" onClick={() => handleReply(concern._id)}>
                                        Reply
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

        </CCard>
    );
};

export default AdminConcernsScreen;
