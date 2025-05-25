import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useAuth } from '../../context/AuthContext';
import { serverUrl, rootUrl } from '../../config.js';
import 'react-phone-number-input/style.css';
import './MobileMoney.css';

function MobileMoney() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    price = 0,
    paymentFor = 'points',
    paymentType = 'paper',
    hasFullAccess = false,
    points = 0,
    studentInfo = { userId: '', name: '', educationLevel: '' },
    network = 'MTN',
    couponCode = null,
    duration = 366,
    splitPayment = false,
    subaccountID = null,
    transactionSplitRatio = null,
    transactionChargeType = null,
    transactionCharge = null,
    educationLevel = userInfo.educationLevel,
  } = state || {};

  const [error, setError] = useState(null);
  const [phone, setPhone] = useState(userInfo.phone || '');
  const [email] = useState(userInfo.email || 'crownzcom@gmail.com');
  const [message, setMessage] = useState(
    'A page will load shortly after, requesting you to enter the MOMO validation OTP sent to you via SMS and WhatsApp to complete this transaction.'
  );
  const [phoneError, setPhoneError] = useState(false);
  const [amount] = useState(price);
  const [submit, setSubmit] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Check for missing price
  useEffect(() => {
    console.log('MobileMoney state:', { points, price, educationLevel, paymentType, hasFullAccess });
    if (!price) {
      setPaymentStatus('No price provided. Please go back and try again.');
      setTimeout(() => navigate(-1), 3000);
    }
  }, [price, navigate]);

  const isStudent = userInfo.labels.includes('student');
  const isNextOfKin = userInfo.labels.includes('kin');
  const studentId = isNextOfKin ? studentInfo.userId : '';
  const studentName = isNextOfKin ? studentInfo.name : '';

  const validatePhoneNumber = (phoneNumber) => {
    return phoneNumber && isValidPhoneNumber(phoneNumber);
  };

  const handlePhoneChange = (value) => {
    setPhone(value || '');
    setPhoneError(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPhoneError(false);
    setPaymentStatus(null);
    setSubmit(true);

    console.log("MobileMoney: Submitting payment request", { phone, amount, network });

    if (!phone) {
      setMessage('Please enter a phone number.');
      setPhoneError(true);
      setTimeout(() => setSubmit(false), 100);
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setPhoneError(true);
      setMessage('Please enter a valid phone number (e.g., +256123456789).');
      setTimeout(() => setSubmit(false), 100);
      return;
    }

    if (error) {
      setPaymentStatus(error);
      setTimeout(() => setSubmit(false), 100);
      return;
    }

    const payload = {
      phone_number: phone,
      network,
      amount,
      currency: 'UGX',
      email,
      redirect_url: `${rootUrl}/payment/verification`,
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
      meta: {
        price,
        userId: userInfo.userId,
        description: `Exam subscription${isStudent ? '.' : ` for ${studentName}`}`,
        service: paymentFor,
        paymentType: paymentType,
        hasFullAccess: hasFullAccess,
        points: points.toString(),
        couponCode: couponCode || '',
        duration: duration.toString(),
        educationLevel,
        ...(isStudent ? {} : { studentName, studentId }),
        splitPayment: splitPayment || false,
      },
    };
  
    console.log("MobileMoney Payload:", payload);

    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const controller = new AbortController();

    try {
      const response = await fetch(`${serverUrl}/flutterwave/mobile-money-pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        } catch {
          throw new Error(`Server responded with: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log("MobileMoney: Server response:", data);
      if (data.status === "success" && data.response.meta?.authorization?.mode === "redirect") {
        console.log("MobileMoney: Redirecting to:", data.response.meta.authorization.redirect);
        window.location.href = data.response.meta.authorization.redirect;
      } else {
        setPaymentStatus(data.response.message || "Payment initiation failed.");
        setSubmit(false);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("MobileMoney: Error making payment:", error);
      setPaymentStatus(error.name === "AbortError" ? "Payment request timed out. Please check your internet connection" : `Payment failed: ${error.message}`);
      setSubmit(false);
    }
  };
  
  return (
    <div className="mt-4" style={{ marginTop: '100px', background: 'linear-gradient(135deg, hsl(236, 72%, 79%), hsl(237, 63%, 64%))' }}>
      <Form onSubmit={handleSubmit}>
        <Card className="payment-card">
          <Card.Header className="payment-card-header" style={{ backgroundColor: network === 'AIRTEL' ? '#c2ecf3' : undefined }}>
            <h3 style={{ color: network === 'MTN' ? 'yellow' : '#ff0000' }}>{network} Mobile Money Payment</h3>
            <p style={{ color: network === 'AIRTEL' ? '#854a12' : undefined }}>Securely complete your payment via Mobile Money.</p>
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
            
            <Form.Group className="mb-3">
              <Card.Subtitle>
                <Form.Label>Phone Number*</Form.Label>
              </Card.Subtitle>
              <PhoneInput
                className={`form-control ${phoneError ? 'is-invalid' : ''}`}
                placeholder="Enter phone number"
                international
                defaultCountry="UG"
                value={phone}
                onChange={handlePhoneChange}
                required
                aria-describedby={phoneError ? 'phone-error' : undefined}
              />
              {phoneError && (
                <Form.Control.Feedback type="invalid" id="phone-error">
                  Invalid phone number
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="text" value={`UGX ${amount}`} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Network</Form.Label>
              <Form.Control type="text" value={network} disabled />
            </Form.Group>
            {paymentStatus && (
              <Alert className="mt-3" variant={paymentStatus.includes('Error') || paymentStatus.includes('Failed') ? 'danger' : 'info'}>
                {paymentStatus}
              </Alert>
            )}
            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3 payment-submit-btn"
              disabled={!phone || submit}
            >
              {submit ? (
                <>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                'Pay with Mobile Money'
              )}
            </Button>
          </Card.Body>
          <Card.Footer>{message && <p className="payment-message">{message}</p>}</Card.Footer>
        </Card>
      </Form>
    </div>
  );
}
export default MobileMoney;