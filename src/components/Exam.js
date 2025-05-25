import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetAnswers } from "./renderQuiz/redux/actions";
import QuizContainer from "./renderQuiz/QuizContainer";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext.js";
import { serverUrl } from "../config.js";
import { useSectionB } from "../context/pleSectionBContext.js";

/**
 * Represents an Exam component.
 * @param {Object} props - The component props.
 * @param {string} props.subject - The subject of the exam.
 * @returns {JSX.Element} The Exam component.
 */
function Exam({ subject }) {
  const dispatch = useDispatch();
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [showUnavailableModal, setshowUnavailableModal] = useState(true);
  const [data, setData] = useState(null); // Variable to store the fetched questions data

  const { userInfo } = useAuth();
  const { clearSectionBAnswers } = useSectionB()

  const navigate = useNavigate();

  /*================================================================*/
  /* FETCH EXAM FROM SERVER-SIDE */
  const fetchExam = async (subjectName, userId, educationLevel) => {
    const url = `${serverUrl}/exam2/fetch-exam?userId=${userId}&subjectName=${subjectName}&educationLevel=${educationLevel}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // console.log(data);

      return data;
    } catch (error) {
      console.error("Error fetching user exam:", error);
      return null; // or handle the error as you see fit
    }
  };
  /*================================================================*/
  useEffect(() => {
    // Clear user answers when this component mounts
    dispatch(resetAnswers());
  }, [dispatch]);

  useEffect(() => {
    // Fetch data from your cloud Appwrite database
    const fetchData = async () => {
      try {
        /*================================================================*/
        // fetch from server-side
        const serverExam = await fetchExam(
          subject,
          userInfo.userId,
          userInfo.educationLevel
        );
        // console.log('ORIG - exam fetched from server side: ', serverExam.allquestions);
        // console.log('SORTED - exam fetched from server side: ', serverExam.questions);
        let questionData = [];
        questionData = serverExam.questions;
        // console.log(questionData);

        setData(questionData); // Assign the fetched data to the variable
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetchData function to fetch the data

    // Cleanup function
    return () => {};
  }, []); // Empty dependency array ensures the code runs only once

  const handleProceed = () => {
    clearSectionBAnswers()
    if (
      subject === "social-studies_ple" ||
      subject === "mathematics_ple" ||
      subject === "english-language_ple" ||
      subject === "science_ple"
    ) {
      
      setShowInstructionsModal(false);
    } else {
      setShowInstructionsModal(false);
      setshowUnavailableModal(false); // Set the subject validity to false
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const renderQuizContent = () => {
    switch (subject) {
      case "english-language_ple":
        if (data === null) {
          return null;
        } else {
          return <QuizContainer questionsData={data} subjectName={"eng_ple"} />;
        }

      case "social-studies_ple":
        if (data === null) {
          return null;
        } else {
          return <QuizContainer questionsData={data} subjectName={"sst_ple"} />;
        }

      case "mathematics_ple":
        return <QuizContainer questionsData={data} subjectName={"math_ple"} />;

      case "science_ple":
        return <QuizContainer questionsData={data} subjectName={"sci_ple"} />;

      default:
        return null;
    }
  };

  const subjectInstructions = () => {
    // console.log('Subject Name: ', subject);
    return subject ===
      ("mathematics_ple" || "mathematics_uce" || "mathematics_uace") ? (
      <>
        <li>
          Have a piece of paper, pen/pencil, and calculator ready for
          calculations.{" "}
        </li>
      </>
    ) : (
      <></>
    );
  };

  return (
    <>
      <Modal show={showInstructionsModal} onHide={() => {}} centered>
        <Modal.Header>
          <Modal.Title>Exam Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Here are the instructions for your exam:</p>
          <ul>
            {/* Subject based instructions as needed */}
            {subjectInstructions()}
            {/* Other General instructions as needed */}
            <li>Read each question carefully.</li>
            <li>Ensure you answer all questions.</li>
            <li>
              Answer multiple-choice questions by selecting the best option.
            </li>
            <li>
              Enter text responses for text entry questions in the provided text
              box.
            </li>
            <li>Keep track of the time limit and pace yourself accordingly.</li>
            <li>Do not refresh the page during the exam.</li>
            <li>
              Upon completion, submit the exam and await feedback on your
              performance.
            </li>
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

      {!showInstructionsModal && showUnavailableModal && renderQuizContent()}

      {!showUnavailableModal && (
        <Modal
          show={true}
          onHide={() => {}}
          centered
          styles={{ width: "40%", height: "40%" }}
        >
          <Modal.Header>
            <Modal.Title>Exam Unavailable</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Currently, the exam for the selected subject is not available.
              Please check back later.
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
}

export default Exam;
