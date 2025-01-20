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

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]); // Store appointment data
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For modal
  const [actionModal, setActionModal] = useState(false); // Toggle modal

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch appointments from the backend
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://44.196.64.110:3555/api/appointments');
      setAppointments(response.data.data); // Update appointments
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle approve or decline actions
  const handleAction = async (id, action) => {
    try {
      await axios.put(`http://44.196.64.110:3555/api/appointments/${id}/${action}`);
      fetchAppointments(); // Refresh after action
      setActionModal(false);
    } catch (error) {
      console.error(`Error ${action} appointment:`, error);
    }
  };

  return (
    <div>
      {/* <h3 className="mb-4">Appointment Management</h3> */}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CSpinner color="primary" size="lg" />
        </div>
      ) : (
        <CTable responsive striped>
          <CTableHead color='primary'>
            <CTableRow color='primary'>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>User</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Date</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell>
              <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {appointments.map((appointment, index) => (
              <CTableRow key={appointment._id}>
                <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>
                  {index + 1}
                </CTableHeaderCell>
                <CTableDataCell style={{ textAlign: 'center' }}>
                  {appointment.user?.name || 'N/A'}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center' }}>
                  {new Date(appointment.date).toLocaleDateString()}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center' }}>
                  {appointment.status || 'Pending'}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center' }}>
                  {appointment.status === 'Pending' && (
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
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}

      {/* Modal for confirmation */}
      {selectedAppointment && (
        <CModal visible={actionModal} onClose={() => setActionModal(false)}>
          <CModalHeader>
            <CModalTitle>Confirm Action</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to{' '}
            <strong>
              {selectedAppointment.status === 'Pending' ? 'approve or decline' : selectedAppointment.status}
            </strong>{' '}
            this appointment?
          </CModalBody>
          <CModalFooter>
            <CButton
              color="success"
              onClick={() => handleAction(selectedAppointment._id, 'approve')}
            >
              Approve
            </CButton>
            <CButton
              color="danger"
              onClick={() => handleAction(selectedAppointment._id, 'decline')}
            >
              Decline
            </CButton>
            <CButton color="secondary" onClick={() => setActionModal(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </div>
  );
};

export default AppointmentManagement;
