import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { Icon } from '@iconify/react'
import BatchAccount from '../AccountsCreations/BatchAccount'
import SingleAccount from '../AccountsCreations/SingleAccount'

const students = [{}, {}, {}] // example dummy data
const activeStudents = 2
const suspendedStudents = 1

const UserManagement = () => {
  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '5px',
        }}
        className="p-4 rounded"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-semibold tracking-tight">
              User Management board
            </h5>
            <p style={{ color: '##64748B', fontSize: 'smaller' }} className="">
              manage students accounts for your school
            </p>
          </div>
          <div className="d-flex justify-content-between align-items-center gap-2 w-50">
            <button
              type="button"
              className="btn btn-primary btn-sm m-0 p-1"
              data-bs-toggle="modal"
              data-bs-target="#myModal-single-account-creation"
            >
              <span className="small d-flex justify-content-center align-items-center gap-2">
                <Icon icon="line-md:account-add" width="24" height="24" />
                Single Account Creation
              </span>
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm m-0 p-2 "
              data-bs-toggle="modal"
              data-bs-target="#myModal-batch-account-creation"
            >
              <span className="small d-flex justify-content-center align-items-center gap-2">
                <Icon icon="material-symbols:upload" width="24" height="24" />
                Batch Account Creation
              </span>
            </button>
          </div>
          {/* <!-- Modal --> */}
          <div
            className="modal fade"
            id="myModal-single-account-creation"
            tabIndex="-1"
            aria-labelledby="myModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog ">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="myModalLabel">
                    Single Account Creation
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <SingleAccount />
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="myModal-batch-account-creation"
            tabIndex="-1"
            aria-labelledby="myModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="myModalLabel">
                    Batch Account Creation
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <BatchAccount />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '1rem',
          }}
        >
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Total Students</Card.Title>
              <Card.Text className="fs-4 fw-bold">{students.length}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Active Students</Card.Title>
              <Card.Text className="fs-4 fw-bold text-success">
                {activeStudents}
              </Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Suspended Students</Card.Title>
              <Card.Text className="fs-4 fw-bold text-danger">
                {suspendedStudents}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '1rem',
          }}
        ></div>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
          }}
          className="p-4 rounded"
        >
          <h5 className="fw-semibold tracking-tight">
            Metrics: Students & Exams
          </h5>
          <p style={{ color: '##64748B', fontSize: 'smaller' }} className="">
            Subject Performance Average performance across all subjects
          </p>
          <Button style={{ width: 'auto', padding: '4px' }}>
            <span className="small">View Performance</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
