import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { InputGroup, Container, Row, Col, ButtonGroup, Button, Form, Alert, Card, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { databases, database_id, pointsTable_id, Query } from "../../appwriteConfig.js";
import { updateStudentDataInLocalStorage, fetchAndProcessStudentData } from '../../utilities/fetchStudentData.js';
import { useAuth } from '../../context/AuthContext.js';
import { updatePointsTable, couponTrackerUpdate } from '../../utilities/otherUtils.js';
import { serverUrl } from '../../config.js';
import './PaymentMethods.css';

function PaymentMethods({
    initialCoupon,
    price,
    paymentFor,
    points,
    tier,
    studentInfo,
    duration,
    expiryDate,
    staticDate,
    selectedSubjects = {},
    paperTypes = [],
    packageTypes = [],
    classLevels = [],
}) {
    const { userInfo, fetchUserPoints } = useAuth();
    const isStudent = userInfo.labels.includes("student");
    const isNextOfKin = userInfo.labels.includes("kin");
    const navigate = useNavigate();
    const originalPrice = price;
    const originalPoints = points;

    const [stage, setStage] = useState('coupon');
    const [coupon, setCoupon] = useState(initialCoupon || '');
    const [discountInfo, setDiscountInfo] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoader, setCouponLoader] = useState(false);
    const [finalPrice, setFinalPrice] = useState(originalPrice);
    const [finalPoints, setFinalPoints] = useState(originalPoints);
    const [paymentMadeFor, setPaymentMadeFor] = useState(paymentFor);
    const [loader, setLoader] = useState(false);

    const handleApplyCoupon = async () => {
        try {
            setCouponLoader(true);
            const response = await fetch(`${serverUrl}/query/validate-coupon?code=${coupon}&userId=${isStudent ? userInfo.userId : studentInfo.userId}&userLabel=${userInfo.labels}`);
            const data = await response.json();

            if (response.ok && data.couponDetails) {
                setDiscountInfo(data.couponDetails);
                setCouponError('');
            } else {
                setDiscountInfo(null);
                setFinalPrice(originalPrice);
                setCouponError(data.message || 'Invalid coupon code');
            }
            setCouponLoader(false);
        } catch (error) {
            console.error('Error validating coupon:', error);
            setCouponError('Error validating coupon. Please try again.');
            setCouponLoader(false);
        }
    };

    const calculatePrice = () => {
        if (!discountInfo) return originalPrice;
        if (discountInfo.DiscountType === 'points') return originalPrice;
        const discountValue = parseFloat(discountInfo.DiscountValue);
        switch (discountInfo.DiscountType) {
            case 'fixed': return Math.max(originalPrice - discountValue, 0);
            case 'percentage': return originalPrice * (1 - discountValue / 100);
            default: return originalPrice;
        }
    };

    const calculatePoints = () => {
        if (!discountInfo || discountInfo.DiscountType !== 'points') return originalPoints;
        const discountValue = parseFloat(discountInfo.DiscountValue);
        return Math.max(originalPoints + discountValue, 0);
    };

    useEffect(() => {
        setFinalPrice(calculatePrice());
        setFinalPoints(calculatePoints());
    }, [discountInfo]);

    const handleNext = async () => {
        setFinalPoints(calculatePoints());

        if (stage === 'coupon' && finalPrice > 0) {
            setStage('payment');
        }
        if (finalPrice === 0) {
            try {
                setLoader(true);
                const currentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a');
                let data = {
                    staticDate: staticDate,
                    created_at: currentDateTime,
                    paymentFor: paymentMadeFor,
                    transactionID: 'DISCOUNT-0000',
                    userId: isStudent ? userInfo.userId : studentInfo.userId,
                    points: finalPoints,
                    educationLevel: isStudent ? userInfo.educationLevel : studentInfo.educationLevel,
                    expiryDate: expiryDate ? expiryDate : null,
                    message: `Points Purchase on discount.`,
                    // Transform selectedSubjects for discount case
                    selectedSubjects: Object.keys(selectedSubjects).reduce((acc, id) => {
                        acc[id] = selectedSubjects[id].attempts;
                        return acc;
                    }, {}),
                };

                await updatePointsTable(data);

                if (isNextOfKin) {
                    await fetchAndProcessStudentData(userInfo.userId);
                }

                if (isStudent) {
                    await fetchUserPoints(userInfo.userId, userInfo.educationLevel);
                } else {
                    let newPointsBalance;
                    try {
                        const response = await databases.listDocuments(database_id, pointsTable_id, [Query.equal('UserID', studentInfo.userId)]);
                        if (response.documents.length > 0) {
                            newPointsBalance = response.documents[0].PointsBalance;
                            await updateStudentDataInLocalStorage(studentInfo.userId, { pointsBalance: newPointsBalance });
                        }
                    } catch (err) {
                        console.error('Failed to Fetch points from Database for update after Payment verification: ', err);
                    }
                }

                await couponTrackerUpdate({ userId: data.userId, couponCode: coupon });
            } catch (err) {
                console.error('Failed to top-up points: ', err);
            } finally {
                setLoader(false);
                navigate(-1);
            }
        }
    };

    const handlePaymentSelection = (method, network) => {
        // Transform selectedSubjects to { [subjectId]: attempts }
        const transformedSubjects = Object.keys(selectedSubjects).reduce((acc, id) => {
            acc[id] = selectedSubjects[id].attempts;
            return acc;
        }, {});

        navigate(`/payment/${method.toLowerCase()}`, {
            state: {
                price: finalPrice,
                paymentFor: paymentMadeFor,
                points: finalPoints,
                studentInfo: studentInfo,
                network: network,
                couponCode: coupon,
                duration: duration,
                selectedSubjects: transformedSubjects, // Use transformed format
                paperTypes: paperTypes,
                packageTypes: packageTypes,
                classLevels: classLevels,
                splitPayment: discountInfo?.IsSplit || false,
                subaccountID: discountInfo?.SubaccountID || null,
                transactionSplitRatio: discountInfo?.TransactionSplitRatio || null,
                transactionChargeType: discountInfo?.TransactionChargeType || null,
                transactionCharge: discountInfo?.TransactionCharge || null
            }
        });
    };

    const renderSelectedSubjects = () => {
        if (!selectedSubjects || Object.keys(selectedSubjects).length === 0) return null;

        return (
            <div className="mb-4">
                <h6 className="section-heading mb-3">SELECTED PAPERS</h6>
                {Object.entries(selectedSubjects).map(([id, subject]) => (
                    <div
                        key={id}
                        className="d-flex justify-content-between align-items-center p-2 subject-item"
                    >
                        <div className="d-flex align-items-center">
                            <span className="fw-medium">{subject.name}</span>
                            <span className="ms-3">
                                {subject.attempts} attempt{subject.attempts > 1 ? 's' : ''} @ UGX {subject.price.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <span className="me-3">
                                UGX {(subject.attempts * subject.price).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {stage === 'coupon' && (
                <Row className="justify-content-md-center order-summary">
                    <Col md={8} lg={9} className='justify-content-md-center'>
                        <Card className="content-center">
                            <Card.Header as="h2">Order Summary</Card.Header>
                            <Card.Body>
                                {renderSelectedSubjects()}
                                <Card.Text>
                                    <br />
                                    <strong>Package:</strong> {tier || (selectedSubjects ? 'Exam Papers' : '')}
                                    <br />
                                    <strong>Price: UGX.</strong>{finalPrice.toLocaleString()}
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
                                                ) : "Apply"}
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
                                {discountInfo && (
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
                                            <strong>Discount:</strong>
                                            {' '}
                                            {(discountInfo.DiscountType === 'fixed') && 'UGX '}
                                            {(discountInfo.DiscountType === 'fixed' || discountInfo.DiscountType === 'percentage') ? discountInfo.DiscountValue : (discountInfo.DiscountType === 'points' ? 'Exam discount' : 0)}
                                            {' '}
                                            {discountInfo.DiscountType === 'percentage' ? '%' : (discountInfo.DiscountType === 'points' ? null : null)}
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
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {stage === 'payment' && (
                <Row className="justify-content-center my-5">
                    <h2 className="text-center mb-4 w-100">Select Payment Method</h2>
                    <Col lg={4} className="d-flex justify-content-center">
                        <Card border="warning" className={`text-center package-card shadow-lg`} style={{ width: '18rem' }} onClick={() => handlePaymentSelection('mobile-money', 'MTN')}>
                            <Card.Header style={{ backgroundColor: 'orange', color: 'white' }}>
                                MTN Mobile Money
                            </Card.Header>
                            <Card.Body className="justify-content-center">
                                <Card.Img variant="top" src={`img/images/mtnmomo.png`} className="card-img-centered" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} className="d-flex justify-content-center">
                        <Card border="danger" className={`text-center package-card shadow-lg`} style={{ width: '18rem' }} onClick={() => handlePaymentSelection('mobile-money', 'AIRTEL')}>
                            <Card.Header style={{ backgroundColor: 'red', color: 'white' }}>
                                Airtel Money
                            </Card.Header>
                            <Card.Body className="justify-content-center">
                                <Card.Img variant="top" src={`img/images/airtel-money.png`} className="card-img-centered" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} className="d-flex justify-content-center">
                        <Card border="info" className={`text-center package-card shadow-lg`} style={{ width: '18rem' }} onClick={() => handlePaymentSelection('card-payment', 'card')}>
                            <Card.Header style={{ backgroundColor: '#2a9d8f', color: 'white' }}>
                                Card
                            </Card.Header>
                            <Card.Body className="justify-content-center">
                                <Card.Img variant="top" src={`img/images/credit-card.png`} className="card-img-centered" />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <ButtonGroup style={{ width: '75%' }}>
                    <Button className='btn-cancel' variant="dark" onClick={() => navigate('/')}>
                        Cancel
                    </Button>
                    {stage === 'payment' && (
                        <Button variant="secondary" onClick={() => setStage('coupon')}>Back to Order Summary</Button>
                    )}
                    {stage === 'coupon' && (
                        !loader ?
                            <Button variant="success" onClick={handleNext}>{finalPrice === 0 ? 'Complete Purchase' : 'Proceed to Payment'}</Button>
                            :
                            <Button variant="success" disabled>
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Processing...
                            </Button>
                    )}
                </ButtonGroup>
            </div>
        </div>
    );
}

export default PaymentMethods;