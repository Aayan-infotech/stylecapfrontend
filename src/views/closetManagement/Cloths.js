import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const cloths = () => {

    const [clothData, setClothData] = useState([]);
    const [singleClothsData, setSingleClothsData] = useState([]);
    const [clothVisible, setClothVisible] = useState(false);
    const [editClothsVisible, setEditClothsVisible] = useState(false);
    const [formData, setFormData] = useState([]);
    const [selectedFile, setSelectedFile] = useState();

    useEffect(() => {
        fetchData();
    },[])


    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://44.196.64.110:3555/api/cloths/get-by-category/cloths`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setClothData(response.data);
        } catch (error) {
            console.error('Not able to fetch cloth data', error);
        }
    }

    const fetchClothData = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://44.196.64.110:3555/api/cloths/getClothById/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setClothVisible(true);
            setSingleClothsData(response.data);
        } catch (error) {
            console.error('Failed to fetch shoe details', error);
        }
    }

    const handleEditClick = async (cloths) => {
        setEditClothsVisible(true);
        setFormData({
            id: cloths._id,
            brand: cloths.brand,
            color: cloths.color,
            typesOfCloths: cloths.typesOfCloths,
            season: cloths.season,
            purchaseDate: cloths.purchaseDate,
            description: cloths.description,
        })
    }

    const handleFormChange = async (e) => {
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

            await axios.put(`http://44.196.64.110:3555/api/cloths/update-cloths/${id}`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',  // Use multipart/form-data for file uploads
                },
            });

            setEditClothsVisible(false);
            fetchData();  // Refresh the list after editing
        } catch (error) {
            console.error('Failed to update shoe data', error);
        }
    }



    return (
        <div>
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
                    {clothData.map((cloths, index) => (
                        <CTableRow key={index}>
                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                            <CTableDataCell style={{ textAlign: 'center' }}>
                                {cloths.picture ? (
                                    <img src={cloths.picture} alt="shoe" width="50" height="50" />
                                ) : (
                                    'No Image Available'
                                )}
                            </CTableDataCell>
                            <CTableDataCell style={{ textAlign: 'center' }}>{cloths.brand}</CTableDataCell>
                            <CTableDataCell style={{ textAlign: 'center' }}>{cloths.typesOfCloths}</CTableDataCell>
                            <CTableDataCell style={{ textAlign: 'center' }}>{cloths.color}</CTableDataCell>
                            <CTableDataCell style={{ textAlign: 'center' }}>{cloths.season}</CTableDataCell>
                            <CTableDataCell style={{ textAlign: 'center' }}>
                                {cloths.purchaseDate
                                    ? new Date(cloths.purchaseDate).toLocaleDateString()
                                    : 'No Date Available'}
                            </CTableDataCell>
                            <CTableDataCell style={{ textAlign: 'center' }}>
                                <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => fetchClothData(cloths._id)}>
                                    <FontAwesomeIcon icon={faEye} color='blue' />
                                </button>
                                <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => handleEditClick(cloths)}>
                                    <FontAwesomeIcon icon={faEdit} color='green' />
                                </button>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            <CModal size='lg' visible={clothVisible} onClose={() => setClothVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                        Cloths Details
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {singleClothsData && (
                        <CCard className="shadow-sm">
                            <CCardHeader className="bg-primary text-white">
                                <h5 style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {singleClothsData.brand}
                                </h5>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="align-items-center">
                                    <CCol xs="12" md="6" className="text-center">
                                        <img
                                            src={singleClothsData.picture}
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
                                            <p><strong>Color:</strong> {singleClothsData.color}</p>
                                            <p><strong>Type:</strong> {singleClothsData.typesOfCloths}</p>
                                            <p><strong>Season:</strong> {singleClothsData.season}</p>
                                            <p><strong>Purchase Date:</strong> {new Date(singleClothsData.purchaseDate).toLocaleDateString()}</p>
                                            <p><strong>Description:</strong> {singleClothsData.description}</p>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                            <CCardFooter className="d-flex justify-content-end">
                                <CButton color="secondary" onClick={() => setClothVisible(false)}>
                                    Close
                                </CButton>
                            </CCardFooter>
                        </CCard>
                    )}
                </CModalBody>
            </CModal>

            <CModal visible={editClothsVisible} onClose={()=>{setEditClothsVisible(false)}}>
                <CModalHeader>
                    <CModalTitle>
                        Edit Cloths
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow>
                            <CCol md='6'>
                                <CFormLabel htmlFor='brand'>Brand</CFormLabel>
                                <CFormInput id='brand' name='brand' value={formData.brand} onChange={handleFormChange} />
                            </CCol>
                            <CCol>
                                <CFormLabel htmlFor='purchaseDate'>Purchase Date</CFormLabel>
                                <CFormInput id='purchaseDate' type='date' value={formData.purchaseDate} onChange={handleFormChange} />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md='6'>
                                <CFormLabel htmlFor='color'>Color</CFormLabel>
                                <CFormInput id='color' name='color' value={formData.color} onChange={handleFormChange} />
                            </CCol>
                            <CCol>
                                <CFormLabel htmlFor='typesOfCloths'>Type</CFormLabel>
                                <CFormInput id='typesOfCloths' name='typesOfCloths' value={formData.typesOfCloths} onChange={handleFormChange} />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md='6'>
                                <CFormLabel htmlFor='season'>Season</CFormLabel>
                                <CFormInput id='season' name='season' value={formData.season} onChange={handleFormChange} />
                            </CCol>
                            <CCol>
                                <CFormLabel htmlFor='description'>Description</CFormLabel>
                                <CFormInput id='description' name='description' value={formData.description} onChange={handleFormChange} />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md='6'>
                                <CFormLabel htmlFor='picture'>Edit Image</CFormLabel>
                                <CFormInput id='season' type='file' onChange={(e) => setSelectedFile(e.target.files[0])} />
                            </CCol>
                        </CRow>
                    </CForm>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setEditClothsVisible(false)}>
                            Close
                        </CButton>
                        <CButton color="primary" onClick={() => handleFormSubmit(formData.id)}>
                            Save Changes
                        </CButton>
                    </CModalFooter>
                </CModalBody>
            </CModal>

        </div>
    )
}

export default cloths
