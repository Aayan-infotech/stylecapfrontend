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
    CSpinner,
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    const [loading, setLoading] = useState({
        fetch: false,
        add: false,
        edit: false,
        delete: false,
        view: false
    });
    const [addFormData, setAddFormData] = useState({
        name: '',
        section: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(prev => ({ ...prev, fetch: true }));
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://18.209.91.97:3555/api/marketplaces/`);
            setProducts(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(prev => ({ ...prev, fetch: false }));
        }
    }

    const getProduct = async (id) => {
        try {
            setLoading(prev => ({ ...prev, view: true }));
            const response = await axios.get(`http://18.209.91.97:3555/api/marketplaces/getProduct/${id}`);
            setOneProduct(response.data.data);
            setProductVisible(true);
        } catch (error) {
            console.log(error);
            toast.error('Failed to fetch product details');
        } finally {
            setLoading(prev => ({ ...prev, view: false }));
        }
    }

    const handleEditClick = async (product) => {
        setEditProductVisible(true);
        setFormData({
            id: product._id,
            name: product.name,
            section: product.section
        });
        setSelectedFile(null);
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
            setLoading(prev => ({ ...prev, edit: true }));
            const token = localStorage.getItem('token');
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('section', formData.section);
            if (selectedFile) {
                formDataToSend.append('images', selectedFile);
            }

            await axios.put(`http://18.209.91.97:3555/api/marketplaces/update/${id}`, formDataToSend);
            toast.success('Product updated successfully');
            setEditProductVisible(false);
            fetchData();
        } catch (error) {
            console.error('Failed to update data', error);
            toast.error('Failed to update product');
        } finally {
            setLoading(prev => ({ ...prev, edit: false }));
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
        try {
            setLoading(prev => ({ ...prev, add: true }));
            const form = new FormData();
            form.append('section', addFormData.section);
            form.append('name', addFormData.name);
            if (addSelectedFile) form.append('images', addSelectedFile);

            const response = await axios.post('http://18.209.91.97:3555/api/marketplaces/create', form);
            toast.success('Product added successfully');
            setAddProductVisible(false);
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(prev => ({ ...prev, add: false }));
        }
    };

    const handleEditModalClose = () => {
        setEditProductVisible(false);
        setFormData({
            name: '',
            section: ''
        });
        setSelectedFile(null);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(`Market place data once deleted, will be deleted from the system and will not be retrieved. Are you sure to continue?`);

        if (confirmDelete) {
            try {
                setLoading(prev => ({ ...prev, delete: true }));
                await axios.delete(`http://18.209.91.97:3555/api/marketplaces/delete/${id}`);
                toast.success('Product deleted successfully');
                fetchData();
            } catch (error) {
                console.error('Error Deleting user:', error);
                toast.error('Failed to delete product');
            } finally {
                setLoading(prev => ({ ...prev, delete: false }));
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

            {loading.fetch ? (
                <div className="d-flex justify-content-center my-5">
                    <CSpinner color="primary" />
                    <span className="ms-2">Loading products...</span>
                </div>
            ) : (
                <CTable responsive>
                    <CTableHead>
                        <CTableRow color='primary'>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Photo</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Section</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {products.map((product, index) => (
                            <CTableRow key={product._id}>
                                <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <img
                                        src={product.images}
                                        alt={'N/A'}
                                        style={{ width: '50px', height: '50px' }}
                                    />
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{product.name}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{product.section}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <CButton style={{ margin: '0 2px', padding: '4px' }} onClick={() => getProduct(product._id)}>
                                        <FontAwesomeIcon style={{ color: 'blue' }} icon={faEye} />
                                    </CButton>
                                    <CButton style={{ margin: '0 2px', padding: '4px' }} onClick={() => handleEditClick(product)}>
                                        <FontAwesomeIcon style={{ color: 'green' }} icon={faEdit} />
                                    </CButton>
                                    <CButton
                                        style={{ margin: '0 2px', padding: '4px' }}
                                        onClick={() => handleDelete(product._id)}
                                        disabled={loading.delete}
                                    >
                                        {loading.delete ? (
                                            <CSpinner size="sm" />
                                        ) : (
                                            <FontAwesomeIcon style={{ color: 'red' }} icon={faTrash} />
                                        )}
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            )}

            <CModal visible={addProductVisible} onClose={() => { setAddProductVisible(false) }}>
                <CModalHeader>
                    <CModalTitle>Add Product</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleAddSubmit}>
                        <CRow>
                            <CCol md="6">
                                <CFormLabel htmlFor="section">Section Of Market Place</CFormLabel>
                                <CFormSelect
                                    id="section"
                                    name="section"
                                    value={addFormData.section}
                                    onChange={handleAddChange}
                                    required
                                >
                                    <option value="">Select Market Place</option>
                                    <option value="Shop by Style">Shop by Style</option>
                                    <option value="Shop Menswear">Shop Menswear</option>
                                    <option value="Shop Womenswear">Shop Womenswear</option>
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

                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormLabel htmlFor="image">Product Image</CFormLabel>
                                <CFormInput
                                    type="file"
                                    id="image"
                                    name="Image"
                                    onChange={handleAddFileChange}
                                    required
                                />
                            </CCol>
                        </CRow>
                        <CButton
                            type="submit"
                            color="primary"
                            style={{ marginTop: '10px' }}
                            disabled={loading.add}
                        >
                            {loading.add ? (
                                <>
                                    <CSpinner as="span" size="sm" aria-hidden="true" className="me-2" />
                                    Adding...
                                </>
                            ) : 'Add Product'}
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
                    {loading.view ? (
                        <div className="d-flex justify-content-center my-5">
                            <CSpinner color="primary" />
                            <span className="ms-2">Loading product details...</span>
                        </div>
                    ) : oneProduct ? (
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
                                            src={oneProduct.images}
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
                                            <p><strong>Section:</strong> {oneProduct.section}</p>
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
                    ) : (
                        <p>No product details available</p>
                    )}
                </CModalBody>
            </CModal>

            <CModal visible={editProductVisible} onClose={handleEditModalClose}>
                <CModalHeader>
                    <CModalTitle>Edit product</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow>
                            <CCol md='6'>
                                <CFormLabel htmlFor='name'>Name</CFormLabel>
                                <CFormInput id='name' name='name' type='text' value={formData.name} onChange={handleFormChange} />
                            </CCol>
                            <CCol md='6'>
                                <CFormLabel htmlFor='section'>Section</CFormLabel>
                                <CFormSelect
                                    id="section"
                                    name="section"
                                    value={formData.section}
                                    onChange={handleFormChange}
                                >
                                    <option value="Shop by Style">Shop by Style</option>
                                    <option value="Shop Menswear">Shop Menswear</option>
                                    <option value="Shop Womenswear">Shop Womenswear</option>
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md='6'>
                                <CFormLabel htmlFor='image'>Edit Image</CFormLabel>
                                <CFormInput id='image' type='file' onChange={(e) => setSelectedFile(e.target.files[0])} />
                            </CCol>
                        </CRow>
                    </CForm>
                    <CModalFooter style={{ marginTop: '20px' }}>
                        <CButton color="secondary" onClick={handleEditModalClose}>
                            Close
                        </CButton>
                        <CButton
                            color="primary"
                            onClick={() => handleFormSubmit(formData.id)}
                            disabled={loading.edit}
                        >
                            {loading.edit ? (
                                <>
                                    <CSpinner as="span" size="sm" aria-hidden="true" className="me-2" />
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </CButton>
                    </CModalFooter>
                </CModalBody>
            </CModal>
        </div>
    )
}
export default MarketPlaceManagement;