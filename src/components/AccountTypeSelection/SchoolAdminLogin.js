import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext.js'
import { schoolServerUrl } from '../../config.js'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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

const SchoolAdminLogin = () => {
  const navigate = useNavigate()
  const { loginSchool } = useAuth()
  // console.log('LoginSchool from useAuth:', loginSchool)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('') //fro backend errors
  const [signupLoader, setSignupLoader] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    let formErrors = {}

    if (!formData.email) {
      formErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      formErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(formErrors)
    return Object.keys(formErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      console.log('School admin login attempt:', formData)

      try {
        setSignupLoader(true)
        setServerError('')

        const response = await fetch(`${schoolServerUrl}/api/admins/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        const data = await response.json()
        console.log('Login response: ', data)

        if (!response.ok) {
          const errorMessage = data.message || 'Login failed. please try again'
          throw new Error(errorMessage)
        }

        if (!data.admin) {
          throw new Error(
            'Login successful but user data is missing. Please contact support.'
          )
        }

        loginSchool({
          documentId: data.admin.documentId,
          userID: data.admin.userID,
          email: data.admin.email,
          firstName: data.admin.firstName,
          lastName: data.admin.lastName,
          authUserId: data.admin.authUserId,
        })

        toast.success('Login is a success Redirecting ... ')

        setTimeout(() => {
          if (data.redirectPath === 'create-school') {
            navigate('/create-school-profile')
          } else if (data.redirectPath === 'dashboard') {
            navigate('/school-dashboard')
          } else if (data.redirectPath === 'subscription') {
            navigate('/verify-token')
          } else {
            navigate('/create-school')
          }
        }, 3000)
      } catch (error) {
        console.error('login error:', error)
        setSignupLoader(false)
        setServerError(
          error.message || 'Login failed. please check the email and password'
        )
        toast.error('Login failed. Please try again')
      } finally {
        setSignupLoader(false)
      }
    }
  }

  return (
    <div className="account-type min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div className="container-fluid col-md-6 col-lg-4">
        <div className="mb-5">
          <p className="text-center text-secondary mt-2">
            Sign in with your administrator credentials
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="id"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? 'is-invalid' : ''
                }`}
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            {serverError && (
              <div className="alert alert-danger" role="alert">
                {serverError}
              </div>
            )}

            {/* <button type="submit" className="btn btn-primary w-100">
              Admin Sign In
            </button> */}

            {!signupLoader ? (
              <Button type="submit" variant="primary" className="w-100 mt-3">
                Sign In
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
                Signing in ...
              </Button>
            )}
          </form>

          <div className="text-center mt-3">
            <p className="small text-secondary">
              Student login?{' '}
              <span
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate('/school-login')}
                role="button"
                style={{ color: '#18181B' }}
              >
                Student Login
              </span>
            </p>
          </div>

          <div className="text-center mt-2">
            <p className="small text-secondary mb-1">
              Don't have a school Account ?{' '}
              <span
                className="btn btn-link p-0 text-decoration-none"
                onClick={() => navigate('/administrator-signup')}
                role="button"
                style={{ color: '#18181B' }}
              >
                Create school Account
              </span>
            </p>
          </div>

          <div className="text-center mt-3">
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

export default SchoolAdminLogin
