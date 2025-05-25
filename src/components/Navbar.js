import React, { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { Navbar, Nav, Badge, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import useNetworkStatus from '../hooks/useNetworkStatus'
import './Navbar.css'

const CustomNavbar = () => {
  const navigate = useNavigate()
  const { sessionInfo, userInfo, schoolUser, accountType, handleLogout } =
    useAuth()
  const isOffline = !useNetworkStatus()
  const [expanded, setExpanded] = useState(false)

  const handleLogoutClick = async () => {
    try {
      await handleLogout()
      setExpanded(false)
      //window.location.href = 'https://exampreptutor.com/'
      window.location.href = 'localhost:3000/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className={`shadow ${isOffline ? 'offline-border' : ''}`}
      sticky="top"
      expanded={expanded}
    >
      <Navbar.Brand
        as={NavLink}
        to="/"
        onClick={() => setExpanded(false)}
        className={expanded ? 'visible' : 'hidden-brand'}
      >
        <img
          src="/logo.png" // Changed from /img/logo.png to match manifest
          width="40"
          height="40"
          className="d-inline-block align-top"
          alt="ExamPrepTutor Logo"
          style={{ borderRadius: '15px', marginLeft: '5px' }}
        />
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        onClick={() => setExpanded((prev) => !prev)}
      />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {accountType === 'school' && schoolUser ? (
            <>
              <Nav.Link onClick={handleLogoutClick}>Logout</Nav.Link>
              <Badge
                bg="primary"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  navigate('#')
                  setExpanded(false)
                }}
              >
                <NavLink
                  className="nav-link"
                  to="#"
                  onClick={() => setExpanded(false)}
                >
                  {schoolUser.firstName
                    ? `${schoolUser.firstName} (Admin)`
                    : 'School Admin'}
                </NavLink>
              </Badge>
            </>
          ) : accountType === 'student' && schoolUser ? (
            <>
              <Nav.Link
                as={NavLink}
                to="/student-dashboard"
                onClick={() => setExpanded(false)}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link onClick={handleLogoutClick}>Logout</Nav.Link>
              <Badge
                bg="primary"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  navigate('/student-profile') // Add student profile route
                  setExpanded(false)
                }}
              >
                <NavLink
                  className="nav-link"
                  to="/student-profile"
                  onClick={() => setExpanded(false)}
                >
                  {schoolUser.firstName
                    ? `${schoolUser.firstName} (Student)`
                    : 'Student'}
                </NavLink>
              </Badge>
            </>
          ) : accountType === 'individual' && sessionInfo ? (
            <>
              <Nav.Link as={NavLink} to="/" onClick={() => setExpanded(false)}>
                Home
              </Nav.Link>
              <Nav.Link onClick={handleLogoutClick}>Logout</Nav.Link>
              <Badge
                bg="primary"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  navigate('/profile')
                  setExpanded(false)
                }}
              >
                <NavLink
                  className="nav-link"
                  to="/profile"
                  onClick={() => setExpanded(false)}
                >
                  {userInfo?.firstName ? userInfo.firstName : 'Profile'}
                </NavLink>
              </Badge>
            </>
          ) : (
            <>
              <Nav.Link
                as={NavLink}
                to="/sign-in"
                onClick={() => setExpanded(false)}
              >
                Login
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/sign-up"
                onClick={() => setExpanded(false)}
              >
                Sign up
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/administrator-login"
                onClick={() => setExpanded(false)}
              >
                School Admin Login
              </Nav.Link>
            </>
          )}
          {isOffline && (
            <Alert variant="warning" className="offline-pill">
              Offline
            </Alert>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default CustomNavbar
