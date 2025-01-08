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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';
import axios from 'axios';

const StylistManagement = () => {

    const [stylist, setStylist] = useState([]);
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState();
    const [error, setError] = useState();
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
        workHistory: [{ title: '', subtitle: '', workLocation: '', duration: '' }] // Adding work history as an array of objects
    });


    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://44.196.64.110:3555/api/stylist/get-stylist`,
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
            workHistory: [...prevData.workHistory, { title: '', subtitle: '', workLocation: '', duration: '' }],
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
            await axios.post('http://44.196.64.110:3555/api/stylist/add-stylist', newStylist);
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
            await axios.put(`http://44.196.64.110:3129/api/stylist/update/${selectedStylist._id}`, updatedStylist);
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
            workHistory: [{ title: '', subtitle: '', workLocation: '', duration: '' }],
        });
    };

    const handleCancel = () => {
        setEditVisible(false);
        setSelectedStylist(null);  // Clear selected stylist data
        resetFormData();  // Reset the form data to its initial state
    };




    const handleApprove = async (stylistId) => {
        try {
            const response = await axios.post(`http://44.196.64.110:3555/api/stylist/approve/${stylistId}`)
            alert(response.data.message); // Display success message
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

    return (
        <div>
            <CButton color="primary" onClick={() => setVisible(true)}>Add Stylist</CButton>
            <CTable responsive>
                <CTableHead>
                    <CTableRow color='primary'>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Photo</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Email</CTableHeaderCell> */}
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Phone No.</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Communicate</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Performance</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
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

                                <CTableDataCell style={{ textAlign: 'center' }}>{stylist.name}</CTableDataCell>
                                {/* <CTableDataCell style={{ textAlign: 'center' }}>{stylist.email}</CTableDataCell> */}
                                <CTableDataCell>
                                    {stylist.approved ? (
                                        <span className="text-success">Approved</span>
                                    ) : (
                                        <span className="text-danger">Not Approved</span>
                                    )}
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{stylist.phone}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        style={{
                                            width: '80%',
                                            padding: '0.5rem',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <span key={index} style={{ color: index < stylist.ratings ? 'gold' : 'lightgray', fontSize: '24px' }}>
                                            {index < stylist.ratings ? '★' : '☆'}
                                        </span>
                                    ))}
                                </CTableDataCell>
                                <CTableDataCell>
                                    <CTooltip content={stylist.approved ? "Disapprove" : "Approve"}>
                                        <CButton
                                            // color={stylist.approved ? "danger" : "success"}
                                            onClick={() => handleApprove(stylist._id)}
                                        >
                                            {stylist.approved ? "❌" : "✅"}
                                        </CButton>
                                    </CTooltip>
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
                            <CFormInput type="number" id="experience" label="Experience (Years)" value={formData.experience} onChange={handleChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="description" label="Description" value={formData.description} onChange={handleChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="price" label="Price" value={formData.price} onChange={handleChange} required />
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

        </div>
    )
}

export default StylistManagement
