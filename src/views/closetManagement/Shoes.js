import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const Shoes = () => {
    const [shoesData, setShoesData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [userShoesData, setUserShoesData] = useState([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [shoesVisible, setShoesVisible] = useState(false);
    const [singleShoesData, setSingleShoesData] = useState([]);
    const [editShoesVisible, setEditShoesVisible] = useState(false);
    const [formData, setFormData] = useState({
        brand: '',
        color: '',
        typesOfCloths: '',
        season: '',
        purchaseDate: '',
        description: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);  // New state for file
    const category = "shoes"

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://44.196.64.110:3555/api/user`, {
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUserData(response.data.data);
            console.log("abc", response.data)
        } catch (error) {
            console.error('Not able to fetch cloth data', error);
        }
    }

    // const fetchData = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         const response = await axios.get(`http://localhost:3555/api/cloths/get-by-category/shoes`, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    //         setShoesData(response.data);
    //     } catch (error) {
    //         console.error('Failed to fetch shoes data', error);
    //     }
    // }

    const handleView = async (category, userId) => {
        try {
            const response = await axios.get(`http://localhost:3555/api/cloths/all-cloths/${category}/${userId}`)
            setUserShoesData(response.data.cloths);
            console.log(response.data.cloths)
            setVisibleModal(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchShoesData = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3555/api/cloths/getClothById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setShoesVisible(true);
            setSingleShoesData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch shoe details', error);
        }
    }

    const handleEditClick = (shoes) => {
        setEditShoesVisible(true);
        setFormData({
            id: shoes._id,
            brand: shoes.brand,
            color: shoes.color,
            typesOfCloths: shoes.typesOfCloths,
            season: shoes.season,
            purchaseDate: shoes.purchaseDate,
            description: shoes.description,
        });
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleFormSubmit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();

            // Append form data
            formDataToSend.append('brand', formData.brand);
            formDataToSend.append('color', formData.color);
            formDataToSend.append('typesOfCloths', formData.typesOfCloths);
            formDataToSend.append('season', formData.season);
            formDataToSend.append('purchaseDate', formData.purchaseDate);
            formDataToSend.append('description', formData.description);

            // Append file if selected
            if (selectedFile) {
                formDataToSend.append('picture', selectedFile);
            }

            await axios.put(`http://localhost:3555/api/cloths/update-cloths/${id}`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',  // Use multipart/form-data for file uploads
                },
            });

            setEditShoesVisible(false);
            fetchData();  // Refresh the list after editing
        } catch (error) {
            console.error('Failed to update shoe data', error);
        }
    }

    return (
        <div>
            <CTable responsive>
                <CTableHead color='primary'>
                    <CTableRow color='primary'>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{}}>Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{}}>Email</CTableHeaderCell>
                        {/* <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Age</CTableHeaderCell>
                                    <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell> */}
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {userData.map((user, index) => (
                        <CTableRow key={index}>
                            <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                            <CTableDataCell style={{}}>{user.firstName}</CTableDataCell>
                            <CTableDataCell style={{}}>{user.email}</CTableDataCell>
                            <CTableDataCell style={{ textAlign: 'center' }}>
                                <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', marginRight: '8px' }}
                                    title="View" onClick={() => handleView(category, user._id)}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* shoes from userId */}
            <CModal size='lg' visible={visibleModal} onClose={() => setVisibleModal(false)}>
                <CModalHeader onClose={() => setVisibleModal(false)}>
                    <CModalTitle>Cloth Details of User</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {userShoesData && userShoesData.length > 0 ? (
                        <CTable responsive>
                            <CTableHead color='primary'>
                                <CTableRow>
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Image</CTableHeaderCell>
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Brand</CTableHeaderCell>
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Type</CTableHeaderCell>
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Color</CTableHeaderCell>
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Season</CTableHeaderCell>
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Purchase Date</CTableHeaderCell>
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {userShoesData.map((shoes, index) => (
                                    <CTableRow key={index}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        <CTableDataCell style={{ textAlign: 'center' }}>
                                            {shoes.picture ? (
                                                <img src={shoes.picture} alt="shoe" width="50" height="50" />
                                            ) : (
                                                'No Image Available'
                                            )}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center' }}>{shoes.brand}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center' }}>{shoes.typesOfCloths}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center' }}>{shoes.color}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center' }}>{shoes.season}</CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center' }}>
                                            {shoes.purchaseDate
                                                ? new Date(shoes.purchaseDate).toLocaleDateString()
                                                : 'No Date Available'}
                                        </CTableDataCell>
                                        <CTableDataCell style={{ textAlign: 'center' }}>
                                            <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => fetchShoesData(shoes._id)}>
                                                <FontAwesomeIcon icon={faEye} color='blue' />
                                            </button>
                                            <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => handleEditClick(shoes)}>
                                                <FontAwesomeIcon icon={faEdit} color='green' />
                                            </button>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    ) : (
                        <p>No styles added</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleModal(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal size='lg' visible={shoesVisible} onClose={() => setShoesVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                        Shoes Details
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {singleShoesData && (
                        <CCard className="shadow-sm">
                            <CCardHeader className="bg-primary text-white">
                                <h5 style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {singleShoesData.brand}
                                </h5>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="align-items-center">
                                    <CCol xs="12" md="6" className="text-center">
                                        <img
                                            src={singleShoesData.picture}
                                            alt="Shoe"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '300px',
                                                objectFit: 'cover',
                                                borderRadius: '10px',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                                            }}
                                        />
                                    </CCol>
                                    <CCol xs="12" md="6">
                                        <div className="mt-3">
                                            <p><strong>Color:</strong> {singleShoesData.color}</p>
                                            <p><strong>Type:</strong> {singleShoesData.typesOfCloths}</p>
                                            <p><strong>Season:</strong> {singleShoesData.season}</p>
                                            <p><strong>Purchase Date:</strong> {new Date(singleShoesData.purchaseDate).toLocaleDateString()}</p>
                                            <p><strong>Description:</strong> {singleShoesData.description}</p>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                            <CCardFooter className="d-flex justify-content-end">
                                <CButton color="secondary" onClick={() => setShoesVisible(false)}>
                                    Close
                                </CButton>
                            </CCardFooter>
                        </CCard>
                    )}
                </CModalBody>
            </CModal>

            <CModal size="lg" visible={editShoesVisible} onClose={() => setEditShoesVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Edit Shoe</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow>
                            <CCol md="6">
                                <CFormLabel htmlFor="brand">Brand</CFormLabel>
                                <CFormInput id="brand" name="brand" value={formData.brand} onChange={handleFormChange} />
                            </CCol>
                            <CCol md="6">
                                <CFormLabel htmlFor="color">Color</CFormLabel>
                                <CFormInput id="color" name="color" value={formData.color} onChange={handleFormChange} />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormLabel htmlFor="typesOfCloths">Type</CFormLabel>
                                <CFormInput id="typesOfCloths" name="typesOfCloths" value={formData.typesOfCloths} onChange={handleFormChange} />
                            </CCol>
                            <CCol md="6">
                                <CFormLabel htmlFor="season">Season</CFormLabel>
                                <CFormInput id="season" name="season" value={formData.season} onChange={handleFormChange} />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormLabel htmlFor="purchaseDate">Purchase Date</CFormLabel>
                                <CFormInput type="date" id="purchaseDate" name="purchaseDate" value={formData.purchaseDate} onChange={handleFormChange} />
                            </CCol>
                            <CCol md="6">
                                <CFormLabel htmlFor="description">Description</CFormLabel>
                                <CFormInput id="description" name="description" value={formData.description} onChange={handleFormChange} />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormLabel htmlFor="image">Edit Image</CFormLabel>
                                <CFormInput
                                    id="image"
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}  // Capture file input
                                />
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setEditShoesVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={() => handleFormSubmit(formData.id)}>
                        Save Changes
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default Shoes;
