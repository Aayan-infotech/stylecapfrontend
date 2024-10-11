import {React, useEffect, useState} from 'react'
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

const StylistManagement = () => {

  const [stylist, setStylist] = useState([]);

  useEffect(()=>{
    fetchData();
  })

  const fetchData = async () => {
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/stylist/get-stylist`,
            {
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        setStylist(response.data.stylists);
        // console.log(response.data.stylists);
    }catch(error){
        console.error(error);
    }
  }


  return (
    <div>
        <CTable responsive>
              <CTableHead>
                  <CTableRow color='primary'>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Photo</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Email</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Phone No.</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Communicate</CTableHeaderCell>
                      <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Performance</CTableHeaderCell>
                  </CTableRow>
              </CTableHead>
              <CTableBody>
                  {
                      stylist.map((stylist, index) => (
                          <CTableRow key={stylist._id}>
                              <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
                              <CTableDataCell style={{ textAlign: 'center' }}>
                                <img
                                    src={stylist.profilePicture} // Ensure this is the correct path to the image
                                    alt={'N/A'} // Provide an alt text for accessibility
                                    style={{ width: '50px', height: '50px', borderRadius: '50%' }} // Adjust size and shape as needed
                                />
                              </CTableDataCell>

                              <CTableDataCell style={{ textAlign: 'center' }}>{stylist.name}</CTableDataCell>
                              <CTableDataCell style={{ textAlign: 'center' }}>{stylist.email}</CTableDataCell>
                              <CTableDataCell style={{ textAlign: 'center' }}>{stylist.phone}</CTableDataCell>
                              <CTableDataCell style={{ textAlign: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    style={{
                                    width: '80%', 
                                    padding: '0.5rem',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                                />
                                </CTableDataCell>
                                <CTableDataCell style={{ textAlign: 'center' }}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <span key={index} style={{  color: index < stylist.ratings ? 'gold' : 'lightgray', fontSize: '24px'  }}>
                                        {index < stylist.ratings ? '★' : '☆'}
                                        </span>
                                    ))}
                                </CTableDataCell>
                          </CTableRow>
                      ))
                  }
              </CTableBody>
          </CTable>
    </div>
  )
}

export default StylistManagement
