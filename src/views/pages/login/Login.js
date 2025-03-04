import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const API_URL = 'http://54.236.98.193:3555/api/admin/loginAdmin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(API_URL, { email, password }, { withCredentials: true });


      console.log('Logging in with:', { email, password });

      if (response.status === 200) {
        console.log('Login successful');

        // Save the token to local storage
        const token = response.data.token; // Adjust based on your API response structure
        localStorage.setItem('token', token); // Store token in local storage
        setLoading(false);

        navigate('/userManagement'); // Ensure this route exists
      }
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);

      if (error.response) {
        setError(error.response.data.message || 'Failed to login. Please check your credentials.');
      } else {
        setError('Failed to login. Please check your credentials.');
      }
    }
    finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1 className="text-center">Login</h1>
                    <p className="text-body-secondary text-center">Sign In to your account</p>

                    {error && <p className="text-danger text-center">{error}</p>}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol className="text-center">
                        {loading ? (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <CSpinner color="primary" size="lg" />
                          </div>
                        ) : (
                          <CButton
                            type="submit"
                            color="primary"
                            className="px-4"
                            disabled={loading} // Disable the button when loading
                          >
                            Login
                          </CButton>
                        )}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
