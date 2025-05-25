import React from 'react'
import { useNavigate } from 'react-router-dom'
import './AccountTypeSelection.css'

const AccountTypeSelection = () => {
  const navigate = useNavigate()

  return (
    <div className="account-type min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div className="container">
        <h3 className="text-center fw-bold mb-5">Choose Account Type</h3>

        <div className="row row-cols-1 row-cols-md-2 g-4 justify-content-center">
          <div className="col">
            <div className="card shadow h-100 hover-shadow p-4 gap-4">
              <div className="">
                <h5 className="card-title fw-semibold">Individual Account</h5>
                <h6 className="card-subtitle text-muted">
                  For students preparing independently
                </h6>
              </div>
              <div className="">
                <p className="card-text small text-secondary">
                  Access practice exams and track your progress individually.
                  Perfect for self-paced exam preparation.
                </p>
              </div>
              <div className="">
                <button
                  className="btn btn-primary btn-sm m-0 p-2"
                  onClick={() => navigate('/sign-in')}
                >
                  Continue as Individual
                </button>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card shadow h-100 hover-shadow p-4 gap-4">
              <div className="">
                <h5 className="card-title fw-semibold">School Account</h5>
                <h6 className="card-subtitle text-muted">
                  For students with school memberships
                </h6>
              </div>
              <div className="">
                <p className="card-text small text-secondary">
                  Access your school's assigned practice exams and resources.
                  Teachers can track student progress and create batch accounts.
                </p>
              </div>
              <div className="">
                <button
                  className="btn btn-outline-primary btn-sm m-0 p-2"
                  onClick={() => navigate('/school-login')}
                >
                  Continue with School
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountTypeSelection
