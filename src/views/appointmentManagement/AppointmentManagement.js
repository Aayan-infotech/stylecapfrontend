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
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';


const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]); // Store appointment data
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For modal
  const [userAppointmentData, setUserAppointmentData] = useState([]);
  const [visibleModel, setVisibleModel] = useState(false);
  const [actionModal, setActionModal] = useState(false); // Toggle modal
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://44.196.64.110:3555/api/user/`, {
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
      const response = await axios.get(`http://44.196.64.110:3555/api/appointment/get-appointment/${userId}`,
        {

          headers: {
            // 'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      setUserAppointmentData(response.data.data);
      console.log('userAppointmentData', userAppointmentData);

      setVisibleModel(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Fetch appointments from the backend
  const fetchAppointments = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://44.196.64.110:3555/api/appointment/get-appointment?userId=${id}`);
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
      await axios.put(`http://44.196.64.110:3555/api/appointment/approve-appointment/${userId}`, {
        appointmentId: id,
        approveStatus: action
      });

      handleView(selectedAppointment.userId._id);
      setActionModal(false);
    } catch (error) {
      console.error(`Error ${action} appointment:`, error);
    }
  };

  const handleDelete = async (userId, appointmentId) => {
    try {

      console.log("data incoming in delete: ", userId, appointmentId)
      await axios.delete(`http://44.196.64.110:3555/api/appointment/delete-appointment/${appointmentId}`)
      handleView(userId);
    }
    catch (err) {
      console.error("Error deleting the appointment:", err.message);
    }
  }

  const handleOpenModal = (appointment) => {
    setSelectedStylist(appointment.stylistId?._id);
    setModalVisible(true);
  }

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
                      {appointment.userId?.firstName || 'N/A'}
                    </CTableDataCell>
                    <CTableDataCell style={{ textAlign: 'center' }} onClick={() => handleOpenModal(appointment)}>
                      {appointment.stylistId?.name || 'N/A'}
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
                          <CButton
                            color="success"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setActionModal(true);
                            }}
                          >
                            Approve
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setActionModal(true);
                            }}
                          >
                            Decline
                          </CButton>
                        </>
                      )}
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => {
                          // setSelectedAppointment(appointment);
                          // setActionModal(true);
                          handleDelete(appointment.userId._id, appointment._id);
                        }}
                      >
                        Delete
                      </CButton>
                    </CTableDataCell>
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
                onClick={() => handleAction(selectedAppointment.userId._id, selectedAppointment._id, 'approved')}
              >
                Approve
              </CButton>
              <CButton
                color="danger"
                onClick={() => handleAction(selectedAppointment._id, 'declined')}
              >
                Decline
              </CButton>
              <CButton color="secondary" onClick={() => setActionModal(false)}>
                Cancel
              </CButton>
            </CModalFooter>
          </CModal>
        )
      }
    </div >
  );
};

export default AppointmentManagement;
