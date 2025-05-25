import {
    databases,
    database_id,
    pointsTable_id,
    pointsBatchTable_id,
    couponUsagesTable_id,
    subjectsTable_id, 
    paper_subjectsTable_id,
    Query,
} from "../appwriteConfig.js";
import moment from 'moment';
import { serverUrl } from "../config.js";

export const validateArrayInput = (input, fieldName) => {
    console.log(`validateArrayInput - Input for ${fieldName}:`, { input, type: typeof input });
    if (input == null || input === undefined) {
        console.warn(`Null or undefined ${fieldName}, defaulting to []`);
        return [];
    }
    if (!Array.isArray(input)) {
        console.warn(`Non-array input for ${fieldName}:`, input);
        try {
            if (typeof input === 'string' && input.trim()) {
                const parsed = JSON.parse(input);
                return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string' && item.trim()) : [String(parsed)];
            }
            return [String(input)].filter(item => item.trim());
        } catch (e) {
            console.error(`Failed to parse ${fieldName}:`, e);
            return [];
        }
    }
    const validArray = input.filter(item => typeof item === 'string' && item.trim());
    console.log(`validateArrayInput - Output for ${fieldName}:`, validArray);
    return validArray;
};

const validateSelectedSubjects = (input, fieldName) => {
  console.log(`Validating ${fieldName}:`, input);
  let selectedSubjectsObj = {};
  if (typeof input === "string") {
    try {
      selectedSubjectsObj = JSON.parse(input);
    } catch (e) {
      console.warn(`Failed to parse ${fieldName}:`, e);
      return [];
    }
  } else if (input && typeof input === "object") {
    selectedSubjectsObj = input;
  }
  const selectedSubjectsArray = Object.entries(selectedSubjectsObj).map(([key, value]) => {
    return JSON.stringify({ id: key, attempts: value.attempts || value });
  });
  console.log(`Validated ${fieldName}:`, selectedSubjectsArray);
  return selectedSubjectsArray;
};

export const sendEmailToNextOfKin = async (userInfo, subjectName, examScore, examDateTime) => {
    const studentName = `${userInfo.firstName} ${userInfo.lastName}${userInfo.otherName ? ` ${userInfo.otherName}` : ''}`;
    const educationLevel = userInfo.educationLevel;
    const kinNames = `${userInfo.kinFirstName} ${userInfo.kinLastName}`;
    const kinEmail = userInfo.kinEmail;

    // Send the information to the backend
    fetch(`${serverUrl}/alert-guardian`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            studentName,
            educationLevel,
            kinNames,
            kinEmail,
            subjectName,
            examScore,
            examDateTime,
        }),
    })
        .then(response => {
            // Handle the response from the backend
            // ...
        })
        .catch(error => {
            console.error('Failed to send email notification', error);
        });
};

export const updateLabels = async (userId, labels) => {
    const paylaod = {
        userId: userId,
        labels: labels,
    };
    // Send the information to the backend
    fetch(`${serverUrl}/update-labels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paylaod),
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/**
 * Formats the date string into a more readable format.
 * @param {string} dateTime - The original date-time string.
 * @returns {string} - The formatted date-time string.
 */
export const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return `${date.toLocaleString("en-US", {
        dateStyle: "long",
    })} ${date.toLocaleTimeString()}`;
};

/**
 * APPWRITE FUNCTIONS
 */

/*** ----------- Create a document ----------- ***/
export const createDocument = async (databaseId, tableId, data, tableUse) => {
    try {
        const response = await databases.createDocument(databaseId, tableId, 'unique()', data)
        return response;
    } catch (error) {
        console.error(`Error Creating Document - (${tableUse}):`, error);
        return null;
    }
}

/* ----------- Coupon Usage tracking ----------- ***/
export const couponTrackerUpdate = async (data) => {
    try {
        var currentDateTime = moment().format('MMMM Do YYYY, h:mm:ss a z');
        await createDocument(database_id, couponUsagesTable_id, {
            UserID: data.userId,
            CouponCode: data.couponCode,
            UsageDate: currentDateTime,
        }, data.message)
    } catch (e) {
        console.error('Failed to update coupon usage table: ', e);
    }
}

// Function to map between paper_subjectsTable_id and subjectsTable_id
export const mapSubjectsBetweenTables = async (educationLevel) => {
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
    ]);
    
    // Create mapping between paper_subjectsTable_id and subjectsTable_id
    const mapping = {};
    
    // Try to match subjects by name
    paperSubjectsResponse.documents.forEach(paperSubject => {
      const matchingSubject = subjectsResponse.documents.find(subject => 
        subject.name.toLowerCase() === paperSubject.subjectName.toLowerCase()
      );
      
      if (matchingSubject) {
        mapping[paperSubject.$id] = matchingSubject.$id;
        mapping[matchingSubject.$id] = paperSubject.$id;
      }
    });
    
    return mapping;
  } catch (error) {
    console.error('Error mapping subjects between tables:', error);
    return {};
  }
};

// Function to check if a subject is paid for
export const isSubjectPaid = (subjectId, paymentInfo, subjectMapping) => {
  // If user has full access (package payment)
  if (paymentInfo.hasFullAccess) {
    return true;
  }
  
  // Check if this specific subject is paid for
  if (paymentInfo.paidSubjects.includes(subjectId)) {
    return true;
  }
  
  // Check if there's a mapping to a paid subject
  const mappedId = subjectMapping[subjectId];
  if (mappedId && paymentInfo.paidSubjects.includes(mappedId)) {
    return true;
  }
  
  return false;
};

// Function to update payment info in the database
export const updatePaymentInfo = async (userId, paymentData) => {
  try {
    const response = await databases.listDocuments(
      database_id,
      pointsTable_id,
      [Query.equal('UserID', userId)]
    );
    
    if (response.documents.length === 0) {
      console.error('No points document found for user:', userId);
      return false;
    }
    
    const pointsDoc = response.documents[0];
    
    // Extract subject IDs from selected subjects
    let paidSubjectIds = [];
    if (paymentData.selectedSubjects) {
      if (typeof paymentData.selectedSubjects === 'string') {
        try {
          const parsed = JSON.parse(paymentData.selectedSubjects);
          paidSubjectIds = Object.keys(parsed);
        } catch (e) {
          console.error('Error parsing selectedSubjects:', e);
        }
      } else {
        paidSubjectIds = Object.keys(paymentData.selectedSubjects);
      }
    }
    
    // Update the points document with payment info
    const updateData = {
      paymentType: paymentData.paymentType || 'paper',
      hasFullAccess: paymentData.hasFullAccess || false,
    };
    
    // Only update paidSubjects if this is a per-paper payment
    if (!paymentData.hasFullAccess && paidSubjectIds.length > 0) {
      // Get existing paid subjects
      let existingPaidSubjects = [];
      if (pointsDoc.paidSubjects && Array.isArray(pointsDoc.paidSubjects)) {
        existingPaidSubjects = pointsDoc.paidSubjects;
      }
      
      // Merge with new paid subjects
      updateData.paidSubjects = [...new Set([...existingPaidSubjects, ...paidSubjectIds])];
    }
    
    // Update the document
    await databases.updateDocument(
      database_id,
      pointsTable_id,
      pointsDoc.$id,
      updateData
    );
    
    return true;
  } catch (error) {
    console.error('Error updating payment info:', error);
    return false;
  }
};

// Function to get paid subjects for a user
export const getPaidSubjects = async (userId) => {
  try {
    const response = await databases.listDocuments(
      database_id,
      pointsTable_id,
      [Query.equal('UserID', userId)]
    );
    
    if (response.documents.length === 0) {
      return { hasFullAccess: false, paidSubjects: [] };
    }
    
    const pointsDoc = response.documents[0];
    
    // Check if user has full access
    const hasFullAccess = pointsDoc.hasFullAccess === true || 
                          pointsDoc.paymentType === 'package';
    
    // Get paid subjects
    let paidSubjects = [];
    let paidSubjectsWithAttempts = {};
    
    // If user has selectedSubjects, extract subject IDs
    if (pointsDoc.selectedSubjects && Array.isArray(pointsDoc.selectedSubjects)) {
      pointsDoc.selectedSubjects.forEach(subjectStr => {
        try {
          const subjectData = typeof subjectStr === 'string' ? JSON.parse(subjectStr) : subjectStr;
          if (subjectData.id && subjectData.attempts > 0) {
            paidSubjects.push(subjectData.id);
            paidSubjectsWithAttempts[subjectData.id] = subjectData.attempts;
          }
        } catch (e) {
          console.error('Error parsing subject data:', e);
        }
      });
    }
    
    // If user has explicit paidSubjects array, use that
    if (pointsDoc.paidSubjects && Array.isArray(pointsDoc.paidSubjects)) {
      pointsDoc.paidSubjects.forEach(subjectId => {
        if (!paidSubjects.includes(subjectId)) {
          paidSubjects.push(subjectId);
          if (!paidSubjectsWithAttempts[subjectId]) {
            paidSubjectsWithAttempts[subjectId] = 1; // Default to 1 attempt if not specified
          }
        }
      });
    }
    
    return {
      hasFullAccess,
      paidSubjects,
      paidSubjectsWithAttempts,
      paymentType: pointsDoc.paymentType || (hasFullAccess ? 'package' : 'paper')
    };
  } catch (error) {
    console.error('Error getting paid subjects:', error);
    return { 
      hasFullAccess: false, 
      paidSubjects: [], 
      paidSubjectsWithAttempts: {},
      paymentType: null 
    };
  }
};

// Function to reduce attempts for a specific subject
export const reduceSubjectAttempt = async (userId, subjectId) => {
  try {
    // Get the current points document
    const response = await databases.listDocuments(
      database_id,
      pointsTable_id,
      [Query.equal('UserID', userId)]
    );
    
    if (response.documents.length === 0) {
      console.log("No points document found, cannot reduce attempts");
      return false;
    }
    
    const pointsDoc = response.documents[0];
    const selectedSubjects = pointsDoc.selectedSubjects || [];
    
    // Find and update the subject's attempts
    let updated = false;
    const updatedSelectedSubjects = selectedSubjects.map(subjectStr => {
      try {
        const subjectData = typeof subjectStr === 'string' ? JSON.parse(subjectStr) : subjectStr;
        if (subjectData.id === subjectId && subjectData.attempts > 0) {
          updated = true;
          return JSON.stringify({
            ...subjectData,
            attempts: subjectData.attempts - 1
          });
        }
        return subjectStr;
      } catch (e) {
        console.error('Error processing subject data:', e);
        return subjectStr;
      }
    });
    
    if (updated) {
      await databases.updateDocument(
        database_id,
        pointsTable_id,
        pointsDoc.$id,
        { selectedSubjects: updatedSelectedSubjects }
      );
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error reducing subject attempt:', error);
    return false;
  }
};

// Modified updatePointsTable to handle payment type and paid subjects
export const updatePointsTable = async (data) => {
  try {
    console.log('updatePointsTable - Received Data:', {
      paymentType: data.paymentType,
      hasFullAccess: data.hasFullAccess,
      points: data.points,
      trialStatus: data.trialStatus
    });

    const currentDate = moment().tz('Africa/Nairobi').format('YYYY-MM-DD HH:mm:ss.SSS Z');
    let expiryDate = determineExpiryDate(data);
    const points = parseInt(data.points, 10);

    // Accept 'points', 'package', or 'paper' as valid values
    if (!['points', 'package', 'paper'].includes(data.paymentFor)) {
      console.error('Not a valid payment service:', data.paymentFor);
      return;
    }

    // For paper payment type, we only need to track points
    const paymentType = data.paymentType || 'paper';
    const hasFullAccess = paymentType === 'package' ? true : false;
    const trialStatus = data.trialStatus || 'inactive';

    // Add payment type and points to points batch
    await addPointsBatch(data, currentDate, expiryDate, points, {
      paymentType: paymentType,
      hasFullAccess: hasFullAccess,
      trialStatus: trialStatus
    });

    const responseCheck = await databases.listDocuments(
      database_id,
      pointsTable_id,
      [Query.equal('UserID', data.userId)]
    );

    let updateResponse;
    if (responseCheck.documents.length === 0) {
      updateResponse = await createNewPointsDocument(data, currentDate, expiryDate, points, {
        paymentType: paymentType,
        hasFullAccess: hasFullAccess,
        trialStatus: trialStatus
      });
    } else {
      updateResponse = await updateExistingPointsDocument(data, responseCheck.documents[0], currentDate, points, {
        paymentType: paymentType,
        hasFullAccess: hasFullAccess,
        trialStatus: trialStatus
      });
    }
    console.log('Points Table Updated:', updateResponse);
  } catch (err) {
    console.error('Error updating points table:', err);
    throw err;
  }
};

const determineExpiryDate = (data) => {
    let expiryDate;
    const currentMoment = moment.tz('Africa/Nairobi');

    if (data.staticDate && moment(data.expiryDate).isBefore(currentMoment)) {
        expiryDate = moment.tz(data.expiryDate, 'Africa/Nairobi').toDate();
    } else if (!data.staticDate) {
        expiryDate = currentMoment.add(data.duration, 'days').toDate();
    } else {
        expiryDate = moment.tz(data.expiryDate, 'Africa/Nairobi').toDate();
    }

    return expiryDate;
}

// Modified addPointsBatch to include payment type and paid subjects
const addPointsBatch = async (data, currentDate, expiryDate, points, { 
    paymentType, hasFullAccess, trialStatus 
}) => {
    console.log('addPointsBatch - Input Data:', {
        transactionID: data.transactionID,
        userID: data.userId,
        points,
        paymentType,
        hasFullAccess,
        trialStatus
    });

    try {
        const documentData = {
            transactionID: data.transactionID,
            userID: data.userId,
            points: points,
            purchaseDate: currentDate,
            expiryDate: expiryDate,
            paymentType: paymentType || 'paper',
            hasFullAccess: hasFullAccess || false,
            trialStatus: trialStatus || 'inactive'
        };

        console.log('addPointsBatch - Saving Document:', documentData);

        const response = await databases.createDocument(
            database_id,
            pointsBatchTable_id,
            'unique()',
            documentData
        );

        console.log('addPointsBatch - Saved Document:', response);
        return response;
    } catch (error) {
        console.error('Error in addPointsBatch:', error);
        throw error;
    }
};

// Modified createNewPointsDocument to include payment type and paid subjects
const createNewPointsDocument = async (data, currentDate, expiryDate, points, { 
    paymentType, hasFullAccess, trialStatus 
}) => {
    console.log('createNewPointsDocument - Input Data:', {
        userId: data.userId,
        points,
        paymentType,
        hasFullAccess,
        trialStatus
    });

    try {
        const documentData = {
            UserID: data.userId || null,
            PurchasedTier: data.educationLevel,
            AcquisitionDate: currentDate,
            ExpiryDate: expiryDate,
            PointsBalance: points,
            paymentType: paymentType || 'paper',
            hasFullAccess: hasFullAccess || false,
            trialStatus: trialStatus || 'inactive'
        };

        console.log('createNewPointsDocument - Saving Document:', documentData);

        const response = await databases.createDocument(
            database_id,
            pointsTable_id,
            data.userId,
            documentData
        );

        console.log('createNewPointsDocument - Saved Document:', response);
        return response;
    } catch (error) {
        console.error('Error in createNewPointsDocument:', error);
        throw error;
    }
};

// Modified updateExistingPointsDocument to include payment type and paid subjects
const updateExistingPointsDocument = async (data, currentDocument, currentDate, points, { 
    paymentType, hasFullAccess, trialStatus 
}) => {
    console.log('updateExistingPointsDocument - Input Data:', {
        currentDocumentId: currentDocument.$id,
        points,
        paymentType,
        hasFullAccess,
        trialStatus
    });

    const expiryDate = determineExpiryDateForExistingDocument(data, currentDocument);

    try {
        const documentData = {
            PointsBalance: currentDocument.PointsBalance + points,
            AcquisitionDate: currentDate,
            ExpiryDate: expiryDate.toISOString(),
            // Only update payment type if it's a package (full access)
            ...(paymentType === 'package' ? { paymentType: 'package' } : {}),
            // Only update hasFullAccess if it's true
            ...(hasFullAccess ? { hasFullAccess: true } : {}),
            // Only update trial status if it's being explicitly set to active
            ...(trialStatus === 'active' ? { trialStatus: 'active' } : {})
        };

        console.log('updateExistingPointsDocument - Updating Document:', documentData);

        const response = await databases.updateDocument(
            database_id,
            pointsTable_id,
            currentDocument.$id,
            documentData
        );

        console.log('updateExistingPointsDocument - Updated Document:', response);
        return response;
    } catch (error) {
        console.error('Error in updateExistingPointsDocument:', error);
        throw error;
    }
};

const determineExpiryDateForExistingDocument = (data, currentDocument) => {
    const currentExpiryDate = moment.tz(currentDocument.ExpiryDate, 'Africa/Nairobi');
    let expiryDate;

    if (data.staticDate && moment(data.expiryDate).isBefore(currentExpiryDate)) {
        expiryDate = currentExpiryDate.toDate();
    } else if (data.staticDate && moment(data.expiryDate).isAfter(currentExpiryDate)) {
        expiryDate = moment.tz(data.expiryDate, 'Africa/Nairobi').toDate();
    } else if (!data.staticDate && currentExpiryDate.isAfter(moment())) {
        expiryDate = currentExpiryDate.add(data.duration, 'days').toDate();
    } else {
        expiryDate = moment().tz('Africa/Nairobi').add(data.duration, 'days').toDate();
    }

    return expiryDate;
}

export const kinPurchasePoints = async (navigate, studentInfo) => {
    navigate(`/select-package/`, { state: { studentInfo: studentInfo } });
}

// Function to parse selected subjects from various formats
export const parseSelectedSubjects = (selectedSubjects) => {
  if (!selectedSubjects) return {};
  
  if (typeof selectedSubjects === 'string') {
      try {
          return JSON.parse(selectedSubjects);
      } catch (e) {
          console.error('Error parsing selectedSubjects string:', e);
          return {};
      }
  }
  
  if (Array.isArray(selectedSubjects)) {
      return selectedSubjects.reduce((acc, subjectStr) => {
          try {
              const subjectData = typeof subjectStr === 'string' ? JSON.parse(subjectStr) : subjectStr;
              if (subjectData.id) {
                  acc[subjectData.id] = { attempts: subjectData.attempts || 1 };
              }
          } catch (e) {
              console.error('Error parsing subject in array:', e);
          }
          return acc;
      }, {});
  }
  
  return selectedSubjects;
}