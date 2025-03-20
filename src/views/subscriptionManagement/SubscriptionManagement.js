import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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


const SubscriptionManagement = () => {
  const [userData, setUserData] = useState([]);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
      fetchData();
      subscriptionAnalytics();
  }, []);

  const fetchData = async () => {
      try {
          const token = localStorage.getItem('token');

          if (!token) {
              throw new Error('No token found. Please log in.');
          }
          const response = await axios.get(`http://3.223.253.106:3555/api/user/`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          setUserData(response.data.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
  }

  const subscriptionOptions = ['Free', 'Basic', 'Premium'];

  const changeSubscription = async(id, option) => {
    try{
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://3.223.253.106:3555/api/subscription/update-subscription/${id}`,{option},
        {
          headers: {
            'Authorization': `Bearer ${token}`
        }
        });
        fetchData();
        subscriptionAnalytics();
        if (response.status === 200) {
          console.log('Subscription updated successfully:', response.data);
          return response.data; 
        } else {
          console.error('Failed to update subscription:', response.data);
        }
    }catch(error){
      console.error("error", error);
    }
  }

  const subscriptionAnalytics = async() => {
    try{
      const response = await axios.get(`http://3.223.253.106:3555/api/subscription/`);
      setAnalytics(response.data);
    }catch(error){
      console.error(error);
    }
  }


  return (
      <>
       <CRow>
            <CCol xs="12" sm="6" md="4" lg="3" className="mb-4">
              <CCard color='primary' style={{
                color: 'white', width: '100%', height: '10rem',
                borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', display: 'flex',
                justifyContent: 'center', alignItems: 'center', padding: '1rem'
              }}>
                <CCardBody>
                  <CCardTitle style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Total Subscription</CCardTitle>
                  <CCardText style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                    {analytics.length}
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol xs="12" sm="6" md="4" lg="3" className="mb-4">
              <CCard color='info' style={{
                color: 'white', width: '100%', height: '10rem',
                borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', display: 'flex',
                justifyContent: 'center', alignItems: 'center', padding: '1rem'
              }}>
                <CCardBody>
                  <CCardTitle style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Premium</CCardTitle>
                  <CCardText style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                    {analytics.premium}
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol xs="12" sm="6" md="4" lg="3" className="mb-4">
              <CCard color='warning' style={{
                color: 'white', width: '100%', height: '10rem',
                borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', display: 'flex',
                justifyContent: 'center', alignItems: 'center', padding: '1rem'
              }}>
                <CCardBody>
                  <CCardTitle style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Basic</CCardTitle>
                  <CCardText style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                    {analytics.basic}
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>

            <CCol xs="12" sm="6" md="4" lg="3" className="mb-4">
              <CCard color='danger' style={{
                color: 'white', width: '100%', height: '10rem',
                borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', display: 'flex',
                justifyContent: 'center', alignItems: 'center', padding: '1rem'
              }}>
                <CCardBody>
                  <CCardTitle style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Free</CCardTitle>
                  <CCardText style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
                    {analytics.free}
                  </CCardText>
                </CCardBody>
              </CCard>
            </CCol>
       </CRow>

          


          <CTable responsive>
              <CTableHead>
                  <CTableRow color='primary'>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Subscription</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell>
                  </CTableRow>
              </CTableHead>
              <CTableBody>
                  {
                      userData.map((user, index) => (
                          <CTableRow key={user.id}>
                              <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                              <CTableDataCell style={{ textAlign: 'center' }}>{user.firstName}</CTableDataCell>
                              <CTableDataCell style={{ textAlign: 'center' }}>{user.email}</CTableDataCell>
                              <CTableDataCell style={{ textAlign: 'center' }}>
                                <CDropdown>
                                  <CDropdownToggle style={{ color: 'blue' }} caret>
                                    {user.subscription || 'Choose Subscription'}
                                  </CDropdownToggle>
                                  <CDropdownMenu>
                                    {subscriptionOptions.filter(option => option !== user.subscription).map((option, index) => (
                                      <CDropdownItem onClick={()=> {changeSubscription(user._id, option)}} key={index}>
                                        {option}
                                      </CDropdownItem>
                                    ))}
                                  </CDropdownMenu>
                                </CDropdown>
                              </CTableDataCell>
                              <CTableDataCell style={{ textAlign: 'center', color: user.status==='activated'?'green':'red' }}>{user.status}</CTableDataCell>
                          </CTableRow>
                      ))
                  }
              </CTableBody>
          </CTable>
      </>
  );
}

export default SubscriptionManagement
