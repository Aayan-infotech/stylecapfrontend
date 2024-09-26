import React, { useEffect, useState } from 'react'
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const shoes = () => {

    const [shoesData, setShoesData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/cloths/get-by-category/shoes`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setShoesData(response.data);
            console.log(response.data);

        } catch (error) {
            console.error('failed to fetch shoes data', error);
        }
    }

    return (
        <div>
            <CTable>
                <CTableHead color='primary'>
                    <CTableRow>
                        <CTableHeaderCell style={{textAlign:'center'}} scope="col">#</CTableHeaderCell>
                        <CTableHeaderCell style={{textAlign:'center'}} scope="col">Image</CTableHeaderCell>
                        <CTableHeaderCell style={{textAlign:'center'}} scope="col">Brand</CTableHeaderCell>
                        <CTableHeaderCell style={{textAlign:'center'}} scope="col">Type</CTableHeaderCell>
                        <CTableHeaderCell style={{textAlign:'center'}} scope="col">Color</CTableHeaderCell>
                        <CTableHeaderCell style={{textAlign:'center'}} scope="col">Season</CTableHeaderCell>
                        <CTableHeaderCell style={{textAlign:'center'}} scope="col">Purchase Date</CTableHeaderCell>
                        <CTableHeaderCell style={{textAlign:'center'}} scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {shoesData.map((shoes, index) => (
                        <CTableRow key={index}>
                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>

                            <CTableDataCell style={{textAlign:'center'}}>
                                {shoes.picture ? (
                                    <img src={shoes.picture} alt="shoe" width="50" height="50" />
                                ) : (
                                    'No Image Available'
                                )}
                            </CTableDataCell>
                            <CTableDataCell style={{textAlign:'center'}}>{shoes.brand}</CTableDataCell>
                            <CTableDataCell style={{textAlign:'center'}}>{shoes.typesOfCloths}</CTableDataCell>
                            <CTableDataCell style={{textAlign:'center'}}>{shoes.color}</CTableDataCell>
                            <CTableDataCell style={{textAlign:'center'}}>{shoes.season}</CTableDataCell>
                            <CTableDataCell style={{textAlign:'center'}}>
                                {shoes.purchaseDate
                                    ? new Date(shoes.purchaseDate).toLocaleDateString()
                                    : 'No Date Available'}
                            </CTableDataCell>
                            <CTableDataCell style={{textAlign:'center'}}>
                                <button style={{backgroundColor:'transparent', border:'none'}}>
                                    <FontAwesomeIcon icon={faEye} color='blue'/>
                                </button>
                                <button style={{backgroundColor:'transparent', border:'none'}}>
                                    <FontAwesomeIcon icon={faEdit} color='green'/>
                                </button>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>
        </div>
    )
}

export default shoes
