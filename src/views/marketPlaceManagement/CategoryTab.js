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

const CategoryTab = () => {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Fetch categories
  useEffect(() => {
    // Add fetch logic for categories
  }, []);

  const handleAddCategory = () => {
    setCurrentCategory(null); // Reset currentCategory to null for new category
    setModal(true);
  };
  
  const handleEditCategory = (category) => {
    setCurrentCategory(category); // Set currentCategory for editing
    setModal(true);
  };

  const handleSaveCategory = () => {
    // Logic to save or update the category
    setModal(false);
  };

  return (
    <>
      <CButton color="primary" onClick={handleAddCategory}>Add New Category</CButton>
      <CTable responsive className="mt-3">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories.map((category, index) => (
            <CTableRow key={category._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{category.name}</CTableDataCell>
              <CTableDataCell>
                <CButton color="info" onClick={() => handleEditCategory(category)}>Edit</CButton>
                <CButton color="danger">Delete</CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal for Add/Edit Category */}
      <CModal show={modal} onClose={() => setModal(false)}>
        <CModalHeader closeButton>Add/Edit Category</CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label">Name</label>
            <input
              type="text"
              id="categoryName"
              className="form-control"
              value={currentCategory ? currentCategory.name : ''}
              onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
            />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveCategory}>Save</CButton>
          <CButton color="secondary" onClick={() => setModal(false)}>Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default CategoryTab;
