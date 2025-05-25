import React from 'react'
import { Card, Table, Button, Pagination } from 'react-bootstrap'

// Mock data for school analytics
const schoolAnalyticsData = {
  totalStudents: 245,
  activeStudents: 218,
  totalPapers: 32,
  totalAttempts: 1876,
}

const schoolDashboard = () => {
  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '5px',
        }}
        className="p-4 rounded mb-4"
      >
        <h5 className="fw-semibold tracking-tight">
          Welcome to your Dashboard
        </h5>
        <p style={{ color: '##64748B', fontSize: 'smaller' }} className="">
          School performance overview and quick actions. Stay informed about
          your children academic journey, track their progress, and support
          their success.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '1rem',
          }}
        >
          {Object.entries(schoolAnalyticsData).map(([key, value]) => (
            <Card key={key} className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>{key.replace(/([A-Z])/g, ' $1')}</Card.Title>
                <Card.Text>{value}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
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
          <Button style={{ width: 'auto', padding: '6px' }}>
            <span>View Performance</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default schoolDashboard
