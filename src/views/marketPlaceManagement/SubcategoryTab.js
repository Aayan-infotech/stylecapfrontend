import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CCard,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormInput,
    CFormSelect,
    CAlert
} from '@coreui/react';

// Import necessary Font Awesome components and icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const SubcategoryManagement = () => {
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        sellType: '',
        description: '',
        price: '',
        discount: '',
        brand: '',
        image: null,
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubcategories();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://44.196.64.110:3555/api/category');
            setCategories(response.data.data);
        } catch (error) {
            setError('Error fetching categories');
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('http://44.196.64.110:3555/api/marketPlaceSubcat/get');
            setSubcategories(response.data.data);
        } catch (error) {
            setError('Error fetching subcategories');
            console.error('Error fetching subcategories:', error);
        }
    };

    const handleAddSubcategory = async (event) => {
        event.preventDefault();
        try {
            const imageUrl = await uploadImageToCloudinary(formData.image);
            const newSubcategory = {
                name: formData.name,
                category: formData.category,
                sellType: formData.sellType,
                description: formData.description,
                price: formData.price,
                discount: formData.discount,
                brand: formData.brand,
                image: imageUrl,
            };
            await axios.post('http://44.196.64.110:3129/api/subcategory/add', newSubcategory);
            setVisible(false);
            resetFormData();
            fetchSubcategories(); // Re-fetch subcategories
        } catch (error) {
            setError('Error adding subcategory');
            console.error('Error adding subcategory:', error);
        }
    };

    const handleEdit = (subcategory) => {
        setSelectedSubcategory(subcategory);
        setFormData({
            name: subcategory.name || '',
            category: subcategory.category || '',
            sellType: subcategory.sellType || '',
            description: subcategory.description || '',
            price: subcategory.price || '',
            discount: subcategory.discount || '',
            brand: subcategory.brand || '',
            image: subcategory.image || null,
        });
        setEditVisible(true);
    };

    const handleEditSubcategory = async (event) => {
        event.preventDefault();
        const { _id } = selectedSubcategory;
        try {
            const imageUrl = formData.image instanceof File ? await uploadImageToCloudinary(formData.image) : formData.image;
            const updatedSubcategory = {
                name: formData.name,
                category: formData.category,
                sellType: formData.sellType,
                description: formData.description,
                price: formData.price,
                discount: formData.discount,
                brand: formData.brand,
                image: imageUrl,
            };
            await axios.put(`http://44.196.64.110:3129/api/subcategory/update/${_id}`, updatedSubcategory);
            setEditVisible(false);
            resetFormData();
            fetchSubcategories(); // Fetch the latest data
        } catch (error) {
            setError('Error updating subcategory');
            console.error('Error updating subcategory:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://44.196.64.110:3555/api/marketPlaceSubcat/delete/${id}`);
            setSubcategories(subcategories.filter(subcategory => subcategory._id !== id));
        } catch (error) {
            setError('Error deleting subcategory');
            console.error('Error deleting subcategory:', error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            category: '',
            sellType: '',
            description: '',
            price: '',
            discount: '',
            brand: '',
            image: null,
        });
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
        <>
            {error && <CAlert color="danger">{error}</CAlert>}
            <CCard>
                <CCardHeader>
                    <CRow className="align-items-center">
                        <CCol>
                            <div style={{ fontSize: '1rem' }}>Product Management</div>
                        </CCol>
                        <CCol xs="auto" className="px-4">
                            <CButton color="primary" className="px-4" onClick={() => setVisible(true)}>Add Product</CButton>
                        </CCol>
                    </CRow>
                </CCardHeader>

                <CTable responsive striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Sell Type</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Image</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" scope="col">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {subcategories.map((subcategory, index) => (
                            <CTableRow key={subcategory._id}>
                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{subcategory.name || 'null'}</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{subcategory.category || 'null'}</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{subcategory.sellType || 'null'}</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>${subcategory.price || 'null'}</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{subcategory.discount || 'null'}%</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>
                                    <img src={subcategory.image} alt={subcategory.name} width="100" />
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                    <CButton className="me-1 p-1" onClick={() => handleEdit(subcategory)}><FontAwesomeIcon icon={faEdit} /></CButton>
                                    <CButton className="me-1 p-1" onClick={() => handleDelete(subcategory._id)}><FontAwesomeIcon icon={faTrash} style={{ color: "#fd2b2b" }} /></CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCard>

            <CModal visible={visible} onClose={() => { setVisible(false); resetFormData(); }}>
                <CModalHeader closeButton>
                    <CModalTitle>Add Product</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleAddSubcategory}>
                        <CCol md={6}>
                            <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormSelect id="category" label="Category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="sellType" label="Sell Type" value={formData.sellType} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="number" id="price" label="Price" value={formData.price} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="number" id="discount" label="Discount" value={formData.discount} onChange={handleChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="brand" label="Brand" value={formData.brand} onChange={handleChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="file" id="image" label="Upload Image" onChange={handleFileChange} />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="description" label="Description" value={formData.description} onChange={handleChange} required />
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
                    <CModalTitle>Edit Product</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleEditSubcategory}>
                        <CCol md={6}>
                            <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormSelect id="category" label="Category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="sellType" label="Sell Type" value={formData.sellType} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="number" id="price" label="Price" value={formData.price} onChange={handleChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="number" id="discount" label="Discount" value={formData.discount} onChange={handleChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="brand" label="Brand" value={formData.brand} onChange={handleChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="file" id="image" label="Upload Image" onChange={handleFileChange} />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="description" label="Description" value={formData.description} onChange={handleChange} required />
                        </CCol>
                        <CCol xs="auto">
                            <CButton type="submit" color="primary">Update</CButton>
                            <CButton color="secondary" className="ms-1" onClick={() => { setEditVisible(false); resetFormData(); }}>Cancel</CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
            </CModal>
        </>
    );
};

export default SubcategoryManagement;
