import React, { useState, useEffect } from "react";
import {
    CTableDataCell,
    CButton,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CTooltip
} from "@coreui/react";
import { FaTrash, FaCommentDots } from "react-icons/fa";
import { Lock, Unlock } from "lucide-react";
import { database } from "../firebase/firebaseConfig"; // Firebase config
import { ref, push, onValue } from "firebase/database";

const ChatBox = ({ stylist }) => {
    const [chatVisible, setChatVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // const chatRef = ref(database, `chats/${stylist._id}`); // Firebase path for this stylist
    const chatPath = stylist?._id ? `chats/${stylist._id}` : "chats/tempChat";
    const chatRef = ref(database, chatPath); // Firebase path for this stylist or a default chat

    // Fetch messages from Firebase
    useEffect(() => {
        const unsubscribe = onValue(chatRef, (snapshot) => {
            if (snapshot.exists()) {
                setMessages(Object.values(snapshot.val()));
            } else {
                setMessages([]);
            }
        });

        return () => unsubscribe();
    }, [chatRef]);

    // Send a message
    const sendMessage = (e) => {
        if (e.key === "Enter" && newMessage.trim()) {
            push(chatRef, {
                message: newMessage,
                sender: "Admin",
                timestamp: Date.now()
            });
            setNewMessage("");
        }
    };

    return (
        <CTableDataCell>
            {/* Approve / Disapprove Button */}
            {/* <CTooltip content={stylist.approved ? "Disapprove" : "Approve"}>
                <CButton onClick={() => handleApprove(stylist._id)} style={{ transition: "0.3s ease-in-out" }}>
                    {stylist.approved ? <Lock size={20} /> : <Unlock size={20} />}
                </CButton>
            </CTooltip> */}

            {/* Delete Button */}
            {/* <CButton onClick={() => handleDelete(stylist._id)}>
                <FaTrash color="red" size={16} />
            </CButton> */}

            {/* Chat Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Other icons here */}
                <CButton style={{ padding: "5px", minWidth: "auto" }} 
                                        className="p-0"
                                        onClick={() => setChatVisible(true)}>
                    <FaCommentDots color="blue" size={16} />
                </CButton>
            </div>

            {/* Chat Modal */}
            <CModal visible={chatVisible} onClose={() => setChatVisible(false)}>
                <CModalHeader>Chat with Stylist</CModalHeader>
                <CModalBody style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <strong>{msg.sender}: </strong> {msg.message}
                            </div>
                        ))
                    ) : (
                        <p>No messages yet.</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={sendMessage} // Sends message on "Enter" key press
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <CButton color="primary" onClick={sendMessage}>
                        Send
                    </CButton>
                </CModalFooter>
            </CModal>
        </CTableDataCell>
    );
};

export default ChatBox;
