import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext';
import { serverUrl, rootUrl } from '../../config';
import 'react-phone-number-input/style.css';
import './CardPayment.css';

function CardPayment() {
  const { userInfo } = useAuth();
  const isStudent = userInfo.labels.includes('student');
  const isNextOfKin = userInfo.labels.includes('kin');
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    price = 0,
    paymentFor = 'points',
    paymentType = 'paper',
    hasFullAccess = false,
    points = 0,
    studentInfo = { userId: '', name: '', educationLevel: '' },
    couponCode = null,
    duration = 366,
    splitPayment = false,
    subaccountID = null,
    transactionSplitRatio = null,
    transactionChargeType = null,
    transactionCharge = null,
    educationLevel = userInfo.educationLevel,
  } = state || {};

  const studentId = isNextOfKin ? studentInfo.userId : '';
  const studentName = isNextOfKin ? studentInfo.name : '';

  // State variables
  const [userId] = useState(userInfo ? userInfo.userId : '');
  const [phone, setPhone] = useState(userInfo ? userInfo.phone : '');
  const [email, setEmail] = useState('crownzcom@gmail.com');
  const [name, setName] = useState((userInfo ? userInfo.firstName : '') + ' ' + (userInfo ? userInfo.lastName : ''));
  const [phoneError, setPhoneError] = useState(false);
  const [amount] = useState(price);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [submit, setSubmit] = useState(false);

  // Check for missing price
  useEffect(() => {
    console.log('CardPayment state:', { points, price, educationLevel, paymentType, hasFullAccess });
    if (!price) {
      setPaymentStatus('No price provided. Redirecting back...');
      setTimeout(() => navigate(-1), 3000);
    }
  }, [price, navigate]);

  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && !isValidPhoneNumber(phoneNumber);
  };

  const initiatePayment = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const dataToSend = {
        tx_ref: `${uuidv4()}`,
        amount: amount,
        currency: 'UGX',
        redirect_url: `${rootUrl}/payment/verification`,
        payment_options: 'card',
        ...(splitPayment && subaccountID
          ? {
              subaccounts: [
                {
                  id: subaccountID,
                  transaction_split_ratio: transactionSplitRatio,
                  transaction_charge_type: transactionChargeType,
                  transaction_charge: transactionCharge,
                },
              ],
            }
          : {}),
        customer: {
          email: email,
          phonenumber: phone,
          name: name,
        },
        meta: {
          userId: `${userId}`,
          description: `Payment for Exam subscription${isStudent ? '.' : ` for ${studentName}`}`,
          service: `${paymentFor}`,
          paymentType: paymentType,
          hasFullAccess: hasFullAccess,
          points: `${points}`,
          couponCode: couponCode,
          duration: `${duration}`,
          educationLevel: educationLevel,
          ...(isStudent ? {} : { studentName: studentName, studentId: studentId }),
          splitPayment: splitPayment || false,
        },
        customizations: {
          title: 'Crownzcom',
          description: `Payment for exam attempts${isStudent ? '.' : ` for ${studentName}`}`,
          logo: `${serverUrl}/images/logo.png`,
        },
      };

      console.log('CardPayment: Initiating payment', { name, email, phone, amount });
      console.log('CardPayment Payload:', dataToSend);

      const response = await fetch(`${serverUrl}/flutterwave/card-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      const data = await response.json();
      console.log('CardPayment: Server response:', JSON.stringify(data, null, 2));

      if (data && data.status === 'success') {
        const redirectUrl = data.data?.link || data.response?.meta?.authorization?.redirect;
        if (redirectUrl) {
          console.log('CardPayment: Redirecting to:', redirectUrl);
          window.location.href = redirectUrl;
        } else {
          setPaymentStatus('Error: No redirect URL provided by server.');
        }
      } else {
        setPaymentStatus(data.message || 'Error initiating payment. Please try again.');
      }
    } catch (error) {
      console.error('CardPayment: Error initiating payment:', error);
      setPaymentStatus(
        error.name === 'AbortError'
          ? 'Payment request timed out. Please check your internet connection.'
          : `Payment failed: ${error.message}`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submit) return; // Prevent multiple submissions
    setSubmit(true);
    setPaymentStatus(null);

    if (validatePhoneNumber(phone)) {
      setPhoneError(true);
      setTimeout(() => setSubmit(false), 100);
      return;
    }

    await initiatePayment();
    setSubmit(false);
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, hsl(236, 72%, 79%), hsl(237, 63%, 64%))' }}>
      <Container className="card-payment-container">
        <Row className="w-100 justify-content-center">
          <Col>
            <Card className="w-100 shadow">
              <Card.Header>
                <Card.Title className="text-center mb-3">Card Payment</Card.Title>
                <Card.Text className="text-center">Enter your details to proceed with card payment.</Card.Text>
              </Card.Header>
              <Card.Body>
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
                  <div className="d-flex justify-content-between align-items-center p-2 subject-item">
                    <div className="d-flex align-items-center">
                      <span className="fw-medium">Total Amount</span>
                    </div>
                    <div>
                      <span className="me-3">UGX {price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Form onSubmit={handleSubmit} className="card-payment-form">
                  <Form.Group className="mb-3">
                    <Form.Label>Name*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email*</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number*</Form.Label>
                    <PhoneInput
                      className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                      placeholder="Enter phone number"
                      international
                      defaultCountry="UG"
                      value={phone}
                      onChange={setPhone}
                      required
                      aria-describedby={phoneError ? 'phone-error' : undefined}
                    />
                    {phoneError && (
                      <Form.Control.Feedback type="invalid" id="phone-error">
                        Invalid phone number
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submit}
                    className="w-100 mb-3 payment-submit-btn"
                  >
                    {submit ? (
                      <>
                        <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                        Processing...
                      </>
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer>
                {paymentStatus && <Alert variant="info" className="mt-3">{paymentStatus}</Alert>}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default CardPayment;