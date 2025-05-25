import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Modal, Spinner } from 'react-bootstrap';
import moment from 'moment-timezone';
import PaymentMethods from './PaymentMethods_2';
import './Packages.css';

import { databases, packagesTable_id, database_id, Query } from '../../appwriteConfig';

const Packages = ({ studentInfo, educationLevel }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await databases.listDocuments(
          database_id,
          packagesTable_id,
          [Query.equal('educationLevel', educationLevel || 'PLE')]
        );

        const processedPackages = response.documents.map((pkg) => {
          let expiryDate;

          if (pkg.staticDate) {
            expiryDate = moment(pkg.expiryDate).toISOString();
          } else {
            expiryDate = moment()
              .tz('Africa/Nairobi')
              .add(pkg.duration, 'days')
              .toDate();
          }

          return {
            ...pkg,
            expiryDate,
            duration: pkg.staticDate
              ? calculateDaysLeft(pkg.expiryDate)
              : pkg.duration,
          };
        });

        processedPackages.sort((a, b) => a.price - b.price);

        setPackages(processedPackages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching packages:', err);
        setError('Failed to load packages');
        setLoading(false);
      }
    };

    fetchPackages();
  }, [educationLevel]);

  const calculateDaysLeft = (endDate) => {
    const endMoment = moment.tz(endDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ', 'Africa/Nairobi');
    const currentMoment = moment.tz('Africa/Nairobi');
    return endMoment.diff(currentMoment, 'days');
  };

  const handlePurchaseClick = (selectedPkg) => {
    setSelectedPackage(selectedPkg);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '300px' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;
  }

  return (
    <div
      className="justify-content-center"
      style={{ backgroundColor: 'hsl(240, 78%, 98%)' }}
    >
      <Row className="justify-content-md-center">
        <h2 className="text-center" style={{ paddingTop: '30px' }}>
          Choose Your {educationLevel} Package
        </h2>
        <div className="packages-container">
          {packages.map((pkg, idx) => (
            <Col key={pkg.$id} md={3} className="mb-3">
              <Card
                className={`text-center package-card ${idx === 1 ? 'middle-card' : ''}`}
              >
                <Card.Body className="card-body">
                  <Card.Title
                    className="package-tier"
                    style={{ color: `${idx === 1 ? 'white' : ''}` }}
                  >
                    {pkg.tier}
                  </Card.Title>
                  <Card.Text
                    className="package-price"
                    style={{ color: `${idx === 1 ? 'white' : ''}` }}
                  >
                    UGX.{pkg.price}
                  </Card.Text>
                  <ul className="package-features">
                    {pkg.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="feature-item">
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline-primary"
                    className={`package-learn-more ${
                      idx === 1 ? ' middle-button' : ''
                    }`}
                    onClick={() => handlePurchaseClick(pkg)}
                  >
                    Select Pack
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </div>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPackage && (
            <PaymentMethods
              price={selectedPackage.price}
              points={selectedPackage.points}
              tier={selectedPackage.tier}
              paymentFor={'package'}
              studentInfo={studentInfo}
              duration={selectedPackage.duration}
              expiryDate={selectedPackage.expiryDate}
              staticDate={selectedPackage.staticDate}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Packages;