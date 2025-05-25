import 'react-phone-number-input/style.css'
import { isValidPhoneNumber } from 'react-phone-number-input'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import AdminDetails from '../formComponents/AdminDetails.js'
import { schoolServerUrl } from '../../config.js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function SchoolAdminSignup() {
  const navigate = useNavigate()

  const [signupMethod, setSignupMethod] = useState('email')
  const [signupLoader, setSignupLoader] = useState(false)
  const [errors, setErrors] = useState([])

  const [adminFirstName, setAdminFirstName] = useState('')
  const [adminlastName, setAdminlastName] = useState('')
  const [adminOtherName, setAdminOtherName] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPhone, setAdminPhone] = useState('')
  const [adminGender, setAdminGender] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Handles input changes
  const handleInputChange = (event) => {
    const { id, value } = event.target
  }

  // console.log(errors)

  // Handles the form submission
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSignupLoader(true)

      // Construct the admin details object to match backend expectations
      const adminDetails = {
        firstName: adminFirstName,
        lastName: adminlastName,
        otherName: adminOtherName || undefined,
        phone: adminPhone || undefined,
        gender: adminGender || undefined,
        email: adminEmail,
        label: [],
        userType: 'admin',
        password: adminPassword,
        confirmPassword: confirmPassword,
      }

      // Send the admin details to the backend
      const response = await fetch(
        `${schoolServerUrl}/api/admins/create-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(adminDetails),
        }
      )

      const responseData = await response.json()

      if (!response.ok) {
        if (response.status === 400 && responseData.errors) {
          setErrors(responseData.errors.map((error) => error.message))
          console.log(
            setErrors(responseData.errors.map((error) => error.message))
          )

          return
        }
        throw new Error(`Error: ${responseData.message}`)
      }

      console.log('Admin created  successfully:', responseData)
      toast.success('Account created successfully! Redirecting ... ')
      setTimeout(() => navigate('/administrator-login'), 3000)
    } catch (error) {
      setSignupLoader(false)
      console.error('Error Creating Account at Submission:', error)
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
                    <h3 className="text-center mb-4">Create Account</h3>
                    <ToastContainer position="top-center" />
                    <Form id="signupForm" onSubmit={handleSubmit}>
                      {/* Admin Details Section before creating school profile */}
                      <AdminDetails
                        adminFirstName={adminFirstName}
                        adminlastName={adminlastName}
                        adminOtherName={adminOtherName}
                        setAdminFirstName={setAdminFirstName}
                        setAdminlastName={setAdminlastName}
                        setAdminOtherName={setAdminOtherName}
                        adminEmail={adminEmail}
                        setAdminEmail={setAdminEmail}
                        adminPhone={adminPhone}
                        setAdminPhone={setAdminPhone}
                        adminGender={adminGender}
                        setAdminGender={setAdminGender}
                        adminPassword={adminPassword}
                        setAdminPassword={setAdminPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                      />
                      {/* Signup Button */}
                      {!signupLoader ? (
                        <Button
                          type="submit"
                          variant="primary"
                          className="w-100 mt-3"
                        >
                          Sign Up
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
                          Signing Up...
                        </Button>
                      )}
                      <div className="mt-3 text-center">
                        Already have a school account?{' '}
                        <Link to="/administrator-login">Log in here</Link>
                      </div>
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

export default SchoolAdminSignup
