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
    CTooltip,
    CBadge,
    CSpinner
} from '@coreui/react';
import { FaLock, FaLockOpen, FaTrash, FaKey } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';
import { Lock, Unlock, Eye } from "lucide-react";
import axios from 'axios';
import ChatBox from '../../chatBox/chatBox'
import { database } from "../../firebase/firebaseConfig"; // Firebase config
import { ref, push, onValue } from "firebase/database";
import { toast } from 'react-toastify';

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
    const [chatHistory, setChatHistory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [chatPath, setChatPath] = useState();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const chatRef = ref(database, chatPath);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: '',
        location: '',
        experience: '',
        description: '',
        price: '',
        image: null,
        workHistory: [{ title: '', subtitle: '', workLocation: '', previous_experience: '', duration: '' }]
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
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://18.209.91.97:3555/api/stylist/get-all-stylist-admin`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            setStylist(response.data.stylists);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch stylists");
        } finally {
            setLoading(false);
        }
    }

    const openPasswordModal = (stylist) => {
        setSelectedStylist(stylist._id);
        setShowPasswordModal(true);
    };

    const addWorkHistory = () => {
        setFormData((prevData) => ({
            ...prevData,
            workHistory: [...prevData.workHistory, { title: '', subtitle: '', workLocation: '', previous_experience: '', duration: '' }],
        }));
    };

    const removeWorkHistory = (index) => {
        setFormData((prevData) => {
            const updatedHistory = prevData.workHistory.filter((_, i) => i !== index);
            return { ...prevData, workHistory: updatedHistory };
        });
    };

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
            setLoading(true);
            const imageUrl = await uploadImageToCloudinary(formData.image);
            const newStylist = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                specialization: formData.specialization,
                location: formData.location,
                experience: formData.experience,
                description: formData.description,
                price: formData.price,
                image: imageUrl,
                workHistory: formData.workHistory,
            };
            await axios.post('http://18.209.91.97:3555/api/stylist/add-stylist', newStylist);
            setVisible(false);
            resetFormData();
            fetchData();
            toast.success("Stylist added successfully");
        } catch (error) {
            setError('Error adding stylist');
            console.error('Error adding stylist:', error);
            toast.error("Failed to add stylist");
        } finally {
            setLoading(false);
        }
    };

    const handleEditStylist = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const imageUrl = formData.image ? await uploadImageToCloudinary(formData.image) : selectedStylist.image;
            const updatedStylist = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                specialization: formData.specialization,
                location: formData.location,
                experience: formData.experience,
                description: formData.description,
                price: formData.price,
                image: imageUrl,
                workHistory: formData.workHistory,
            };
            await axios.put(`http://18.209.91.97:3555/api/stylist/update/${selectedStylist._id}`, updatedStylist);
            setEditVisible(false);
            resetFormData();
            fetchData();
            toast.success("Stylist updated successfully");
        } catch (error) {
            setError('Error updating stylist');
            console.error('Error updating stylist:', error);
            toast.error("Failed to update stylist");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async () => {
        const errors = [];
        if (newPassword.length < 8) errors.push("at least 8 characters");
        if (!/[A-Z]/.test(newPassword)) errors.push("at least one uppercase letter");
        if (!/[a-z]/.test(newPassword)) errors.push("at least one lowercase letter");
        if (!/[0-9]/.test(newPassword)) errors.push("at least one number");
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) errors.push("at least one special character");

        if (errors.length > 0) {
            toast.error(`Password must contain: ${errors.join(", ")}`);
            return;
        }

        try {
            setLoading(true);
            // fetchStylistDetails(selectedStylist._id);
            const token = localStorage.getItem('token');
            await axios.put(
                `http://18.209.91.97:3555/api/stylist/update-stylist?id=${selectedStylist._id}`,
                { password: newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Password updated successfully");
            setShowPasswordModal(false);
            setNewPassword('');
            fetchData();
        } catch (err) {
            toast.error("Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            specialization: '',
            location: '',
            experience: '',
            description: '',
            price: '',
            image: null,
            workHistory: [{ title: '', subtitle: '', workLocation: '', previous_experience: '', duration: '' }],
        });
    };

    const handleCancel = () => {
        setEditVisible(false);
        setSelectedStylist(null);
        resetFormData();
    };

    const handleApprove = async (stylistId) => {
        try {
            setLoading(true);
            const response = await axios.post(`http://18.209.91.97:3555/api/stylist/approve/${stylistId}`)
            setStylist((prevStylists) =>
                prevStylists.map((stylist) =>
                    stylist._id === stylistId ? { ...stylist, approved: !stylist.approved } : stylist
                )
            );
            // console.log(response.data.data.approved, "response.data.stylist")
            toast.success(`Stylist ${response.data.data.approved ? "approved" : "disapproved"}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update approval status");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (event) => {
        const { id, value } = event.target;
        if (id === 'workHistory') {
            const updatedWorkHistory = [...formData.workHistory];
            updatedWorkHistory[event.target.dataset.index][event.target.name] = value;
            setFormData(prevState => ({
                ...prevState,
                workHistory: updatedWorkHistory,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [id]: value,
            }));
        }
    };

    const handleFileChange = (event) => {
        const { id, files } = event.target;
        if (files && files.length > 0) {
            setFormData(prevState => ({
                ...prevState,
                [id]: files[0]
            }));
        }
    };

    const uploadImageToCloudinary = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'blog_app');
            formData.append('cloud_name', 'dqhh1rff5');
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
        console.log(stylist);
        // fetchStylistDetails(stylist._id);
        setModalVisible(true);
    }

    const fetchStylistDetails = async (stylistId) => {
        if (!stylistId) return;
        
        setLoading(true);
        setError(null);
        console.log("reached here!")
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://18.209.91.97:3555/api/stylist/stylist-profile/${stylistId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            setStylistDetails(response.data.stylist);
        } catch (error) {
            setError(error.message);
            toast.error("Failed to fetch stylist details");
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (stylistId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this stylist?');
        if (!confirmDelete) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.delete(`http://18.209.91.97:3555/api/stylist/delete-stylist/${stylistId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            fetchData();
            toast.success("Stylist deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete stylist");
        } finally {
            setLoading(false);
        }
    }

    const handleChat = (stylistId) => {
        if (!messages[stylistId]) {
            setMessages((prev) => ({ ...prev, [stylistId]: "" }));
        }
    };

    const sendMessage = (e, stylistId) => {
        if (e.key === "Enter" && messages[stylistId].trim() !== "") {
            const chatRef = ref(database, `chats/${stylistId}`);
            push(chatRef, { message: messages[stylistId], timestamp: Date.now() });
            setMessages((prev) => ({ ...prev, [stylistId]: "" }));
        }
    };

    const fetchChatHistory = (stylistId) => {
        setLoading(true);
        setSelectedStylist(stylistId);
        const chatRef = ref(database, `chats/${stylistId}`);

        onValue(chatRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const chatArray = Object.values(data);
                setChatHistory(chatArray);
            } else {
                setChatHistory([]);
            }
            setLoading(false);
        });

        setIsModalOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h5 style={{ margin: 0 }}>Stylist Management</h5>
                <CButton color="primary" onClick={() => setVisible(true)}>Add Stylist</CButton>
            </div>
            
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <CSpinner color="primary" />
                    <span className="ms-2">Loading...</span>
                </div>
            ) : (
                <CTable responsive>
                    <CTableHead>
                        <CTableRow color='primary'>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Photo</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Phone No.</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Performance</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ paddingLeft: '1.5%' }}>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {stylist.map((stylist, index) => (
                            <CTableRow key={stylist._id}>
                                <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <img
                                        src={stylist.profilePicture}
                                        alt={'N/A'}
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
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
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    {stylist.approved ? (
                                        <span className="text-success">Unblocked</span>
                                    ) : (
                                        <span className="text-danger">Blocked</span>
                                    )}
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{stylist.phone}</CTableDataCell>
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
                                                style={{ transition: "0.3s ease-in-out" }}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <CSpinner size="sm" />
                                                ) : stylist.approved ? (
                                                    <Lock size={15} />
                                                ) : (
                                                    <Unlock size={15} />
                                                )}
                                            </CButton>
                                        </CTooltip>
                                        <CButton
                                            className="p-0"
                                            onClick={() => handleDelete(stylist._id)}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <CSpinner size="sm" />
                                            ) : (
                                                <FaTrash color="red" size={16} />
                                            )}
                                        </CButton>
                                        <CButton
                                            className="p-0 position-relative"
                                            onClick={() => openPasswordModal(stylist)}
                                            title="Change Password"
                                        >
                                            <FaKey color="blue" size={16} />
                                            {stylist?.passwordChangeRequested && (
                                                <span
                                                    className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                                                    style={{ width: '8px', height: '8px' }}
                                                ></span>
                                            )}
                                        </CButton>
                                    </div>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            )}

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
                            <CFormInput type="number" id="phone" label="Phone" value={formData.phone} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="specialization" label="Specialization" value={formData.specialization} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="location" label="Location" value={formData.location} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="number" id="experience" label="Experience (Years)" value={formData.experience} onChange={handleChange} onWheel={(e) => e.target.blur()}
                                min={0} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="description" label="Description" value={formData.description} onChange={handleChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="number" id="price" label="Price(in $)" value={formData.price} onChange={handleChange} onWheel={(e) => e.target.blur()}
                                min={0} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="file" id="image" label="Upload Image" onChange={handleFileChange} required/>
                        </CCol>

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
                            <CButton type="submit" color="primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <CSpinner size="sm" /> Saving...
                                    </>
                                ) : "Save"}
                            </CButton>
                            <CButton color="secondary" className="ms-1" onClick={() => { setVisible(false); resetFormData(); }}>
                                Cancel
                            </CButton>
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
                            <CButton type="submit" color="primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <CSpinner size="sm" /> Updating...
                                    </>
                                ) : "Update"}
                            </CButton>
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

            {modalVisible && (
                <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Stylist Details</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {loading ? (
                            <div className="d-flex justify-content-center">
                                <CSpinner />
                            </div>
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
                                        <li key={index}>
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
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <CSpinner />
                        </div>
                    ) : chatHistory.length > 0 ? (
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

            <CModal visible={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Change Password</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormInput
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {newPassword && (
                        <div className="mt-2">
                            <small>Password must contain:</small>
                            <ul className="list-unstyled">
                                <li className={newPassword.length >= 8 ? "text-success" : "text-danger"}>
                                    {newPassword.length >= 8 ? "✓" : "✗"} At least 8 characters
                                </li>
                                <li className={/[A-Z]/.test(newPassword) ? "text-success" : "text-danger"}>
                                    {/[A-Z]/.test(newPassword) ? "✓" : "✗"} One uppercase letter
                                </li>
                                <li className={/[!@#$%^&*]/.test(newPassword) ? "text-success" : "text-danger"}>
                                    {/[!@#$%^&*]/.test(newPassword) ? "✓" : "✗"} One special character
                                </li>
                            </ul>
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowPasswordModal(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={handlePasswordChange} disabled={loading}>
                        {loading ? (
                            <>
                                <CSpinner size="sm" /> Updating...
                            </>
                        ) : "Update Password"}
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default StylistManagement