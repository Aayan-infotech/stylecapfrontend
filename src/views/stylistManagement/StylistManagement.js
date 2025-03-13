import { React, useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardText,
    CCardTitle,
    CCol,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CForm,
    CFormInput,
    CFormTextarea,
    CTooltip
} from '@coreui/react';
import { FaLock, FaLockOpen, FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';
import { Lock, Unlock, Eye } from "lucide-react";
import axios from 'axios';
import ChatBox from '../../chatBox/chatBox'
import { database } from "../../firebase/firebaseConfig"; // Firebase config
import { ref, push, onValue } from "firebase/database";

const StylistManagement = () => {

    const adminId = "ADMIN"
    const [stylist, setStylist] = useState([]);
    const [selectedStylist, setSelectedStylist] = useState();
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState();
    const [error, setError] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [stylistDetails, setStylistDetails] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [chatHistory, setChatHistory] = useState([]); // Stores fetched messages
    const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatPath, setChatPath] = useState();
    const chatRef = ref(database, chatPath); // Firebase path for this stylist or a default chat
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: '',
        experience: '',
        description: '',
        price: '',
        image: null,
        workHistory: [{ title: '', subtitle: '', workLocation: '', previous_experience: '', duration: '' }] // Adding work history as an array of objects
    });


    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (selectedStylist) {
            fetchStylistDetails(selectedStylist);
        }
    }, [selectedStylist])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://54.236.98.193:3555/api/stylist/get-all-stylist-admin`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            setStylist(response.data.stylists);
            // console.log(response.data.stylists);
        } catch (error) {
            console.error(error);
        }
    }

    // Add a new empty work history field
    const addWorkHistory = () => {
        setFormData((prevData) => ({
            ...prevData,
            workHistory: [...prevData.workHistory, { title: '', subtitle: '', workLocation: '', previous_experience: '', duration: '' }],
        }));
    };

    // Remove a work history field by index
    const removeWorkHistory = (index) => {
        setFormData((prevData) => {
            const updatedHistory = prevData.workHistory.filter((_, i) => i !== index);
            return { ...prevData, workHistory: updatedHistory };
        });
    };

    // Handle changes in work history inputs
    const handleWorkHistoryChange = (index, field, value) => {
        const updatedWorkHistory = [...formData.workHistory];
        updatedWorkHistory[index][field] = value;
        setFormData((prevData) => ({
            ...prevData,
            workHistory: updatedWorkHistory
        }));
    };

    const handleAddStylist = async (event) => {
        event.preventDefault();
        try {
            console.log("Image Data:", formData.image); // Debug image data before uploading

            const imageUrl = await uploadImageToCloudinary(formData.image);
            const newStylist = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                specialization: formData.specialization,
                experience: formData.experience,
                description: formData.description,
                price: formData.price,
                image: imageUrl,
                workHistory: formData.workHistory, // Include work history
            };
            await axios.post('http://54.236.98.193:3555/api/stylist/add-stylist', newStylist);
            setVisible(false);
            resetFormData();
            fetchData(); // Re-fetch after adding a stylist
        } catch (error) {
            setError('Error adding stylist');
            console.error('Error adding stylist:', error);
        }
    };


    const handleEditStylist = async (event) => {
        event.preventDefault();
        try {
            const imageUrl = formData.image ? await uploadImageToCloudinary(formData.image) : selectedStylist.image;
            const updatedStylist = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                specialization: formData.specialization,
                experience: formData.experience,
                description: formData.description,
                price: formData.price,
                image: imageUrl,
                workHistory: formData.workHistory, // Include work history
            };
            await axios.put(`http://54.236.98.193:3129/api/stylist/update/${selectedStylist._id}`, updatedStylist);
            setEditVisible(false);
            resetFormData();
            fetchData(); // Re-fetch after updating
        } catch (error) {
            setError('Error updating stylist');
            console.error('Error updating stylist:', error);
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            specialization: '',
            experience: '',
            description: '',
            price: '',
            image: null,
            workHistory: [{ title: '', subtitle: '', workLocation: '', previous_experience: '', duration: '' }],
        });
    };

    const handleCancel = () => {
        setEditVisible(false);
        setSelectedStylist(null);  // Clear selected stylist data
        resetFormData();  // Reset the form data to its initial state
    };




    const handleApprove = async (stylistId) => {
        try {
            const response = await axios.post(`http://54.236.98.193:3555/api/stylist/approve/${stylistId}`)
            // alert(response.data.message); // Display success message
            setStylist((prevStylists) =>
                prevStylists.map((stylist) =>
                    stylist._id === stylistId ? { ...stylist, approved: !stylist.approved } : stylist
                )
            );
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleChange = (event) => {
        const { id, value } = event.target;

        if (id === 'workHistory') {
            // If editing workHistory, make sure it's an array of objects
            const updatedWorkHistory = [...formData.workHistory];
            updatedWorkHistory[event.target.dataset.index][event.target.name] = value;
            setFormData(prevState => ({
                ...prevState,
                workHistory: updatedWorkHistory,
            }));
        } else {
            // For other form fields, just update the value
            setFormData(prevState => ({
                ...prevState,
                [id]: value,
            }));
        }
    };

    const handleFileChange = (event) => {
        const { id, files } = event.target;

        // Check if files are selected
        if (files && files.length > 0) {
            // For file input fields (e.g., image upload)
            const file = files[0];

            console.log("Selected File:", file); // Debug the file data

            // Update the formData with the selected file
            setFormData(prevState => ({
                ...prevState,
                [id]: file // For example, formData.image will be updated with the selected file
            }));
        }
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'blog_app');
        formData.append('cloud_name', 'dqhh1rff5');
        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/dqhh1rff5/image/upload`, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new Error('Error uploading image to Cloudinary');
        }
    };

    const handleOpenModal = (stylist) => {
        if (stylist?._id) {
            setSelectedStylist(stylist._id);
        }
        setModalVisible(true);
    }

    const fetchStylistDetails = async (stylistId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://54.236.98.193:3555/api/stylist/stylist-profile/${stylistId}`,
                {

                    headers: {
                        // 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            setStylistDetails(response.data.stylist);
        }
        catch (error) {
            setError(error.message)
        }
        finally {
            setLoading(false);
        }
    }

    // delete stylist
    const handleDelete = async (stylistId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this stylist?');
        const token = localStorage.getItem('token')
        try {
            if (confirmDelete) {
                await axios.delete(`http://54.236.98.193:3555/api/stylist/delete-stylist/${stylistId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            }
            fetchData();
        }
        catch (error) {
            console.error(error);
        }
    }


    const handleChat = (stylistId) => {
        if (!messages[stylistId]) {
            setMessages((prev) => ({ ...prev, [stylistId]: "" })); // Initialize empty chat if not present
        }
    };

    const sendMessage = (e, stylistId) => {
        if (e.key === "Enter" && messages[stylistId].trim() !== "") {
            console.log("Sending message:", messages[stylistId]);

            // Send to Firebase Realtime Database
            const chatRef = ref(database, `chats/${stylistId}`);
            push(chatRef, { message: messages[stylistId], timestamp: Date.now() });

            // Clear input after sending
            setMessages((prev) => ({ ...prev, [stylistId]: "" }));
        }
    };

    const fetchChatHistory = (stylistId) => {
        setSelectedStylist(stylistId);
        const chatRef = ref(database, `chats/${stylistId}`);

        onValue(chatRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const chatArray = Object.values(data);
                setChatHistory(chatArray);
            } else {
                setChatHistory([]); // Empty if no messages
            }
        });

        setIsModalOpen(true);
    };



    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h5 style={{ margin: 0 }}>Stylist Management</h5>
                <CButton color="primary" onClick={() => setVisible(true)}>Add Stylist</CButton>
            </div>
            <CTable responsive>
                <CTableHead>
                    <CTableRow color='primary'>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Photo</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Email</CTableHeaderCell> */}
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Phone No.</CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Communicate</CTableHeaderCell> */}
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Performance</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ paddingLeft: '1.5%' }}>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        stylist.map((stylist, index) => (
                            <CTableRow key={stylist._id}>
                                <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <img
                                        src={stylist.profilePicture} // Ensure this is the correct path to the image
                                        alt={'N/A'} // Provide an alt text for accessibility
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }} // Adjust size and shape as needed
                                    />
                                </CTableDataCell>

                                <CTableDataCell
                                    style={{
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        color: 'black',
                                        transition: 'color 0.3s ease-in-out'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = 'blue';
                                        e.target.style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = 'black';
                                        e.target.style.textDecoration = 'none';
                                    }}
                                    onClick={() => handleOpenModal(stylist)}
                                >
                                    {stylist.name}
                                </CTableDataCell>

                                {/* <CTableDataCell style={{ textAlign: 'center' }}>{stylist.email}</CTableDataCell> */}
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    {stylist.approved ? (
                                        <span className="text-success">Unblocked</span>
                                    ) : (
                                        <span className="text-danger">Blocked</span>
                                    )}
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{stylist.phone}</CTableDataCell>
                                {/* <CTableDataCell style={{ textAlign: 'center' }}>
                                    <input
                                        type="text"
                                        value={messages[stylist._id] || ""} // Use separate state for each stylist
                                        onChange={(e) =>
                                            setMessages((prev) => ({ ...prev, [stylist._id]: e.target.value }))
                                        }
                                        onKeyPress={(e) => sendMessage(e, stylist._id)} // Pass stylist ID to sendMessage
                                        placeholder="Type a message..."
                                        onClick={() => handleChat(stylist._id)} // Ensure chat initializes
                                        style={{
                                            width: '80%',
                                            padding: '0.5rem',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <CButton
                                        className="p-0"
                                        onClick={() => fetchChatHistory(stylist._id)}
                                    >
                                        <Eye size={15} />
                                    </CButton>
                                </CTableDataCell> */}

                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <span key={index} style={{ color: index < stylist.ratings ? 'gold' : 'lightgray', fontSize: '24px' }}>
                                            {index < stylist.ratings ? '★' : '☆'}
                                        </span>
                                    ))}
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>

                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <CTooltip content={stylist.approved ? "Disapprove" : "Approve"}>
                                            <CButton
                                                className="p-0"
                                                onClick={() => handleApprove(stylist._id)}
                                                style={{ transition: "0.3s ease-in-out" }} // Smooth transition
                                            >
                                                {stylist.approved ? <Lock size={15} /> : <Unlock size={15} />}
                                            </CButton>
                                        </CTooltip>
                                        <CButton
                                            className="p-0"
                                            onClick={() => handleDelete(stylist._id)}>
                                            <FaTrash color="red" size={16} />
                                        </CButton>
                                        <ChatBox
                                            stylist={stylist._id} />
                                    </div>
                                </CTableDataCell>

                            </CTableRow>
                        ))
                    }
                </CTableBody>
            </CTable>

            <CModal visible={visible} onClose={() => { setVisible(false); resetFormData(); }}>
                <CModalHeader closeButton>
                    <CModalTitle>Add Stylist</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleAddStylist}>
                        <CCol md={6}>
                            <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="email" id="email" label="Email" value={formData.email} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="password" id="password" label="Password" value={formData.password} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="tel" id="phone" label="Phone" value={formData.phone} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="specialization" label="Specialization" value={formData.specialization} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="number" id="experience" label="Experience (Years)" value={formData.experience} onChange={handleChange} onWheel={(e) => e.target.blur()}
                                min={0} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="description" label="Description" value={formData.description} onChange={handleChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="number" id="price" label="Price" value={formData.price} onChange={handleChange} onWheel={(e) => e.target.blur()} 
                                min={0} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="file" id="image" label="Upload Image" onChange={handleFileChange} />
                        </CCol>

                        {/* Work History */}
                        <CCol md={12}>
                            <label>Work History</label>
                            {formData.workHistory.map((history, index) => (
                                <div key={index} className="mb-3">
                                    <CFormInput
                                        type="text"
                                        id={`title-${index}`}
                                        label="Title"
                                        value={history.title}
                                        onChange={(e) => handleWorkHistoryChange(index, 'title', e.target.value)}
                                    />
                                    <CFormInput
                                        type="text"
                                        id={`subtitle-${index}`}
                                        label="Subtitle"
                                        value={history.subtitle}
                                        onChange={(e) => handleWorkHistoryChange(index, 'subtitle', e.target.value)}
                                    />
                                    <CFormInput
                                        type="text"
                                        id={`workLocation-${index}`}
                                        label="Work Location"
                                        value={history.workLocation}
                                        onChange={(e) => handleWorkHistoryChange(index, 'workLocation', e.target.value)}
                                    />
                                    <CFormInput
                                        type="text"
                                        id={`previous_experience-${index}`}
                                        label="Previous Experience Description"
                                        value={history.previous_experience}
                                        onChange={(e) => handleWorkHistoryChange(index, 'previous_experience', e.target.value)}
                                    />
                                    <CFormInput
                                        type="text"
                                        id={`duration-${index}`}
                                        label="Duration"
                                        value={history.duration}
                                        onChange={(e) => handleWorkHistoryChange(index, 'duration', e.target.value)}
                                    />
                                    <CButton color="danger" onClick={() => removeWorkHistory(index)}>Remove Work History</CButton>
                                </div>
                            ))}
                            <CButton color="primary" onClick={addWorkHistory}>Add Work History</CButton>
                        </CCol>

                        <CCol xs="auto">
                            <CButton type="submit" color="primary">Save</CButton>
                            <CButton color="secondary" className="ms-1" onClick={() => { setVisible(false); resetFormData(); }}>Cancel</CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
            </CModal>


            <CModal visible={editVisible} onClose={() => { setEditVisible(false); resetFormData(); }}>
                <CModalHeader closeButton>
                    <CModalTitle>Edit Stylist</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleEditStylist}>
                        <CCol md={6}>
                            <CFormInput
                                type="text"
                                id="name"
                                label="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                type="email"
                                id="email"
                                label="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                type="text"
                                id="phone"
                                label="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                type="text"
                                id="experience"
                                label="Experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                type="text"
                                id="specialization"
                                label="Specialization"
                                value={formData.specialization}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                type="text"
                                id="location"
                                label="Location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput
                                type="file"
                                id="profilePicture"
                                label="Upload Profile Picture"
                                onChange={handleFileChange}
                            />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput
                                type="text"
                                id="availability"
                                label="Availability"
                                value={formData.availability}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={12}>
                            <CFormTextarea
                                id="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput
                                type="number"
                                id="ratings"
                                label="Ratings"
                                value={formData.ratings}
                                onChange={handleChange}
                                required
                            />
                        </CCol>
                        <CCol xs="auto">
                            <CButton type="submit" color="primary">Update</CButton>
                            <CButton
                                color="secondary"
                                className="ms-1"
                                onClick={() => { setEditVisible(false); resetFormData(); }}
                            >
                                Cancel
                            </CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
            </CModal>

            {/* Modal for stylist details */}
            {modalVisible && (
                <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Stylist Details</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : stylistDetails ? (
                            <div>
                                <img src={stylistDetails.profilePicture} alt={stylistDetails.name} width="150px" style={{ display: 'block', margin: '0 auto' }} />
                                <p><strong>Name:</strong> {stylistDetails.name}</p>
                                <p><strong>Email:</strong> {stylistDetails.email}</p>
                                <p><strong>Description:</strong> {stylistDetails.description} </p>
                                <p><strong>Specialization:</strong> {stylistDetails.specialization.join(", ")} </p>
                                <p><strong>Location:</strong> {stylistDetails.location} </p>
                                <p><strong>Work History:</strong></p>
                                <ul>
                                    {stylistDetails.workHistory.map((history, index) => (
                                        <li>
                                            <strong>{history.title}</strong> -{history.subtitle} ({history.duration})
                                            <br />
                                            <span>{history.previous_experience}</span>
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        ) : (
                            <p>No details available</p>
                        )}
                    </CModalBody>
                </CModal>
            )}

            <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Chat with Stylist</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {chatHistory.length > 0 ? (
                        chatHistory.map((msg, index) => (
                            <p key={index} style={{ padding: "5px", background: "#f5f5f5", borderRadius: "5px" }}>
                                {msg.message}
                            </p>
                        ))
                    ) : (
                        <p>No messages yet.</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setIsModalOpen(false)}>Close</CButton>
                </CModalFooter>
            </CModal>

        </div>
    )
}

export default StylistManagement
