import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormInput,
    CListGroup,
    CListGroupItem,
    CFormLabel
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const QuestionnaireManagement = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [formData, setFormData] = useState({ 
        question: "", 
        options: [""], 
        images: [] 
    });
    const [editId, setEditId] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const token = localStorage.getItem('token');
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get("http://18.209.91.97:3555/api/user/all_quest", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setQuestionnaires(response.data.data);
        } catch (error) {
            console.error("Error fetching questionnaires", error);
        }
    };

    const handleChange = (e, index = null) => {
        if (index !== null) {
            const updatedOptions = [...formData.options];
            updatedOptions[index] = e.target.value;
            setFormData({ ...formData, options: updatedOptions });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const addOption = () => {
        setFormData({ ...formData, options: [...formData.options, ""] });
    };

    const removeOption = (index) => {
        const updatedOptions = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: updatedOptions });
    };

    const handleSubmit = async () => {
        try {
            const form = new FormData();
            form.append("question", formData.question);
            
            formData.options.forEach((opt, index) => {
                form.append(`options[${index}]`, opt);
            });

            // Append new image files
            imageFiles.forEach((file) => {
                form.append("images", file);
            });

            // Append existing image URLs if in edit mode
            if (editId && formData.images) {
                formData.images.forEach((img) => {
                    if (typeof img === 'string') { // It's a URL
                        form.append("existingImages", img);
                    }
                });
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            };

            if (editId) {
                await axios.put(
                    `http://localhost:3555/api/user/update-questionnaire/${editId}`, 
                    form, 
                    config
                );
            } else {
                await axios.post(
                    "http://18.209.91.97:3555/api/user/create-questionnaire", 
                    form, 
                    config
                );
            }

            resetForm();
            setModalVisible(false);
            fetchQuestions();
        } catch (error) {
            console.error("Error submitting questionnaire", error);
        }
    };

    const resetForm = () => {
        setFormData({ question: "", options: [""], images: [] });
        setEditId(null);
        setImageFiles([]);
        setPreviews([]);
    };

    const handleEdit = (questionnaire) => {
        setFormData({
            question: questionnaire.question,
            options: questionnaire.options,
            images: questionnaire.images || []
        });
        setEditId(questionnaire._id);
        setPreviews(questionnaire.images || []);
        setModalVisible(true);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const maxImages = 5;
        
        if (files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images.`);
            return;
        }
        
        setImageFiles(files);
        
        // Create previews for the new files
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        // If editing, we need to distinguish between existing URLs and new files
        const isUrl = typeof previews[index] === 'string' && previews[index].startsWith('http');
        
        if (isUrl) {
            // Remove from formData.images
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }));
        } else {
            // Remove from imageFiles
            const fileIndex = index - (previews.length - imageFiles.length);
            setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
        }
        
        // Remove from previews
        setPreviews(prev => prev.filter((_, i) => i !== index));
        
        // Revoke the object URL if it's not a http URL
        if (!isUrl) {
            URL.revokeObjectURL(previews[index]);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://18.209.91.97:3555/api/user/delete-questionnaire/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchQuestions();
        } catch (error) {
            console.error("Error deleting questionnaire", error);
        }
    };

    const handleView = (question) => {
        setSelectedQuestion(question);
        setViewModalVisible(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4>Questionnaire Management</h4>
                <CButton color="primary" onClick={() => {
                    resetForm();
                    setModalVisible(true);
                }}>Add Question</CButton>
            </div>
            
            <CTable striped hover className="mt-3">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Question</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {questionnaires.map((question, index) => (
                        <CTableRow key={question._id}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = 'blue';
                                    e.target.style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = 'black';
                                    e.target.style.textDecoration = 'none';
                                }}
                                onClick={() => handleView(question)}
                            >
                                {question.question}
                            </CTableDataCell>
                            <CTableDataCell>
                                <CButton style={{ color: "white" }} color="info" size="sm" className="me-2" onClick={() => handleEdit(question)}>
                                    <FontAwesomeIcon icon={faPen} /> Edit
                                </CButton>
                                <CButton style={{ color: "white" }} color="danger" size="sm" onClick={() => handleDelete(question._id)}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* Add/Edit Modal */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
                <CModalHeader closeButton>
                    <CModalTitle>{editId ? "Edit Question" : "Add Question"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <div className="mb-3">
                            <CFormLabel>Question</CFormLabel>
                            <CFormInput
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <CFormLabel>Upload Images (Max 5)</CFormLabel>
                            <CFormInput
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                            <div className="d-flex flex-wrap mt-2">
                                {previews.map((src, index) => (
                                    <div key={index} className="position-relative me-2 mb-2">
                                        <img 
                                            src={src} 
                                            alt={`preview-${index}`} 
                                            width={100} 
                                            height={100}
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <button
                                            type="button"
                                            className="position-absolute top-0 end-0 btn btn-sm btn-danger"
                                            onClick={() => removeImage(index)}
                                            style={{ transform: 'translate(50%, -50%)' }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-3">
                            <CFormLabel>Options</CFormLabel>
                            {formData.options.map((opt, index) => (
                                <div key={index} className="d-flex align-items-center mb-2">
                                    <CFormInput 
                                        value={opt} 
                                        onChange={(e) => handleChange(e, index)} 
                                        required 
                                    />
                                    {formData.options.length > 1 && (
                                        <CButton 
                                            color="danger" 
                                            size="sm" 
                                            className="ms-2" 
                                            onClick={() => removeOption(index)}
                                        >
                                            ✖
                                        </CButton>
                                    )}
                                </div>
                            ))}
                            <CButton color="success" size="sm" onClick={addOption}>
                                + Add Option
                            </CButton>
                        </div>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={handleSubmit}>
                        {editId ? "Update" : "Save"}
                    </CButton>
                </CModalFooter>
            </CModal>

            {/* View Modal */}
            <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Question Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedQuestion && (
                        <div>
                            <p><strong>Question:</strong> {selectedQuestion.question}</p>
                            
                            {selectedQuestion.images && selectedQuestion.images.length > 0 && (
                                <div className="mb-3">
                                    <strong>Images:</strong>
                                    <div className="d-flex flex-wrap mt-2">
                                        {selectedQuestion.images.map((img, index) => (
                                            <img 
                                                key={index} 
                                                src={img} 
                                                alt={`question-${index}`} 
                                                width={100} 
                                                height={100}
                                                className="me-2 mb-2"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <p><strong>Options:</strong></p>
                            <ol>
                                {selectedQuestion.options.map((option, index) => (
                                    <li key={index}>{option}</li>
                                ))}
                            </ol>
                        </div>
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

export default QuestionnaireManagement;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//     CTable,
//     CTableHead,
//     CTableRow,
//     CTableHeaderCell,
//     CTableBody,
//     CTableDataCell,
//     CButton,
//     CModal,
//     CModalHeader,
//     CModalTitle,
//     CModalBody,
//     CModalFooter,
//     CForm,
//     CFormInput,
//     CListGroup,
//     CListGroupItem,
//     CFormLabel
// } from "@coreui/react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";


// const QuestionnaireManagement = () => {
//     const [questionnaires, setQuestionnaires] = useState([]);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [viewModalVisible, setViewModalVisible] = useState(false);
//     const [formData, setFormData] = useState({ question: "", options: [""], images: [] });
//     const [editId, setEditId] = useState(null);
//     const [selectedQuestion, setSelectedQuestion] = useState('');
//     const [loading, setLoading] = useState('');
//     const [error, setError] = useState('');
//     const [images, setImages] = useState([]);
//     const token = localStorage.getItem('token');
//     const [previews, setPreviews] = useState([]);

//     useEffect(() => {
//         if (images.length > 0) {
//             const objectUrls = images.map((file) => URL.createObjectURL(file));
//             setPreviews(objectUrls);

//             return () => {
//                 objectUrls.forEach(url => URL.revokeObjectURL(url));
//             };
//         }
//     }, [images]);



//     // Fetch questions from backend
//     useEffect(() => {
//         fetchQuestions();
//     }, []);

//     const fetchQuestions = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get("http://18.209.91.97:3555/api/user/all_quest", {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
//             setQuestionnaires(response.data.data);
//         } catch (error) {
//             console.error("Error fetching questionnaires", error);
//         }
//     };

//     // Handle input change
//     const handleChange = (e, index = null) => {
//         if (index !== null) {
//             const updatedOptions = [...formData.options];
//             updatedOptions[index] = e.target.value;
//             setFormData({ ...formData, options: updatedOptions });
//         } else {
//             setFormData({ ...formData, [e.target.name]: e.target.value });
//         }
//     };

//     // Add new option field
//     const addOption = () => {
//         setFormData({ ...formData, options: [...formData.options, ""] });
//     };

//     // Remove option field
//     const removeOption = (index) => {
//         const updatedOptions = formData.options.filter((_, i) => i !== index);
//         setFormData({ ...formData, options: updatedOptions });
//     };

//     const handleSubmit = async () => {
//         try {
//             const form = new FormData();

//             console.log(formData, "formData");
//             console.log(form, "formData");

//             form.append("question", formData.question);
//             formData.options.forEach((opt, index) => {
//                 form.append(`options[${index}]`, opt);
//             });

//             console.log(formData, "formData");


//             if (formData.images && formData.images.length > 0) {
//                 formData.images.forEach((img, i) => {
//                     form.append("images", img); // name must match backend field (usually "images")
//                 });
//             }

//             const config = {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data',
//                 }
//             };

//             if (editId) {
//                 await axios.put(`http://18.209.91.97:3555/api/user/update-questionnaire/${editId}`, form, config);
//             } else {
//                 await axios.post("http://18.209.91.97:3555/api/user/create-questionnaire", form, config);
//             }

//             console.log(formData, "formDataAfter");
//             console.log(form, "formDataAfter");


//             setModalVisible(false);
//             fetchQuestions();
//             setFormData({ question: "", options: [""], images: [] });
//             setEditId(null);
//         } catch (error) {
//             console.error("Error submitting questionnaire", error);
//         }
//     };


//     // Edit Question
//     const handleEdit = (questionnaire) => {
//         setFormData(questionnaire);
//         setEditId(questionnaire._id);
//         setModalVisible(true);
//     };

//     const handleMultipleImageUpload = async (e) => {
//         const files = Array.from(e.target.files);
//         const maxImages = 5;

//         if (files.length > maxImages) {
//             alert(`You can only upload up to ${maxImages} images.`);
//             return;
//         }

//         const uploadedUrls = [];

//         for (let i = 0; i < files.length; i++) {
//             const formData = new FormData();
//             formData.append('file', files[i]);
//             formData.append('upload_preset', 'commerce_data');
//             formData.append('cloud_name', 'dpgnawkaj');
//             try {
//                 const res = await fetch('https://api.cloudinary.com/v1_1/dpgnawkaj/image/upload', {
//                     method: 'POST',
//                     body: formData,
//                 });

//                 const data = await res.json();
//                 uploadedUrls.push(data.secure_url);
//             } catch (error) {
//                 console.error('Error uploading image:', error);
//             }
//         }

//         // Store URLs in state (or wherever you need)
//         // setImages(uploadedUrls);
//         setFormData((prev) => ({
//             ...prev,
//             images: [...prev.images, ...uploadedUrls]
//         }));

//     };


//     const handleDelete = async (id) => {
//         try {
//             await axios.delete(`http://18.209.91.97:3555/api/user/delete-questionnaire/${id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
//             fetchQuestions();
//         } catch (error) {
//             console.error("Error deleting questionnaire", error);
//         }
//     };

//     const handleView = async (question) => {
//         try {
//             setSelectedQuestion(question);
//             setViewModalVisible(true);
//         }
//         catch (error) {
//             console.error("Error in viewing the question:", error);
//         }
//     }

//     return (
//         <div>

//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
//                 <h4>Questionnaire Management</h4>
//                 <CButton color="primary" onClick={() => setModalVisible(true)}>Add Question</CButton>
//             </div>
//             <CTable striped hover className="mt-3">
//                 <CTableHead>
//                     <CTableRow>
//                         <CTableHeaderCell>#</CTableHeaderCell>
//                         <CTableHeaderCell>Question</CTableHeaderCell>
//                         {/* <CTableHeaderCell>Options</CTableHeaderCell> */}
//                         <CTableHeaderCell>Actions</CTableHeaderCell>
//                     </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                     {questionnaires.map((question, index) => (
//                         <CTableRow key={question._id}>
//                             <CTableDataCell>{index + 1}</CTableDataCell>
//                             <CTableDataCell
//                                 onMouseEnter={(e) => {
//                                     e.target.style.color = 'blue';
//                                     e.target.style.textDecoration = 'underline';
//                                 }}
//                                 onMouseLeave={(e) => {
//                                     e.target.style.color = 'black';
//                                     e.target.style.textDecoration = 'none';
//                                 }}
//                                 onClick={() => handleView(question)}>{question.question}</CTableDataCell>
//                             {/* <CTableDataCell>
//                 <CListGroup>
//                   {item.options.map((opt, i) => (
//                     <CListGroupItem key={i}>{opt}</CListGroupItem>
//                   ))}
//                 </CListGroup>
//               </CTableDataCell> */}
//                             <CTableDataCell>
//                                 <CButton style={{ color: "white" }} color="info" size="sm" className="me-2" onClick={() => handleEdit(question)}> <FontAwesomeIcon icon={faPen} />Edit</CButton>
//                                 <CButton style={{ color: "white" }} color="danger" size="sm" onClick={() => handleDelete(question._id)}> <FontAwesomeIcon icon={faTrash} />Delete</CButton>
//                             </CTableDataCell>
//                         </CTableRow>
//                     ))}
//                 </CTableBody>
//             </CTable>

//             {/* Modal for Adding/Editing */}
//             <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
//                 <CModalHeader>
//                     <CModalTitle>{editId ? "Edit Question" : "Add Question"}</CModalTitle>
//                 </CModalHeader>
//                 <CModalBody>
//                     <CForm>
//                         <CFormInput
//                             label="Question"
//                             name="question"
//                             value={formData.question}
//                             onChange={handleChange}
//                             required
//                         />
//                         <CFormLabel className="mt-3">Upload Images (Max 5)</CFormLabel>
//                         <CFormInput
//                             type="file"
//                             accept="image/*"
//                             multiple
//                             onChange={handleMultipleImageUpload}
//                         />
//                         <div className="image-previews mt-2">
//                             {previews.map((src, index) => (
//                                 <img key={index} src={src} alt={`preview-${index}`} width={100} style={{ marginRight: '10px' }} />
//                             ))}
//                         </div>

//                         <h6 className="mt-3">Options</h6>
//                         {formData.options.map((opt, index) => (
//                             <div key={index} className="d-flex align-items-center mb-2">
//                                 <CFormInput value={opt} onChange={(e) => handleChange(e, index)} required />
//                                 {formData.options.length > 1 && (
//                                     <CButton color="danger" size="sm" className="ms-2" onClick={() => removeOption(index)}>✖</CButton>
//                                 )}
//                             </div>
//                         ))}
//                         <CButton color="success" size="sm" onClick={addOption}>+ Add Option</CButton>
//                     </CForm>
//                 </CModalBody>
//                 <CModalFooter>
//                     <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
//                     <CButton color="primary" onClick={handleSubmit}>{editId ? "Update" : "Save"}</CButton>
//                 </CModalFooter>
//             </CModal>

//             {/* Modal for questionnaire details */}
//             {viewModalVisible && (
//                 <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)}>
//                     <CModalHeader>
//                         <CModalTitle>Question Details</CModalTitle>
//                     </CModalHeader>
//                     <CModalBody>
//                         {loading ? (
//                             <p>Loading...</p>
//                         ) : error ? (
//                             <p>{error}</p>
//                         ) : selectedQuestion ? (
//                             <div>
//                                 <p><strong>Question:</strong> {selectedQuestion.question}</p>
//                                 <p><strong>Options:</strong></p>
//                                 {/* <p><imag src={selectedQuestion.images[0]}/></p> */}
//                                 <ol>
//                                     {selectedQuestion.options.map((option, index) => (
//                                         <li key={index}>{option}</li>
//                                     ))}
//                                 </ol>
//                             </div>
//                         ) : (
//                             <p>No details available</p>
//                         )}
//                     </CModalBody>
//                 </CModal>
//             )}
//         </div>
//     );
// };

// export default QuestionnaireManagement;
