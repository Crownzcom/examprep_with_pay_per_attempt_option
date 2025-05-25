import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Spinner, Modal, Badge, Container, Tab, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CreditCard, Info, Gift, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PaymentMethods from './PaymentMethods_2';
import { updatePointsTable } from '../../utilities/otherUtils';
import moment from 'moment';
import { databases, database_id, pointsTable_id, Query } from '../../appwriteConfig';

const SelectAttempts = () => {
    const { userInfo, fetchUserPoints } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const educationLevel = userInfo?.educationLevel || 'PLE';
    const [attempts, setAttempts] = useState(1); // Start with 1 additional attempt
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [trialStatus, setTrialStatus] = useState('checking'); // 'checking', 'available', 'used'
    const [activeTab, setActiveTab] = useState('trial');
    const [buttonLoading, setButtonLoading] = useState(false);
    
    // Set pricing based on education level
    const pricePerAttempt = educationLevel === 'PLE' ? 300 : 500;
    const totalPrice = attempts * pricePerAttempt;
    
    // Check trial status when component mounts
    useEffect(() => {
        const checkTrialStatus = async () => {
            if (!userInfo?.userId) return;
            
            try {
                const response = await databases.listDocuments(
                    database_id,
                    pointsTable_id,
                    [Query.equal('UserID', userInfo.userId)]
                );
                
                if (response.documents.length > 0) {
                    const pointsDoc = response.documents[0];
                    const status = pointsDoc.trialStatus === 'active' ? 'used' : 'available';
                    setTrialStatus(status);
                    
                    // If trial is already used, switch to purchase tab
                    if (status === 'used') {
                        setActiveTab('purchase');
                    }
                } else {
                    setTrialStatus('available');
                }
            } catch (error) {
                console.error('Error checking trial status:', error);
                setTrialStatus('available'); // Default to available if error
            }
        };
        
        checkTrialStatus();
    }, [userInfo]);
    
    const handleAttemptChange = (delta) => {
        const newAttempts = Math.max(1, Math.min(100, attempts + delta));
        setAttempts(newAttempts);
    };
    
    const handleCheckout = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    const handleActivateTrial = async () => {
        setLoading(true);
        setButtonLoading(true);
        try {
            // Add 2 trial points to the user's account
            await updatePointsTable({
                created_at: moment().format('MMMM Do YYYY, h:mm:ss a'),
                paymentFor: "paper",
                paymentType: "paper",
                hasFullAccess: false,
                transactionID: `TRIAL-${userInfo.userId}`,
                userId: userInfo.userId,
                points: 2,
                duration: 366, // 1 year validity for trial points
                educationLevel: userInfo.educationLevel,
                message: "Trial points activation",
                isTrial: true, // Mark this as a trial activation
                trialStatus: 'active'
            });
            
            // Refresh user points
            await fetchUserPoints(userInfo.userId, userInfo.educationLevel);
            
            // Navigate to home page with success message
            navigate("/", { 
                state: { 
                    trialActivated: true,
                    message: "You've received 2 free trial attempts! You can now access exam papers."
                } 
            });
        } catch (error) {
            console.error("Error activating trial:", error);
        } finally {
            setLoading(false);
            setButtonLoading(false);
        }
    };
    
    if (trialStatus === 'checking') {
        return (
            <Container className="my-5 text-center">
                <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                    <Spinner animation="border" role="status" variant="primary" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <h5 className="text-muted">Checking trial status...</h5>
                </div>
            </Container>
        );
    }
    
    return (
        <div className="min-vh-100 bg-light py-5">
            <Container>
                {/* Enhanced Header */}
                <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold text-dark mb-3">Get Exam Attempts</h1>
                    <p className="lead text-muted">Choose how you want to access exam papers</p>
                </div>
                
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <Card className="shadow border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <Card.Header className="bg-white border-0 pt-4 pb-0">
                                <Nav variant="tabs" className="nav-fill border-0">
                                    {trialStatus === 'available' && (
                                        <Nav.Item>
                                            <Nav.Link 
                                                active={activeTab === 'trial'} 
                                                onClick={() => setActiveTab('trial')}
                                                className="d-flex align-items-center justify-content-center border-0 fw-semibold"
                                                style={{ 
                                                    borderRadius: '12px 12px 0 0',
                                                    backgroundColor: activeTab === 'trial' ? '#f8f9fa' : 'transparent',
                                                    color: activeTab === 'trial' ? '#198754' : '#6c757d',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <Gift size={18} className="me-2" />
                                                Free Trial
                                                <Badge bg="success" pill className="ms-2 animate__animated animate__pulse animate__infinite">
                                                    2 Free
                                                </Badge>
                                            </Nav.Link>
                                        </Nav.Item>
                                    )}
                                    <Nav.Item>
                                        <Nav.Link 
                                            active={activeTab === 'purchase'} 
                                            onClick={() => setActiveTab('purchase')}
                                            className="d-flex align-items-center justify-content-center border-0 fw-semibold"
                                            style={{ 
                                                borderRadius: '12px 12px 0 0',
                                                backgroundColor: activeTab === 'purchase' ? '#f8f9fa' : 'transparent',
                                                color: activeTab === 'purchase' ? '#0d6efd' : '#6c757d',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <CreditCard size={18} className="me-2" />
                                            Purchase Attempts
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body className="p-4" style={{ minHeight: '500px' }}>
                                <Tab.Content>
                                    {trialStatus === 'available' && (
                                        <Tab.Pane active={activeTab === 'trial'}>
                                            <div className="text-center py-4">
                                                <div className="mb-4">
                                                    <div className="mx-auto mb-4 d-inline-flex align-items-center justify-content-center" 
                                                            style={{ 
                                                            width: '100px', 
                                                            height: '100px',
                                                            background: 'linear-gradient(135deg, #198754 0%, #146c43 100%)',
                                                            borderRadius: '50%',
                                                            color: 'white'
                                                            }}>
                                                        <Gift size={48} />
                                                    </div>
                                                    <h2 className="fw-bold text-success mb-3">Start with 2 Free Attempts</h2>
                                                    <p className="text-muted lead">
                                                        Activate your free trial to get started with your exam preparation.
                                                        <br />
                                                        <strong>No payment required.</strong>
                                                    </p>
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <div className="d-flex justify-content-center mb-4">
                                                        <div className="px-5 py-4 border-0 rounded-4 shadow-sm"
                                                                style={{ 
                                                                background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f9f0 100%)',
                                                                border: '2px solid #198754'
                                                                }}>
                                                            <h1 className="mb-0 text-success fw-bold display-4">2</h1>
                                                            <div className="text-success fw-semibold">Free attempts</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mb-5">
                                                    <h4 className="fw-bold mb-4">What you get:</h4>
                                                    <Row className="g-3">
                                                        <Col md={4}>
                                                            <div className="d-flex flex-column align-items-center text-center">
                                                                <div className="rounded-circle bg-success bg-opacity-10 p-3 mb-2">
                                                                    <Check size={24} className="text-success" />
                                                                </div>
                                                                <span className="fw-medium">Access any exam paper</span>
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="d-flex flex-column align-items-center text-center">
                                                                <div className="rounded-circle bg-success bg-opacity-10 p-3 mb-2">
                                                                    <Gift size={24} className="text-success" />
                                                                </div>
                                                                <span className="fw-medium">2 free exam attempts</span>
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="d-flex flex-column align-items-center text-center">
                                                                <div className="rounded-circle bg-success bg-opacity-10 p-3 mb-2">
                                                                    <Check size={24} className="text-success" />
                                                                </div>
                                                                <span className="fw-medium">Valid for 1 month</span>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                
                                                <Button 
                                                    variant="success" 
                                                    size="lg" 
                                                    className="px-5 py-3 fw-semibold"
                                                    onClick={handleActivateTrial}
                                                    disabled={buttonLoading}
                                                    style={{ 
                                                        borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, #198754 0%, #146c43 100%)',
                                                        border: 'none',
                                                        boxShadow: '0 4px 12px rgba(25, 135, 84, 0.4)',
                                                        minWidth: '200px'
                                                    }}
                                                >
                                                    {buttonLoading ? (
                                                        <>
                                                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                            <span className="ms-2">Activating...</span>
                                                        </>
                                                    ) : (
                                                        "Activate Free Trial"
                                                    )}
                                                </Button>
                                            </div>
                                        </Tab.Pane>
                                    )}
                                    
                                    <Tab.Pane active={activeTab === 'purchase'}>
                                        <div className="py-3">
                                            {trialStatus === 'used' && (
                                                <Alert variant="info" className="d-flex align-items-center mb-4 border-0 rounded-3" 
                                                        style={{ backgroundColor: '#e7f3ff' }}>
                                                    <Info size={20} className="me-3 flex-shrink-0" />
                                                    <div>
                                                        <strong>Trial Used:</strong> You've already used your free trial. Purchase additional attempts to continue your exam preparation.
                                                    </div>
                                                </Alert>
                                            )}
                                            
                                            {trialStatus === 'available' && (
                                                <Alert variant="success" className="d-flex align-items-center mb-4 border-0 rounded-3" 
                                                        style={{ backgroundColor: '#e8f5e8' }}>
                                                    <Gift size={20} className="me-3 flex-shrink-0" />
                                                    <div>
                                                        <strong>Bonus Included!</strong> Your purchase will include 2 free trial attempts in addition to the attempts you purchase.
                                                    </div>
                                                </Alert>
                                            )}
                                            
                                            <div className="text-center mb-4">
                                                <h4 className="fw-bold mb-3">Select Number of Attempts</h4>
                                                <p className="text-muted">
                                                    Choose how many exam attempts you want to purchase. 
                                                    Each attempt can be used for any subject.
                                                </p>
                                            </div>
                                            
                                            {/* Enhanced Attempt Selector */}
                                            <div className="d-flex justify-content-center align-items-center mb-5">
                                                <Button 
                                                    variant="outline-secondary" 
                                                    onClick={() => handleAttemptChange(-1)}
                                                    disabled={attempts <= 1}
                                                    className="rounded-circle p-2"
                                                    style={{ width: '48px', height: '48px' }}
                                                >
                                                    <ChevronLeft size={20} />
                                                </Button>
                                                <div className="mx-4 px-5 py-4 border-0 rounded-4 shadow-sm text-center"
                                                    style={{ 
                                                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                                                        border: '2px solid #0d6efd',
                                                        minWidth: '120px'
                                                    }}>
                                                    <h1 className="mb-0 text-primary fw-bold display-4">{attempts}</h1>
                                                    <div className="text-primary fw-semibold">attempts</div>
                                                </div>
                                                <Button 
                                                    variant="outline-secondary" 
                                                    onClick={() => handleAttemptChange(1)}
                                                    disabled={attempts >= 100}
                                                    className="rounded-circle p-2"
                                                    style={{ width: '48px', height: '48px' }}
                                                >
                                                    <ChevronRight size={20} />
                                                </Button>
                                            </div>
                                            
                                            {/* Enhanced Price Summary */}
                                            <div className="rounded-4 p-4 mb-4 shadow-sm" 
                                                style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                                                <h5 className="fw-bold mb-3 text-center">Order Summary</h5>
                                                <div className="d-flex justify-content-between align-items-center mb-2 py-2">
                                                    <span className="fw-medium">Education Level:</span>
                                                    <Badge bg="primary" pill className="fs-6">{educationLevel}</Badge>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mb-2 py-2">
                                                    <span className="fw-medium">Price per attempt:</span>
                                                    <span className="fw-semibold">UGX {pricePerAttempt.toLocaleString()}</span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mb-2 py-2">
                                                    <span className="fw-medium">Number of attempts selected:</span>
                                                    <span className="fw-semibold">{attempts}</span>
                                                </div>
                                                {trialStatus === 'available' && (
                                                    <div className="d-flex justify-content-between align-items-center mb-3 py-2 text-success">
                                                        <span className="fw-medium">Free trial bonus:</span>
                                                        <span className="fw-semibold">+2 attempts</span>
                                                    </div>
                                                )}
                                                <hr className="my-3" />
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="fw-bold fs-5">Total price:</span>
                                                    <span className="fw-bold fs-4 text-primary">UGX {totalPrice.toLocaleString()}</span>
                                                </div>
                                                {trialStatus === 'available' && (
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="fw-bold fs-6">Total attempts:</span>
                                                        <span className="fw-bold fs-5 text-success">{attempts + 2}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="text-center">
                                                <Button 
                                                    variant="primary" 
                                                    size="lg" 
                                                    className="px-5 py-3 fw-semibold"
                                                    onClick={handleCheckout}
                                                    disabled={loading}
                                                    style={{ 
                                                        borderRadius: '12px',
                                                        background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
                                                        border: 'none',
                                                        boxShadow: '0 4px 12px rgba(13, 110, 253, 0.4)',
                                                        minWidth: '200px'
                                                    }}
                                                >
                                                    <CreditCard size={18} className="me-2" />
                                                    Proceed to Checkout
                                                </Button>
                                            </div>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Payment Modal */}
                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    size="lg"
                    centered
                    keyboard
                    autoFocus
                    backdrop="static"
                >
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold">Complete Your Purchase</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-2">
                        <PaymentMethods
                            price={totalPrice}
                            paymentFor={'points'}
                            paymentType={'paper'}
                            hasFullAccess={false}
                            points={trialStatus === 'available' ? attempts + 2 : attempts}
                            educationLevel={educationLevel}
                            onHide={() => setShowModal(false)}
                            activateTrial={trialStatus === 'available'}
                            trialStatus={trialStatus === 'available' ? 'active' : 'inactive'}
                        />
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default SelectAttempts;