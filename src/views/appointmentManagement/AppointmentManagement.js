import React, { useState, useEffect } from 'react';
import {
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';


const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]); // Store appointment data
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For modal
  const [userAppointmentData, setUserAppointmentData] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [stylistDetails, setStylistDetails] = useState(null);
  const [visibleModel, setVisibleModel] = useState(false);
  const [actionModal, setActionModal] = useState(false); // Toggle modal
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false)


  useEffect(() => {
    fetchAppointments();
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedStylist) {
      fetchStylistDetails(selectedStylist);
    }
  }, [selectedStylist])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3555/api/user/`, {
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setUserData(response.data.data);
    } catch (error) {
      console.error('Not able to fetch cloth data', error);
    }
  }

  const handleView = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3555/api/appointment/get-appointment/${userId}`,
        {

          headers: {
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      setUserAppointmentData(response.data.data);
      setVisibleModel(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Fetch appointments from the backend
  const fetchAppointments = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3555/api/appointment/get-appointment?userId=${id}`);
      setAppointments(response.data.data); // Update appointments
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve or decline actions
  const handleAction = async (userId, id, action) => {
    try {
      await axios.put(`http://localhost:3555/api/appointment/approve-appointment/${userId}`, {
        appointmentId: id,
        approveStatus: action
      });

      handleView(selectedAppointment.user._id);
      setActionModal(false);
    } catch (error) {
      console.error(`Error ${action} appointment:`, error);
    }
  };

  const handleDelete = async (userId, appointmentId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
      if (confirmDelete) {
        await axios.delete(`http://localhost:3555/api/appointment/delete-appointment/${appointmentId}`)
        handleView(userId);
      }
    }
    catch (err) {
      console.error("Error deleting the appointment:", err.message);
    }
  }

  const handleOpenModal = (appointment) => {
    if (appointment?.stylist) {
      setSelectedStylist(appointment.stylist?._id);
    }
    setModalVisible(true);
  }

  const fetchStylistDetails = async (stylistId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3555/api/stylist/stylist-profile/${stylistId}`,
        {

          headers: {
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setStylistDetails(response.data.stylist);
    }
    catch (error) {
      setError(error.message)
    }
    finally {
      setLoading(false);
    }
  }

  // const handleAction = async (userId, id, currentStatus) => {
  //   try {
  //     const newStatus = currentStatus === 'approved' ? 'pending' : 'approved'; // Toggle status

  //     await axios.put(`http://localhost:3555/api/appointment/approve-appointment/${userId}`, {
  //       appointmentId: id,
  //       approveStatus: newStatus
  //     });

  //     handleView(userId);


  //     toast.success(`Appointment ${newStatus === 'approved' ? 'approved' : 'set to pending'}`);
  //     fetchData(); // Refresh data
  //   } catch (error) {
  //     console.error('Error updating appointment status:', error);
  //     toast.error('Failed to update appointment status.');
  //   }
  // };

  return (
    <div>
      {/* <h3 className="mb-4">Appointment Management</h3> */}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CSpinner color="primary" size="lg" />
        </div>
      ) : (
        <CTable responsive>
          <CTableHead color='primary'>
            <CTableRow color='primary'>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{}}>Name</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{}}>Email</CTableHeaderCell>
              {/* <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Age</CTableHeaderCell>
                                <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell> */}
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {userData.map((user, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                <CTableDataCell style={{}}>{user.firstName}</CTableDataCell>
                <CTableDataCell style={{}}>{user.email}</CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center' }}>
                  <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', marginRight: '8px' }}
                    title="View" onClick={() => handleView(user._id)}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      {/* appointments from userId */}
      <CModal size='lg' visible={visibleModel} onClose={() => setVisibleModel(false)}>
        <CModalHeader onClose={() => setVisibleModel(false)}>
          <CModalTitle>Appointment Details of User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {userAppointmentData && userAppointmentData.length ? (
            <CTable responsive striped>
              <CTableHead color='primary'>
                <CTableRow color='primary'>
                  <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>User</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Stylist</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Approved</CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {userAppointmentData.map((appointment, index) => (
                  <CTableRow key={appointment._id}>
                    <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>
                      {index + 1}
                    </CTableHeaderCell>
                    <CTableDataCell style={{ textAlign: 'center' }}>
                      {appointment.user?.firstName || 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleOpenModal(appointment)}>
                      {appointment.stylist?.name || 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center' }}>
                      {new Date(appointment.date).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center' }}>
                      {appointment.approvedByStylist || 'pending'}
                    </CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center' }}>
                      {appointment.approvedByStylist === 'pending' && (
                        <>
                          <CTableDataCell style={{ textAlign: 'center' }}>
                            {/* <div
                              className="form-check form-switch"
                              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id={`flexSwitchCheckChecked-${appointment._id}`}
                                checked={appointment.approvedByStylist === 'approved'}
                                onChange={() => handleAction(appointment.user._id, appointment._id, appointment.approvedByStylist)}
                                style={{
                                  backgroundColor: appointment.approvedByStylist === 'approved' ? 'green' : ''
                                }}
                              />
                            </div> */}
                          </CTableDataCell>

                          <CButton
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setActionModal(true);
                            }}
                          >
                            <FontAwesomeIcon color="green" icon={faThumbsUp} /> {/* Thumbs Up for Approve */}
                          </CButton>
                          <CButton

                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setActionModal(true);
                            }}
                          >
                            <FontAwesomeIcon color="red" icon={faThumbsDown} />
                          </CButton>
                        </>
                      )}
                      <CButton
                        size="sm"
                        onClick={() => {
                          // setSelectedAppointment(appointment);
                          // setActionModal(true);
                          handleDelete(appointment.user._id, appointment._id);
                        }}
                      ><FontAwesomeIcon color="red" icon={faTrash} />

                      </CButton>
                    </CTableDataCell>
                    {/* <CTableDataCell>
                      <div className="form-check form-switch" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id={`flexSwitchCheckChecked-${user._id}`}
                          checked={user.status === 'activated'}
                          onChange={() => handleToggleStatus(user._id)}
                          style={{
                            backgroundColor: user.status === 'activated' ? 'green' : ''
                          }}
                        />
                      </div>
                    </CTableDataCell> */}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p>No appointments added yet!</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleModel(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for confirmation */}
      {
        selectedAppointment && (
          <CModal visible={actionModal} onClose={() => setActionModal(false)}>
            <CModalHeader>
              <CModalTitle>Confirm Action</CModalTitle>
            </CModalHeader>
            <CModalBody>
              Are you sure you want to{' '}
              <strong>
                {selectedAppointment.approvedByStylist === 'pending' ? 'approve or decline' : selectedAppointment.status}
              </strong>{' '}
              this appointment?
            </CModalBody>
            <CModalFooter>
              <CButton
                color="success"
                onClick={() => handleAction(selectedAppointment.user._id, selectedAppointment._id, 'approved')}
              >
                <FontAwesomeIcon color="green" icon={faThumbsUp} /> {/* Thumbs Up for Approve */}

              </CButton>
              <CButton
                color="danger"
                onClick={() => handleAction(selectedAppointment._id, 'declined')}
              >
                <FontAwesomeIcon color="red" icon={faThumbsDown} />
              </CButton>
              <CButton color="secondary" onClick={() => setActionModal(false)}>
                Cancel
              </CButton>
            </CModalFooter>
          </CModal>
        )
      }

      {/* Modal for stylist details */}
      {modalVisible && (
        <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <CModalHeader>
            <CModalTitle>Stylist Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : stylistDetails ? (
              <div>
                <img src={stylistDetails.profilePicture} alt={stylistDetails.name} width="150px" style={{ display: 'block', margin: '0 auto' }} />
                <p><strong>Name:</strong> {stylistDetails.name}</p>
                <p><strong>Email:</strong> {stylistDetails.email}</p>
                <p><strong>Experience:</strong> {stylistDetails.experience} years</p>
              </div>
            ) : (
              <p>No details available</p>
            )}
          </CModalBody>
        </CModal>
      )}

    </div >
  );
};

export default AppointmentManagement;
