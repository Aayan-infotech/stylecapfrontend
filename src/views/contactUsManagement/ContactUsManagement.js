import React, { useEffect, useState } from "react";
import {
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CCard,
    CCardBody,
    CCardHeader,
    CSpinner,
    CCollapse,
    CButton,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter  
} from "@coreui/react";
import axios from "axios";

const ContactUsManagement = () => {
    const [contactData, setContactData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleReplies, setVisibleReplies] = useState({}); // For managing reply visibility
    const [modalVisible, setModalVisible ] = useState(false)
    const [selectedContact, setSelectedContact ] = useState(null)

    useEffect(() => {
        fetchContactUsData();
    }, []);

    const fetchContactUsData = async () => {
        try {
            const response = await axios.get("http://3.223.253.106:3555/api/contact/get-all-query"); // Update API URL as needed
            setContactData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching contact data:", error);
            setLoading(false);
        }
    };

    const showReplies = (contact) => {
        setSelectedContact(contact); // Set the selected contact for the modal
        console.log("abc", selectedContact);
        setModalVisible(true); // Show the modal
      };

    //   const toggleReplies = (id) => {
    //     setVisibleReplies((prev) => ({
    //       ...prev,
    //       [id]: !prev[id],
    //     }));
    //   };
    const closeModal = () => {
        setSelectedContact(null); // Clear the selected contact
        setModalVisible(false); // Hide the modal
    };


    const handleSendReply = async (contact) => {
        try {
            const response = await axios.post("http://3.223.253.106:3555/api/contact/reply-query", {
                queryId: contact._id,
                replyMessage: contact.replyMessage,
            });

            alert("Reply sent successfully!");

            const updatedReplies = response.data.data;
            setContactData((prevData) =>
                prevData.map((c) =>
                    c._id === contact._id ? { ...c, replies: updatedReplies } : c
                )
            );

            closeModal();
        } catch (error) {
            console.error("Error sending reply:", error);
            alert("Failed to send reply.");
        }
    };
    return (
        <CCard>
            <CCardHeader>
                <h4>Contact Us Information</h4>
            </CCardHeader>
            <CCardBody>
                {loading ? (
                    <CSpinner />
                ) : (
                    <CTable responsive striped hover>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>#</CTableHeaderCell>
                                <CTableHeaderCell>Name</CTableHeaderCell>
                                <CTableHeaderCell>Email</CTableHeaderCell>
                                <CTableHeaderCell>Message</CTableHeaderCell>
                                <CTableHeaderCell>Replies</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {contactData.map((contact, index) => (
                                <CTableRow key={contact._id}>
                                    <CTableDataCell>{index + 1}</CTableDataCell>
                                    <CTableDataCell>{contact.name}</CTableDataCell>
                                    <CTableDataCell>{contact.email}</CTableDataCell>
                                    <CTableDataCell>{contact.message}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton
                                            color="primary"
                                            size="sm"
                                            onClick={() => showReplies(contact)}
                                        >View Replies
                                            {/* {visibleReplies[contact._id] ? "Hide" : "View"} Replies */}
                                        </CButton>
                                        {/* <CCollapse visible={visibleReplies[contact._id]}>
                      <CTable responsive striped hover className="mt-3">
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Email</CTableHeaderCell>
                            <CTableHeaderCell>Reply Message</CTableHeaderCell>
                            <CTableHeaderCell>Date</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          {contact.replies.map((reply) => (
                            <CTableRow key={reply._id}>
                              <CTableDataCell>{reply.senderEmail}</CTableDataCell>
                              <CTableDataCell>{reply.replyMessage}</CTableDataCell>
                              <CTableDataCell>
                                {new Date(reply.date).toLocaleString()}
                              </CTableDataCell>
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCollapse> */}
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                )}
            </CCardBody>

            {/* Modal to Display Replies */}
            {/* <CModal visible={modalVisible} onClose={closeModal} size="lg">
                <CModalHeader onClose={closeModal}>
                    Replies for {selectedContact?.name}
                </CModalHeader>
                <CModalBody>
                    {selectedContact?.replies.length > 0 ? (
                        <CTable responsive striped hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>Reply Message</CTableHeaderCell>
                                    <CTableHeaderCell>Date</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {selectedContact.replies.map((reply) => (
                                    <CTableRow key={reply._id}>
                                        <CTableDataCell>{reply.senderEmail}</CTableDataCell>
                                        <CTableDataCell>{reply.replyMessage}</CTableDataCell>
                                        <CTableDataCell>
                                            {new Date(reply.date).toLocaleString()}
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    ) : (
                        <p>No replies available for this contact.</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal> */}

            {/* Reply Modal */}
            {selectedContact && (
                <CModal visible={modalVisible} onClose={closeModal} size="lg">
                    <CModalHeader onClose={closeModal}>
                        Replies for {selectedContact.name}
                    </CModalHeader>
                    <CModalBody>
                        {selectedContact.replies?.length > 0 ? (
                            <CTable responsive striped hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Email</CTableHeaderCell>
                                        <CTableHeaderCell>Reply Message</CTableHeaderCell>
                                        <CTableHeaderCell>Date</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {selectedContact.replies.map((reply) => (
                                        <CTableRow key={reply._id}>
                                            <CTableDataCell>{reply.senderEmail}</CTableDataCell>
                                            <CTableDataCell>{reply.replyMessage}</CTableDataCell>
                                            <CTableDataCell>
                                                {new Date(reply.date).toLocaleString()}
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        ) : (
                            <p>No replies available for this query.</p>
                        )}

                        <div className="mt-4">
                            <h5>Send a Reply</h5>
                            <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Enter your reply..."
                                value={selectedContact.replyMessage || ""}
                                onChange={(e) =>
                                    setSelectedContact({ ...selectedContact, replyMessage: e.target.value })
                                }
                            />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="primary" onClick={() => handleSendReply(selectedContact)}>
                            Send Reply
                        </CButton>
                        <CButton color="secondary" onClick={closeModal}>
                            Close
                        </CButton>
                    </CModalFooter>
                </CModal>
            )}
        </CCard>
    );
};

export default ContactUsManagement;

// import React, { useEffect, useState } from "react";
// import {
//     CTable,
//     CTableBody,
//     CTableDataCell,
//     CTableHead,
//     CTableHeaderCell,
//     CTableRow,
//     CCard,
//     CCardBody,
//     CCardHeader,
//     CSpinner,
//     CButton,
//     CModal,
//     CModalHeader,
//     CModalBody,
//     CModalFooter
// } from "@coreui/react";
// import axios from "axios";
// import { requestForToken, onMessageListener } from "../../firebase/firebaseNotification"; // Import Firebase functions

// const ContactUsManagement = () => {
//     const [contactData, setContactData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [selectedContact, setSelectedContact] = useState(null);

//     useEffect(() => {
//         fetchContactUsData();
//         requestForToken(); // Request notification permission

//         // Listen for incoming notifications
//         onMessageListener()
//             .then((payload) => {
//                 alert(`New Notification: ${payload.notification.title} - ${payload.notification.body}`);
//                 fetchContactUsData(); // Refresh data when a new notification is received
//             })
//             .catch((err) => console.log("Failed to receive message: ", err));
//     }, []);

//     const fetchContactUsData = async () => {
//         try {
//             const response = await axios.get("http://3.223.253.106:3555/api/contact/get-all-query");
//             setContactData(response.data.data);
//             setLoading(false);
//         } catch (error) {
//             console.error("Error fetching contact data:", error);
//             setLoading(false);
//         }
//     };

//     const handleSendReply = async (contact) => {
//         try {
//             const response = await axios.post("http://3.223.253.106:3555/api/contact/reply-query", {
//                 queryId: contact._id,
//                 replyMessage: contact.replyMessage,
//             });

//             alert("Reply sent successfully!");

//             // Send a push notification to the user
//             await sendNotification(contact.email, "New Reply", `You have received a new reply to your query: ${contact.replyMessage}`);

//             fetchContactUsData();
//             setModalVisible(false);
//         } catch (error) {
//             console.error("Error sending reply:", error);
//             alert("Failed to send reply.");
//         }
//     };

//     const sendNotification = async (email, title, message) => {
//         try {
//             await axios.post("http://3.223.253.106:3555/api/notifications/send", {
//                 email,
//                 title,
//                 message,
//             });
//         } catch (error) {
//             console.error("Error sending notification:", error);
//         }
//     };

//     return (
//         <CCard>
//             <CCardHeader>
//                 <h4>Contact Us Information</h4>
//             </CCardHeader>
//             <CCardBody>
//                 {loading ? <CSpinner /> : (
//                     <CTable responsive striped hover>
//                         <CTableHead>
//                             <CTableRow>
//                                 <CTableHeaderCell>#</CTableHeaderCell>
//                                 <CTableHeaderCell>Name</CTableHeaderCell>
//                                 <CTableHeaderCell>Email</CTableHeaderCell>
//                                 <CTableHeaderCell>Message</CTableHeaderCell>
//                                 <CTableHeaderCell>Actions</CTableHeaderCell>
//                             </CTableRow>
//                         </CTableHead>
//                         <CTableBody>
//                             {contactData.map((contact, index) => (
//                                 <CTableRow key={contact._id}>
//                                     <CTableDataCell>{index + 1}</CTableDataCell>
//                                     <CTableDataCell>{contact.name}</CTableDataCell>
//                                     <CTableDataCell>{contact.email}</CTableDataCell>
//                                     <CTableDataCell>{contact.message}</CTableDataCell>
//                                     <CTableDataCell>
//                                         <CButton color="primary" size="sm" onClick={() => setSelectedContact(contact)}>Reply</CButton>
//                                     </CTableDataCell>
//                                 </CTableRow>
//                             ))}
//                         </CTableBody>
//                     </CTable>
//                 )}
//             </CCardBody>

//             {selectedContact && (
//                 <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
//                     <CModalHeader>Reply to {selectedContact.name}</CModalHeader>
//                     <CModalBody>
//                         <textarea
//                             className="form-control"
//                             rows="3"
//                             placeholder="Enter your reply..."
//                             value={selectedContact.replyMessage || ""}
//                             onChange={(e) => setSelectedContact({ ...selectedContact, replyMessage: e.target.value })}
//                         />
//                     </CModalBody>
//                     <CModalFooter>
//                         <CButton color="primary" onClick={() => handleSendReply(selectedContact)}>Send Reply</CButton>
//                         <CButton color="secondary" onClick={() => setModalVisible(false)}>Close</CButton>
//                     </CModalFooter>
//                 </CModal>
//             )}
//         </CCard>
//     );
// };

// export default ContactUsManagement;

