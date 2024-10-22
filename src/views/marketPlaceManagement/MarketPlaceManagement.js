import { React, useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCardText,
    CCardTitle,
    CCol,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CFormSelect,
    CForm,
    CFormInput,
    CFormLabel,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';
import axios from 'axios';
import { color } from 'chart.js/helpers';


const MarketPlaceManagement = () => {
    const [products, setProducts] = useState([]);
    const [oneProduct, setOneProduct] = useState([]);
    const [productVisible, setProductVisible] = useState(false);
    const [editProductVisible, setEditProductVisible] = useState(false);
    const [formData, setFormData] = useState([]);
    const [selectedFile, setSelectedFile] = useState();
    const [addSelectedFile, setAddSelectedFile] = useState(null);
    const [addProductVisible, setAddProductVisible] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [addFormData, setAddFormData] = useState({
        type: '',
        name: '',
        category: '',
        brand: '',
        price: '',
        description: '',
    });

    useEffect(() => {
        fetchData();
    })

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/marketplaces/`)
            setProducts(response.data.data);
            //   console.log(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getProduct = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/marketplaces/getProduct/${id}`);
            setOneProduct(response.data.data)
            console.log(response.data);
            setProductVisible(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleEditClick = async (product) => {
        setEditProductVisible(true);
        setFormData({
            id: product._id,
            brand: product.brand,
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
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
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);

            // Append file if selected
            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }

            await axios.put(`http://localhost:3000/api/marketplaces/update/${id}`, formDataToSend);

            setEditProductVisible(false);
            fetchData();
        } catch (error) {
            console.error('Failed to update shoe data', error);
        }
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setAddFormData({
            ...addFormData,
            [name]: value,
        });
    };

    const handleAddFileChange = (e) => {
        setAddSelectedFile(e.target.files[0]);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('type', addFormData.type);
        form.append('name', addFormData.name);
        form.append('category', addFormData.category);
        form.append('brand', addFormData.brand);
        form.append('price', addFormData.price);
        form.append('description', addFormData.description);
        if (addSelectedFile) form.append('image', addSelectedFile);

        try {
            const response = await axios.post('http://localhost:3000/api/marketplaces/create', form);

            setResponseMessage(response.data.message);
        } catch (error) {
            setResponseMessage(error.response.data.message || 'An error occurred');
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete product`);

        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/marketplaces/delete/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error Deleting user:', error);
            }
        }
    };



    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h5 style={{ margin: 0 }}>Market Place List</h5>
                <CButton
                    color="primary"
                    onClick={() => setAddProductVisible(true)}
                >
                    Add Product
                </CButton>
            </div>
            <CTable responsive>
                <CTableHead>
                    <CTableRow color='primary'>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Photo</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Brand</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>category</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Price</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Discription</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        products.map((product, index) => (
                            <CTableRow key={product._id}>
                                <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <img
                                        src={product.image} // Ensure this is the correct path to the image
                                        alt={'N/A'} // Provide an alt text for accessibility
                                        style={{ width: '50px', height: '50px' }} // Adjust size and shape as needed
                                    />
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{product.name}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{product.brand}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{product.category}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{product.price}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{product.description}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <CButton style={{ margin: '0 2px', padding: '4px' }}>
                                        <FontAwesomeIcon style={{ color: 'blue' }}
                                            onClick={() => getProduct(product._id)}
                                            icon={faEye} />
                                    </CButton>
                                    <CButton style={{ margin: '0 2px', padding: '4px' }}>
                                        <FontAwesomeIcon style={{ color: 'green' }}
                                            onClick={() => handleEditClick(product)}
                                            icon={faEdit} />
                                    </CButton>
                                    <CButton style={{ margin: '0 2px', padding: '4px' }}>
                                        <FontAwesomeIcon style={{ color: 'red' }}
                                            onClick={() => handleDelete(product._id)}
                                            icon={faTrash} />
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    }
                </CTableBody>
            </CTable>

            <CModal visible={addProductVisible} onClose={() => { setAddProductVisible(false) }}>
                <CModalHeader>
                    <CModalTitle>
                        Add Product
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleAddSubmit}>
                        <CRow>
                            <CCol md="6">
                                <CFormLabel htmlFor="type">Type Of Market Place</CFormLabel>
                                <CFormSelect
                                    id="type"
                                    name="type"
                                    value={addFormData.type}
                                    onChange={handleAddChange}
                                    required
                                >
                                    <option value="">Select Market Place</option>
                                    <option value="shop_by_style">Shop by Style</option>
                                    <option value="shop_menswear">Shop Menswear</option>
                                    <option value="shop_womenswear">Shop Womenswear</option>
                                </CFormSelect>
                            </CCol>

                            <CCol md="6">
                                <CFormLabel htmlFor="name">Product Name</CFormLabel>
                                <CFormInput
                                    id="name"
                                    name="name"
                                    value={addFormData.name}
                                    onChange={handleAddChange}
                                    required
                                />
                            </CCol>
                            <CCol md="6">
                                <CFormLabel htmlFor="category">Category</CFormLabel>
                                <CFormInput
                                    id="category"
                                    name="category"
                                    value={addFormData.category}
                                    onChange={handleAddChange}
                                    required
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormLabel htmlFor="brand">Brand</CFormLabel>
                                <CFormInput
                                    id="brand"
                                    name="brand"
                                    value={addFormData.brand}
                                    onChange={handleAddChange}
                                    required
                                />
                            </CCol>
                            <CCol md="6">
                                <CFormLabel htmlFor="price">Price</CFormLabel>
                                <CFormInput
                                    id="price"
                                    name="price"
                                    value={addFormData.price}
                                    onChange={handleAddChange}
                                    type="number"
                                    required
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormLabel htmlFor="description">Description</CFormLabel>
                                <CFormInput
                                    id="description"
                                    name="description"
                                    value={addFormData.description}
                                    onChange={handleAddChange}
                                    required
                                />
                            </CCol>
                            <CCol md="6">
                                <CFormLabel htmlFor="picture">Product Image</CFormLabel>
                                <CFormInput
                                    type="file"
                                    id="picture"
                                    name="picture"
                                    onChange={handleAddFileChange}
                                />
                            </CCol>
                        </CRow>
                        <CButton onClick={() => setAddProductVisible(false)} type="submit" color="primary" style={{ marginTop: '10px' }}>
                            Add Product
                        </CButton>
                    </CForm>
                </CModalBody>
            </CModal>

            <CModal size='lg' visible={productVisible} onClose={() => setProductVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                        Product Details
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {oneProduct && (
                        <CCard className="shadow-sm">
                            <CCardHeader className="bg-primary text-white">
                                <h5 style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {oneProduct.brand}
                                </h5>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="align-items-center">
                                    <CCol xs="12" md="6" className="text-center">
                                        <img
                                            src={oneProduct.image}
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
                                            <p><strong>Name:</strong> {oneProduct.name}</p>
                                            <p><strong>Price:</strong> {oneProduct.price}</p>
                                            <p><strong>Category:</strong> {oneProduct.category}</p>
                                            <p><strong>Description:</strong> {oneProduct.description}</p>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                            <CCardFooter className="d-flex justify-content-end">
                                <CButton color="secondary" onClick={() => setProductVisible(false)}>
                                    Close
                                </CButton>
                            </CCardFooter>
                        </CCard>
                    )}
                </CModalBody>
            </CModal>

            <CModal visible={editProductVisible} onClose={() => { setEditProductVisible(false) }}>
                <CModalHeader>
                    <CModalTitle>
                        Edit product
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow>
                            <CCol md='6'>
                                <CFormLabel htmlFor='brand'>Brand</CFormLabel>
                                <CFormInput id='brand' name='brand' value={formData.brand} onChange={handleFormChange} />
                            </CCol>
                            <CCol md='6'>
                                <CFormLabel htmlFor='color'>Name</CFormLabel>
                                <CFormInput id='color' name='color' value={formData.name} onChange={handleFormChange} />
                            </CCol>

                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormLabel htmlFor='typesOfproduct'>Price</CFormLabel>
                                <CFormInput id='typesOfproduct' name='typesOfproduct' value={formData.price} onChange={handleFormChange} />
                            </CCol>
                            <CCol md='6'>
                                <CFormLabel htmlFor='season'>Category</CFormLabel>
                                <CFormInput id='season' name='season' value={formData.category} onChange={handleFormChange} />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md='6'>
                                <CFormLabel htmlFor='description'>Description</CFormLabel>
                                <CFormInput id='description' name='description' value={formData.description} onChange={handleFormChange} />
                            </CCol>
                            <CCol md='6'>
                                <CFormLabel htmlFor='picture'>Edit Image</CFormLabel>
                                <CFormInput id='season' type='file' onChange={(e) => setSelectedFile(e.target.files[0])} />
                            </CCol>
                        </CRow>
                    </CForm>
                    <CModalFooter style={{ marginTop: '20px' }}>
                        <CButton color="secondary" onClick={() => setEditProductVisible(false)}>
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
export default MarketPlaceManagement;
