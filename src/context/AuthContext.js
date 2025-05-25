import React, { createContext, useState, useContext } from 'react'
import moment from 'moment'
import {
  account,
  databases,
  database_id,
  studentTable_id,
  pointsTable_id,
  paper_subjectsTable_id,
  subjectsTable_id,
  Query,
} from '../appwriteConfig.js'
import { serverUrl } from '../config.js'
import db from '../db.js'
import storageUtil from '../utilities/storageUtil.js'
import { studentSubjectsData } from '../utilities/fetchStudentData'

const AuthContext = createContext(null)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [sessionInfo, setSessionInfo] = useState(
    storageUtil.getItem('sessionInfo')
  )
  const [userInfo, setUserInfo] = useState(storageUtil.getItem('userInfo'))
  const [userPoints, setUserPoints] = useState(
    storageUtil.getItem('userPoints') || 0
  )
  const [userSubjectData, setUserSubjectData] = useState(
    storageUtil.getItem('userSubjectData') || []
  )
  // New state for tracking payment type and paid subjects
  const [paymentInfo, setPaymentInfo] = useState(
    storageUtil.getItem('paymentInfo') || { 
      type: null, // 'package' or 'paper'
      hasFullAccess: false,
      paidSubjects: [],
      lastPaymentDate: null
    }
  )
  // New state for subject mapping between tables
  const [subjectMapping, setSubjectMapping] = useState(
    storageUtil.getItem('subjectMapping') || {}
  )

  //school project states
  const [schoolUser, setSchoolUser] = useState(
    storageUtil.getItem('school_user')
  )
  const [accountType, setAccountType] = useState(
    storageUtil.getItem('accountType')
  )

  //LOGOUT FUNCTION
  const handleLogout = async () => {
    if (sessionInfo && sessionInfo.$id && accountType === 'individual') {
      try {
        await account.deleteSession(sessionInfo.$id) //Clears the session on Client's and Appwrite's side
      } catch (error) {
        console.error('Logout failed', error)
      }
    } else {
      console.error('No session to logout')
  }

    // Clear userPoints from context and storage
    setUserPoints('')
    setPaymentInfo({ type: null, hasFullAccess: false, paidSubjects: [], lastPaymentDate: null })
    setSubjectMapping({})
    storageUtil.removeItem('userPoints')
    storageUtil.removeItem('paymentInfo')
    storageUtil.removeItem('subjectMapping')
    setSessionInfo(null)
    setUserInfo(null)
    setUserSubjectData([])
    setSchoolUser(null)
    setAccountType(null)
    storageUtil.clear() // Clears all storageUtil items
    sessionStorage.clear()

    // Clear IndexedDB
    try {
      await db.delete() // Clears all data from the Dexie database
      // console.log("IndexedDB cleared successfully");
    } catch (error) {
      console.error('Error clearing IndexedDB:', error)
    }

    // Clear rest of stored data
    setSessionInfo(null)
    setUserInfo(null)
    storageUtil.clear()

    // Clear session storage
    sessionStorage.clear()
  }

  //LOGIN FUNCTION
  const handleLogin = async (sessionData, userData) => {
    const sessionDetails = {
      $id: sessionData.$id,
      userId: sessionData.userId,
      expire: sessionData.expire,
      authMethod: sessionData.provider,
    }
    setSessionInfo(sessionDetails)
    setAccountType('individual')
    storageUtil.setItem('sessionInfo', sessionDetails)
    storageUtil.setItem('accountType', 'individual')
    storageUtil.removeItem('school_user')

    // console.log('userData: ', userData);

    const userDetails = {
      userId: sessionData.userId,
      userDocId: userData.userDocId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      otherName: userData.otherName,
      phone: userData.phone,
      email: userData.email,
      gender: userData.gender,
      schoolName: userData.schoolName,
      schoolAddress: userData.schoolAddress,
      educationLevel: userData.educationLevel,
      subjects: userData.subjects,
      labels: userData.labels,
      kinID: userData.kinID,
      kinFirstName: userData.kinFirstName,
      kinLastName: userData.kinLastName,
      kinEmail: userData.kinEmail,
      kinPhone: userData.kinPhone,
    }

    setUserInfo(userDetails)
    storageUtil.setItem('userInfo', userDetails)

    if (userDetails.labels.includes('student')) {
      //Setting up subjects data
      await updateUserSubjectData(
        userDetails.subjects,
        userDetails.educationLevel
      )
      
      // Fetch payment info and subject mapping
      await fetchPaymentInfo(sessionData.userId)
      await fetchSubjectMapping(userDetails.educationLevel)
    }
  }

  //Login for school accounts (admin)
  const loginSchool = (schoolUserData) => {
    setSchoolUser(schoolUserData)
    setAccountType('school')
    setSessionInfo(null)
    setUserInfo(null)
    setUserPoints(0)
    setUserSubjectData([])
    setPaymentInfo({ type: null, hasFullAccess: false, paidSubjects: [], lastPaymentDate: null })
    setSubjectMapping({})
    storageUtil.setItem('school_user', schoolUserData)
    storageUtil.setItem('accountType', 'school')
    storageUtil.removeItem('sessionInfo')
    storageUtil.removeItem('userInfo')
    storageUtil.removeItem('userPoints')
    storageUtil.removeItem('userSubjectData')
    storageUtil.removeItem('paymentInfo')
    storageUtil.removeItem('subjectMapping')
  }

  //login for students accounts
  const loginSchoolStudent = (schoolStudentData, sessionData) => {
    const studentDetails = {
      userID: schoolStudentData.userID,
      schoolID: schoolStudentData.schoolID,
      firstName: schoolStudentData.firstName,
      lastName: schoolStudentData.lastName,
      authUserID: schoolStudentData.authUserID,
      createdAt: schoolStudentData.createdAt,
      studClass: schoolStudentData.studClass,
      stream: schoolStudentData.stream,
    }

    const sessionDetails = {
      $id: sessionData.$id,
      userId: sessionData.userId,
      expire: sessionData.expire,
      authMethod: sessionData.provider,
    }

    setSchoolUser(studentDetails)
    setAccountType('student')
    setSessionInfo(sessionDetails)
    setUserInfo(null)
    setUserPoints(0)
    setUserSubjectData([])
    setPaymentInfo({ type: null, hasFullAccess: false, paidSubjects: [], lastPaymentDate: null })
    setSubjectMapping({})
    storageUtil.setItem('school_user', studentDetails)
    storageUtil.setItem('accountType', 'student')
    storageUtil.setItem('sessionInfo', sessionDetails)
    storageUtil.removeItem('userInfo')
    storageUtil.removeItem('userPoints')
    storageUtil.removeItem('userSubjectData')
    storageUtil.removeItem('paymentInfo')
    storageUtil.removeItem('subjectMapping')
  }

  // Update userPoints in local storage and database
  const updateUserPoints = async (PointsToDeduct, userId) => {
    // Update points in the database and then in the context and storage
    await saveUserPointsToDatabase(PointsToDeduct, userId)
  }

  // Fetch userPoints function (example)
  const fetchUserPoints = async (userId, educationLevel) => {
    try {
      // console.log('Fetching userPoints: ', userId + ' ' + educationLevel);
      let pointsData
      const pointsResponse = await databases.listDocuments(
        database_id,
        pointsTable_id,
        [Query.equal('UserID', userId)]
      )
      //Create a new document if user has no document assigned
      if (pointsResponse.documents.length !== 0) {
        pointsData = pointsResponse.documents[0].PointsBalance
      } else {
        console.log(
          'No user document assigned, creating a new one for the user'
        )

        var currentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a')

        // console.log('CURRENT DATE: ' + currentDateTime)

        let docId = `PT-${userId}`
        // console.log('Unique ID: ', docId)

        const userDocResponse = await databases.createDocument(
          database_id,
          pointsTable_id,
          'unique()',
          {
            UserID: JSON.stringify(userId) || null,
            PurchasedTier: educationLevel,
            AcquisitionDate: currentDateTime,
            ExpiryDate: currentDateTime,
          }
        )
        pointsData = 0
      }

      setUserPoints(pointsData)
      storageUtil.setItem('userPoints', pointsData)
      // console.log('Fetched points: ', pointsData)
    } catch (error) {
      console.error('Error fetching user points:', error)
    }
  }

  // Save userPoints function (example)
  const saveUserPointsToDatabase = async (points, userId) => {
    try {
      let updatedPoints;
      const response = await databases.listDocuments(
        database_id,
        pointsTable_id,
        [Query.equal('UserID', userId)]
      );
      
      if (response.documents.length > 0) {
        const documentId = response.documents[0].$id;
        let currentPoints = response.documents[0].PointsBalance;
        updatedPoints = currentPoints - points;
        
        if (updatedPoints >= 0) {
          const updateResponse = await databases.updateDocument(
            database_id,
            pointsTable_id,
            documentId,
            { PointsBalance: updatedPoints }
          );

          // Update points in context and localStorage
          setUserPoints(updatedPoints);
          storageUtil.setItem('userPoints', updatedPoints);
          
          // Log point usage
          console.log(`Used ${points} point(s). Remaining: ${updatedPoints}`);
        }
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  };

  const fetchPaymentInfo = async (userId) => {
    try {
      const pointsResponse = await databases.listDocuments(
        database_id,
        pointsTable_id,
        [Query.equal('UserID', userId)]
      );
      
      if (pointsResponse.documents.length > 0) {
        const pointsDoc = pointsResponse.documents[0];
        
        // Determine payment type and access level
        const hasPackage = pointsDoc.paymentType === 'package' || 
                          pointsDoc.hasFullAccess === true;
        
        // Extract paid subjects with their attempts from selectedSubjects array
        let paidSubjectsWithAttempts = {};
        if (!hasPackage && pointsDoc.selectedSubjects && Array.isArray(pointsDoc.selectedSubjects)) {
          pointsDoc.selectedSubjects.forEach(subjectStr => {
            try {
              const subjectData = typeof subjectStr === 'string' ? JSON.parse(subjectStr) : subjectStr;
              if (subjectData.id && subjectData.attempts > 0) {
                // If subject already exists, add the attempts
                if (paidSubjectsWithAttempts[subjectData.id]) {
                  paidSubjectsWithAttempts[subjectData.id] += subjectData.attempts;
                } else {
                  paidSubjectsWithAttempts[subjectData.id] = subjectData.attempts;
                }
              }
            } catch (e) {
              console.error('Error parsing subject data:', e);
            }
          });
        }
        
        // Get list of subject IDs
        const paidSubjects = Object.keys(paidSubjectsWithAttempts);
        
        // Add explicit paidSubjects if they exist
        if (pointsDoc.paidSubjects && Array.isArray(pointsDoc.paidSubjects)) {
          pointsDoc.paidSubjects.forEach(subjectId => {
            if (!paidSubjectsWithAttempts[subjectId]) {
              paidSubjectsWithAttempts[subjectId] = 1; // Default to 1 attempt if not specified
            }
          });
        }
        
        const paymentData = {
          type: hasPackage ? 'package' : 'paper',
          hasFullAccess: hasPackage,
          paidSubjects: paidSubjects,
          paidSubjectsWithAttempts: paidSubjectsWithAttempts,
          lastPaymentDate: pointsDoc.AcquisitionDate || null,
          lastUpdated: new Date().toISOString()
        };
        
        setPaymentInfo(paymentData);
        storageUtil.setItem('paymentInfo', paymentData);
        return paymentData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching payment info:', error);
      return null;
    }
  };
  
  // New function to fetch subject mapping between tables
  const fetchSubjectMapping = async (educationLevel) => {
    try {
      // Fetch subjects from both tables
      const [subjectsResponse, paperSubjectsResponse] = await Promise.all([
        databases.listDocuments(
          database_id,
          subjectsTable_id,
          [Query.equal('educationLevel', educationLevel)]
        ),
        databases.listDocuments(
          database_id,
          paper_subjectsTable_id,
          [Query.equal('level', educationLevel)]
        )
      ])
      
      // Create mapping between paper_subjectsTable_id and subjectsTable_id
      const mapping = {}
      
      // Try to match subjects by name
      paperSubjectsResponse.documents.forEach(paperSubject => {
        const matchingSubject = subjectsResponse.documents.find(subject => 
          subject.name.toLowerCase() === paperSubject.subjectName.toLowerCase()
        )
        
        if (matchingSubject) {
          mapping[paperSubject.$id] = matchingSubject.$id
          mapping[matchingSubject.$id] = paperSubject.$id
        }
      })
      
      setSubjectMapping(mapping)
      storageUtil.setItem('subjectMapping', mapping)
    } catch (error) {
      console.error('Error fetching subject mapping:', error)
    }
  }

  const getMatchingPaperSubjectId = async (subjectId) => {
    try {
      // First check if we have a cached mapping
      if (subjectMapping[subjectId]) {
        return subjectMapping[subjectId];
      }
      
      // If not, fetch the subject from subjectsTable_id
      const subject = await databases.getDocument(database_id, subjectsTable_id, subjectId);
      
      // Find matching paper subject by name
      const response = await databases.listDocuments(database_id, paper_subjectsTable_id, [
        Query.equal('subjectName', subject.name),
        Query.equal('level', subject.educationLevel)
      ]);
      
      if (response.documents.length > 0) {
        const paperSubjectId = response.documents[0].$id;
        
        // Update mapping cache
        const updatedMapping = {...subjectMapping};
        updatedMapping[subjectId] = paperSubjectId;
        updatedMapping[paperSubjectId] = subjectId;
        
        setSubjectMapping(updatedMapping);
        storageUtil.setItem('subjectMapping', updatedMapping);
        
        return paperSubjectId;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting matching paper subject ID:', error);
      return null;
    }
  };

  
  // Function to check if a subject has remaining attempts
  const hasRemainingAttempts = (subjectId) => {
    // If user has full access (package payment), always return true
    if (paymentInfo?.hasFullAccess === true) {
      return true;
    }
    
    // For paper payment type, check if there are points/attempts available
    if (paymentInfo?.type === 'paper' && userPoints > 0) {
      return true;
    }
    
    return false;
  };

  const isSubjectPaid = (subjectId) => {
    // If user has full access (package payment), always return true
    if (paymentInfo?.hasFullAccess === true) {
      return true;
    }
    
    // For paper payment type, check if there are points/attempts available
    // First 2 attempts are free, then check for purchased points
    const freeTrialAttempts = 2;
    const totalAvailableAttempts = freeTrialAttempts + userPoints;
    
    if (totalAvailableAttempts > 0) {
      return true;
    }
    
    return false;
  };  

  // Update payment info after a new payment
  const updatePaymentInfo = async (paymentData) => {
    try {
      // If package payment, set full access
      if (paymentData.paymentType === 'package') {
        const newPaymentInfo = {
          type: 'package',
          hasFullAccess: true,
          paidSubjects: [],
          lastPaymentDate: new Date().toISOString()
        }
        setPaymentInfo(newPaymentInfo)
        storageUtil.setItem('paymentInfo', newPaymentInfo)
        return true
      }
      
      // If individual papers payment
      if (paymentData.paymentType === 'paper' && paymentData.selectedSubjects) {
        const newPaidSubjects = [...paymentInfo.paidSubjects]
        
        // Add newly paid subjects
        Object.keys(paymentData.selectedSubjects).forEach(subjectId => {
          if (!newPaidSubjects.includes(subjectId)) {
            newPaidSubjects.push(subjectId)
          }
        })
        
        const newPaymentInfo = {
          type: 'paper',
          hasFullAccess: false,
          paidSubjects: newPaidSubjects,
          lastPaymentDate: new Date().toISOString()
        }
        
        setPaymentInfo(newPaymentInfo)
        storageUtil.setItem('paymentInfo', newPaymentInfo)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error updating payment info:', error)
      return false
    }
  }

  /**
   * Enrolls a student in a subject if they have paid for it
   * @param {string} userDocId - Document id string.
   * @param {string} newSubject - Subject id to enroll in.
   * @returns {Object} - Result of enrollment attempt.
   */
  const studentEnrollSubject = async (userDocId, newSubject) => {
    // Check if subject is paid for
    if (!isSubjectPaid(newSubject)) {
      // Return false to indicate enrollment failed due to payment
      return { success: false, reason: 'not_paid', subjectId: newSubject }
    }
    
    // Ensure 'subjects' is an array
    const subjects = Array.isArray(userInfo.subjects) ? userInfo.subjects : []

    // Add new subject if it doesn't exist in the array
    if (!subjects.includes(newSubject)) {
      subjects.push(newSubject)

      // Update the userInfo with the updated 'subjects'
      const updatedUserInfo = { ...userInfo, subjects }

      // Update the database
      try {
        const document = await databases.getDocument(database_id, studentTable_id, userDocId)
        
        // Update the 'subjects' field in the document
        const updatedSubjects = [...document.subjects, newSubject]
        const updatedDocument = await databases.updateDocument(
          database_id,
          studentTable_id,
          userDocId,
          {
            subjects: updatedSubjects,
          }
        )
        
        // Update user subject data on localStorage
        await updateUserSubjectData(
          updatedDocument.subjects,
          updatedDocument.educationLevel
        )
        
        // Save to local storage and update the state
        storageUtil.setItem('userInfo', updatedUserInfo)
        setUserInfo(updatedUserInfo)
        
        return { success: true }
      } catch (error) {
        console.error('Error updating subjects in the database:', error)
        return { success: false, reason: 'error', message: error.message }
      }
    }
    
    // Subject already enrolled
    return { success: true }
  }

  //Update user subject data on localStorage
  const updateUserSubjectData = async (subjectsData, educationLevel) => {
    try {
      let enrolledSubjectsData = subjectsData || []
      const response = await studentSubjectsData(
        enrolledSubjectsData,
        educationLevel
      )
      setUserSubjectData(response)
      storageUtil.setItem('userSubjectData', response)
    } catch (error) {
      // console.log('Subjects Data Error: ', error);
    }
  }

  const updateQuestionSubjectData = async (
    subjects,
    userId,
    educationLevel
  ) => {
    for (const subject of subjects) {
      try {
        // Check if there are already exams for the given subject
        const existingExams = await db.exams
          .where({ userId, subjectName: subject, educationLevel })
          .count()

        // If exams exist for the subject, skip fetching
        if (existingExams > 0) {
          // console.log(`Exams for subject ${subject} already exist, skipping fetch.`);
          continue
        }

        // If no exams exist for the subject, fetch up to 5 exams
        for (let i = 0; i < 5; i++) {
          try {
            const url = `${serverUrl}/exam/fetch-exam?subjectName=${subject}&userId=${userId}&educationLevel=${educationLevel}`
            const response = await fetch(url)

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            const exam = {
              userId,
              educationLevel,
              subjectName: subject,
              examData: data.questions,
            }

            // Store the exam immediately and await completion
            await db.exams.add(exam)

            // console.log(`Exam - ${i} for subject ${subject} stored successfully`);
          } catch (error) {
            console.error(
              `Error fetching exam data for subject ${subject}:`,
              error
            )
            break // Exit loop on error
          }
        }
      } catch (error) {
        console.error(`Error processing subject ${subject}:`, error)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        sessionInfo,
        userInfo,
        userPoints,
        userSubjectData,
        paymentInfo,
        subjectMapping,
        schoolUser,
        accountType,
        loginSchool,
        loginSchoolStudent,
        handleLogin,
        handleLogout,
        fetchUserPoints,
        updateUserPoints,
        studentEnrollSubject,
        updateQuestionSubjectData,
        isSubjectPaid,
        hasRemainingAttempts,
        updatePaymentInfo,
        fetchPaymentInfo,
        fetchSubjectMapping
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}