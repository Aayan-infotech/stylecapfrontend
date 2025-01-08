import React, { useEffect, useState } from 'react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalHeader,
    CModalBody,
    CForm,
    CFormInput,
    CModalFooter,
    CFormSelect
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const MyStyleCapsuleEntity = () => {
    const [products, setProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newEntity, setNewEntity] = useState({ name: '', type: '', image: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://44.196.64.110:3555/api/entity/get`);
            const { result } = response.data;
            setProducts(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddEntity = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newEntity.name);
            formData.append('type', newEntity.type);
            formData.append('image', newEntity.image); // Attach the image file

            await axios.post(`http://44.196.64.110:3555/api/entity/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Required for file uploads
                },
            });

            setModalVisible(false);
            setNewEntity({ name: '', type: '', image: '' });
            fetchData(); // Refresh the list
        } catch (error) {
            console.error('Error adding entity:', error);
        }
    };


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://44.196.64.110:3555/api/entity/delete/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h5 style={{ margin: 0 }}>Market Place List</h5>
                <CButton color="primary" onClick={() => setModalVisible(true)}>
                    Add Product
                </CButton>
            </div>
            <CTable responsive hover>
                <CTableHead>
                    <CTableRow color="primary">
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center', width: '5%' }}>#</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center', width: '20%' }}>Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center', width: '15%' }}>Type</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center', width: '20%' }}>Image</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center', width: '20%' }}>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <CTableRow key={product._id}>
                                <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>
                                    {index + 1}
                                </CTableHeaderCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{product.name}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>{product.type}</CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                                    />
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    {/* <CButton
                                        style={{
                                            color: 'blue',

                                        }}
                                        size="sm"
                                        onClick={() => console.log(`Viewing product ${product._id}`)}
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </CButton> */}
                                    <CButton
                                        style={{
                                            color: 'green',
                                        }}
                                        size="sm"
                                        onClick={() => console.log(`Editing product ${product._id}`)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </CButton>
                                    <CButton
                                        style={{
                                            color: 'red',
                                        }}
                                        size="sm"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </CButton>
                                </CTableDataCell>

                            </CTableRow>
                        ))
                    ) : (
                        <CTableRow>
                            <CTableDataCell colSpan="5" style={{ textAlign: 'center' }}>
                                No products available.
                            </CTableDataCell>
                        </CTableRow>
                    )}
                </CTableBody>
            </CTable>


            {/* Add Product Modal */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader>Add New Product</CModalHeader>
                <CModalBody>
                    <CForm>
                    <CFormSelect
                            label="Type"
                            value={newEntity.type}
                            onChange={(e) => setNewEntity({ ...newEntity, type: e.target.value })}
                        >   
                            <option value="" disabled>Select Type</option>
                            <option value="mood">Mood</option>
                            <option value="style">Style</option>
                            <option value="occassion">Occasion</option>
                        </CFormSelect>
                        <CFormInput
                            label="Name"
                            onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                        />
                        <CFormInput
                            type="file"
                            label="Image"
                            onChange={(e) => setNewEntity({ ...newEntity, image: e.target.files[0] })}
                        />
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleAddEntity}>Add</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default MyStyleCapsuleEntity;