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
    const [modalVisible, setModalVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        marketplaceId: '',
        // sellType: '',
        description: '',
        price: '',
        discount: '',
        brand: '',
        quantityStock: '',
        image: null,
    });
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    useEffect(() => {
        fetchCategories();
        fetchSubcategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://18.209.91.97:3555/api/marketplaces/');
            setCategories(response.data.data);
            // console.log(response.data.data)
        } catch (error) {
            setError('Error fetching categories');
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get('http://18.209.91.97:3555/api/marketPlaceSubcat/get');
            setSubcategories(response.data.data);
        } catch (error) {
            setError('Error fetching subcategories');
            console.error('Error fetching subcategories:', error);
        }
    };

    // const handleAddSubcategory = async (event) => {
    //     event.preventDefault();
    //     try {
    //         // const imageUrl = await uploadImageToCloudinary(formData.image);
    //         const newSubcategory = {
    //             name: formData.name,
    //             marketplaceId: formData.marketplaceId,
    //             sellType: formData.sellType,
    //             description: formData.description,
    //             price: formData.price,
    //             discount: formData.discount,
    //             brand: formData.brand,
    //             image: imageUrl,
    //         };
    //         await axios.post(`http://18.209.91.97:3555/api/marketPlaceSubcat/add`, newSubcategory);
    //         setVisible(false);
    //         resetFormData();
    //         fetchSubcategories(); // Re-fetch subcategories
    //     } catch (error) {
    //         setError('Error adding subcategory');
    //         console.error('Error adding subcategory:', error);
    //     }
    // };

    const handleAddSubcategory = async (e) => {
        e.preventDefault();
        await fetchCategories();
        const form = new FormData();
        form.append("name", formData.name);
        // form.append("sellType", formData.sellType);
        form.append("description", formData.description);
        form.append("price", formData.price);
        form.append("brand", formData.brand);
        form.append("discount", formData.discount);

        form.append("marketplaceId", formData.marketplaceId);
        if (selectedFile) form.append("image", selectedFile); // Attach image file

        try {
            const response = await axios.post(
                "http://18.209.91.97:3555/api/marketPlaceSubcat/add",
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                setVisible(false);
            }

            fetchSubcategories();

            setResponseMessage(response.data.message || "Subcategory added successfully!");
            // Optionally, reset form and fetch data after successful submission
            setFormData({
                name: "",
                // sellType: "",
                description: "",
                price: "",
                brand: "",
                discount: "",
                quantityStock: '',
                marketplaceId: "",
            });
            setSelectedFile(null);
        } catch (error) {
            setResponseMessage(error.response?.data?.message || "An error occurred");
        }
    };


    const handleEdit = (subcategory) => {
        console.log(subcategory, "subcategory");
        console.log(subcategory.discount, "subcategory.discount")
        fetchCategories();

        setSelectedSubcategory(subcategory);
        setFormData({
            name: subcategory.name || '',
            marketplaceId: subcategory.marketplaceId || '',
            // sellType: subcategory.sellType || '',
            description: subcategory.description || '',
            price: subcategory.price || '',
            discount: subcategory.discount || '',
            brand: subcategory.brand || '',
            quantityStock: subcategory.quantityStock || '',
            image: subcategory.image || null,
        });
        setEditVisible(true);
    };

    const handleEditSubcategory = async (event) => {
        event.preventDefault();
        fetchCategories();

        const { _id } = selectedSubcategory;
        try {
            const imageUrl = formData.image instanceof File ? await uploadImageToCloudinary(formData.image) : formData.image;
            const updatedSubcategory = {
                name: formData.name,
                marketplaceId: formData.marketplaceId,
                // sellType: formData.sellType,
                description: formData.description,
                price: formData.price,
                discount: formData.discount,
                brand: formData.brand,
                quantityStock: formData.quantityStock,
                image: imageUrl,
            };
            console.log(formData, "formData")
            console.log(updatedSubcategory, "updatedSubcategory")
            const token = localStorage.getItem('token');
            await axios.put(`http://18.209.91.97:3555/api/marketplacesubcat/update-subcategory/${_id}`,
                updatedSubcategory,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                },
            );
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
            await axios.delete(`http://18.209.91.97:3555/api/marketPlaceSubcat/delete/${id}`);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setFormData({ ...formData, image: file });
    // };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            marketplaceId: '',
            // sellType: '',
            description: '',
            price: '',
            discount: '',
            brand: '',
            quantityStock: '',
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

    const handleViewSubcategory = async (subcategory) => {
        console.log(subcategory)
        setSelectedSubcategory(subcategory);
        setModalVisible(true);
    }

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
                            {/* <CTableHeaderCell scope="col">Sell Type</CTableHeaderCell> */}
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
                                <CTableDataCell
                                    style={{
                                        fontSize: '0.870rem',
                                        cursor: 'pointer',
                                        color: 'black',
                                        transition: 'color 0.3s ease-in-out'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = 'blue';
                                        e.target.style.textDecoration = 'underline';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = 'black';
                                        e.target.style.textDecoration = 'none';
                                    }}
                                    onClick={() => handleViewSubcategory(subcategory)}
                                >{subcategory.name || 'null'}</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{subcategory?.marketplaceId?.name || 'null'}</CTableDataCell>
                                {/* <CTableDataCell style={{ fontSize: '0.870rem' }}>{subcategory.sellType || 'null'}</CTableDataCell> */}
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>${subcategory.price || 'null'}</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{subcategory.discount || '0'}%</CTableDataCell>
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
                            <CFormInput type="text" id="name" name="name" label="Name" value={formData.name} onChange={handleInputChange} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormSelect id="marketplaceId" name='marketplaceId' label="Market Place Category" value={formData.marketplaceId} onChange={handleInputChange} required>
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        {/* <CCol md={6}>
                            <CFormInput type="text" id="sellType" name='sellType' label="Sell Type" value={formData.sellType} onChange={handleInputChange} required />
                        </CCol> */}
                        <CCol md={6}>
                            <CFormInput type="number" id="price" name='price' label="Price" value={formData.price} onChange={handleInputChange} onWheel={(e) => e.target.blur()}
                                min={0} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="number" id="discount" name='discount' label="Discount" value={formData.discount} onChange={handleInputChange} onWheel={(e) => e.target.blur()}
                                min={0} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="brand" name='brand' label="Brand" value={formData.brand} onChange={handleInputChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="number" id="quantityStock" name='quantityStock' label="Stock Quantity" value={formData.quantityStock} onChange={handleInputChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="file" id="image" label="Upload Image" onChange={handleFileChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="description" name='description' label="Description" value={formData.description} onChange={handleInputChange} required />
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
                            <CFormSelect id="marketplaceId" label="MarketplaceId" value={formData.marketplaceId} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                        {/* <CCol md={6}>
                            <CFormInput type="text" id="sellType" label="Sell Type" value={formData.sellType} onChange={handleChange} required />
                        </CCol> */}
                        <CCol md={6}>
                            <CFormInput type="number" id="price" label="Price" value={formData.price} onChange={handleChange} onWheel={(e) => e.target.blur()}
                                min={0} required />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="number" id="discount" label="Discount" value={formData?.discount} onChange={handleChange} onWheel={(e) => e.target.blur()}
                                min={0} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="text" id="brand" label="Brand" value={formData.brand} onChange={handleChange} required />
                        </CCol>
                        <CCol md={12}>
                            <CFormInput type="number" id="quantityStock" name='quantityStock' label="Stock Quantity" value={formData.quantityStock} onChange={handleChange} onWheel={(e) => e.target.blur()}
                                min={0} required />
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

            {/* Subcategory Details Modal */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader>Product Details</CModalHeader>
                <CModalBody>
                    {selectedSubcategory ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src={`${selectedSubcategory.image}`}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                        marginBottom: '15px',
                                    }}
                                />
                            </div>

                            <p><strong>Name</strong> {selectedSubcategory.name}</p>
                            <p><strong>Category:</strong> {selectedSubcategory.category || "null"}</p>
                            {/* <p><strong>Sell Type:</strong> {selectedSubcategory.sellType || "null"}</p> */}
                            <p><strong>Price:</strong> ${selectedSubcategory.price}</p>
                            <p><strong>Description:</strong> {selectedSubcategory.description}</p>
                            <p><strong>Stock Quantity:</strong> {selectedSubcategory.stockQuantity || '0'}</p>
                            <p><strong>Brand:</strong> ₹{selectedSubcategory.brand}</p>
                            {/* <p><strong>Items:</strong></p>
                                        <ul>
                                            {selectedOrder.items.map((item, index) => (
                                                <li key={index}>
                                                    {item.name} - {item.quantity} x ${item.price}
                                                </li>
                                            ))}
                                        </ul> */}
                        </>
                    ) : (
                        <p>No subcategory selected.</p>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default SubcategoryManagement;
