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

const CategoryTab = () => {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: '' });
  const [isEdit, setIsEdit] = useState(false); // Flag to check Add or Edit
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:3000/api/category'; // Update with your backend URL

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/`); // Assuming a GET endpoint
      setCategories(response.data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setCurrentCategory({ name: '' }); // Reset currentCategory for new category
    setIsEdit(false); // Mark as Add operation
    setModal(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category); // Set currentCategory for editing
    setIsEdit(true); // Mark as Edit operation
    setModal(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (!currentCategory.name.trim()) {
        setError('Category name is required.');
        return;
      }
      setError('');

      if (isEdit) {
        // Edit category logic
        await axios.put(`${API_BASE_URL}/updateCategory/${currentCategory._id}`, {
          name: currentCategory.name,
        });
        fetchCategories(); // Refresh categories
      } else {
        // Add category logic
        await axios.post(`${API_BASE_URL}/createCategory`, {
          name: currentCategory.name,
        });
        fetchCategories(); // Refresh categories
      }

      setModal(false);
    } catch (err) {
      console.error('Error saving category:', err.message);
      setError('Failed to save the category.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`${API_BASE_URL}/deleteCategory/${categoryId}`);
      fetchCategories(); // Refresh categories
    } catch (err) {
      console.error('Error deleting category:', err.message);
    }
  };

  return (
    <>
      <CButton color="primary" onClick={handleAddCategory}>
        Add New Category
      </CButton>
      <CTable responsive className="mt-3">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories.map((category, index) => (
            <CTableRow key={category._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{category.Name}</CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center' }}>
                <CButton style={{ margin: '0 2px', padding: '4px' }}>
                  <FontAwesomeIcon style={{ color: 'blue' }}
                    onClick={() => getProduct(product._id)}
                    icon={faEye} />
                </CButton>
                <CButton style={{ margin: '0 2px', padding: '4px' }}>
                  <FontAwesomeIcon style={{ color: 'green' }}
                    onClick={() => handleEditCategory(category)}
                    icon={faEdit} />
                </CButton>
                <CButton style={{ margin: '0 2px', padding: '4px' }}>
                  <FontAwesomeIcon style={{ color: 'red' }}
                    onClick={() => handleDeleteCategory(category._id)}
                    icon={faTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      {/* Modal for Add/Edit Category */}
      <CModal show={modal} onClose={() => setModal(false)}>
        <CModalHeader closeButton>
          {isEdit ? 'Edit Category' : 'Add New Category'}
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <label htmlFor="categoryName" className="form-label">
              Name
            </label>
            <input
              type="text"
              id="categoryName"
              className="form-control"
              value={currentCategory.name}
              onChange={(e) =>
                setCurrentCategory({ ...currentCategory, name: e.target.value })
              }
            />
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSaveCategory}>
            Save
          </CButton>
          <CButton color="secondary" onClick={() => setModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default CategoryTab;
