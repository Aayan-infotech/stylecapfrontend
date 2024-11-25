import React, { useState, useEffect } from 'react';
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

const SubcategoryTab = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);

  // Fetch subcategories
  useEffect(() => {
    // Add fetch logic for subcategories
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
      <CTable responsive className="mt-3">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {subcategories.map((Subcategory, index) => (
            <CTableRow key={Subcategory._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{Subcategory.name}</CTableDataCell>
              <CTableDataCell>
                <CButton color="info" onClick={() => handleEditSubcategory(Subcategory)}>Edit</CButton>
                <CButton color="danger">Delete</CButton>
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
