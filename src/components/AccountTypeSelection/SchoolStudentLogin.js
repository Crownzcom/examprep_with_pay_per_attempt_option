import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { schoolServerUrl } from '../../config'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Alert, Button, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const SchoolStudentLogin = () => {
  const navigate = useNavigate()
  const { loginSchoolStudent } = useAuth()
  const [formData, setFormData] = useState({
    schoolID: '',
    studentID: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [signInLoader, setSignInLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSignInLoader(true)

      const response = await fetch(`${schoolServerUrl}/api/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('data:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      loginSchoolStudent(data.student, data.session)

      toast.success('Login successful! redirecting ...')
      setTimeout(() => navigate('/student-dashboard'), 2000)
    } catch (error) {
      setError(error.message)
      toast.error(error.message)
    } finally {
      setSignInLoader(false)
    }
  }

  return (
    <div className="account-type min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div className="container-fluid col-md-6 col-lg-4">
        <div className="mb-5">
          <p className="text-center text-secondary mt-2">
            Sign in with your school credentials
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="mb-3">
              <label htmlFor="schoolID" className="form-label">
                School ID
              </label>
              <input
                type="text"
                className="form-control"
                id="schoolID"
                name="schoolID"
                placeholder="Enter your school ID"
                value={formData.schoolID}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="studentID" className="form-label">
                Student ID
              </label>
              <input
                type="text"
                className="form-control"
                id="studentID"
                name="studentID"
                placeholder="Enter your student ID"
                value={formData.studentID}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="form-check mt-2 d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showPasswordCheck"
                  checked={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
                />
                <label className="form-check-label" htmlFor="showPasswordCheck">
                  Show Password
                </label>
              </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {!signInLoader ? (
              <Button type="submit" className="btn btn-primary p-2 w-100">
                Log In
              </Button>
            ) : (
              <Button variant="secondary" disabled className="w-100 mt-3">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{' '}
                Logging Up...
              </Button>
            )}
          </form>

          <div className="text-center mt-3">
            <p className="small text-secondary mb-1">
              School administrator?{' '}
              <span
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate('/administrator-login')}
                role="button"
                style={{ color: '#18181B' }}
              >
                Admin Login
              </span>
            </p>
          </div>

          <div className="text-center mt-2 ">
            <button
              className="btn btn-link p-0 text-decoration-none"
              onClick={() => navigate('/account-type')}
              style={{ color: '#18181B' }}
            >
              Return to account selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchoolStudentLogin
