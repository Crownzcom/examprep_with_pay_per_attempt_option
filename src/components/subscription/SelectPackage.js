import React from 'react';
import { useLocation } from 'react-router-dom';
import Packages from './Packages';
import { useAuth } from "../../context/AuthContext";

function SelectPackage() {
  const { userInfo } = useAuth();
  const location = useLocation();
  
  // Get payment type and access level from navigation state
  const paymentType = location.state?.paymentType || 'package';
  const hasFullAccess = location.state?.hasFullAccess !== false;

  // Check if we're in admin mode or if there's student info passed from location
  const isAdmin = userInfo?.labels?.includes("admin");
  const passedStudentInfo = location.state?.studentInfo;

  // Use passed student info or current user info
  const studentInfo = passedStudentInfo || {
    userId: userInfo?.userId || '',
    firstName: userInfo?.firstName || '',
    lastName: userInfo?.lastName || '',
    email: userInfo?.email || '',
    educationLevel: userInfo?.educationLevel || 'PLE'
  };

  console.log("Payment type:", paymentType);
  console.log("Has full access:", hasFullAccess);
  console.log("Student info in SelectPackage:", studentInfo);

  return (
    <>
      <Packages 
        studentInfo={studentInfo} 
        educationLevel={studentInfo.educationLevel}
        paymentType={paymentType}
        hasFullAccess={hasFullAccess}
      />
    </>
  );
}

export default SelectPackage;
