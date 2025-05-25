import React from 'react'
import { Icon } from '@iconify/react'
import { Button } from 'react-bootstrap'

const VerifyToken = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="p-4 shadow rounded"
        style={{ maxWidth: '500px', width: '100%', backgroundColor: '#fff' }}
      >
        <div className="text-center">
          <Icon icon="mdi:badge-outline" width="40" height="40" />
          <h3 className="mt-2">Verify Your School Payment</h3>
          <p
            className="text-center"
            style={{ fontSize: 'small', color: '#64748B' }}
          >
            To verify your school payment, please enter the token you received
            via email.
          </p>
        </div>

        <div className="d-flex flex-column gap-3 mt-4">
          <div>
            <label htmlFor="token" className="p-0 m-0">
              Verification Token
            </label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter your token"
              id="token"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-50 mx-auto mt-3 btn btn-sm"
            style={{
              backgroundColor: '#272E3F',
              borderColor: '#272E3F',
            }}
          >
            Verify your token
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VerifyToken
