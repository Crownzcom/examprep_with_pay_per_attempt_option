import React, { useState, useRef, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
  ButtonGroup,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUpload,
  faFileCsv,
  faFileExcel,
  faDownload,
  faCheckCircle,
  faExclamationTriangle,
  faKey,
} from '@fortawesome/free-solid-svg-icons'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { useAuth } from '../../context/AuthContext'
import db from '../../db'
import { schoolServerUrl } from '../../config.js'
import './BatchAccount.css'
import { account } from '../../appwriteConfig.js'

const BatchAccount = () => {
  const { schoolUser } = useAuth()
  // console.log('context:', useAuth())
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [classData, setClassData] = useState([])
  const [responseMessage, setResponseMessage] = useState('')
  const [createdUsers, setCreatedUsers] = useState([])
  const [usersCreated, setUsersCreated] = useState(false)
  const [subscriptionCode, setSubscriptionCode] = useState('')
  const [codeValid, setCodeValid] = useState(false)
  const [subCodeInfo, setSubCodeInfo] = useState({})
  const [remainingStudents, setRemainingStudents] = useState(0)
  const [codeMessage, setCodeMessage] = useState('')
  const fileInputRef = useRef(null)
  const [subscription, setSubscription] = useState(null)

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
        // console.log('shool data:', data)

        if (response.ok) {
          setSchoolInfo(data.school)
          setClassData(Array.isArray(data.classes) ? data.classes : [])
        } else {
          setResponseMessage(data.message || 'Failed to fetch school profile')
        }
      } catch (error) {
        setResponseMessage('Error fetching school profile')
      }
    }

    const fetchSubscription = async () => {
      console.log('school information: ', schoolInfo)
      console.log('school user id: ', schoolInfo.AdminID)

      try {
        const response = await fetch(
          `${schoolServerUrl}/api/subscriptions?schoolID=${schoolInfo.AdminID}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        )

        const data = await response.json()
        console.log('Subscription data:', data)

        if (response.ok && data.subscriptions?.length > 0) {
          const activeSub = data.subscriptions.find(
            (sub) =>
              sub.isActive &&
              sub.isVerified &&
              new Date(sub.endDate) > new Date()
          )

          if (activeSub) {
            setSubscription(activeSub)
            setRemainingStudents(
              activeSub.studentLimit - activeSub.studentsCreated
            )
          } else {
            setUploadMessage('No active and verified subscription found')
          }
        } else {
          setUploadMessage(
            data.message || 'No subscriptions found for this school.'
          )
        }
      } catch (error) {
        console.error('Fetch subscription error: ', error)
        setUploadMessage('Error fetching subscription data ..')
      }
    }

    if (schoolUser?.userID) {
      fetchSchoolInfo()
      fetchSubscription()
    }
  }, [schoolUser])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    } else {
      setFile(null)
    }
    setUploadMessage('')
  }

  const downloadTemplate = (type) => {
    const headers = [
      'firstName',
      'lastName',
      'otherName',
      'gender',
      'studClass',
      'stream',
    ]
    let data = [headers]

    if (type === 'csv') {
      const csvData = Papa.unparse(data)
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
      saveAs(blob, 'template.csv')
    } else {
      const ws = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Template')
      XLSX.writeFile(wb, 'template.xlsx')
    }
  }

  const validateData = async (data) => {
    console.log('classData: ', classData)

    const validClasses = classData.map((cls) => cls.classID)
    console.log('Valid Classes:', validClasses)

    const errors = []
    const validData = data.filter((row, index) => {
      if (row.length !== 6) {
        errors.push(`Row ${index + 1}: Incorrect number of fields`)
        return false
      }
      const [firstName, lastName, otherName, gender, studClass, stream] = row
      console.log(`Row ${index + 1} - Class: ${studClass}, Stream: ${stream}`)

      // Check if the class exists
      const classInfo = classData.find((cls) => cls.classID === studClass)
      if (!classInfo) {
        errors.push(`Row ${index + 1}: Invalid class ${studClass}`)
        return false
      }

      // Check if the stream exists within the class
      const streams = Array.isArray(classInfo.streams)
      console.log(`Class ${studClass} - Streams: ${streams}`)
      if (!streams.includes(stream)) {
        errors.push(
          `Row ${index + 1}: Invalid stream ${stream} for class ${studClass}`
        )
        return false
      }

      return true
    })

    console.log('Valid Data:', validData)
    console.log('Errors:', errors)

    return { validData, errors }
  }

  const updateSubCode = async ({ subCode, studentsCreated }) => {
    try {
      const response = await fetch(
        `${schoolServerUrl}/api/subscriptions/update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            subCode,
            studentsCreated,
          }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update subscription')
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw error
    }
  }

  const handleFileUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a file to upload.')
      return
    }

    if (!subscription) {
      setUploadMessage('No active subscription. Cannot create users.')
      return
    }

    setIsUploading(true)
    let data = []
    try {
      if (file.name.endsWith('.csv')) {
        const csv = await file.text()
        data = Papa.parse(csv, { skipEmptyLines: true }).data
      } else if (file.name.endsWith('.xlsx')) {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        data = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
          raw: false,
          blankrows: false,
        })
      }
    } catch (error) {
      setUploadMessage(
        'Error parsing file. Ensure it’s a valid CSV or Excel file.'
      )
      setIsUploading(false)
      return
    }

    console.log('Uploaded Data:', data)

    // Remove header row
    const header = data.shift()
    console.log('Header:', header)

    const { validData, errors } = await validateData(data)

    if (errors.length > 0) {
      setUploadMessage(`Errors found:\n${errors.join('\n')}`)
      setIsUploading(false)
      return
    }

    if (validData.length > remainingStudents) {
      setUploadMessage(
        `The number of students in the file exceeds the remaining allowed students. Maximum allowed is ${remainingStudents}.`
      )
      setIsUploading(false)
      return
    }

    const userPayload = validData.map(
      ([firstName, lastName, otherName, gender, studClass, stream]) => ({
        userType: 'student',
        schoolID: schoolInfo?.schoolID,
        firstName,
        lastName,
        otherName: otherName || null,
        gender,
        studClass,
        stream,
        label: ['student'],
      })
    )

    try {
      const response = await fetch(
        `${schoolServerUrl}/api/create-account/create-users`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(userPayload),
        }
      )

      if (response.ok) {
        const result = await response.json()
        setCreatedUsers(result)
        setUploadMessage('Users created successfully!')

        if (result.createdUsers.length === 0) {
          console.log('no user created')
          throw new Error('No account was created from the server-side.')
        }

        //Update database with the used subscription code
        await updateSubCode({
          subCode: subscription.subCode,
          studentsCreated: result.createdUsers.length,
        })

        setUsersCreated(true)
      } else {
        setUploadMessage('Failed to create users.')
      }
    } catch (error) {
      setUploadMessage('Error uploading users.')
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setFile(null)
    }
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    const tableColumn = [
      'UserID',
      'First Name',
      'Last Name',
      'Other Name',
      'Email',
      'Class',
      'Stream',
      'Password',
    ]

    const UserArray =
      createdUsers.createdUsers && Array.isArray(createdUsers.createdUsers)
        ? createdUsers.createdUsers
        : []

    console.log('Checking Created Users: ', createdUsers)

    const tableRows = UserArray.map((user) => [
      user.userID,
      user.firstName,
      user.lastName,
      user.otherName,
      user.email,
      user.studClass,
      user.stream,
      user.password,
    ])

    doc.text('User Credentials', 14, 15)

    // Updated autoTable initiation
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    })

    doc.save('user_credentials.pdf')
  }

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <Card>
            <Card.Header className="bg-primary text-white text-center">
              <h4>
                <FontAwesomeIcon icon={faUpload} /> Batch Accounts Registration
              </h4>
            </Card.Header>
            <Card.Body>
              <>
                <Form>
                  <Form.Group>
                    <Form.Label>Select CSV or Excel File</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      key={file || ''} // Add a key to ensure re-render
                    />
                  </Form.Group>
                  <Button
                    onClick={handleFileUpload}
                    disabled={!file || isUploading}
                    className="w-100 mt-3"
                    variant="primary"
                  >
                    {isUploading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </Form>
                <hr />
                <h5 className="text-center mt-4">Download Templates</h5>
                <ButtonGroup className="w-100">
                  <Button
                    variant="outline-primary"
                    onClick={() => downloadTemplate('csv')}
                  >
                    <FontAwesomeIcon icon={faFileCsv} /> CSV Template
                  </Button>
                  <Button
                    variant="outline-success"
                    onClick={() => downloadTemplate('xlsx')}
                  >
                    <FontAwesomeIcon icon={faFileExcel} /> Excel Template
                  </Button>
                </ButtonGroup>
                {/* if users created then download pdf */}
                {usersCreated && (
                  <Button
                    variant="success"
                    onClick={generatePDF}
                    className="w-100 mt-4"
                  >
                    <FontAwesomeIcon icon={faDownload} /> Download Credentials
                  </Button>
                )}
              </>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {uploadMessage && (
        <Row className="my-4">
          <Col>
            <Alert
              variant={uploadMessage.startsWith('Error') ? 'danger' : 'success'}
            >
              {uploadMessage.startsWith('Error') ? (
                <FontAwesomeIcon icon={faExclamationTriangle} />
              ) : (
                <FontAwesomeIcon icon={faCheckCircle} />
              )}{' '}
              {uploadMessage}
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default BatchAccount
