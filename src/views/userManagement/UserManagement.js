import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {
    CButton,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const UserManagement = () => {

    const [userData, setUserData] = useState([]);
    const [singleUser, setSingleUSer] = useState();
    const [userId, setUserId] = useState();
    const [visibleModel, setVisibleModel] = useState(false);
    const [visibleEditModel, setVisibleEditModel] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No token found. Please log in.');
            }
            const response = await axios.get(`http://localhost:3000/api/user/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleView = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/user/get/${id}`)
            setSingleUSer(response.data.data);
            setVisibleModel(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleEdit = async () => {
        try {
            const token = localStorage.getItem('token');

            await axios.put(`http://localhost:3000/api/user/update-user/${userId}`, editedUser, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchData();
            setEditedUser({});
            setVisibleEditModel(false);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleDelete = async (id, userName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete user: ${userName}?`);

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/user/delete/${id}`);
                toast.success(`${userName} has been deleted successfully.`);
                fetchData();
            } catch (error) {
                console.error('Error Deleting user:', error);
                toast.error('There was an error deleting the user. Please try again.');
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const token = localStorage.getItem('token');

            const response = await axios.put(
                `http://localhost:3000/api/user/update-status/${id}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            const data = response.data.data.status;
            fetchData();
            toast.success(`Status changed to ${data} successfully.`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to change status.');
        }
    };


    return (
        <>
            <CTable>
                <CTableHead>
                    <CTableRow color='primary'>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Age</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        userData.map((user, index) => (
                            <CTableRow key={user.id}>
                                <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{user.firstName}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{user.email}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{user.age}</CTableDataCell>
                                <CTableDataCell>
                                    <div className="form-check form-switch" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id={`flexSwitchCheckChecked-${user._id}`}
                                            checked={user.status === 'activated'}
                                            onChange={() => handleToggleStatus(user._id)}
                                            style={{
                                                backgroundColor: user.status === 'activated' ? 'green' : ''
                                            }}
                                        />
                                    </div>
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', marginRight: '8px' }}
                                        title="View" onClick={() => handleView(user._id)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>

                                    <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', marginRight: '8px' }}
                                        title="Edit" onClick={() => { setUserId(user._id), setVisibleEditModel(true); }}>
                                        <FontAwesomeIcon icon={faEdit} style={{ color: 'blue' }} />
                                    </button>

                                    <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0' }}
                                        title="Delete" onClick={() => handleDelete(user._id, user.firstName)}>
                                        <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} />
                                    </button>
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    }
                </CTableBody>
            </CTable>

            <CModal size='lg' visible={visibleModel} onClose={() => setVisibleModel(false)}>
                <CModalHeader onClose={() => setVisibleModel(false)}>
                    <CModalTitle>User Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {singleUser ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            {/* Left Column */}
                            <div style={{ flex: '1 1 45%', minWidth: '250px' }}>
                                <p><strong>Name:</strong> {singleUser.firstName}</p>
                                <p><strong>Username:</strong> {singleUser.username}</p>
                                <p><strong>Email:</strong> {singleUser.email}</p>
                                <p><strong>Age:</strong> {singleUser.age}</p>
                                <p><strong>Role:</strong> {singleUser.role}</p>
                                <p><strong>Bio:</strong> {singleUser.bio}</p>
                            </div>

                            {/* Right Column */}
                            <div style={{ flex: '1 1 45%', minWidth: '250px' }}>
                                <p><strong>Body Size:</strong> {singleUser.bodySize}</p>
                                <p><strong>Chest:</strong> {singleUser.chest}</p>
                                <p><strong>Eye Color:</strong> {singleUser.eyeColor}</p>
                                <p><strong>Gender:</strong> {singleUser.gender}</p>
                                <p><strong>Hair Color:</strong> {singleUser.hairColor}</p>
                                <p><strong>Height:</strong> {singleUser.height} cm</p>
                                <p><strong>High Hips:</strong> {singleUser.highHips} cm</p>
                            </div>

                            {/* Additional Details */}
                            <div style={{ flex: '1 1 45%', minWidth: '250px' }}>
                                <p><strong>Hips:</strong> {singleUser.hips} cm</p>
                                <p><strong>Marital Status:</strong> {singleUser.maritalStatus}</p>
                                <p><strong>Mobile Number:</strong> {singleUser.mobileNumber}</p>
                                <p><strong>Shoes:</strong> {singleUser.shoes}</p>
                                <p><strong>Shoulders:</strong> {singleUser.shoulders} cm</p>
                            </div>
                            <div style={{ flex: '1 1 45%', minWidth: '250px' }}>
                                <p><strong>Waist:</strong> {singleUser.waist} cm</p>
                                <p><strong>Weight:</strong> {singleUser.weight} kg</p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleModel(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>


            <CModal size='lg' visible={visibleEditModel} onClose={() => setVisibleEditModel(false)}>
                <CModalHeader onClose={() => setVisibleEditModel(false)}>
                    <CModalTitle>Edit User</CModalTitle>
                </CModalHeader>
                <CModalBody style={{ display: 'flex', flexDirection: 'column' }}>
                    {editedUser ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {/* Left Column */}
                            <div style={{ flex: '1 1 45%', marginRight: '8%' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Bio:</label>
                                    <input
                                        type="text"
                                        name="bio"
                                        value={editedUser.bio || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Age:</label>
                                    <input
                                        type="text"
                                        name="age"
                                        value={editedUser.age || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Height:</label>
                                    <input
                                        type="text"
                                        name="height"
                                        value={editedUser.height || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Weight:</label>
                                    <input
                                        type="text"
                                        name="weight"
                                        value={editedUser.weight || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Shoes:</label>
                                    <input
                                        type="text"
                                        name="shoes"
                                        value={editedUser.shoes || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Shoulders:</label>
                                    <input
                                        type="text"
                                        name="shoulders"
                                        value={editedUser.shoulders || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Mobile Number:</label>
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        value={editedUser.mobileNumber || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Gender:</label>
                                    <input
                                        type="text"
                                        name="gender"
                                        value={editedUser.gender || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div style={{ flex: '1 1 45%' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Body Size:</label>
                                    <input
                                        type="text"
                                        name="bodySize"
                                        value={editedUser.bodySize || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Chest:</label>
                                    <input
                                        type="text"
                                        name="chest"
                                        value={editedUser.chest || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Waist:</label>
                                    <input
                                        type="text"
                                        name="waist"
                                        value={editedUser.waist || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Hips:</label>
                                    <input
                                        type="text"
                                        name="hips"
                                        value={editedUser.hips || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>High Hips:</label>
                                    <input
                                        type="text"
                                        name="highHips"
                                        value={editedUser.highHips || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Eye Color:</label>
                                    <input
                                        type="text"
                                        name="eyeColor"
                                        value={editedUser.eyeColor || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Hair Color:</label>
                                    <input
                                        type="text"
                                        name="hairColor"
                                        value={editedUser.hairColor || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ fontWeight: 'bold' }}>Marital Status:</label>
                                    <input
                                        type="text"
                                        name="maritalStatus"
                                        value={editedUser.maritalStatus || ''}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => handleEdit()}>
                        Update
                    </CButton>
                    <CButton color="secondary" onClick={() => setVisibleEditModel(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <ToastContainer />
        </>
    );
}

export default UserManagement;
