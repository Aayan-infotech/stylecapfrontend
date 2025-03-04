import React, { useEffect, useState } from 'react';
import {
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CSpinner, // CoreUI Spinner Component
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ReviewManagement = () => {
    const [review, setReview] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true); // Set loading to true before fetching
            const response = await axios.get(`http://54.236.98.193:3555/api/review/get`);
            setReview(response.data.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://54.236.98.193:3555/api/review/delete/${id}`);
                fetchData();
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };

    return (
        <div>
            {loading ? (
                // Display spinner while loading is true
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <CSpinner color="primary" size="lg" />
                </div>
            ) : (
                <CTable responsive>
                    <CTableHead>
                        <CTableRow color='primary'>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Stylist Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Specialization</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>User</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Ratings</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Date</CTableHeaderCell>
                            <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {review
                            .filter(r => r.stylistId) // Include only items with stylistId
                            .map((filteredReview, index) => (
                                <CTableRow key={filteredReview._id}>
                                    <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>
                                        {filteredReview.stylistId?.name || "null"}
                                    </CTableDataCell>
                                    <CTableDataCell style={{ textAlign: 'center' }}>
                                        {filteredReview.stylistId?.specialization?.length > 0
                                            ? filteredReview.stylistId.specialization.join(', ')
                                            : "null"}
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
                            ))}
                    </CTableBody>
                </CTable>
            )}
        </div>
    );
};

export default ReviewManagement;
