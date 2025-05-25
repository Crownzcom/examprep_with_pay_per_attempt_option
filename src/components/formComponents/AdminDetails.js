import React, { useState } from 'react'

const AdminDetails = ({
  adminFirstName,
  adminlastName,
  adminOtherName,
  setAdminFirstName,
  setAdminlastName,
  setAdminOtherName,
  adminEmail,
  setAdminEmail,
  adminPhone,
  setAdminPhone,
  adminGender,
  setAdminGender,
  adminPassword,
  setAdminPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  return (
    <div class="d-flex flex-column gap-3 mt-4">
      <div className="d-flex gap-3 ">
        <div>
          <label htmlFor="name" className="p-0 m-0">
            FirstName
          </label>
          <input
            className="form-control"
            type="text"
            placeholder="Enter first name"
            id="name"
            required
            value={adminFirstName}
            onChange={(e) => setAdminFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="name" className="p-0 m-0">
            LastName
          </label>
          <input
            className="form-control"
            type="text"
            placeholder="Enter last name"
            id="name"
            required
            value={adminlastName}
            onChange={(e) => setAdminlastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="name" className="p-0 m-0">
            otherName
          </label>
          <input
            className="form-control"
            type="text"
            placeholder="Enter your other name"
            id="name"
            value={adminOtherName}
            onChange={(e) => setAdminOtherName(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="p-0 m-0">
          Phone Number
        </label>
        <input
          className="form-control"
          type="tel"
          id="phone"
          value={adminPhone}
          onChange={(e) => setAdminPhone(e.target.value)}
          placeholder="+ 256 700 000 000"
        />
      </div>
      <div>
        <label htmlFor="gender" className="p-0">
          Gender
        </label>
        <input
          type="text"
          className="form-control"
          id="gender"
          value={adminGender}
          onChange={(e) => setAdminGender(e.target.value)}
          placeholder="Enter gender"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="p-0 m-0">
          Email
        </label>
        <input
          className="form-control"
          type="email"
          id="email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="p-0 m-0">
          Password
        </label>
        <input
          className="form-control"
          type="password"
          id="password"
          placeholder="Enter password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="p-0 m-0">
          Confirm Password
        </label>
        <input
          className="form-control"
          type="password"
          id="confirmPassword"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
    </div>
  )
}

export default AdminDetails
