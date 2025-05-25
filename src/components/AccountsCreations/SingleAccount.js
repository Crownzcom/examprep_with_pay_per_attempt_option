import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  Button,
  ButtonGroup,
  ListGroup,
  Container,
  Row,
  Col,
  Alert,
  Card,
  Spinner,
  Tooltip,
  OverlayTrigger,
  Toast,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faUserPlus,
  faCheck,
  faDownload,
  faUserGraduate,
  faInfoCircle,
  faSchool,
} from '@fortawesome/free-solid-svg-icons'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useAuth } from '../../context/AuthContext.js'
import { schoolServerUrl } from '../../config.js'
import './SingleAccount.css'

const SingleAccount = ({ user_Type, oneType }) => {
  const { schoolUser } = useAuth()
  const staticUserType = oneType === true ? true : false
  const navigate = useNavigate()
  const [schoolInfo, setSchoolInfo] = useState(null) // Store all school details

  // console.log('userInfo from single_account:', schoolUser)

  const initializeFormData = (userType) => ({
    userType: staticUserType ? user_Type : userType,
    schoolID: schoolInfo?.schoolID || '',
    firstName: '',
    lastName: '',
    otherName: '',
    gender: '',
    studClass: '',
    stream: '',
    label: staticUserType
      ? user_Type
      : userType === 'admin'
      ? ['admin']
      : ['student'],
  })

  const [userCred, setUserCred] = useState([])
  const [userType, setUserType] = useState('')
  const [formData, setFormData] = useState(initializeFormData(''))
  const [responseMessage, setResponseMessage] = useState('')
  const [pdfReady, setPdfReady] = useState(false)
  const [classes, setClasses] = useState([])
  const [streams, setStreams] = useState([])
  const [accountCreated, setAccountCreated] = useState(false)
  const [loader, setLoader] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  // Fetch school and classes info on mount
  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const response = await fetch(
          `${schoolServerUrl}/api/schools/get-school?userID=${schoolUser.userID}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        )
        const data = await response.json()
        // console.log('shool information:', data)

        if (response.ok) {
          setSchoolInfo(data.school)
          setClasses(Array.isArray(data.classes) ? data.classes : [])
        } else {
          setResponseMessage(data.message || 'Failed to fetch school profile')
        }
      } catch (error) {
        setResponseMessage('Error fetching school profile')
      }
    }

    if (schoolUser?.userID) {
      fetchSchoolInfo()
    }
  }, [schoolUser])

  const handleUserTypeChange = (event) => {
    const selectedUser = event.target.value
    setUserType(selectedUser)
    setFormData(initializeFormData(selectedUser))
  }

  const handleClassChange = (event) => {
    const classID = event.target.value
    setFormData({
      ...formData,
      studClass: classID,
    })

    const selectedClassObj = classes.find((cls) => cls.classID === classID)
    if (selectedClassObj) {
      setStreams(
        Array.isArray(selectedClassObj.streams) ? selectedClassObj.streams : []
      )
    } else {
      setStreams([])
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name)

  const validateForm = () => {
    const errors = {}

    if (!schoolInfo?.schoolID) {
      errors.schoolID =
        'No school profile found. Please create a school profile first.'
    }
    if (!validateName(formData.firstName)) {
      errors.firstName =
        'First name must contain only alphabetical characters and spaces.'
    }
    if (!validateName(formData.lastName)) {
      errors.lastName =
        'Last name must contain only alphabetical characters and spaces.'
    }
    if (formData.otherName && !validateName(formData.otherName)) {
      errors.otherName =
        'Other name must contain only alphabetical characters and spaces.'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    doc.text('User Credentials', 14, 20)
    const tableColumn = [
      'UserID',
      'First Name',
      'Last Name',
      'Email',
      'Password',
    ]
    const tableRows = userCred.map((user) => [
      user.userID,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
    ])

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    })

    doc.save('Single_user_credential.pdf')
  }

  const createNewAccount = () => {
    setResponseMessage('')
    setAccountCreated(false)
    setUserCred([])
    setPdfReady(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoader(true)
      setResponseMessage('')

      // console.log('schoolInfo', schoolInfo)

      const response = await fetch(
        `${schoolServerUrl}/api/create-account/create-users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include session cookie for Appwrite auth
          body: JSON.stringify([formData]),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        // console.log('errorData', errorData)

        throw new Error(errorData.message || 'Network response not ok')
      }

      const data = await response.json()

      if (data.createdUsers.length === 0) {
        throw new Error('No account was created from the server-side.')
      }

      setAccountCreated(true)
      setResponseMessage('User created successfully')
      setUserCred(data.createdUsers)
      setPdfReady(true)
      setFormData(initializeFormData(userType))
      setLoader(false)
    } catch (error) {
      console.error('Error:', error)
      setResponseMessage(`Failed to create an account: ${error.message}`)
      setLoader(false)
    }
  }

  const renderTooltip = (msg) => <Tooltip>{msg}</Tooltip>

  return (
    <Container>
      <Row className="justify-content-md-center">
        <div>
          {accountCreated ? (
            <Card>
              <Card.Header className="text-center">
                <h3>
                  <FontAwesomeIcon icon={faUserPlus} />
                  {userType.charAt(0).toUpperCase() + userType.slice(1)} Account
                  Created Successfully
                </h3>
              </Card.Header>
              <Card.Body>
                {responseMessage && (
                  <Alert
                    variant={
                      responseMessage.includes('successfully')
                        ? 'success'
                        : 'danger'
                    }
                  >
                    {responseMessage}
                  </Alert>
                )}
                <ListGroup variant="flush">
                  {userCred.length > 0 && (
                    <>
                      <ListGroup.Item>
                        <b>Name: </b>
                        {userCred[0].firstName} {userCred[0].lastName}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <b>ID: </b>
                        {userCred[0].userID}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <b>Email: </b>
                        {userCred[0].email}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <b>Password: </b>
                        {userCred[0].password}
                      </ListGroup.Item>
                    </>
                  )}
                </ListGroup>
                {pdfReady && (
                  <Button
                    variant="outline-success"
                    className="w-100 mt-3"
                    onClick={generatePDF}
                  >
                    <FontAwesomeIcon icon={faDownload} /> Download and Save
                    Account Credentials
                  </Button>
                )}
              </Card.Body>
              <Card.Footer>
                <ButtonGroup style={{ width: '100%' }}>
                  <Button
                    className="btn-back"
                    variant="dark"
                    onClick={createNewAccount}
                  >
                    Create New Account
                  </Button>
                  <Button
                    className="btn-home"
                    variant="primary"
                    onClick={() => navigate(-1)}
                  >
                    Back Home
                  </Button>
                </ButtonGroup>
              </Card.Footer>
            </Card>
          ) : (
            <Card className="signup-card">
              <Card.Header className="text-center">
                <h3>
                  <FontAwesomeIcon icon={faUserPlus} /> Create User Account
                </h3>
                {schoolInfo && (
                  <div className="mt-2">
                    <h5>
                      <FontAwesomeIcon icon={faSchool} /> {schoolInfo.name}
                    </h5>
                    <p className="text-muted">
                      {schoolInfo.address} | {schoolInfo.email} |{' '}
                      {schoolInfo.phone}
                    </p>
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                {!schoolInfo?.schoolID && (
                  <Alert variant="warning">
                    No school profile found. Please create a school profile
                    before adding users.
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="selectUserType">
                    <Form.Label>
                      <FontAwesomeIcon icon={faUser} /> User Type
                      <OverlayTrigger
                        placement="right"
                        overlay={renderTooltip(
                          'Select the type of user to create.'
                        )}
                      >
                        <FontAwesomeIcon icon={faInfoCircle} className="ml-2" />
                      </OverlayTrigger>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      value={userType}
                      onChange={handleUserTypeChange}
                      required
                    >
                      <option value="">Select User Type</option>
                      {staticUserType && user_Type === 'admin' ? (
                        <option value="admin">Admin</option>
                      ) : (
                        <>
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                        </>
                      )}
                    </Form.Control>
                  </Form.Group>
                  {userType && (
                    <>
                      <Form.Group
                        controlId="firstName"
                        className="position-relative"
                      >
                        <Form.Label>
                          <FontAwesomeIcon icon={faUser} /> First Name
                          <OverlayTrigger
                            placement="right"
                            overlay={renderTooltip(
                              'Enter the first name of the user. Only alphabetical characters and spaces are allowed.'
                            )}
                          >
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              className="ml-2"
                            />
                          </OverlayTrigger>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          isInvalid={!!validationErrors.firstName}
                          required
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                          {validationErrors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        controlId="lastName"
                        className="position-relative"
                      >
                        <Form.Label>
                          <FontAwesomeIcon icon={faUser} /> Last Name
                          <OverlayTrigger
                            placement="right"
                            overlay={renderTooltip(
                              'Enter the last name of the user. Only alphabetical characters and spaces are allowed.'
                            )}
                          >
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              className="ml-2"
                            />
                          </OverlayTrigger>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          isInvalid={!!validationErrors.lastName}
                          required
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                          {validationErrors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        controlId="otherName"
                        className="position-relative"
                      >
                        <Form.Label>
                          <FontAwesomeIcon icon={faUser} /> Other Name
                          <OverlayTrigger
                            placement="right"
                            overlay={renderTooltip(
                              'Enter any other names of the user. Only alphabetical characters and spaces are allowed.'
                            )}
                          >
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              className="ml-2"
                            />
                          </OverlayTrigger>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="otherName"
                          value={formData.otherName}
                          onChange={handleInputChange}
                          isInvalid={!!validationErrors.otherName}
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                          {validationErrors.otherName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="gender">
                        <Form.Label>
                          <FontAwesomeIcon icon={faUser} /> Gender
                          <OverlayTrigger
                            placement="right"
                            overlay={renderTooltip(
                              'Select the gender of the user.'
                            )}
                          >
                            <FontAwesomeIcon
                              icon={faInfoCircle}
                              className="ml-2"
                            />
                          </OverlayTrigger>
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Form.Control>
                      </Form.Group>
                      {userType === 'student' && (
                        <>
                          <Form.Group controlId="studClass">
                            <Form.Label>
                              <FontAwesomeIcon icon={faUserGraduate} /> Class
                              <OverlayTrigger
                                placement="right"
                                overlay={renderTooltip(
                                  'Select the class for the student.'
                                )}
                              >
                                <FontAwesomeIcon
                                  icon={faInfoCircle}
                                  className="ml-2"
                                />
                              </OverlayTrigger>
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="studClass"
                              value={formData.studClass}
                              onChange={handleClassChange}
                              required
                            >
                              <option value="">Select Class</option>
                              {classes.map((cls) => (
                                <option key={cls.id} value={cls.classID}>
                                  {cls.className}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                          <Form.Group controlId="stream">
                            <Form.Label>
                              <FontAwesomeIcon icon={faUserGraduate} /> Stream
                              <OverlayTrigger
                                placement="right"
                                overlay={renderTooltip(
                                  'Select the stream for the student.'
                                )}
                              >
                                <FontAwesomeIcon
                                  icon={faInfoCircle}
                                  className="ml-2"
                                />
                              </OverlayTrigger>
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="stream"
                              value={formData.stream}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select Stream</option>
                              {Array.isArray(streams) && streams.length > 0 ? (
                                streams.map((stream, index) => (
                                  <option key={index} value={stream}>
                                    {stream}
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No streams available
                                </option>
                              )}
                            </Form.Control>
                          </Form.Group>
                        </>
                      )}
                      {responseMessage && (
                        <Alert
                          variant={
                            responseMessage.includes('successfully')
                              ? 'success'
                              : 'danger'
                          }
                        >
                          {responseMessage}
                        </Alert>
                      )}
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mt-3"
                        disabled={loader || !schoolInfo?.schoolID}
                      >
                        {loader ? (
                          <>
                            <Spinner animation="border" variant="primary" />
                            <Spinner animation="border" variant="secondary" />
                            <Spinner
                              animation="border"
                              variant="success"
                            />{' '}
                            Creating Account ..
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheck} /> Submit
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </Form>
              </Card.Body>
            </Card>
          )}
        </div>
      </Row>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        animation
      >
        <Toast.Header>
          <strong className="mr-auto">Information</strong>
        </Toast.Header>
        <Toast.Body>
          Select the type of user to create. Fill in the required information
          and submit.
        </Toast.Body>
      </Toast>
    </Container>
  )
}

export default SingleAccount
