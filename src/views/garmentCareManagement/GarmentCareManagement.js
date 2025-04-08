import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    CCard, CCardBody, CCardHeader, CButton,
    CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow,
    CSpinner, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CFormInput, CFormLabel, CFormSelect
} from '@coreui/react'


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const GarmentCarePanel = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [visible, setVisible] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        address: '',
        experience: '',
        service: [],
    })

    useEffect(() => {
        fetchGarmentCare()
    }, [])

    const fetchGarmentCare = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get('http://localhost:3555/api/garment/garment-care',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            setData(res.data.data)
        } catch (error) {
            console.error('Failed to fetch garment care providers:', error)
        } finally {
            setLoading(false)
        }
    }

    const today = new Date().toISOString().split('T')[0] // format: YYYY-MM-DD

    const handleAdd = async () => {
        try {
            const payload = {
                ServiceProvider: {
                    name: form.name,
                    email: form.email,
                    mobile: form.mobile,
                    address: form.address,
                    experience: form.experience,
                },
                service: form.service.length ? form.service : [],
                startTime: new Date(`${today}T${form.startTime}`),
                endTime: new Date(`${today}T${form.endTime}`),
            }

            await axios.post('http://localhost:3555/api/garment', payload)
            setVisible(false)
            setForm({
                name: '',
                email: '',
                mobile: '',
                address: '',
                experience: '',
                service: [],
                startTime: '',
                endTime: '',
            })
            fetchGarmentCare()
        } catch (err) {
            console.error("Error adding garment care provider:", err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this garment care provider?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:3555/api/garment/delete/${id}`);
            fetchGarmentCare();
        }
        catch (error) {
            return console.error("Error deleting garment care provider:", error);
        }
    }

    const handleEditClick = (item) => {
        setIsEditMode(true)
        setEditId(item._id)
        setForm({
            name: item.ServiceProvider.name,
            email: item.ServiceProvider.email,
            mobile: item.ServiceProvider.mobile,
            address: item.ServiceProvider.address,
            experience: item.ServiceProvider.experience,
            service: item.service || [],
            startTime: item.startTime?.slice(11, 16) || '',  // extract "HH:mm"
            endTime: item.endTime?.slice(11, 16) || '',
        })
        setVisible(true)
    }

    const handleUpdate = async () => {
        try {
            const payload = {
                ServiceProvider: {
                    name: form.name,
                    email: form.email,
                    mobile: form.mobile,
                    address: form.address,
                    experience: form.experience,
                },
                service: form.service,
                startTime: form.startTime,
                endTime: form.endTime,
            }

            await axios.put(`http://localhost:3555/api/garment/update/${editId}`, payload)
            alert("Garment care provider updated successfully.")
            setVisible(false)
            setIsEditMode(false)
            setEditId(null)
            fetchGarmentCare()
        } catch (error) {
            console.error("Error updating garment care provider:", error)
            alert("Update failed. Please try again.")
        }
    }


    return (

        <>

            <CCard className="mb-4">
                <CCardHeader className="d-flex justify-content-between align-items-center">
                    <strong>Garment Care Providers</strong>
                    <CButton color="primary" onClick={() => setVisible(true)}>Add New</CButton>
                </CCardHeader>
                <CCardBody>
                    {loading ? (
                        <div className="text-center"><CSpinner color="primary" /></div>
                    ) : (
                        <CTable striped hover responsive>
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell>Name</CTableHeaderCell>
                                    <CTableHeaderCell>Email</CTableHeaderCell>
                                    <CTableHeaderCell>Mobile</CTableHeaderCell>
                                    {/* <CTableHeaderCell>Address</CTableHeaderCell> */}
                                    <CTableHeaderCell>Experience</CTableHeaderCell>
                                    <CTableHeaderCell>Services</CTableHeaderCell>
                                    {/* <CTableHeaderCell>Start Time</CTableHeaderCell>
                                <CTableHeaderCell>End Time</CTableHeaderCell> */}
                                    <CTableHeaderCell >Actions</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {data.map((item) => (
                                    <CTableRow key={item._id}>
                                        <CTableDataCell>{item.ServiceProvider.name}</CTableDataCell>
                                        <CTableDataCell>{item.ServiceProvider.email}</CTableDataCell>
                                        <CTableDataCell>{item.ServiceProvider.mobile}</CTableDataCell>
                                        {/* <CTableDataCell>{item.ServiceProvider.address}</CTableDataCell> */}
                                        <CTableDataCell>{item.ServiceProvider.experience}</CTableDataCell>
                                        <CTableDataCell>{item.service?.join(', ')}</CTableDataCell>
                                        {/* <CTableDataCell>{new Date(item.startTime).toLocaleTimeString()}</CTableDataCell>
                                    <CTableDataCell>{new Date(item.endTime).toLocaleTimeString()}</CTableDataCell> */}
                                        <CTableDataCell>
                                            <CButton style={{ color: "white" }} color="info" size="sm" className="me-2" onClick={() => handleEditClick(item)}>
                                                <FontAwesomeIcon icon={faPen} /> Edit
                                            </CButton>

                                            <CButton style={{ color: "white" }} color="danger" size="sm" onClick={() => handleDelete(item._id)}> <FontAwesomeIcon icon={faTrash} />Delete</CButton>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    )}
                </CCardBody>
            </CCard>

            {/* Add Modal */}
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Add Garment Care Provider</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CFormLabel>Name</CFormLabel>
                    <CFormInput name="name" value={form.name} onChange={handleChange} />

                    <CFormLabel className="mt-2">Email</CFormLabel>
                    <CFormInput name="email" value={form.email} onChange={handleChange} />

                    <CFormLabel className="mt-2">Mobile</CFormLabel>
                    <CFormInput name="mobile" value={form.mobile} onChange={handleChange} />

                    <CFormLabel className="mt-2">Address</CFormLabel>
                    <CFormInput name="address" value={form.address} onChange={handleChange} />

                    <CFormLabel className="mt-2">Experience</CFormLabel>
                    <CFormInput name="experience" value={form.experience} onChange={handleChange} />

                    <CFormLabel className="mt-2">Services (comma separated)</CFormLabel>
                    <CFormInput
                        type="text"
                        name="service"
                        value={form.service.join(', ')}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                service: e.target.value.split(',').map((s) => s.trim()),
                            }))
                        }
                    />
                    <CFormLabel className="mt-2">Start Time</CFormLabel>
                    <CFormInput
                        type="time"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                    />

                    <CFormLabel className="mt-2">End Time</CFormLabel>
                    <CFormInput
                        type="time"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                    />
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={isEditMode ? handleUpdate : handleAdd}>
                        {isEditMode ? 'Update' : 'Add'}
                    </CButton>
                </CModalFooter>
            </CModal>

        </>


    )
}

export default GarmentCarePanel
