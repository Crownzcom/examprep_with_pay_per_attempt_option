// resultsUtil.js
/*=========FETCH DATA FROM DB TO UPDATE LOCALSTORAGE=========*/
import {
  databases,
  database_id,
  studentMarksTable_id,
  uceStudentMarksTable_id,
  Query,
} from "../appwriteConfig";
import storageUtil from "./storageUtil";

export async function fetchAndUpdateResults(userId) {
  try {
    const response = await databases.listDocuments(
      database_id,
      studentMarksTable_id,
      [Query.equal("studID", userId), Query.limit(500)]
    );

    // Update the results key to an empty array for each document
    const updatedDocuments = response.documents.map((doc) => ({
      ...doc,
      results: [],
    }));

    // Update local storage with new results
    storageUtil.setItem("examResults", "");
    storageUtil.setItem("examResults", updatedDocuments);

    return updatedDocuments;
  } catch (error) {
    console.error("Failed to retrieve student results:", error);
    return null;
  }
}

// fetching uce data DB to update Local Storage
export async function uceFetchAndUpdateResults(userId) {
  try {
    const response = await databases.listDocuments(
      database_id,
      uceStudentMarksTable_id,
      [Query.equal("studID", userId), Query.limit(500)]
    );

    // Update the results key to an empty array for each document
    const updatedDocuments = response.documents.map((doc) => ({
      ...doc,
      results: [],
    }));

    // Update local storage with new results
    storageUtil.setItem("examResults", "");
    storageUtil.setItem("examResults", updatedDocuments);

    return updatedDocuments;
  } catch (error) {
    console.error("Failed to retrieve student results:", error);
    return null;
  }
}

/*=========END FETCH DATA FROM DB TO UPDATE LOCALSTORAGE=========*/

/*=========TRANSFORMS THE RESULTS=========*/
export const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const getTransformedResults = (studentId) => {
  const userResults = storageUtil.getItem("examResults") || [];

  // console.log("Saved Results: ", userResults);
  const resultsMap = new Map();

  userResults.forEach((doc) => {
    const qtnId = doc.$id;
    const subject = doc.subject;
    const dateTime = formatDate(doc.$createdAt);
    const score = doc.marks;
    const totalPossibleMarks = doc.totalPossibleMarks;

    // console.log(qtnId)

    if (!resultsMap.has(subject)) {
      resultsMap.set(subject, { subject, attempts: [] });
    }

    resultsMap.get(subject).attempts.push({
      qtnId,
      dateTime,
      score,
      totalPossibleMarks,
      subject,
      resultDetails: doc.results,
      // resultDetails: []
    });
  });

  // Sort each subject's attempts by date in descending order
  resultsMap.forEach((subjectData) => {
    subjectData.attempts.sort(
      (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
    );
  });

  return Array.from(resultsMap.values());
};

/*=========END TRANSFORMS THE RESULTS=========*/
