import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faWarning } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { printPDF } from './print/index';
import axios from 'axios';
import {
  databases,
  database_id,
  transactionTable_id,
  pointsTable_id,
  paper_subjectsTable_id,
  Query,
} from '../../appwriteConfig.js';
import { updatePointsTable, couponTrackerUpdate, validateArrayInput } from '../../utilities/otherUtils';
import { updateStudentDataInLocalStorage } from '../../utilities/fetchStudentData';
import './PaymentResult.css';
import moment from 'moment';
import { serverUrl } from '../../config.js';

import { parseSelectedSubjects } from '../../utilities/otherUtils';

const PaymentResult = () => {
  // Utility functions
  const parseTransactionIdFromResp = (resp) => {
    if (!resp) return null;
    try {
      const decodedResp = JSON.parse(decodeURIComponent(resp));
      return decodedResp?.data?.id || null;
    } catch (error) {
      console.error('Error parsing resp:', error);
      return null;
    }
  };

  const parseMessageFromResp = (resp) => {
    if (!resp) return null;
    try {
      const decodedResp = JSON.parse(decodeURIComponent(resp));
      return decodedResp?.message || null;
    } catch (error) {
      console.error('Error parsing resp:', error);
      return null;
    }
  };

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [transactionData, setTransactionData] = useState({});
  const [paymentStatus, setPaymentStatus] = useState('Verifying...');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localVerificationComplete, setLocalVerificationComplete] = useState(false);

  //const { userInfo, fetchUserPoints } = useAuth();
  const { userInfo, fetchUserPoints, fetchPaymentInfo } = useAuth();
  const isStudent = userInfo?.labels?.includes('student') || false;
  const isNextOfKin = userInfo?.labels?.includes('kin') || false;

  const transactionId = queryParams.get('transaction_id') || parseTransactionIdFromResp(queryParams.get('resp'));
  const statusForPayment = queryParams.get('status');
  const tx_ref = queryParams.get('tx_ref');
  const statusMessage = parseMessageFromResp(queryParams.get('resp'));

  // Fetch subject names and prices
  const fetchSubjectDetails = async (selectedSubjects, educationLevel) => {
    try {
      const parsedSubjects = typeof selectedSubjects === 'string' ? JSON.parse(selectedSubjects) : selectedSubjects || {};
      const subjectIds = Object.keys(parsedSubjects);
      if (subjectIds.length === 0) return {};
      const response = await databases.listDocuments(database_id, paper_subjectsTable_id, [
        Query.equal('$id', subjectIds),
        Query.equal('level', educationLevel),
      ]);
      return response.documents.reduce((acc, doc) => {
        acc[doc.$id] = { name: doc.subjectName, attempts: parsedSubjects[doc.$id].attempts, price: doc.price };
        return acc;
      }, {});
    } catch (err) {
      console.error('Error fetching subject details:', err);
      return {};
    }
  };

  // Function to check if transaction exists in database
  const checkTransactionExists = async (txId) => {
    try {
      const existingTransaction = await databases.listDocuments(database_id, transactionTable_id, [
        Query.equal('transactionId', [`${txId}`]),
      ]);
      
      return existingTransaction.documents.length > 0 ? existingTransaction.documents[0] : null;
    } catch (error) {
      console.error('Error checking transaction:', error);
      return null;
    }
  };

  // New function to create receipt data
  const createReceiptData = async (transaction) => {
    try {
      // Parse the selectedSubjects
      let selectedSubjectsObj = {};
      
      if (transaction.selectedSubjects && transaction.selectedSubjects.length > 0) {
        // Handle the array of JSON strings format
        transaction.selectedSubjects.forEach(subjectStr => {
          try {
            const parsed = JSON.parse(subjectStr);
            selectedSubjectsObj[parsed.id] = { attempts: parsed.attempts };
          } catch (e) {
            console.error('Error parsing subject string:', e);
          }
        });
      }
      
      const educationLevel = transaction.meta?.educationLevel || userInfo?.educationLevel || 'PLE';
      const subjectDetails = await fetchSubjectDetails(selectedSubjectsObj, educationLevel);
      
      // Create receipt data
      return {
        tx_ref: transaction.transactionReference,
        id: transaction.transactionId,
        charged_amount: transaction.transactionAmount,
        currency: transaction.currency,
        payment_type: transaction.paymentMethod,
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.email,
        phone: userInfo.phone || 'N/A',
        created_at: new Date(transaction.transactionDate).toISOString(),
        card: {},
        description: transaction.description,
        paymentFor: transaction.paymentFor,
        points: transaction.points,
        duration: transaction.meta?.duration || 366,
        addressSender: {
          person: 'Crownzcom LTD',
          building: '101, Block C, Swan Residency',
          street: 'Heritage Road, Kireka',
          city: 'Kampala, Uganda',
          email: 'crownzom@gmail.com',
          phone: '+256-702-838167',
        },
        address: {
          company: '',
          person: `${userInfo.firstName} ${userInfo.lastName}`,
          street: '',
          city: '',
        },
        personalInfo: {
          website: '',
          bank: {
            person: 'Crownzcom LTD',
            name: 'Flutterwave Inc.',
            paymentMethod: transaction.paymentMethod,
            cardOrPhoneNumber: userInfo.phone || 'N/A',
            IBAN: 'UG1234***9ABC36',
          },
          taxoffice: {
            name: '',
            number: '',
          },
        },
        label: {
          invoicenumber: 'Transaction Number',
          invoice: 'Receipt',
          tableItems: 'Item',
          tableDescription: 'Description',
          tableQty: 'Qty',
          tableSinglePrice: 'Unit Price',
          tableSingleTotal: 'Total Price',
          totalGrand: 'Grand Total',
          contact: 'Contact Information',
          bank: 'Payment Gateway Information',
          taxinfo: 'TAX Information',
        },
        invoice: {
          number: transaction.transactionId,
          date: new Date(transaction.transactionDate).toISOString(),
          subject: 'Exam Prep Tutor Payment Transaction',
          total: `${transaction.currency}. ${transaction.transactionAmount}`,
          text: 'Payment rendered in May 2025.',
        },
        items: Object.entries(subjectDetails).map(([subjectId, subjectData]) => ({
          title: `Paper: ${subjectData.name || 'Unknown Subject'}`,
          description: `Attempts: ${subjectData.attempts}`,
          amount: `${transaction.currency}. ${subjectData.price}`,
          qty: `${subjectData.attempts}`,
          total: `${transaction.currency}. ${subjectData.attempts * subjectData.price}`,
        })),
      };
    } catch (error) {
      console.error('Error creating receipt data:', error);
      return null;
    }
  };

  useEffect(() => {
    const verifyPayment = async () => {
      setMessage(statusMessage);
      setPaymentStatus(statusForPayment);

      if (statusForPayment === 'cancelled') {
        setMessage('Transaction cancelled');
        setPaymentStatus('Transaction is canceled.');
        setLoading(false);
        return;
      }

      if (!transactionId) {
        setMessage(statusMessage || 'No transaction ID provided.');
        setPaymentStatus('Transaction Failed.');
        setLoading(false);
        return;
      }

      // Check database first
      const existingTransaction = await checkTransactionExists(transactionId);
      if (existingTransaction) {
        console.log('Transaction already exists in database:', existingTransaction);
        setPaymentStatus(existingTransaction.paymentSatus);
        if (existingTransaction.paymentSatus === 'success') {
          const receiptData = await createReceiptData(existingTransaction);
          if (receiptData) {
            setTransactionData(receiptData);
            setMessage('Payment verified from database');
          }
        } else {
          setMessage('Transaction found but payment was not successful');
        }
        setLocalVerificationComplete(true);
        setLoading(false);
        return; // Exit immediately
      }

      // Proceed with server verification only if not found in database
      const maxRetries = 5;
      const baseDelay = 1000;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Verification attempt ${attempt} for transaction ${transactionId}`);
          const response = await axios.get(`${serverUrl}/flutterwave/verify-payment/${transactionId}`);
          if (response.status === 200) {
            const data = response.data;
            console.log('Verification Response:', data);
            if (data.status === 'success') {
              const saveTransaction = await saveTransactionData(data.transactionData);
              setPaymentStatus(data.status);
              if (data.transactionData.meta.couponCode) {
                await couponTrackerUpdate({
                  userId: isNextOfKin ? data.transactionData.meta.studentId : userInfo.userId,
                  couponCode: data.transactionData.meta.couponCode,
                });
              }
              const selectedSubjects = typeof data.transactionData.meta.selectedSubjects === 'string'
                ? JSON.parse(data.transactionData.meta.selectedSubjects)
                : data.transactionData.meta.selectedSubjects || {};
              const educationLevel = data.transactionData.meta.educationLevel || userInfo?.educationLevel || 'PLE';
              const subjectDetails = await fetchSubjectDetails(selectedSubjects, educationLevel);
              const receiptData = {
                  tx_ref: data.transactionData.tx_ref,
                  id: data.transactionData.id,
                  charged_amount: data.transactionData.amount,
                  currency: data.transactionData.currency,
                  payment_type: data.transactionData.payment_type,
                  name: data.transactionData.customer.name,
                  email: data.transactionData.customer.email,
                  phone: data.transactionData.customer.phone_number,
                  created_at: data.transactionData.customer.created_at,
                  card: data.transactionData.card || {},
                  description: data.transactionData.meta.description,
                  paymentFor: data.transactionData.meta.service,
                  points: data.transactionData.meta.points,
                  duration: data.transactionData.meta.duration,
                  addressSender: {
                    person: 'Crownzcom LTD',
                    building: '101, Block C, Swan Residency',
                    street: 'Heritage Road, Kireka',
                    city: 'Kampala, Uganda',
                    email: 'crownzom@gmail.com',
                    phone: '+256-702-838167',
                  },
                  address: {
                    company: '',
                    person: `${userInfo.firstName} ${userInfo.lastName}`,
                    street: '',
                    city: '',
                  },
                  personalInfo: {
                    website: '',
                    bank: {
                      person: 'Crownzcom LTD',
                      name: 'Flutterwave Inc.',
                      paymentMethod: `${data.transactionData.payment_type}`,
                      cardOrPhoneNumber: `${
                        data.transactionData.payment_type === 'card'
                          ? '****' + (data.transactionData.card?.last_4digits || '')
                          : data.transactionData.customer.phone_number
                      }`,
                      IBAN: `UG1234***9ABC36`,
                    },
                    taxoffice: {
                      name: '',
                      number: '',
                    },
                  },
                  label: {
                    invoicenumber: `Transaction Number`,
                    invoice: `Receipt`,
                    tableItems: 'Item',
                    tableDescription: 'Description',
                    tableQty: 'Qty',
                    tableSinglePrice: 'Unit Price',
                    tableSingleTotal: 'Total Price',
                    totalGrand: 'Grand Total',
                    contact: 'Contact Information',
                    bank: 'Payment Gateway Information',
                    taxinfo: 'TAX Information',
                  },
                  invoice: {
                    number: `${data.transactionData.id}`,
                    date: `${data.transactionData.customer.created_at}`,
                    subject: 'Exam Prep Tutor Payment Transaction',
                    total: `${data.transactionData.currency}. ${data.transactionData.amount}`,
                    text: 'Payment rendered in May 2025.',
                  },
                  items: Object.entries(subjectDetails).map(([subjectId, subjectData]) => ({
                    title: `Paper: ${subjectData.name || 'Unknown Subject'}`,
                    description: `Attempts: ${subjectData.attempts}`,
                    amount: `${data.transactionData.currency}. ${subjectData.price}`,
                    qty: `${subjectData.attempts}`,
                    total: `${data.transactionData.currency}. ${subjectData.attempts * subjectData.price}`,
                  })),
        };
              setTransactionData(receiptData);
              setLoading(false);
              return;
            } else {
              throw new Error(`Verification returned status: ${data.status}`);
            }
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (error) {
          console.error(`Attempt ${attempt} failed:`, error.message || error);
          if (attempt === maxRetries) {
            const finalCheck = await checkTransactionExists(transactionId);
            if (finalCheck) {
              console.log('Transaction found on final check:', finalCheck);
              setPaymentStatus(finalCheck.paymentSatus);
              if (finalCheck.paymentSatus === 'success') {
                const receiptData = await createReceiptData(finalCheck);
                if (receiptData) {
                  setTransactionData(receiptData);
                  setMessage('Payment verified from database after API failure');
                }
              } else {
                setMessage('Transaction found but payment was not successful');
              }
              setLoading(false);
              return;
            }
            setMessage(statusMessage || `Failed to verify payment after multiple attempts. Please check your payment status in your account dashboard or contact support.`);
            setPaymentStatus('Verification failed.');
            setLoading(false);
          } else {
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
    };

    verifyPayment();
  }, [transactionId, statusForPayment, tx_ref, statusMessage, userInfo, fetchUserPoints, isNextOfKin]);
  
  const saveTransactionData = async (data) => {
    try {
      const existingTransaction = await databases.listDocuments(database_id, transactionTable_id, [
        Query.equal('transactionId', [`${data.id}`]),
      ]);

      if (existingTransaction.documents.length > 0) {
        return existingTransaction.documents[0];
      }

      // Determine payment type
      const paymentType = data.meta.service === 'package' ? 'package' : 'paper';
      
      // Parse selectedSubjects - these are from paper_subjectsTable_id
      let selectedSubjectsObj = {};
      if (typeof data.meta.selectedSubjects === 'string') {
        try {
          selectedSubjectsObj = JSON.parse(data.meta.selectedSubjects);
        } catch (error) {
          console.error('Error parsing selectedSubjects:', error);
          selectedSubjectsObj = {};
        }
      } else {
        selectedSubjectsObj = data.meta.selectedSubjects || {};
      }

      // Convert to array format for storage
      const selectedSubjectsArray = Object.entries(selectedSubjectsObj).map(([key, value]) => {
        return JSON.stringify({ id: key, attempts: value.attempts || value });
      });

      // Process validation and status
      const validatedPaperTypes = validateArrayInput(data.meta.paperTypes, 'paperTypes');
      const validatedPackageTypes = validateArrayInput(data.meta.packageTypes, 'packageTypes');
      const validatedClassLevels = validateArrayInput(data.meta.classLevels, 'classLevels');
      
      let paymentStatusValue;
      switch (data.status.toLowerCase()) {
        case 'success':
        case 'successful':
          paymentStatusValue = 'success';
          break;
        default:
          paymentStatusValue = 'failed';
      }

      // Save transaction
      const documentData = {
        userID: userInfo.userId,
        transactionDate: new Date(data.created_at),
        transactionAmount: data.amount,
        currency: data.currency,
        paymentMethod: data.payment_type,
        paymentGateway: 'Flutterwave Gateway',
        paymentSatus: paymentStatusValue,
        transactionReference: data.tx_ref,
        transactionId: `${data.id}`,
        paymentFor: paymentType === 'package' ? 'package' : 'paper',
        paymentType: paymentType,
        hasFullAccess: paymentType === 'package',
        description: data.meta.description,
        points: parseInt(data.meta.points, 10),
        selectedSubjects: selectedSubjectsArray,
        paperTypes: validatedPaperTypes,
        packageTypes: validatedPackageTypes,
        classLevels: validatedClassLevels,
        idempotencyKey: `tx-${data.id}-${Date.now()}`
      };

      const newDocument = await databases.createDocument(database_id, transactionTable_id, 'unique()', documentData);

      if (paymentStatusValue === 'success') {
        // Check if trial activation is needed
        const activateTrial = data.meta.activateTrial === true || data.meta.trialStatus === 'active';
        
        // Update points table with purchased points
        await updatePointsTable({
          created_at: new Date(data.created_at),
          paymentFor: paymentType === 'package' ? 'package' : 'paper',
          paymentType: paymentType,
          hasFullAccess: paymentType === 'package',
          transactionID: data.tx_ref,
          userId: isStudent ? userInfo.userId : data.meta.studentId,
          points: data.meta.points,
          duration: data.meta.duration,
          educationLevel: isStudent ? userInfo.educationLevel : data.meta.educationLevel || 'PLE',
          message: `Payment via Flutterwave Gateway`,
          // Only include trialStatus if we're activating the trial
          // Otherwise, don't include it so it doesn't override existing value
          ...(activateTrial ? { trialStatus: 'active' } : {})
        });

        // Update payment info in AuthContext to refresh the UI
        if (isStudent && fetchPaymentInfo) {
          await fetchPaymentInfo(userInfo.userId);
        }

        // Update points balance
        if (isStudent) {
          await fetchUserPoints(userInfo.userId, userInfo.educationLevel || 'PLE');
        } else if (data.meta.studentId) {
          const response = await databases.listDocuments(database_id, pointsTable_id, [
            Query.equal('UserID', data.meta.studentId),
          ]);
          if (response.documents.length > 0) {
            const newPointsBalance = response.documents[0].PointsBalance;
            await updateStudentDataInLocalStorage(data.meta.studentId, { 
              pointsBalance: newPointsBalance,
              // Only update trialStatus if we're activating the trial
              ...(activateTrial ? { trialStatus: 'active' } : {})
            });
          }
        }
      }

      return newDocument;
    } catch (error) {
      console.error('Error saving transaction data:', error);
      setMessage(`Failed to save transaction: ${error.message}. Please contact support.`);
      throw error;
    }
  };
  
  const exitPage = () => {
    navigate('/');
  };

  // If we've verified locally from the database but server verification might fail
  useEffect(() => {
    if (localVerificationComplete && loading) {
      // We found transaction in database but are still waiting on API
      // Wait for a few seconds then give up on API and just use local data
      const timeout = setTimeout(() => {
        if (loading) {
          console.log('Using local verification results as API verification is taking too long');
          setLoading(false);
        }
      }, 8000); // 8 seconds timeout
      
      return () => clearTimeout(timeout);
    }
  }, [localVerificationComplete, loading]);

  // Add this useEffect to expose the refresh function
  useEffect(() => {
    // Make refreshPaymentInfo available globally
    if (isStudent && userInfo) {
      window.refreshPaymentInfo = async () => {
        try {
          await fetchPaymentInfo(userInfo.userId);
          console.log("Payment info refreshed after payment");
        } catch (error) {
          console.error('Error refreshing payment info:', error);
        }
      };
      
      // Clean up
      return () => {
        delete window.refreshPaymentInfo;
      };
    }
  }, [isStudent, userInfo, fetchPaymentInfo]);


  return (
    <Container className="mt-4" style={{ background: 'linear-gradient(135deg, hsl(236, 72%, 79%), hsl(237, 63%, 64%))' }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="payment-card-header">
              <Card.Title className="text-center mb-4">Exam Prep Tutor Online Payment</Card.Title>
              <Card.Text className="text-center">Transaction Verification Status.</Card.Text>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <Spinner animation="grow" variant="primary" className="sr-only" />
                  <Spinner animation="grow" variant="secondary" className="sr-only" />
                  <Spinner animation="grow" variant="success" className="sr-only" />
                  <p>Verifying payment status...</p>
                  <p className="text-muted small">This may take a few moments</p>
                </div>
              ) : (
                <>
                  {paymentStatus === 'success' ? (
                    <div className="text-center mt-4">
                      <Alert variant="success">
                        <FontAwesomeIcon icon={faCheckCircle} size="3x" className="text-success" />
                        <p className="mt-2">
                          <b>Payment Successful!</b>
                        </p>
                        <p className="mt-2">
                          <b>Service:</b> Payment for exams
                        </p>
                        <p className="mt-2">
                          <b>Price:</b> {transactionData.currency + '. ' + transactionData.charged_amount}
                        </p>
                      </Alert>
                      <Button variant="dark" onClick={() => printPDF(transactionData)}>
                        Print Receipt as PDF
                      </Button>
                    </div>
                  ) : statusForPayment === 'cancelled' ? (
                    <div className="text-center mt-4">
                      <Alert variant="warning">
                        <FontAwesomeIcon icon={faWarning} size="3x" className="text-danger" />
                        <p className="mt-2">
                          <b>Transaction cancelled!</b>
                        </p>
                      </Alert>
                      <Button variant="dark" onClick={() => exitPage()}>
                        Exit
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center mt-4">
                      <Alert variant="danger">
                        <FontAwesomeIcon icon={faTimesCircle} size="3x" className="text-danger" />
                        <p className="mt-2">
                          <b>{message}</b>
                        </p>
                        <p className="mt-2">{paymentStatus}</p>
                      </Alert>
                      <Button variant="dark" onClick={() => exitPage()}>
                        Exit
                      </Button>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
            <Card.Footer>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                disabled={paymentStatus === 'success' ? false : true}
                hidden={paymentStatus === 'success' ? false : true}
                className="w-100 mt-3 payment-submit-btn"
              >
                Back To Dashboard
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentResult;