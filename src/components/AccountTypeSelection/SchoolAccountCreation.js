import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { schoolServerUrl } from '../../config'
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Container,
  Card,
  Spinner,
  Alert,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import SchoolForm from '../formComponents/SchoolForm'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const SchoolAccountCreation = () => {
  const navigate = useNavigate()
  const { schoolUser } = useAuth()
  const [signupLoader, setSignupLoader] = useState(false)
  const [error, setError] = useState('')

  // State to hold form data from SchoolForm
  const [formData, setFormData] = useState({
    schoolLogo: null,
    schoolName: '',
    educationLevel: '',
    schoolAddress: '',
    schoolPhone: '',
    schoolEmail: '',
    classes: [],
    streams: [''],
  })

  // Client-side validation
  const validateForm = () => {
    if (!formData.schoolName) return 'School name is required'
    if (!formData.educationLevel) return 'Education level is required'
    if (!formData.schoolEmail || !/\S+@\S+\.\S+/.test(formData.schoolEmail))
      return 'Valid email is required'
    if (!formData.schoolPhone || !/^\+?\d{10,15}$/.test(formData.schoolPhone))
      return 'Valid phone number is required'
    if (formData.schoolLogo && formData.schoolLogo.size > 50 * 1024 * 1024)
      return 'Logo file size must be under 50MB'
    if (formData.schoolLogo && !formData.schoolLogo.type.startsWith('image/'))
      return 'Logo must be an image file'
    return ''
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    // Validate form data
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      return
    }

    // Check if user is authenticated
    if (!schoolUser || !schoolUser.userID) {
      setError('You must be logged in as an admin to create a school profile')
      toast.error('Admin authentication required')
      return
    }

    setSignupLoader(true)

    // Create FormData object
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.schoolName)
    formDataToSend.append('educationLevel', formData.educationLevel)
    formDataToSend.append('address', formData.schoolAddress)
    formDataToSend.append('email', formData.schoolEmail)
    formDataToSend.append('phone', formData.schoolPhone)
    formDataToSend.append('AdminID', schoolUser.userID)
    if (formData.classes.length > 0) {
      formData.classes.forEach((cls) => formDataToSend.append('classes[]', cls))
    }
    if (formData.streams.length > 0) {
      formData.streams.forEach((stream) =>
        formDataToSend.append('streams[]', stream)
      )
    }
    if (formData.schoolLogo) {
      formDataToSend.append('logo', formData.schoolLogo)
    }

    // Log FormData for debugging
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`FormData ${key}:`, value)
    }

    try {
      const response = await fetch(`${schoolServerUrl}/api/schools/create`, {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Backend error response:', errorData)
        throw new Error(
          errorData.message ||
            errorData.errors?.map((e) => e.msg).join(', ') ||
            'Failed to create school profile'
        )
      }

      const {
        message,
        school,
        classes: createdClasses,
        redirect,
      } = await response.json()
      toast.success(message)

      setTimeout(() => {
        navigate(`/school-dashboard`) // Navigate based on backend redirect (e.g., /dashboard)
      }, 2000)
    } catch (error) {
      console.error('Error creating school profile:', error)
      setError(error.message)
      toast.error(error.message)
    } finally {
      setSignupLoader(false)
    }
  }

  return (
    <div className="sign-background">
      <div className="signup-background signup-container">
        <Container className="my-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <div className="signup-card">
                <Card className="shadow-lg p-4">
                  <Card.Body>
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      size="2x"
                      className="text-primary mb-3"
                    />
                    <h3 className="text-center mb-4">Create School Profile</h3>
                    <ToastContainer position="top-center" />
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form id="signupForm" onSubmit={handleSubmit}>
                      <SchoolForm
                        formData={formData}
                        setFormData={setFormData}
                      />
                      {!signupLoader ? (
                        <Button
                          type="submit"
                          variant="primary"
                          className="w-100 mt-3"
                        >
                          Create School Profile
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          disabled
                          className="w-100 mt-3"
                        >
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{' '}
                          Creating School Profile ...
                        </Button>
                      )}
                      <div className="mt-2 text-center">
                        <Link to="/account-type">
                          Return to Account Selection
                        </Link>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default SchoolAccountCreation
