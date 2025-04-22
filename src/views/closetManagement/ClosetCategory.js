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
//   //     const response = await axios.get(`http://3.223.253.106:3555/api/cloths/get-by-category/accessories`, {
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
//       const response = await axios.get(`http://3.223.253.106:3555/api/user/`, {
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
//       const response = await axios.get(`http://3.223.253.106:3555/api/cloths/all-cloths/${category}/${userId}`)
//       setUserAccessoriesData(response.data.cloths);
//       setVisibleModel(true);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }

//   const fetchaccessoriesData = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`http://3.223.253.106:3555/api/cloths/getClothById/${id}`, {
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

//       await axios.put(`http://3.223.253.106:3555/api/cloths/update-cloths/${id}`, formDataToSend, {
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
import { CTable, CFormSelect, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ClosetCategoryManagement = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [visibleModel, setVisibleModel] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [icon, setIcon] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  const [typeSubcategories, setTypeSubcategories] = useState([])
  const [closetSubcategories, setClosetSubcategories] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [closetData, setClosetData] = useState("");

  const fetchSubcategories = async (categoryId = "") => {
    try {
      // const response = await axios.get(`http://3.223.253.106:3555/api/closet/closet-subcategory/get${categoryId ? `?category=${categoryId}` : ""}`);
      const response = await axios.get("http://3.223.253.106:3555/api/closet/closet-subcategory/get");
      if (response.data.success) {
        const result = response.data.data
        // console.log(result, "result")
        setSubcategories(result);
        // console.log(result[0], "response.data.data.subcategory");

      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://3.223.253.106:3555/api/closet/get-closet");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  // ✅ Handle Add / Edit Category
  // const handleSave = async () => {
  //   if (!categoryName) {
  //     alert("Please enter a category name.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("name", categoryName);

  //   if (icon) {
  //     formData.append("icon", icon); // ✅ Append file only if selected
  //   }

  //   try {
  //     const response = await fetch(
  //       editingCategory ? `http://3.223.253.106:3555/api/closet/category-update/${editingCategory._id}` : "http://3.223.253.106:3555/api/closet/category",
  //       {
  //         method: editingCategory ? "PATCH" : "POST",
  //         body: formData,
  //       }
  //     );

  //     const result = await response.json();
  //     if (result.success) {
  //       alert("Category saved successfully!");
  //       setModalVisible(false);
  //     } else {
  //       alert(result.message);
  //     }
  //   } catch (error) {
  //     console.error("Error saving category:", error);
  //   }
  // };

  const handleSave = async () => {
    if (!categoryName || !selectedSubcategory) {
      alert("Select closet name and subcategory!");
      return;
    }

    setIsSaving(true);

    // Prepare the subcategory data in the expected nested format
    const subcategoryData = selectedSubcategory.map((sub) => ({
      name: sub.name,
      typeSubcategory: sub?.typeSubcategory?.map((type) => ({
        name: type
      }))
    }));

    // FormData to send to the backend
    const formData = new FormData();
    formData.append("name", categoryName);

    // Send the subcategory data as a JSON string
    formData.append("subcategory", JSON.stringify(subcategoryData));

    if (icon) {
      formData.append("imageUrl", icon);
    }


    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        editingCategory
          ? `http://3.223.253.106:3555/api/closet/category-update/${editingCategory._id}`
          : "http://3.223.253.106:3555/api/closet/create",
        {
          method: editingCategory ? "PUT" : "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 Passing the token in Authorization header
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchCategories();
        alert("Closet category saved successfully!");
        setModalVisible(false);

        setCategoryName("");
        setSelectedSubcategory([]);
        setIcon(null);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error saving closet category:", error);
    }
    finally {
      setIsSaving(false); // Re-enable after save attempt
    }
  };

  // ✅ Handle Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://3.223.253.106:3555/api/closet/delete-closet/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // const handleView = async (categoryId) => {
  //   try {
  //     const response = await axios.get(`http://3.223.253.106:3555/api/closet/closet-subcategory/get?categoryId=${categoryId}`)
  //     const result = response.data.data
  //     console.log(result.data, "result")
  //     console.log(result, "result")


  //     setClosetSubcategories(result.data);
  //     setViewModalVisible(true);
  //     setVisibleModel(true);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // }

  const handleView = async (categoryId) => {
    try {
      const response = await axios.get(`http://3.223.253.106:3555/api/closet/closet-subcategory/get?categoryId=${categoryId}`);
      const result = response.data.allSubcategories?.[0]; // because you're getting an array
      console.log(result, "result");

      console.log(result.subcategory, "abc")

      if (result) {
        setClosetData(result);
        setVisibleModel(true);
        setViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h5 style={{ margin: 0 }}>Closet Category Management</h5>
        <CButton
          color="primary"
          onClick={() => { setEditingCategory(null); setModalVisible(true) }}
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
            <CTableHeaderCell>Icon</CTableHeaderCell>
            <CTableHeaderCell>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories.map((category, index) => (
            <CTableRow key={category._id}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{category.name}</CTableDataCell>
              <CTableDataCell >
                <img src={category.icon} alt="Category Icon" width="50" height="50" style={{ borderRadius: '5px', backgroundColor: "grey", padding: "10px" }} />
              </CTableDataCell>

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

      {/* <CModal size='lg' visible={visibleModel} onClose={() => setVisibleModel(false)}>
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
      </CModal> */}

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editingCategory ? "Edit Closet" : "Add Closet"}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {/* Closet Name */}
          <CFormInput
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter closet name"
          />
        </CModalBody>

        <CModalBody>
          {/* Closet Icon */}
          <CFormInput type="file" onChange={(e) => setIcon(e.target.files[0])} required/>
        </CModalBody>

        <CModalBody>
          {/* Subcategory and Type Subcategory */}
          <h5>Subcategories</h5>
          {selectedSubcategory.map((sub, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <CFormInput
                type="text"
                value={sub.name}
                onChange={(e) => {
                  const updatedSubcategories = [...selectedSubcategory];
                  updatedSubcategories[index].name = e.target.value;
                  setSelectedSubcategory(updatedSubcategories);
                }}
                placeholder="Enter Subcategory Name" required
              />

              <h6>Type Subcategories</h6>
              {sub.typeSubcategory.map((type, typeIndex) => (
                <div key={typeIndex} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <CFormInput
                    type="text"
                    value={type}
                    onChange={(e) => {
                      const updatedSubcategories = [...selectedSubcategory];
                      updatedSubcategories[index].typeSubcategory[typeIndex] = e.target.value;
                      setSelectedSubcategory(updatedSubcategories);
                    }}
                    placeholder="Enter Type Subcategory Name"
                  />
                  {/* Remove Type Subcategory Button */}
                  <CButton
                    color="danger"
                    onClick={() => {
                      const updatedSubcategories = [...selectedSubcategory];
                      updatedSubcategories[index].typeSubcategory = updatedSubcategories[index].typeSubcategory.filter((_, idx) => idx !== typeIndex);
                      setSelectedSubcategory(updatedSubcategories);
                    }}
                  >
                    Remove Type
                  </CButton>
                </div>
              ))}

              {/* Add More Type Subcategory Button */}
              <CButton
                color="success"
                onClick={() => {
                  const updatedSubcategories = [...selectedSubcategory];
                  updatedSubcategories[index].typeSubcategory.push(""); // Add new type subcategory
                  setSelectedSubcategory(updatedSubcategories);
                }}
              >
                + Add Type
              </CButton>

              {/* Remove Subcategory Button */}
              <CButton
                color="danger"
                onClick={() => {
                  const updatedSubcategories = selectedSubcategory.filter((_, idx) => idx !== index);
                  setSelectedSubcategory(updatedSubcategories);
                }}
              >
                Remove Subcategory
              </CButton>
            </div>
          ))}

          {/* Add More Subcategory Button */}
          <CButton
            color="success"
            onClick={() => setSelectedSubcategory([...selectedSubcategory, { name: "", typeSubcategory: [""] }])}
          >
            + Add Subcategory
          </CButton>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : editingCategory ? "Update" : "Save"}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* closet not working the array is not traversed prorperly */}
      <CModal size = "lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>View Closet</CModalTitle>
        </CModalHeader>

        <CModalBody>
          {/* Closet Name */}
          <h5>Closet Name</h5>
          <p>{closetData.name || "N/A"}</p>
        </CModalBody>

        {/* <CModalBody>
          <h5>Closet Icon</h5>
          {icon ? (
            <img
              src={typeof closetData.icon === "string" ? closetData.icon : URL.createObjectURL(closetData.icon)}
              alt="Closet Icon"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ) : (
            <p>No icon uploaded</p>
          )}
        </CModalBody> */}

        <CModalBody>
          <h5>Subcategories</h5>
          {closetData.subcategory?.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Subcategory Name</th>
                  <th style={thStyle}>Type Subcategories</th>
                </tr>
              </thead>
              <tbody>
                {closetData.subcategory.map((sub, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{sub.name}</td>
                    <td style={tdStyle}>
                      {sub.typeSubcategory?.length > 0 ? (
                        <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                          {sub.typeSubcategory.map((type, idx) => (
                            <li key={idx}>{type.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <em>No types</em>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No subcategories found</p>
          )}
        </CModalBody>


        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ClosetCategoryManagement;

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f8f9fa",
  textAlign: "left"
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px"
};