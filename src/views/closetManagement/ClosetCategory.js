// import { CButton, CCard, CForm, CCardBody, CCardFooter, CCardHeader, CCol, CModal, CModalBody, CModalHeader, CModalTitle, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CFormLabel, CFormInput, CModalFooter } from '@coreui/react';
// import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react'

// const accessories = () => {

//   const [data, setData] = useState([]);
//   const [userData, setUserData] = useState([]);
//   const [userAccessoriesData, setUserAccessoriesData] = useState([]);
//   const [visibleModel, setVisibleModel] = useState(false);
//   const [acessoriesData, setAcessoriesData] = useState([]);
//   const [viewAccessories, setViewAccessories] = useState(false);
//   const [editAccessoriesVisible, setEditAccessoriesVisible] = useState(false);
//   const [formData, setFormData] = useState([]);
//   const [selectedFile, setSelectedFile] = useState([]);
//   const category = "accessories"
//   useEffect(() => {
//     fetchData();
//   }, [])

//   // const fetchData = async () => {
//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     const response = await axios.get(`http://54.236.98.193:3555/api/cloths/get-by-category/accessories`, {
//   //       headers: {
//   //         'Authorization': `Bearer ${token}`
//   //       },
//   //     });
//   //     setData(response.data);
//   //   } catch (error) {
//   //     console.log("Error fetching Data", error);
//   //   }
//   // }

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://54.236.98.193:3555/api/user/`, {
//         headers: {
//           // 'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       setUserData(response.data.data);
//       console.log("abc", response.data)
//     } catch (error) {
//       console.error('Not able to fetch cloth data', error);
//     }
//   }

//   const handleView = async (category, userId) => {
//     try {
//       const response = await axios.get(`http://54.236.98.193:3555/api/cloths/all-cloths/${category}/${userId}`)
//       setUserAccessoriesData(response.data.cloths);
//       setVisibleModel(true);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }

//   const fetchaccessoriesData = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://54.236.98.193:3555/api/cloths/getClothById/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setAcessoriesData(response.data.data);
//       setViewAccessories(true);

//     } catch (error) {
//       console.error("Error fetching Acessories", error);
//     }
//   }

//   const handleEditClick = (accessories) => {
//     setEditAccessoriesVisible(true);
//     setFormData({
//       id: accessories._id,
//       brand: accessories.brand,
//       color: accessories.color,
//       typesOfCloths: accessories.typesOfCloths,
//       season: accessories.season,
//       purchaseDate: new Date(accessories.purchaseDate).toISOString().split('T')[0],
//       description: accessories.description,
//     });
//   }

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   }

//   const handleFormSubmit = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       const formDataToSend = new FormData();

//       // Append form data
//       formDataToSend.append('brand', formData.brand);
//       formDataToSend.append('color', formData.color);
//       formDataToSend.append('typesOfCloths', formData.typesOfCloths);
//       formDataToSend.append('season', formData.season);
//       formDataToSend.append('purchaseDate', formData.purchaseDate);
//       formDataToSend.append('description', formData.description);

//       // Append file if selected
//       if (selectedFile) {
//         formDataToSend.append('picture', selectedFile);
//       }

//       await axios.put(`http://54.236.98.193:3555/api/cloths/update-cloths/${id}`, formDataToSend, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',  // Use multipart/form-data for file uploads
//         },
//       });

//       setEditAccessoriesVisible(false);
//       fetchData();  // Refresh the list after editing
//     } catch (error) {
//       console.error('Failed to update shoe data', error);
//     }
//   }

//   return (
//     <div>
//       <CTable responsive>
//         <CTableHead color='primary'>
//           <CTableRow color='primary'>
//             <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>#</CTableHeaderCell>
//             <CTableHeaderCell scope="col" style={{}}>Name</CTableHeaderCell>
//             <CTableHeaderCell scope="col" style={{}}>Email</CTableHeaderCell>
//             {/* <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Age</CTableHeaderCell>
//                               <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Status</CTableHeaderCell> */}
//             <CTableHeaderCell scope="col" style={{ textAlign: 'center' }}>Actions</CTableHeaderCell>
//           </CTableRow>
//         </CTableHead>
//         <CTableBody>
//           {userData.map((user, index) => (
//             <CTableRow key={index}>
//               <CTableHeaderCell scope="row" style={{ textAlign: 'center' }}>{index + 1}</CTableHeaderCell>
//               <CTableDataCell style={{}}>{user.firstName}</CTableDataCell>
//               <CTableDataCell style={{}}>{user.email}</CTableDataCell>
//               <CTableDataCell style={{ textAlign: 'center' }}>
//                 <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', marginRight: '8px' }}
//                   title="View" onClick={() => handleView(category, user._id)}>
//                   <FontAwesomeIcon icon={faEye} />
//                 </button>
//               </CTableDataCell>
//             </CTableRow>
//           ))}
//         </CTableBody>
//       </CTable>

//       {/* accessories from userId */}
//       <CModal size='lg' visible={visibleModel} onClose={() => setVisibleModel(false)}>
//         <CModalHeader onClose={() => setVisibleModel(false)}>
//           <CModalTitle>Accessories Details of User</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           {userAccessoriesData && userAccessoriesData.length ? (
//             <CTable responsive>
//               <CTableHead color='primary'>
//                 <CTableRow>
//                   <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">#</CTableHeaderCell>
//                   <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Image</CTableHeaderCell>
//                   <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Brand</CTableHeaderCell>
//                   <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Type</CTableHeaderCell>
//                   <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Color</CTableHeaderCell>
//                   <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Season</CTableHeaderCell>
//                   <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Purchase Date</CTableHeaderCell>
//                   <CTableHeaderCell style={{ textAlign: 'center' }} scope="col">Actions</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {userAccessoriesData.map((accessories, index) => (
//                   <CTableRow key={index}>
//                     <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
//                     <CTableDataCell style={{ textAlign: 'center' }}>
//                       {accessories.picture ? (
//                         <img src={accessories.picture} alt="shoe" width="50" height="50" />
//                       ) : (
//                         'No Image Available'
//                       )}
//                     </CTableDataCell>
//                     <CTableDataCell style={{ textAlign: 'center' }}>{accessories.brand}</CTableDataCell>
//                     <CTableDataCell style={{ textAlign: 'center' }}>{accessories.typesOfCloths}</CTableDataCell>
//                     <CTableDataCell style={{ textAlign: 'center' }}>{accessories.color}</CTableDataCell>
//                     <CTableDataCell style={{ textAlign: 'center' }}>{accessories.season}</CTableDataCell>
//                     <CTableDataCell style={{ textAlign: 'center' }}>
//                       {accessories.purchaseDate
//                         ? new Date(accessories.purchaseDate).toLocaleDateString()
//                         : 'No Date Available'}
//                     </CTableDataCell>
//                     <CTableDataCell style={{ textAlign: 'center' }}>
//                       <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => fetchaccessoriesData(accessories._id)}>
//                         <FontAwesomeIcon icon={faEye} color='blue' />
//                       </button>
//                       <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => handleEditClick(accessories)}>
//                         <FontAwesomeIcon icon={faEdit} color='green' />
//                       </button>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))}
//               </CTableBody>
//             </CTable>
//           ) : (
//             <p>No accessories added yet!</p>
//           )}
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setVisibleModel(false)}>
//             Close
//           </CButton>
//         </CModalFooter>
//       </CModal>

//       <CModal size='lg' visible={viewAccessories} onClose={() => { setViewAccessories(false) }} >
//         <CModalHeader>
//           <CModalTitle style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
//             accessories Details
//           </CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CCard className='shadow-sm'>
//             <CCardHeader className="bg-primary text-white">
//               <h5 style={{ textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
//                 {acessoriesData.brand}
//               </h5>
//             </CCardHeader>
//             <CCardBody>
//               <CRow className="align-items-center">
//                 <CCol xs="12" md="6" className="text-center">
//                   <img
//                     src={acessoriesData.picture}
//                     alt="Shoe"
//                     style={{
//                       maxWidth: '100%',
//                       maxHeight: '300px',
//                       objectFit: 'cover',
//                       borderRadius: '10px',
//                       boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
//                     }}
//                   />
//                 </CCol>
//                 <CCol xs="12" md="6">
//                   <div className="mt-3">
//                     <p><strong>Color:</strong> {acessoriesData.color}</p>
//                     <p><strong>Type:</strong> {acessoriesData.typesOfCloths}</p>
//                     <p><strong>Season:</strong> {acessoriesData.season}</p>
//                     <p><strong>Purchase Date:</strong> {new Date(acessoriesData.purchaseDate).toLocaleDateString()}</p>
//                     <p><strong>Description:</strong> {acessoriesData.description}</p>
//                   </div>
//                 </CCol>
//               </CRow>
//             </CCardBody>
//             <CCardFooter className="d-flex justify-content-end">
//               <CButton color="secondary" onClick={() => setViewAccessories(false)}>
//                 Close
//               </CButton>
//             </CCardFooter>
//           </CCard>
//         </CModalBody>
//       </CModal>

//       <CModal size="lg" visible={editAccessoriesVisible} onClose={() => setEditAccessoriesVisible(false)}>
//         <CModalHeader closeButton>
//           <CModalTitle>Edit Accessories</CModalTitle>
//         </CModalHeader>
//         <CModalBody>
//           <CForm>
//             <CRow>
//               <CCol md="6">
//                 <CFormLabel htmlFor="brand">Brand</CFormLabel>
//                 <CFormInput id="brand" name="brand" value={formData.brand} onChange={handleFormChange} />
//               </CCol>
//               <CCol md="6">
//                 <CFormLabel htmlFor="color">Color</CFormLabel>
//                 <CFormInput id="color" name="color" value={formData.color} onChange={handleFormChange} />
//               </CCol>
//             </CRow>
//             <CRow>
//               <CCol md="6">
//                 <CFormLabel htmlFor="typesOfCloths">Type</CFormLabel>
//                 <CFormInput id="typesOfCloths" name="typesOfCloths" value={formData.typesOfCloths} onChange={handleFormChange} />
//               </CCol>
//               <CCol md="6">
//                 <CFormLabel htmlFor="season">Season</CFormLabel>
//                 <CFormInput id="season" name="season" value={formData.season} onChange={handleFormChange} />
//               </CCol>
//             </CRow>
//             <CRow>
//               <CCol md="6">
//                 <CFormLabel htmlFor="purchaseDate">Purchase Date</CFormLabel>
//                 <CFormInput type="date" id="purchaseDate" name="purchaseDate" value={formData.purchaseDate} onChange={handleFormChange} />
//               </CCol>
//               <CCol md="6">
//                 <CFormLabel htmlFor="description">Description</CFormLabel>
//                 <CFormInput id="description" name="description" value={formData.description} onChange={handleFormChange} />
//               </CCol>
//             </CRow>
//             <CRow>
//               <CCol md="6">
//                 <CFormLabel htmlFor="image">Edit Image</CFormLabel>
//                 <CFormInput
//                   id="image"
//                   type="file"
//                   onChange={(e) => setSelectedFile(e.target.files[0])}  // Capture file input
//                 />
//               </CCol>
//             </CRow>
//           </CForm>
//         </CModalBody>
//         <CModalFooter>
//           <CButton color="secondary" onClick={() => setEditShoesVisible(false)}>
//             Close
//           </CButton>
//           <CButton color="primary" onClick={() => handleFormSubmit(formData.id)}>
//             Save Changes
//           </CButton>
//         </CModalFooter>
//       </CModal>

//     </div>
//   )
// }

// export default accessories


import React, { useEffect, useState } from "react";
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ClosetCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [visibleModel, setVisibleModel] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [closetSubcategories, setClosetSubcategories] = useState([]);

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3555/api/closet/get-closet");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Handle Add / Edit Category
  const handleSave = async () => {
    try {
      if (editingCategory) {
        await axios.put(`http://localhost:3555/api/categories/${editingCategory._id}`, { name: categoryName });
      } else {
        await axios.post("http://localhost:3555/api/categories", { name: categoryName });
      }
      fetchCategories();
      setModalVisible(false);
      setEditingCategory(null);
      setCategoryName("");
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // ✅ Handle Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3555/api/closet/delete-closet/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleView = async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:3555/api/closet/closet-subcategory/get?categoryId=${categoryId}`)
      const result = response.data.data
      console.log(result, "result")

      setClosetSubcategories(result);
      setVisibleModel(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h5 style={{ margin: 0 }}>Closet Category Management</h5>
        <CButton
          color="primary"
          onClick={() => setModalVisible(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Category
        </CButton>
      </div>
      {/* <h2></h2>
      <CButton color="primary" onClick={() => setModalVisible(true)}>
        <FontAwesomeIcon icon={faPlus} /> Add Category
      </CButton> */}

      {/* Category Table */}
      <CTable striped hover responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>#</CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories.map((category, index) => (
            <CTableRow key={category._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{category.name}</CTableDataCell>
              <CTableDataCell>
                <CButton color="warning" size="sm" onClick={() => { setEditingCategory(category); setCategoryName(category.name); setModalVisible(true); }}>
                  <FontAwesomeIcon icon={faEdit} />
                </CButton>
                <CButton color="danger" size="sm" onClick={() => handleDelete(category._id)} className="ms-2">
                  <FontAwesomeIcon icon={faTrash} />
                </CButton>
                <CButton color="info" size="sm" onClick={() => handleView(category._id)} className="ms-2">
                  <FontAwesomeIcon icon={faEye} />
                </CButton>
                {/* <CTableDataCell style={{ textAlign: 'center' }}>
                  <button style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0', marginRight: '8px' }}
                    title="View" onClick={() => handleView(category._id)}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </CTableDataCell> */}
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal size='lg' visible={visibleModel} onClose={() => setVisibleModel(false)}>
        <CModalHeader onClose={() => setVisibleModel(false)}>
          <CModalTitle>Subcategory Details of Category</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {closetSubcategories && closetSubcategories.length > 0 ? (
            <CTable striped hover responsive className="mt-3">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Category Name</CTableHeaderCell>
                  <CTableHeaderCell>Subcategory Name</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {closetSubcategories.map((category) => (
                  category.subcategory.map((sub, index) => (
                    <CTableRow key={`${category._id}-${index}`}>
                      <CTableDataCell>{category.name}</CTableDataCell>
                      <CTableDataCell>{sub.name}</CTableDataCell>
                      <CTableDataCell>
                        {/* You can add buttons or actions here */}
                        <CButton color="primary" size="sm">View</CButton>
                      </CTableDataCell>
                      
                    </CTableRow>
                  ))
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <p>No clothes added yet!</p>
          )}
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisibleModel(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal for Adding/Editing Category */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editingCategory ? "Edit Category" : "Add Category"}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Enter category name" />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSave}>{editingCategory ? "Update" : "Save"}</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ClosetCategoryManagement;
