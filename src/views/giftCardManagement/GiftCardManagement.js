import React, { useEffect, useState } from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CSpinner,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CFormLabel,
    CFormInput,
    CModalFooter
} from '@coreui/react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const GiftCardList = () => {
    const [giftCards, setGiftCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        giftTitle: '',
        giftDescription: '',
        productId: '',
        discountPrice: '',
        offerValidity: '',
    });

    const fetchGiftCards = async () => {
        try {
            const res = await axios.get('http://18.209.91.97:3555/api/gifts/all'); // adjust endpoint if needed
            setGiftCards(res.data.data);
        } catch (error) {
            console.error('Failed to fetch gift cards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGiftCard = async () => {
        try {
            const payload = {
                giftTitle: formData.giftTitle || 'Exclusive Gift Card',
                giftDescription: formData.giftDescription,
                productId: formData.productId,
                discountPrice: formData.discountPrice,
                offerValidity: formData.offerValidity,
            };

            await axios.post('http://18.209.91.97:3555/api/gifts/create-gift', payload);

            setModalOpen(false);
            setFormData({
                giftTitle: '',
                giftDescription: '',
                productId: '',
                discountPrice: '',
                offerValidity: '',
            });
            fetchGiftCards();
        } catch (err) {
            console.error('Error adding gift card:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDeleteGiftCard = async (id) => {
        if (!window.confirm('Are you sure you want to delete this gift card?')) return;
        try {
            await axios.delete(`http://18.209.91.97:3555/api/gifts/delete-giftcard/${id}`);
            fetchGiftCards(); // Refresh list after deletion
        } catch (err) {
            console.error('Error deleting gift card:', err);
        }
    };


    useEffect(() => {
        fetchGiftCards();
    }, []);

    return (
        <>
            <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Gift Card Management</h5>
                    <CButton color="primary" onClick={() => setModalOpen(true)}>
                        Add Gift Card
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    {loading ? (
                        <CSpinner />
                    ) : (
                        <CTable striped hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>Title</CTableHeaderCell>
                                    <CTableHeaderCell>Description</CTableHeaderCell>
                                    <CTableHeaderCell>Promo Code</CTableHeaderCell>
                                    <CTableHeaderCell>Discount Price</CTableHeaderCell>
                                    <CTableHeaderCell>Validity</CTableHeaderCell>
                                    <CTableHeaderCell>Created At</CTableHeaderCell>
                                    <CTableHeaderCell>Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {giftCards?.length > 0 ? (
                                    giftCards.map((card) => (
                                        <CTableRow key={card._id}>
                                            <CTableDataCell>{card.giftTitle}</CTableDataCell>
                                            <CTableDataCell>{card.giftDescription}</CTableDataCell>
                                            <CTableDataCell>{card.giftPromoCode}</CTableDataCell>
                                            <CTableDataCell>${card.discountPrice}</CTableDataCell>
                                            <CTableDataCell>{card.offerValidity}</CTableDataCell>
                                            <CTableDataCell>
                                                {new Date(card.createdAt).toLocaleString()}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButton style={{ margin: '0 2px', padding: '4px' }}>
                                                    <FontAwesomeIcon
                                                        style={{ color: 'red' }}
                                                        onClick={() => handleDeleteGiftCard(card._id)}
                                                        icon={faTrash}
                                                    />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))
                                ) : (
                                    <CTableRow>
                                        <CTableDataCell
                                            colSpan="7"
                                            className="text-center py-4"
                                            style={{ fontStyle: 'italic', color: '#6c757d' }}
                                        >
                                            No gift cards found
                                        </CTableDataCell>
                                    </CTableRow>
                                )}
                            </CTableBody>
                        </CTable>
                    )}
                </CCardBody>
            </CCard>

            {/* Add Gift Card Modal */}
            <CModal visible={modalOpen} onClose={() => setModalOpen(false)}>
                <CModalHeader>
                    <CModalTitle>Add Gift Card</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Title</CFormLabel>
                    <CFormInput
                        name="giftTitle"
                        value={formData.giftTitle}
                        onChange={handleChange}
                        required />

                    <CFormLabel className="mt-2">Description</CFormLabel>
                    <CFormInput
                        name="giftDescription"
                        value={formData.giftDescription}
                        onChange={handleChange}
                        required />

                    <CFormLabel className="mt-2">Promo Code</CFormLabel>
                    <CFormInput
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        required />

                    <CFormLabel className="mt-2">Discount Price</CFormLabel>
                    <CFormInput
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        required />

                    <CFormLabel className="mt-2">Offer Validity (YYYY-MM-DD)</CFormLabel>
                    <CFormInput
                        name="offerValidity"
                        type="date"
                        value={formData.offerValidity}
                        onChange={handleChange}
                        required />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalOpen(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={handleAddGiftCard}>
                        Add
                    </CButton>
                </CModalFooter>
            </CModal>

        </>
    );
};

export default GiftCardList;
