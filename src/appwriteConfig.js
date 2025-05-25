// appwriteConfig.js
import {
  Client,
  Account,
  Databases,
  Permission,
  Role,
  Query,
  ID,
} from "appwrite";

/* EXAM_PREP - SERVER LOCAL INSTANCE */
const client = new Client()
  .setEndpoint("https://appwrite.exampreptutor.com/v1")
  .setProject("66a604290011456dccf3");

const account = new Account(client);
const databases = new Databases(client);

//ExamPrep - Appwrite Self-Hosted Instance
const database_id = "655f5a677fcf3b1d8b79";
const studentTable_id = "657065f7dddd996bf19b";
const nextOfKinTable_id = "65706739032c0962d0a9";
const studentMarksTable_id = "6598050dbb628ae2216f";
const uceStudentMarksTable_id = "6703b44d00396e40fb78";
const couponTable_id = "65d74fb70f64c0e46f36";
const transactionTable_id = "65f05f7989ddbc1b06b7";
const pointsTable_id = "UserID";
const pointsBatchTable_id = "65f2c212c16fa9abe971";
const subjectsTable_id = "660bb2f8d5d40ba2c2b5";
const couponUsagesTable_id = "65dc4317b1e6e5bebdb9";
const updatedAttemptedQtnsTable_id = "66279de7702be42c9910";
const packagesTable_id = "663a0ded000c09b7d6fc";

//======================================ADDED BY FRANCIS========================================
const paper_subjectsTable_id = "6821df580035bda5b425"; 

// Export the required parts
export {
  client,
  account,
  databases,
  database_id,
  studentTable_id,
  nextOfKinTable_id,
  studentMarksTable_id,
  uceStudentMarksTable_id,
  couponTable_id,
  transactionTable_id,
  pointsTable_id,
  pointsBatchTable_id,
  subjectsTable_id,
  couponUsagesTable_id,
  updatedAttemptedQtnsTable_id,
  packagesTable_id,
  paper_subjectsTable_id,
  Permission,
  Role,
  Query,
  ID,
};
