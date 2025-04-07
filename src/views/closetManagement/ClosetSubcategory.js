import React, { useEffect, useState } from "react";
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CFormSelect, CRow, CCol } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ClosetSubcategoryManagement = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const [subcategoryName, setSubcategoryName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filterCategory, setFilterCategory] = useState(""); // State for filtering

    // ✅ Fetch Subcategories (With Optional Filter)
    const fetchSubcategories = async (categoryId = "") => {
        try {
            const response = await axios.get(`http://3.223.253.106:3555/api/closet/closet-subcategory/get${categoryId ? `?category=${categoryId}` : ""}`);
            if (response.data.success) {
                const result = response.data.data
                setSubcategories(result);
                console.log(result[0], "response.data.data.subcategory");

            }
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    // const fetchSubcategories = async (categoryId = "") => {
    //     if (!categoryId) {
    //         setSubcategories([]); // Reset subcategories if no category is selected
    //         return;
    //     }
    //     try {
    //         const response = await axios.get(`http://3.223.253.106:3555/api/closet/closet-subcategory/get?categoryId=${categoryId}`);
    //         setSubcategories(response.data.data);
    //     } catch (error) {
    //         console.error("Error fetching subcategories:", error);
    //     }
    // };

    // ✅ Fetch Categories for Dropdown
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
        fetchSubcategories();
        fetchCategories();
    }, []);

    // ✅ Handle Add / Edit Subcategory
    const handleSave = async () => {
        try {
            if (editingSubcategory) {
                await axios.put(`http://3.223.253.106:3555/api/subcategories/${editingSubcategory._id}`, {
                    name: subcategoryName,
                    category: selectedCategory
                });
            } else {
                await axios.post("http://3.223.253.106:3555/api/subcategories", {
                    name: subcategoryName,
                    category: selectedCategory
                });
            }
            fetchSubcategories(filterCategory); // Refresh data based on current filter
            setModalVisible(false);
            setEditingSubcategory(null);
            setSubcategoryName("");
            setSelectedCategory("");
        } catch (error) {
            console.error("Error saving subcategory:", error);
        }
    };

    // ✅ Handle Delete Subcategory
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
        try {
            await axios.delete(`http://3.223.253.106:3555/api/subcategories/${id}`);
            fetchSubcategories(filterCategory); // Refresh data based on current filter
        } catch (error) {
            console.error("Error deleting subcategory:", error);
        }
    };

    return (
        <div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h5 style={{ margin: 0 }}>Closet Subcategory Management</h5>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '10px' }}>
                    <CFormSelect
                        value={filterCategory}
                        onChange={(e) => {
                            const selectedCategory = e.target.value;
                            setFilterCategory(selectedCategory);
                            fetchSubcategories(selectedCategory);
                        }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </CFormSelect>

                    <CButton
                        color="primary"
                        className="mt-2" onClick={() => setModalVisible(true)}
                        style={{ margin: '10px', width: "150%" }}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Subcategory
                    </CButton>
                </div>
            </div>

            {/* Subcategory Table */}
            <CTable striped hover responsive className="mt-3">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell>Category</CTableHeaderCell>
                        {/* <CTableHeaderCell>Actions</CTableHeaderCell> */}
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {subcategories.map((category) => (
                        category.subcategory.map((sub, index) => (
                            <CTableRow key={`${category._id}-${index}`}>
                                <CTableDataCell>{index + 1}</CTableDataCell>
                                <CTableDataCell>{category.name}</CTableDataCell>
                                <CTableDataCell>{sub.name}</CTableDataCell>
                                {/* <CTableDataCell>
                                    <CButton color="primary" size="sm">View</CButton>
                                </CTableDataCell> */}
                                <CTableDataCell>
                                    <CButton
                                        color="warning"
                                        size="sm"
                                        onClick={() => {
                                            setEditingSubcategory(category);
                                            setSubcategoryName(category.name);
                                            setSelectedCategory(category._id || '');
                                            setModalVisible(true);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </CButton>

                                    <CButton
                                        color="danger"
                                        size="sm"
                                        onClick={() => handleDelete(category._id)}
                                        className="ms-2"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))
                    ))}
                </CTableBody>

            </CTable>

            {/* Modal for Adding/Editing Subcategory */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>{editingSubcategory ? "Edit Subcategory" : "Add Subcategory"}</CModalTitle>
                </CModalHeader>

                <CModalBody>
                    <CRow className="mb-3">
                        {/* Subcategory Name Field */}
                        <CCol md={12}>
                            <CFormInput
                                type="text"
                                value={subcategoryName}
                                onChange={(e) => setSubcategoryName(e.target.value)}
                                placeholder="Enter subcategory name"
                                label="Subcategory Name"
                            />
                        </CCol>
                    </CRow>

                    <CRow className="mb-3">
                        {/* Category Dropdown */}
                        <CCol md={12}>
                            <CFormSelect
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                label="Select Category"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CModalBody>

                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleSave}>
                        {editingSubcategory ? "Update" : "Save"}
                    </CButton>
                </CModalFooter>
            </CModal>

        </div>
    );
};

export default ClosetSubcategoryManagement;
