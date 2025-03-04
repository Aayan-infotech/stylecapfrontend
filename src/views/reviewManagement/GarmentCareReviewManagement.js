import { React, useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardText,
    CCardTitle,
    CCol,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
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

const ReviewManagement = () => {

    const [review, setReview] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3555/api/review/get`,
                // {
                //     headers:{
                //         'Authorization': `Bearer ${token}`
                //     }
                // }
            )
            setReview(response.data.data);
            // console.log(response.data.stylists);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3555/api/review/delete/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };


    return (
        <div>
            <CTable responsive>
                <CTableHead>
                    <CTableRow color='primary'>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Service Provider</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Service</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>User</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Ratings</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Date</CTableHeaderCell>
                        <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        review
                            .filter(r => r.serviceId) // Only include items with serviceId but not stylistId
                            .map((filteredReview, index) => (
                                <CTableRow key={filteredReview._id}>
                                    <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>
                                        {filteredReview.serviceId?.ServiceProvider?.name || "null"}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>
                                        {filteredReview.serviceId?.service || "null"}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>
                                        {filteredReview.reviewerId?.firstName || "null"}
                                    </CTableDataCell>
                                    {/* <CTableDataCell style={{ textAlign: 'center' }}>
                                        {filteredReview.ratings}
                                    </CTableDataCell> */}
                                    <CTableDataCell style={{ textAlign: 'center' }}>
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <span key={index} style={{ color: index < filteredReview.ratings ? 'gold' : 'lightgray', fontSize: '24px' }}>
                                                {index < filteredReview.ratings ? '★' : '☆'}
                                            </span>
                                        ))}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>
                                        {filteredReview.createdAt.split('T')[0]}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>
                                        <CButton
                                            style={{ color: 'red' }}
                                            size="sm"
                                            onClick={() => handleDelete(filteredReview._id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))
                    }
                </CTableBody>

            </CTable>
        </div>
    )
}

export default ReviewManagement;
