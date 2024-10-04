import { CButton, CCard, CForm, CCardBody, CCardFooter, CCardHeader, CCol, CModal, CModalBody, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CFormLabel, CFormInput, CModalFooter } from '@coreui/react';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react'


const miscellaneous = () => {
  const [data, setData] = useState([]);
  const [miscellaneousData, setMiscellaneousData] = useState([]);
  const [viewMiscellaneous, setViewMiscellaneous] = useState(false);
  const [editMiscellaneousVisible, setEditMiscellaneousVisible] = useState(false);
  const [formData, setFormData] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);

  useEffect(() => {
    fetchData();
  })

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/cloths/get-by-category/miscellaneous`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      setData(response.data);
    } catch (error) {
      console.log("Error fetching Data", error);
    }
  }

  const fetchaccessoriesData = async(id) =>{
    try{
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/cloths/getClothById/${id}`,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
      setMiscellaneousData(response.data);
      setViewMiscellaneous(true);

    }catch(error){
      console.error("Error fetching Acessories", error);
    }
  }
  
  const handleEditClick = (miscellaneousData) => {
    setEditMiscellaneousVisible(true);
    setFormData({
        id: miscellaneousData._id,
        brand: miscellaneousData.brand,
        color: miscellaneousData.color,
        typesOfCloths: miscellaneousData.typesOfCloths,
        season: miscellaneousData.season,
        purchaseDate: new Date(miscellaneousData.purchaseDate).toISOString().split('T')[0],
        description: miscellaneousData.description,
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

        await axios.put(`http://localhost:3000/api/cloths/update-cloths/${id}`, formDataToSend, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',  // Use multipart/form-data for file uploads
            },
        });

        setEditMiscellaneousVisible(false);
        fetchData();  // Refresh the list after editing
    } catch (error) {
        console.error('Failed to update shoe data', error);
    }
}


  return (
    <div>
      <CTable>
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
          {data.map((accessories, index) => (
            <CTableRow key={index}>
              <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
              <CTableDataCell style={{ textAlign: 'center' }}>
                {accessories.picture ? (
                  <img src={accessories.picture} alt="shoe" width="50" height="50" />
                ) : (
                  'No Image Available'
                )}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>{accessories.brand}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>{accessories.typesOfCloths}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>{accessories.color}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>{accessories.season}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>
                {accessories.purchaseDate
                  ? new Date(accessories.purchaseDate).toLocaleDateString()
                  : 'No Date Available'}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>
                <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => fetchaccessoriesData(accessories._id)}>
                  <FontAwesomeIcon icon={faEye} color='blue' />
                </button>
                <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => handleEditClick(accessories)}>
                  <FontAwesomeIcon icon={faEdit} color='green' />
                </button>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal size='lg' visible={viewMiscellaneous} onClose={()=> {setViewMiscellaneous(false)}} >
        <CModalHeader>
          <CModalTitle style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
            accessories Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCard className='shadow-sm'>
            <CCardHeader className="bg-primary text-white">
              <h5 style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {miscellaneousData.brand}
              </h5>
            </CCardHeader>
            <CCardBody>
              <CRow className="align-items-center">
                <CCol xs="12" md="6" className="text-center">
                  <img
                    src={miscellaneousData.picture}
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
                    <p><strong>Color:</strong> {miscellaneousData.color}</p>
                    <p><strong>Type:</strong> {miscellaneousData.typesOfCloths}</p>
                    <p><strong>Season:</strong> {miscellaneousData.season}</p>
                    <p><strong>Purchase Date:</strong> {new Date(miscellaneousData.purchaseDate).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> {miscellaneousData.description}</p>
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
            <CCardFooter className="d-flex justify-content-end">
              <CButton color="secondary" onClick={() => setViewMiscellaneous(false)}>
                Close
              </CButton>
            </CCardFooter>
          </CCard>
        </CModalBody>
      </CModal>

      <CModal size="lg" visible={editMiscellaneousVisible} onClose={() => setEditMiscellaneousVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Edit Accessories</CModalTitle>
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
                    <CButton color="secondary" onClick={() => setEditMiscellaneousVisible(false)}>
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

export default miscellaneous
