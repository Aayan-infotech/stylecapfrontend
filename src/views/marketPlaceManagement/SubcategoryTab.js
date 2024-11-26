import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const SubcategoryTab = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);

  const API_BASE_URL = "http://localhost:3000/api/marketPlaceSubcat"

  // Fetch categories
  const fetchSubcategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get`); // Assuming a GET endpoint
      setSubcategories(response.data.data || []);
      console.log("abc", response.data.data)
    } catch (err) {
      console.error('Error fetching subcategories:', err.message);
    }
  };

  // Fetch subcategories
  useEffect(() => {
    fetchSubcategories();
  }, []);

  const handleAddSubcategory = () => {
    setCurrentSubcategory(null); // Reset currentSubcategory to null for new Subcategory
    setModal(true);
  };

  const handleEditSubcategory = (Subcategory) => {
    setCurrentSubcategory(Subcategory); // Set currentSubcategory for editing
    setModal(true);
  };

  const handleSaveSubcategory = () => {
    // Logic to save or update the Subcategory
    setModal(false);
  };

  return (
    <>
      <CButton color="primary" onClick={handleAddSubcategory}>Add New Subcategory</CButton>
      <CTable responsive >
        <CTableHead>
          <CTableRow color='primary'>
            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Category</CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Sell Type</CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Price</CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Brand</CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Image</CTableHeaderCell>
            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {subcategories.map((Subcategory, index) => (
            <CTableRow key={Subcategory._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>{Subcategory.category}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>{Subcategory.name}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>{Subcategory.sellType}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>{Subcategory.price}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>{Subcategory.brand}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}> {Subcategory.image ? (
                <img
                  src={Subcategory.image}
                  alt="Subcategory"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              ) : (
                'No Image Available'
              )}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>
                <CButton style={{ margin: '0 2px', padding: '4px' }}>
                  <FontAwesomeIcon style={{ color: 'blue' }}
                    onClick={() => getProduct(product._id)}
                    icon={faEye} />
                </CButton>
                <CButton style={{ margin: '0 2px', padding: '4px' }}>
                  <FontAwesomeIcon style={{ color: 'green' }}
                    onClick={() => handleEditSubcategory(Subcategory)}
                    icon={faEdit} />
                </CButton>
                <CButton style={{ margin: '0 2px', padding: '4px' }}>
                  <FontAwesomeIcon style={{ color: 'red' }}
                    onClick={() => handleDelete(product._id)}
                    icon={faTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal for Add/Edit Subcategory */}
      <CModal show={modal} onClose={() => setModal(false)}>
        <CModalHeader closeButton>Add/Edit Subcategory</CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="SubcategoryName" className="form-label">Name</label>
            <input
              type="text"
              id="SubcategoryName"
              className="form-control"
              value={currentSubcategory ? currentSubcategory.name : ''}
              onChange={(e) => setCurrentSubcategory({ ...currentSubcategory, name: e.target.value })}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveSubcategory}>Save</CButton>
          <CButton color="secondary" onClick={() => setModal(false)}>Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default SubcategoryTab;
