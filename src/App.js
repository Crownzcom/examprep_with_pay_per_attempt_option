import React, { Children, useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom'
import useNetworkStatus from './hooks/useNetworkStatus'
import { showToast } from './utilities/toastUtil.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppContent from './components/navbar/AppContent'
import Footer from './components/Footer'
import Login from './components/Login'
import SignUp from './components/Signup'
import ForgetPassword from './components/ForgetPassword'
// import Testing from './components/Testing'
import Home from './components/Home'
import Profile from './components/Profile'
import AllResults from './components/AllResults'
import Exam from './components/Exam'
import UceExam from './components/UceExam.js'
import ExamPage from './components/ExamPage'
import QuizResults from './components/english/QuizResults'
import PasswordReset from './components/PasswordReset'
import StudentDetails from './components/StudentDetails'
import LinkedStudents from './components/LinkedStudents'
import EditProfile from './components/EditProfile'
import Answers from './components/renderAnswer/Answers'
import PaymentResult from './components/subscription/PaymentVerification'
import MTNMomo from './components/subscription/MtnMomo'
import AirtelMoney from './components/subscription/AirtelMoney'
import MobileMoney from './components/subscription/MobileMoney'
import CardPayment from './components/subscription/CardPayment'
import Receipt from './components/subscription/Receipt.js'
import SelectPackage from './components/subscription/SelectPackage'
import RegisteredStudents from './pages/RegisteredStudents'
import Transactions from './pages/Transactions'
import TransactionDetailsPage from './pages/TransactionDetailsPage'
import NotFoundPage from './components/NotFoundPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UceQuizProvider } from './context/uceQuizContext.js'
import { SectionBProvider } from './context/pleSectionBContext.js'

// import './serviceWorkerListener.js';  // Service worker listener script
import './App.css'
import UceAnswers from './components/renderAnswer/uceAnswers.js'
import ViewUceResults from './components/renderAnswer/viewUceResults.js'
import { UcePracticalsProvider } from './context/ucePracticalContext.js'
import ViewUcePracticalResults from './components/renderAnswer/ViewUcePracticalResults.js'
import Landing from './components/landingPage/Landing.js'
import VerifyToken from './components/subscription/VerifyToken.js'
import UserManagement from './components/schoolDashboards/UserManagement.js'
import PaperSetting from './components/schoolDashboards/PaperSetting.js'
import StudentsDashboard from './components/studentsDashboard/StudentsDashboard.js'
import SchoolDashboard from './components/schoolDashboards/SchoolDashboard.js'
import Reports from './components/schoolDashboards/Reports.js'
import DashboardLayout from './components/schoolDashboards/DashboardLayout.js'
import LearningMode from './components/studentsDashboard/LearningMode.js'
import PastPapers from './components/studentsDashboard/PastPapers.js'
import TestingMode from './components/studentsDashboard/TestingMode.js'
import AccountTypeSelection from './components/AccountTypeSelection/AccountTypeSelection.js'
import SchoolAdminSignup from './components/AccountTypeSelection/SchoolAdminSignup.js'
import SchoolStudentLogin from './components/AccountTypeSelection/SchoolStudentLogin.js'
import SchoolAdminLogin from './components/AccountTypeSelection/SchoolAdminLogin.js'
import SchoolAccountCreation from './components/AccountTypeSelection/SchoolAccountCreation.js'

//================================Added by Francis===============================================================
import PaymentOptions from './components/subscription/PaymentOptions.js'
import SelectAttempts from './components/subscription/SelectAttempts.js'

// function PrivateRoute({ children }) {
//   const { userInfo, sessionInfo } = useAuth()
//   // console.log('APP.JS session info: ', sessionInfo);
//   if (!sessionInfo) {
//     // return <Navigate to="/sign-in" />
//     return <Navigate to="/account-type" />
//   }
//   return children
// }

const PrivateRoute = ({
  children,
  allowedTypes = ['individual', 'school'],
}) => {
  const { userInfo, sessionInfo, schoolUser, accountType } = useAuth()
  const isAuthenticated =
    (sessionInfo && accountType === 'individual') ||
    (schoolUser && accountType === 'school') ||
    (schoolUser && accountType === 'student')

  if (!isAuthenticated || !allowedTypes.includes(accountType)) {
    return <Navigate to="/account-type" />
  }

  return children
}

function ExamWithSubject(props) {
  let { subject } = useParams()
  return <Exam subject={subject} {...props} />
}

function UceExamWithSubject(props) {
  let { subject } = useParams()
  return <UceExam subject={subject} {...props} />
}

function App() {
  const isOnline = useNetworkStatus()
  const initialLoad = useRef(true)

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false
      return
    }

    if (!isOnline) {
      showToast('You are offline. Check your internet connection.', 'warning')
    } else {
      showToast('You are back online.', 'success')
    }
  }, [isOnline])

  useEffect(() => {
    const triggerSync = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready
          await registration.sync.register('SYNC_EXAM_ANSWERS') // Register the sync event
        } catch (error) {
          console.error('Error registering sync event:', error)
        }
      }
    }
    triggerSync()
  }, [])

  return (
    <Router>
      <AuthProvider>
        <UceQuizProvider>
          <SectionBProvider>
            <UcePracticalsProvider>
              <div className="App">
                <AppContent />
                <div>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <Home />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/landing-page"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <Landing />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/all-results"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <AllResults />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/exam/:subject"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <ExamWithSubject />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/uce-exam/:subject"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <UceExamWithSubject />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/exam-page"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <ExamPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/edit-profile"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <EditProfile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/exam-results"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <QuizResults />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/student-details"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <StudentDetails />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/linked-students"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <LinkedStudents />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/answers"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <Answers />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/uce-answers"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <UceAnswers />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/view-results"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <ViewUceResults />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/practical-results"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <ViewUcePracticalResults />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/select-package"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <SelectPackage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/payment-options"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>
                          <PaymentOptions />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/select-attempts"
                      element={
                        <PrivateRoute allowedTypes={['individual']}>                          
                            <SelectAttempts />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/payment/mtn-momo"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <MTNMomo />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/payment/airtel-money"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <AirtelMoney />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/payment/mobile-money"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <MobileMoney />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/payment/card-payment"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <CardPayment />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/payment/verification"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <PaymentResult />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/payment/receipt"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <Receipt />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/registered-students"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <RegisteredStudents />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/transactions"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <Transactions />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/verify-token"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <VerifyToken />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/school-dashboard"
                      element={
                        <PrivateRoute allowedTypes={['school']}>
                          <DashboardLayout />
                        </PrivateRoute>
                      }
                    >
                      <Route index element={<SchoolDashboard />} />
                      <Route path="users" element={<UserManagement />} />
                      <Route path="papers" element={<PaperSetting />} />
                      <Route path="reports" element={<Reports />} />
                    </Route>
                    <Route
                      path="/student-dashboard"
                      element={
                        <PrivateRoute allowedTypes={['school', 'student']}>
                          <DashboardLayout />
                        </PrivateRoute>
                      }
                    >
                      <Route index element={<StudentsDashboard />} />
                      <Route path="learning" element={<LearningMode />} />
                      <Route path="tests" element={<TestingMode />} />
                      <Route path="past-papers" element={<PastPapers />} />
                    </Route>
                    <Route
                      path="/transaction-details"
                      element={
                        <PrivateRoute allowedTypes={['individual', 'school']}>
                          <TransactionDetailsPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="account-type"
                      element={<AccountTypeSelection />}
                    />
                    <Route path="/sign-in" element={<Login />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route
                      path="/school-login"
                      element={<SchoolStudentLogin />}
                    />
                    <Route
                      path="/administrator-login"
                      element={<SchoolAdminLogin />}
                    />
                    <Route
                      path="/administrator-signup"
                      element={<SchoolAdminSignup />}
                    />
                    <Route
                      path="/create-school-profile"
                      element={
                        <PrivateRoute allowedTypes={['school']}>
                          <SchoolAccountCreation />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/forget-password"
                      element={<ForgetPassword />}
                    />
                    <Route path="/password-reset" element={<PasswordReset />} />
                    <Route path="*" element={<NotFoundPage />} />
                    {/* <Route path="/testing" element={<Testing />} /> */}
                  </Routes>
                </div>
              </div>
            </UcePracticalsProvider>
            <ToastContainer position="top-center" />
          </SectionBProvider>
        </UceQuizProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
