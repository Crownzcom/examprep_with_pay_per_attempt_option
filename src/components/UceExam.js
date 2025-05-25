import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.js";
import QuizContainer from "./renderQuiz/QuizContainer";
import { serverUrl } from "../config.js";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UceExam = ({ subject }) => {
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [showUnavailableModal, setShowUnavailableModal] = useState(true);
  const [data, setData] = useState(null); // Variable to store fetched questions
  const [examID, setExamID] = useState(null); // Store examID separately

  const { userInfo } = useAuth();
  const navigate = useNavigate();

  /*================================================================*/
  /* FETCH UCE EXAM FROM SERVER-SIDE */
  const fetchUceExam = async (subjectName, userId) => {
    const url = `${serverUrl}/api/fetch-uce-exam?userId=${userId}&subjectName=${subjectName}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const serverExam = await response.json();

      // Extract examID and questions
      if (serverExam && serverExam.questions) {
        setData(serverExam.questions); // Set exam questions
        setExamID(serverExam.examID); // Set examID from the fetched data
      } else {
        setShowUnavailableModal(true);
      }
    } catch (error) {
      console.error("Error fetching UCE exam:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch exam questions and examID from server-side
        await fetchUceExam(subject, userInfo.userId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetch function on component mount

    // Cleanup function
    return () => {};
  }, [subject, userInfo.userId]);

  const handleProceed = () => {
    if (data !== null) {
      setShowInstructionsModal(false); // Proceed if data is available
    } else {
      setShowInstructionsModal(false);
      setShowUnavailableModal(true); // Show unavailable modal if no data
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  const subjectInstructions = () => {
    return subject === "mathematics" ? (
      <>
        <li>
          Have a piece of paper, pen/pencil, and calculator ready for
          calculations.
        </li>
      </>
    ) : null;
  };

  const renderQuizContent = () => {
    if (data === null || examID === null) return null; // Ensure both data and examID are available

    // Render QuizContainer with specific subject quiz data and pass the examID
    return (
      <QuizContainer
        questionsData={data}
        subjectName={subject}
        examID={examID}
      />
    );
  };

  return (
    <>
      {/* Instructions Modal */}
      <Modal show={showInstructionsModal} onHide={() => {}} centered>
        <Modal.Header>
          <Modal.Title>Exam Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Here are the instructions for your exam:</p>
          <ul>
            {subjectInstructions()}
            <li>Read each question carefully.</li>
            <li>Ensure you answer all questions.</li>
            <li>
              Answer multiple-choice questions by selecting the best option.
            </li>
            <li>Keep track of the time limit and pace yourself accordingly.</li>
            <li>Do not refresh the page during the exam.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProceed}>
            Proceed to Exam
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Render quiz content if instructions modal is closed */}
      {!showInstructionsModal && showUnavailableModal && renderQuizContent()}

      {/* Unavailable Modal */}
      {!showUnavailableModal && (
        <Modal show={true} onHide={() => {}} centered>
          <Modal.Header>
            <Modal.Title>Exam Unavailable</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Currently, the exam for the selected subject is not available.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCancel}>
              Go Back
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default UceExam;
