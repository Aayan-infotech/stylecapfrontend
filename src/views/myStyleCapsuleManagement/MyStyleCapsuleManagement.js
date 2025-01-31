import { CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCol, CForm, CFormInput, CFormLabel, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const StyleCapsuleManagement = () => {

    const [clothData, setClothData] = useState([]);
    const [userClothsData, setUserClothsData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [singleClothsData, setSingleClothsData] = useState([]);
    const [visibleModel, setVisibleModel] = useState(false);
    const [styleVisible, setStyleVisible] = useState(false);
    const [editClothsVisible, setEditClothsVisible] = useState(false);
    const [formData, setFormData] = useState([]);
    const [selectedFile, setSelectedFile] = useState();
    const category = 'clothes'

    useEffect(() => {
        fetchData();
    }, [])


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
    //         const response = await axios.get(`http://44.196.64.110:3555/api/user`, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    //         setClothData(response.data);
    //     } catch (error) {
    //         console.error('Not able to fetch cloth data', error);
    //     }
    // }

    const handleView = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://44.196.64.110:3555/api/myStyleCapsule/getStyle?userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUserClothsData(response.data.data.styleOfTheDay);
            console.log(response.data.data.styleOfTheDay)
            setVisibleModel(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const fetchStyleData = async (date) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://44.196.64.110:3555/api/myStyleCapsule/styleByDate/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setStyleVisible(true);
            setSingleClothsData(response.data.data);
            console.log("setSingleClothsData", response.data.data);
        } catch (error) {
            console.error('Failed to fetch style data', error);
        }
    };


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
                                    title="View" onClick={() => handleView(user._id)}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* style fethcing from userId */}
            <CModal size='lg' visible={visibleModel} onClose={() => setVisibleModel(false)}>
                <CModalHeader onClose={() => setVisibleModel(false)}>
                    <CModalTitle>Style Details of User</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {userClothsData ? (
                        <CTable responsive>
                            <CTableHead color='primary'>
                                <CTableRow>
                                    <CTableHeaderCell style={{}} scope="col">#</CTableHeaderCell>
                                    {/* <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">User</CTableHeaderCell> */}
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Date</CTableHeaderCell>
                                    {/* <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Type</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Color</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Season</CTableHeaderCell>
                                <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Purchase Date</CTableHeaderCell> */}
                                    <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {userClothsData.map((cloths, index) => (
                                    <CTableRow key={index}>
                                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                        {/* <CTableDataCell style={{ textAlign: 'center' }}>
                                        {cloths.picture ? (
                                            <img src={cloths.picture} alt="shoe" width="50" height="50" />
                                        ) : (
                                            'No Image Available'
                                        )}
                                    </CTableDataCell> */}
                                        <CTableDataCell style={{ textAlign: 'center' }}>{cloths.date}</CTableDataCell>
                                        {/* <CTableDataCell style={{ textAlign: 'center' }}>{cloths.brand}</CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>{cloths.typesOfCloths}</CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>{cloths.color}</CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>{cloths.season}</CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>
                                        {cloths.purchaseDate
                                            ? new Date(cloths.purchaseDate).toLocaleDateString()
                                            : 'No Date Available'}
                                    </CTableDataCell> */}
                                        <CTableDataCell style={{ textAlign: 'center' }}>
                                            <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => fetchStyleData(cloths.date)}>
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

            {singleClothsData && (
                <CModal size='lg' visible={styleVisible} onClose={() => setStyleVisible(false)}>
                    <CModalHeader closeButton>
                        <CModalTitle style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                            Style Details of {singleClothsData.styleOfTheDay?.[0]?.date || 'N/A'}
                        </CModalTitle>

                    </CModalHeader>
                    <CModalBody>
                        <CCard className="shadow-sm">
                            <CCardHeader className="bg-primary text-white">
                                {/* <h5 style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {singleClothsData.date}
                                </h5> */}
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="align-items-center">
                                    {singleClothsData.styleOfTheDay && singleClothsData.styleOfTheDay.length > 0 ? (
                                        singleClothsData.styleOfTheDay.map((item, outerIndex) => (
                                            <React.Fragment key={outerIndex}>
                                                {/* Render the Date */}
                                                {/* <CCol xs="12" className="text-center mb-3">
                                                    <h5>{item.date}</h5>
                                                </CCol> */}

                                                {/* Render Pictures for this Date */}
                                                {item.picture && item.picture.length > 0 ? (
                                                    item.picture.map((picture, innerIndex) => (
                                                        <CCol xs="12" md="6" className="text-center" key={`${outerIndex}-${innerIndex}`}>
                                                            <img
                                                                src={`http://44.196.64.110:3555/uploads/${picture}`}
                                                                alt={`Cloth ${outerIndex + 1}-${innerIndex + 1}`}
                                                                style={{
                                                                    maxWidth: '100%',
                                                                    maxHeight: '300px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '10px',
                                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                                    marginBottom: '15px',
                                                                }}
                                                            />
                                                        </CCol>
                                                    ))
                                                ) : (
                                                    <CCol xs="12" className="text-center">
                                                        <p>No pictures found for {item.date}</p>
                                                    </CCol>
                                                )}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <CCol xs="12" className="text-center">
                                            {/* <img
                                                src="https://via.placeholder.com/150"
                                                alt="No Cloth Found"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '300px',
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                }}
                                            /> */}
                                            <p>No style found for the date!</p>
                                        </CCol>
                                    )}
                                </CRow>


                            </CCardBody>
                            <CCardFooter className="d-flex justify-content-end">
                                <CButton color="secondary" onClick={() => setStyleVisible(false)}>
                                    Close
                                </CButton>
                            </CCardFooter>
                        </CCard>
                    </CModalBody>
                </CModal>
            )}


            <CModal visible={editClothsVisible} onClose={() => { setEditClothsVisible(false) }}>
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

export default StyleCapsuleManagement
