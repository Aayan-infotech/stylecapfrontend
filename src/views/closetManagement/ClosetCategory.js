import React, { useEffect, useState } from "react";
import { CTable, CFormSelect, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CSpinner } from "@coreui/react";
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
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [closetData, setClosetData] = useState("");
  const [loading, setLoading] = useState(false);


  const fetchSubcategories = async (categoryId = "") => {
    try {
      const response = await axios.get("http://18.209.91.97:3555/api/closet/closet-subcategory/get");
      if (response.data.success) {
        const result = response.data.data
        console.log(result, 'result')
        setSubcategories(result);


      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

 

  // ✅ Fetch Categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://18.209.91.97:3555/api/closet/get-closet");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);


  const handleEditCategory = (category) => {
    console.log(category, "category")
    setEditingCategory(category);
    setCategoryName(category.name);
    setIcon(category.icon);
    const matched = subcategories.find(sub => sub._id === category._id);


    if (matched && matched.subcategory) {
      const formatted = matched.subcategory.map(sub => ({
        name: sub.name,
        typeSubcategory: sub.typeSubcategory?.map(type => type.name) || []
      }));
      setSelectedSubcategory(formatted);
    } else {
      setSelectedSubcategory([]); // fallback
    }


    setModalVisible(true);
  };




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
          ? `http://18.209.91.97:3555/api/closet/category-update/${editingCategory._id}`
          : "http://18.209.91.97:3555/api/closet/create",
        {
          method: editingCategory ? "PUT" : "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 Passing the token in Authorization header
          },
        }
      );

      await fetchCategories();

      const result = await response.json();
      if (result.success) {
        alert("Closet category saved successfully!");
        setModalVisible(false);
        setCategoryName("");
        setSelectedSubcategory([]);
        setIcon(null);
      } else {
        alert(result.message);
      }
      fetchSubcategories();
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
      await axios.delete(`http://18.209.91.97:3555/api/closet/delete-closet/${id}`, {
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
      const response = await axios.get(`http://18.209.91.97:3555/api/closet/closet-subcategory/get?categoryId=${categoryId}`);
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

  const handleCloseModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setIcon('');
    setSelectedSubcategory([]);
    setModalVisible(false);
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
          {loading ? (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                <CSpinner color="primary" />
              </CTableDataCell>
            </CTableRow>
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <CTableRow key={category._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{category.name}</CTableDataCell>
                <CTableDataCell >
                  <img src={category.icon} alt="Category Icon" width="50" height="50" style={{ borderRadius: '5px', backgroundColor: "grey", padding: "10px" }} />
                </CTableDataCell>


                <CTableDataCell>
                  <CButton color="warning" size="sm" onClick={() => handleEditCategory(category)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </CButton>
                  {/* <CButton color="danger" size="sm" onClick={() => handleDelete(category._id)} className="ms-2">
                   <FontAwesomeIcon icon={faTrash} />
                 </CButton> */}
                  <CButton color="info" size="sm" onClick={() => handleView(category._id)} className="ms-2">
                    <FontAwesomeIcon icon={faEye} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="4" className="text-center">
                No categories found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>


      <CModal visible={modalVisible} onClose={handleCloseModal} size="lg">
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
          {typeof icon === "string" && (
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <strong>Current Icon:</strong><br />
              <img src={icon} alt="Existing Icon" width="80" height="80" style={{ borderRadius: '5px', marginTop: '5px' }} />
            </div>
          )}


          <CFormInput type="file" onChange={(e) => setIcon(e.target.files[0])} required />
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
                    Remove
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
          <CButton color="secondary" onClick={handleCloseModal}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : editingCategory ? "Update" : "Save"}
          </CButton>
        </CModalFooter>
      </CModal>


      {/* closet not working the array is not traversed prorperly */}
      <CModal size="lg" visible={viewModalVisible} onClose={() => setViewModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>View Closet</CModalTitle>
        </CModalHeader>


        <CModalBody>
          {/* Closet Name */}
          <h5>Closet Name</h5>
          <p>{closetData.name || "N/A"}</p>
        </CModalBody>


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
