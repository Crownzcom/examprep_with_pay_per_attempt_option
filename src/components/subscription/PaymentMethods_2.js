import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import { InputGroup, Container, Row, Col, ButtonGroup, Button, Form, Alert, Card, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { databases, database_id, pointsTable_id, Query } from '../../appwriteConfig.js';
import { updateStudentDataInLocalStorage, fetchAndProcessStudentData } from '../../utilities/fetchStudentData.js';
import { useAuth } from '../../context/AuthContext.js';
import { updatePointsTable, couponTrackerUpdate } from '../../utilities/otherUtils.js';
import { serverUrl } from '../../config.js';
import './PaymentMethods.css';
import { v4 as uuidv4 } from 'uuid';

import _ from 'lodash';

function PaymentMethods({
  initialCoupon = '',
  price,
  paymentFor,
  points,
  tier = '',
  studentInfo,
  duration,
  expiryDate,
  staticDate,
  selectedSubjects = {},
  paperTypes = [],
  packageTypes = [],
  classLevels = [],
  educationLevel,
}) {
  console.log('PaymentMethods received paymentFor:', paymentFor);
  // All Hooks at the top
  const { userInfo, fetchUserPoints, updatePaymentInfo, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [stage, setStage] = useState('coupon');
  const [coupon, setCoupon] = useState(initialCoupon);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoader, setCouponLoader] = useState(false);
  const [finalPrice, setFinalPrice] = useState(price);
  const [finalPoints, setFinalPoints] = useState(points);
  const [paymentMadeFor, setPaymentMadeFor] = useState(paymentFor);
  const [loader, setLoader] = useState(false);
  const [adjustedSelectedSubjects, setAdjustedSelectedSubjects] = useState(selectedSubjects);

  // Determine payment type based on paymentFor prop
  const paymentType = paymentFor === 'package' ? 'package' : 'paper';
  const hasFullAccess = paymentType === 'package';

  // Non-Hook variables
  const isStudent = userInfo?.labels?.includes('student') || false;
  const isNextOfKin = userInfo?.labels?.includes('kin') || false;
  const originalPrice = price;
  const originalPoints = points;
  const effectiveEducationLevel = educationLevel || state?.educationLevel || userInfo?.educationLevel || 'PLE';

  // Calculate price based on discount
  const calculatePrice = () => {
    if (!discountInfo) return originalPrice;
    if (discountInfo.DiscountType === 'points') return originalPrice;
    const discountValue = parseFloat(discountInfo.DiscountValue);
    switch (discountInfo.DiscountType) {
      case 'fixed':
        return Math.max(originalPrice - discountValue, 0);
      case 'percentage':
        return originalPrice * (1 - discountValue / 100);
      default:
        return originalPrice;
    }
  };

  // Calculate points based on discount
  const calculatePoints = () => {
    if (!discountInfo || discountInfo.DiscountType !== 'points') return originalPoints;
    const discountValue = parseFloat(discountInfo.DiscountValue);
    return Math.max(originalPoints + discountValue, 0);
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    try {
      setCouponLoader(true);
      const response = await fetch(
        `${serverUrl}/query/validate-coupon?code=${coupon}&userId=${
          isStudent ? userInfo.userId : studentInfo.userId
        }&userLabel=${userInfo.labels}`
      );
      const data = await response.json();

      if (response.ok && data.couponDetails) {
        setDiscountInfo(data.couponDetails);
        setCouponError('');
        setFinalPrice(calculatePrice());
        setFinalPoints(calculatePoints());
      } else {
        setDiscountInfo(null);
        setFinalPrice(originalPrice);
        setFinalPoints(originalPoints);
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Error validating coupon. Please try again.');
    } finally {
      setCouponLoader(false);
    }
  };

  useEffect(() => {
    if (!discountInfo || discountInfo.DiscountType !== 'points') {
      if (!_.isEqual(adjustedSelectedSubjects, selectedSubjects)) {
        setAdjustedSelectedSubjects(selectedSubjects);
      }
      if (finalPoints !== originalPoints) {
        setFinalPoints(originalPoints);
      }
      return;
    }

    const discountValue = parseFloat(discountInfo.DiscountValue);
    const extraPoints = Math.max(discountValue, 0);
    let remainingPoints = extraPoints;
    const newSelectedSubjects = { ...selectedSubjects };

    for (const subjectId in newSelectedSubjects) {
      if (remainingPoints <= 0) break;
      const currentAttempts = newSelectedSubjects[subjectId].attempts;
      const maxAttempts = 100;
      const pointsToAdd = Math.min(remainingPoints, maxAttempts - currentAttempts);
      newSelectedSubjects[subjectId] = {
        ...newSelectedSubjects[subjectId],
        attempts: currentAttempts + pointsToAdd,
      };
      remainingPoints -= pointsToAdd;
    }

    // Only update state if the new state is different
    if (!_.isEqual(adjustedSelectedSubjects, newSelectedSubjects)) {
      setAdjustedSelectedSubjects(newSelectedSubjects);
    }

    if (finalPoints !== originalPoints + extraPoints) {
      setFinalPoints(originalPoints + extraPoints);
    }
  }, [discountInfo, selectedSubjects, originalPoints]);

  // Handle next step or complete purchase
  const handleNext = async () => {
    setFinalPrice(calculatePrice());
    setFinalPoints(calculatePoints());

    if (stage === 'coupon' && finalPrice > 0) {
      setStage('payment');
      return;
    }

    if (finalPrice === 0) {
      try {
        setLoader(true);
        const currentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
        const data = {
          staticDate,
          created_at: currentDateTime,
          paymentFor: paymentMadeFor,
          paymentType: paymentType,
          hasFullAccess: hasFullAccess,
          transactionID: 'DISCOUNT-0000',
          userId: isStudent ? userInfo.userId : studentInfo.userId,
          points: finalPoints,
          educationLevel: effectiveEducationLevel,
          expiryDate: expiryDate || null,
          message: 'Points Purchase on discount.',
        };

        await updatePointsTable(data);

        // Update payment info in AuthContext
        if (isStudent && updatePaymentInfo) {
          await updatePaymentInfo({
            paymentType: paymentType,
            hasFullAccess: hasFullAccess,
          });
        }

        if (isNextOfKin) {
          await fetchAndProcessStudentData(userInfo.userId);
        }

        if (isStudent) {
          await fetchUserPoints(userInfo.userId, effectiveEducationLevel);
        } else {
          try {
            const response = await databases.listDocuments(database_id, pointsTable_id, [
              Query.equal('UserID', studentInfo.userId),
            ]);
            if (response.documents.length > 0) {
              const newPointsBalance = response.documents[0].PointsBalance;
              await updateStudentDataInLocalStorage(studentInfo.userId, { 
                pointsBalance: newPointsBalance,
                paymentType: paymentType,
                hasFullAccess: hasFullAccess,
              });
            }
          } catch (err) {
            console.error('Failed to fetch points from database for update after payment verification:', err);
          }
        }

        await couponTrackerUpdate({ userId: data.userId, couponCode: coupon });
        navigate(-1);
      } catch (err) {
        console.error('Failed to top-up points:', err);
        setCouponError('Failed to complete purchase. Please try again.');
      } finally {
        setLoader(false);
      }
    }
  };
  
  // Navigate to payment method
  const handlePaymentSelection = (method, network) => {
    navigate(`/payment/${method.toLowerCase()}`, {
      state: {
        price: finalPrice,
        paymentFor: paymentFor,
        paymentType: paymentType,
        hasFullAccess: hasFullAccess,
        points: finalPoints,
        studentInfo,
        network,
        couponCode: coupon,
        duration,
        educationLevel: effectiveEducationLevel,
        splitPayment: discountInfo?.IsSplit || false,
        subaccountID: discountInfo?.SubaccountID || null,
        transactionSplitRatio: discountInfo?.TransactionSplitRatio || null,
        transactionChargeType: discountInfo?.TransactionChargeType || null,
        transactionCharge: discountInfo?.TransactionCharge || null,
      },
    });
  };

  // Render selected subjects
  const renderSelectedSubjects = () => {
    if (paymentType === 'paper') {
      return (
        <div className="mb-4">
          <h6 className="section-heading mb-3">PURCHASE SUMMARY</h6>
          <div className="d-flex justify-content-between align-items-center p-2 subject-item">
            <div className="d-flex align-items-center">
              <span className="fw-medium">Exam Attempts</span>
            </div>
            <div>
              <span className="me-3">{points} attempts @ UGX {(price / points).toLocaleString()} each</span>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center p-2 subject-item">
            <div className="d-flex align-items-center">
              <span className="fw-medium">Education Level</span>
            </div>
            <div>
              <span className="me-3">{educationLevel}</span>
            </div>
          </div>
        </div>
      );
    } else if (tier) {
      // For package payments
      return (
        <div className="mb-4">
          <Card.Text>
            <br />
            <strong>Package:</strong> {tier}
            <br />
            <strong>Price: UGX.</strong> {finalPrice.toLocaleString()}
          </Card.Text>
        </div>
      );
    }
    
    return null;
  };

  // Render loading state in JSX
  if (authLoading || !userInfo) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      {stage === 'coupon' && (
        <Row className="justify-content-md-center order-summary">
          <Col md={8} lg={9} className="justify-content-md-center">
            <Card className="content-center">
              <Card.Header as="h2">
                Order Summary
                {paymentType === 'package' ? (
                  <Badge bg="success" className="ms-2">Full Access</Badge>
                ) : (
                  <Badge bg="info" className="ms-2">Pay Per Attempt</Badge>
                )}
              </Card.Header>
              <Card.Body>
                {renderSelectedSubjects()}
                <Card.Text>
                  <br />
                  <strong>Package:</strong> {tier || (selectedSubjects ? 'Exam Papers' : '')}
                  <br />
                  <strong>Price: UGX.</strong> {finalPrice.toLocaleString()}
                  <br />
                  <strong>Payment Type:</strong> {paymentType === 'package' ? 'Full Access' : 'Pay Per Attempt'}
                </Card.Text>
                <Card.Title>Do you have a coupon?</Card.Title>
                <Form>
                  <Form.Group className="mb-3" controlId="formCouponCode">
                    <Form.Label>Apply Coupon/Token Code</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Enter coupon code"
                        aria-describedby="button-apply-coupon"
                      />
                      <Button
                        variant="outline-primary"
                        size="sm"
                        id="button-apply-coupon"
                        onClick={handleApplyCoupon}
                        disabled={!coupon || couponLoader}
                      >
                        {couponLoader ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">Applying...</span>
                          </>
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </InputGroup>
                    {couponLoader && (
                      <div className="mt-2">
                        <Spinner animation="grow" variant="primary" size="sm" />
                        <Spinner animation="grow" variant="secondary" size="sm" />
                        <Spinner animation="grow" variant="success" size="sm" />
                      </div>
                    )}
                  </Form.Group>
                  {couponError && <Alert variant="danger">{couponError}</Alert>}
                </Form>
                {/* {discountInfo && (
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <i className="bi bi-building me-2"></i>
                      <strong>Original Price:</strong> UGX {originalPrice.toLocaleString()}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-building me-2"></i>
                      <strong>Description:</strong> {discountInfo.Description}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-building me-2"></i>
                      <strong>Discount:</strong>{' '}
                      {discountInfo.DiscountType === 'fixed' && 'UGX '}
                      {discountInfo.DiscountType === 'fixed' || discountInfo.DiscountType === 'percentage'
                        ? discountInfo.DiscountValue
                        : discountInfo.DiscountType === 'points'
                        ? 'Exam discount'
                        : 0}{' '}
                      {discountInfo.DiscountType === 'percentage'
                        ? '%'
                        : discountInfo.DiscountType === 'points'
                        ? null
                        : null}
                    </li>
                    <li className="list-group-item">
                      <i className="bi bi-building me-2"></i>
                      <strong>Final Price:</strong> UGX {finalPrice.toLocaleString()}
                    </li>
                    {discountInfo.IsSplit && (
                      <li className="list-group-item">
                        <i className="bi bi-building me-2"></i>
                        <strong>Payment Type:</strong> Split Payment
                      </li>
                    )}
                  </ul>
                )} */}
                {discountInfo && (
                  <Alert variant="success" className="mt-3">
                    <i className="bi bi-check-circle me-2"></i>
                    <strong>{discountInfo.DiscountType === 'points' ? 'Exam discount' : 'Coupon'} applied!</strong>
                    {calculatePrice() !== originalPrice && ` Final price: UGX ${calculatePrice().toLocaleString()}`}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {stage === 'payment' && (
        <Row className="justify-content-center my-5">
          <h2 className="text-center mb-4 w-100">
            Select Payment Method
            {paymentType === 'package' ? (
              <Badge bg="success" className="ms-2">Full Access</Badge>
            ) : (
              <Badge bg="info" className="ms-2">Pay Per Attempt</Badge>
            )}
          </h2>
          <Col lg={4} className="d-flex justify-content-center">
            <Card
              border="warning"
              className="text-center package-card shadow-lg"
              style={{ width: '18rem' }}
              onClick={() => handlePaymentSelection('mobile-money', 'MTN')}
            >
              <Card.Header style={{ backgroundColor: 'orange', color: 'white' }}>MTN Mobile Money</Card.Header>
              <Card.Body className="justify-content-center">
                <Card.Img variant="top" src="img/images/mtnmomo.png" className="card-img-centered" />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="d-flex justify-content-center">
            <Card
              border="danger"
              className="text-center package-card shadow-lg"
              style={{ width: '18rem' }}
              onClick={() => handlePaymentSelection('mobile-money', 'AIRTEL')}
            >
              <Card.Header style={{ backgroundColor: 'red', color: 'white' }}>Airtel Money</Card.Header>
              <Card.Body className="justify-content-center">
                <Card.Img variant="top" src="img/images/airtel-money.png" className="card-img-centered" />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="d-flex justify-content-center">
            <Card
              border="info"
              className="text-center package-card shadow-lg"
              style={{ width: '18rem' }}
              onClick={() => handlePaymentSelection('card-payment', 'card')}
            >
              <Card.Header style={{ backgroundColor: '#2a9d8f', color: 'white' }}>Card</Card.Header>
              <Card.Body className="justify-content-center">
                <Card.Img variant="top" src="img/images/credit-card.png" className="card-img-centered" />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ButtonGroup style={{ width: '75%' }}>
          <Button className="btn-cancel" variant="dark" onClick={() => navigate('/')}>
            Cancel
          </Button>
          {stage === 'payment' && (
            <Button variant="secondary" onClick={() => setStage('coupon')}>
              Back to Order Summary
            </Button>
          )}
          {stage === 'coupon' && (
            !loader ? (
              <Button variant="success" onClick={handleNext}>
                {finalPrice === 0 ? 'Complete Purchase' : 'Proceed to Payment'}
              </Button>
            ) : (
              <Button variant="success" disabled>
                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                Processing...
              </Button>
            )
          )}
        </ButtonGroup>
      </div>
    </div>
  );
}
export default PaymentMethods;