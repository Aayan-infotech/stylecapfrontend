import React, { useState } from 'react';

import {
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faClock, faEye, faDownload, faHourglass } from '@fortawesome/free-solid-svg-icons';

const UserManagement = () => {

    return (
        <>
            <CTable>
                <CTableHead>
                    <CTableRow color='primary'>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Age</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow>
                        <CTableHeaderCell scope="row">1</CTableHeaderCell>
                        <CTableDataCell>Mark</CTableDataCell>
                        <CTableDataCell>Otto</CTableDataCell>
                        <CTableDataCell>@mdo</CTableDataCell>
                        <CTableDataCell>
                            <CIcon icon={cilHome } title="View" style={{ cursor: 'pointer' }} />
                            <CIcon icon={cilEyeSlash } title="View" style={{ cursor: 'pointer' }} />
                            <CIcon icon={cilPen} title="Edit" style={{ color:'blue', cursor: 'pointer', marginRight: '8px' }} />
                            <CIcon icon={cilTrash} title="Delete" style={{color:'red', cursor: 'pointer', marginRight: '8px' }} />
                        </CTableDataCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">2</CTableHeaderCell>
                        <CTableDataCell>Jacob</CTableDataCell>
                        <CTableDataCell>Thornton</CTableDataCell>
                        <CTableDataCell>@fat</CTableDataCell>    
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">3</CTableHeaderCell>
                        <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                        <CTableDataCell>@twitter</CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
        </>
    );
}
export default UserManagement;