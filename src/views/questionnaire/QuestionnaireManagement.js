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
    CListGroupItem
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";


const QuestionnaireManagement = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [formData, setFormData] = useState({ question: "", options: [""] });
    const [editId, setEditId] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState('');
    const [loading, setLoading] = useState('');
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');


    // Fetch questions from backend
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://54.236.98.193:3555/api/user/all_quest", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setQuestionnaires(response.data.data);
        } catch (error) {
            console.error("Error fetching questionnaires", error);
        }
    };

    // Handle input change
    const handleChange = (e, index = null) => {
        if (index !== null) {
            const updatedOptions = [...formData.options];
            updatedOptions[index] = e.target.value;
            setFormData({ ...formData, options: updatedOptions });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    // Add new option field
    const addOption = () => {
        setFormData({ ...formData, options: [...formData.options, ""] });
    };

    // Remove option field
    const removeOption = (index) => {
        const updatedOptions = formData.options.filter((_, i) => i !== index);
        setFormData({ ...formData, options: updatedOptions });
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            if (editId) {
                await axios.put(`http://54.236.98.193:3555/api/user/update-questionnaire/${editId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
            } else {
                await axios.post("http://54.236.98.193:3555/api/user/create-questionnaire", formData,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
            }
            setModalVisible(false);
            fetchQuestions();
            setFormData({ question: "", options: [""] });
            setEditId(null);
        } catch (error) {
            console.error("Error submitting questionnaire", error);
        }
    };

    // Edit Question
    const handleEdit = (questionnaire) => {
        setFormData(questionnaire);
        setEditId(questionnaire._id);
        setModalVisible(true);
    };

    // Delete Question
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://54.236.98.193:3555/api/user/delete-questionnaire/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchQuestions();
        } catch (error) {
            console.error("Error deleting questionnaire", error);
        }
    };

    const handleView = async (question) => {
        try {
            setSelectedQuestion(question);
            setViewModalVisible(true);
        }
        catch (error) {
            console.error("Error in viewing the question:", error);
        }
    }

    return (
        <div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4>Questionnaire Management</h4>
            <CButton color="primary" onClick={() => setModalVisible(true)}>Add Question</CButton>
            </div>
            <CTable striped hover className="mt-3">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>#</CTableHeaderCell>
                        <CTableHeaderCell>Question</CTableHeaderCell>
                        {/* <CTableHeaderCell>Options</CTableHeaderCell> */}
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {questionnaires.map((question, index) => (
                        <CTableRow key={question._id}>
                            <CTableDataCell>{index + 1}</CTableDataCell>
                            <CTableDataCell
                                onMouseEnter={(e) => {
                                    e.target.style.color = 'blue';
                                    e.target.style.textDecoration = 'underline';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = 'black';
                                    e.target.style.textDecoration = 'none';
                                }}
                                onClick={() => handleView(question)}>{question.question}</CTableDataCell>
                            {/* <CTableDataCell>
                <CListGroup>
                  {item.options.map((opt, i) => (
                    <CListGroupItem key={i}>{opt}</CListGroupItem>
                  ))}
                </CListGroup>
              </CTableDataCell> */}
                            <CTableDataCell>
                                <CButton style={{color: "white"}} color="info" size="sm" className="me-2" onClick={() => handleEdit(question)}> <FontAwesomeIcon icon={faPen} />Edit</CButton>
                                <CButton style={{color: "white"}} color="danger" size="sm" onClick={() => handleDelete(question._id)}> <FontAwesomeIcon icon={faTrash} />Delete</CButton>
                            </CTableDataCell>
                        </CTableRow>
                    ))}
                </CTableBody>
            </CTable>

            {/* Modal for Adding/Editing */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>{editId ? "Edit Question" : "Add Question"}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormInput
                            label="Question"
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            required
                        />
                        <h6 className="mt-3">Options</h6>
                        {formData.options.map((opt, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <CFormInput value={opt} onChange={(e) => handleChange(e, index)} required />
                                {formData.options.length > 1 && (
                                    <CButton color="danger" size="sm" className="ms-2" onClick={() => removeOption(index)}>✖</CButton>
                                )}
                            </div>
                        ))}
                        <CButton color="success" size="sm" onClick={addOption}>+ Add Option</CButton>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
                    <CButton color="primary" onClick={handleSubmit}>{editId ? "Update" : "Save"}</CButton>
                </CModalFooter>
            </CModal>

            {/* Modal for questionnaire details */}
            {viewModalVisible && (
                <CModal visible={viewModalVisible} onClose={() => setViewModalVisible(false)}>
                    <CModalHeader>
                        <CModalTitle>Question Details</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : selectedQuestion ? (
                            <div>
                                <p><strong>Question:</strong> {selectedQuestion.question}</p>
                                <p><strong>Options:</strong></p>
                                <ol>
                                    {selectedQuestion.options.map((option, index) => (
                                        <li key={index}>{option}</li>
                                    ))}
                                </ol>
                            </div>
                        ) : (
                            <p>No details available</p>
                        )}
                    </CModalBody>
                </CModal>
            )}
        </div>
    );
};

export default QuestionnaireManagement;
