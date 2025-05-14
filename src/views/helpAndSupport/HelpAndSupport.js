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
    CFormTextarea,
    CSpinner
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
    const [selectedConcernIndex, setSelectedConcernIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchConcerns();
    }, []);

    const fetchConcerns = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://18.209.91.97:3555/api/help-concerns/admin/get', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setConcerns(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching concerns:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = (concern, index = 0) => {
        setSelectedConcern(concern._id);
        setSelectedConcernIndex(index);
        setReplyMessage('');
        setVisible(true);
    };

    const submitReply = async () => {
        if (!replyMessage.trim()) {
            alert("Reply message cannot be empty!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://18.209.91.97:3555/api/help-concerns/admin/reply-to-concern', {
                concernId: selectedConcern,
                concernIndex: selectedConcernIndex,
                reply: replyMessage,
                replyBy: "Admin"
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.data.success) {
                alert("Reply submitted successfully!");
                setVisible(false);
                setReplyMessage("");
                await fetchConcerns();
            }
        } catch (error) {
            console.error("Error submitting reply:", error);
            alert("Failed to submit reply. Please try again.");
        }
    };

    const handleViewChat = (concern) => {
        setSelectedConcernView(concern);
        setVisibleView(true);
    };

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
                            <CTableHeaderCell>Latest Concern</CTableHeaderCell>
                            <CTableHeaderCell>Latest Reply</CTableHeaderCell>
                            <CTableHeaderCell>Reply By</CTableHeaderCell>
                            <CTableHeaderCell>Created At</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {loading ? (
                            // Loading state
                            <CTableRow>
                                <CTableDataCell colSpan="6" className="text-center py-4">
                                    <CSpinner size="sm" />
                                    <span className="ms-2">Loading concerns...</span>
                                </CTableDataCell>
                            </CTableRow>
                        ) : concerns.length > 0 ? (
                            // Concerns list
                            concerns.map((concern) => {
                                const latestConcern = concern.concern[concern.concern.length - 1];
                                const latestReply = latestConcern.replies.length > 0
                                    ? latestConcern.replies[latestConcern.replies.length - 1]
                                    : null;

                                return (
                                    <CTableRow key={concern._id}>
                                        <CTableDataCell>
                                            {concern?.userId?.firstName || 'User'} ({concern.concernSide})
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {latestConcern.message}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {latestReply ? latestReply.reply : 'No reply yet.'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {latestReply ? latestReply.replyBy : 'N/A'}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            {moment(concern.createdAt).format('DD MMM YYYY, h:mm A')}
                                        </CTableDataCell>
                                        <CTableDataCell>
                                            <CButton
                                                color="info"
                                                size="sm"
                                                onClick={() => handleReply(concern, concern.concern.length - 1)}
                                                className="me-2"
                                            >
                                                Reply
                                            </CButton>
                                            <CButton
                                                color="secondary"
                                                size="sm"
                                                onClick={() => handleViewChat(concern)}
                                            >
                                                View
                                            </CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                );
                            })
                        ) : (
                            // No concerns found
                            <CTableRow>
                                <CTableDataCell colSpan="6" className="text-center py-4 text-muted">
                                    No concerns found
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </CCardBody>

            {/* Reply Modal */}
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Reply to Concern</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormTextarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Enter your reply here..."
                        rows={5}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={submitReply}>
                        Submit Reply
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* View Chat Modal */}
            <CModal visible={visibleView} onClose={handleCloseModal} size="lg">
                <CModalHeader>
                    <CModalTitle>Chat History</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedConcernView && (
                        <div className="chat-history">
                            {selectedConcernView.concern.map((concernObj, concernIdx) => (
                                <div key={`concern-${concernIdx}`} className="mb-4">
                                    <div className="user-concern p-3 rounded mb-2" style={{backgroundColor: "#6b7785"}}>
                                        <strong>User Concern ({moment(concernObj.concernTime).format('MMM D, h:mm A')}):</strong>
                                        <p className="mb-0">{concernObj.message}</p>
                                    </div>

                                    {concernObj.replies.length > 0 ? (
                                        concernObj.replies.map((reply, replyIdx) => (
                                            <div key={`reply-${replyIdx}`} className="admin-reply bg-primary text-white p-3 rounded mb-2 ms-4">
                                                <strong>Admin Reply ({moment(reply.repliedAt).format('MMM D, h:mm A')}):</strong>
                                                <p className="mb-0">{reply.reply}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted ms-4">No replies yet</div>
                                    )}

                                    <CButton
                                        color="info"
                                        size="sm"
                                        onClick={() => {
                                            setVisibleView(false);
                                            handleReply(selectedConcernView, concernIdx);
                                        }}
                                        className="mt-2"
                                    >
                                        Reply to This Concern
                                    </CButton>
                                </div>
                            ))}
                        </div>
                    )}
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