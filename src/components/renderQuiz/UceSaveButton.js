import React, { useState } from "react";
import { useUceQuiz } from "../../context/uceQuizContext";
import moment from "moment";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { sendEmailToNextOfKin } from "../../utilities/otherUtils.js";
import {
  uceFetchAndUpdateResults,
  formatDate,
} from "../../utilities/resultsUtil";

import {
  databases,
  database_id,
  uceStudentMarksTable_id,
} from "../../appwriteConfig.js";
import { Button, Spinner } from "react-bootstrap";

const UceSaveButton = ({
  selectedQuestions,
  onSubmit,
  disabled,
  subjectName,
  // studentID,
  examID,
}) => {
  const { answers } = useUceQuiz();
  const { userInfo, updateUserPoints } = useAuth();
  // console.log("updateUserPoints: ", updateUserPoints);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  let studentID = userInfo.userId;

  const totalMarksMap = {
    english: 20,
    chemistry: 57,
    biology: 60,
    physics: 68,
    mathematics: 80,
    history: 50,
    physicalEducation: 0,
    geography: 40,
    commerce: 0,
    art: 0,
    agriculture: 0,
    religious: 0,
    literature: 0,
    foreign: 0,
    computer: 0,
  };

  // function to add user_answer/selected value and the score to the selectedQuestions json file
  const formattedSelectedQuestions = (selectedQuestions, answers) => {
    return selectedQuestions.map((category) => {
      const hasEitherOr = category.questions.either || category.questions.or;

      if (hasEitherOr) {
        const eitherAnswer = answers.find(
          (answer) => answer.questionId === category.questions.either?.id
        );
        const orAnswer = answers.find(
          (answer) => answer.questionId === category.questions.or?.id
        );

        if (eitherAnswer) {
          category.questions.either.sub_question =
            category.questions.either.sub_question.map((subQuestion) => {
              const userAnswer = answers.find(
                (answer) =>
                  answer.questionId === category.questions.either.id &&
                  answer.subQuestionId === subQuestion.id
              );

              return {
                ...subQuestion,
                user_answer: userAnswer ? userAnswer.selectedValue : null,
                user_score: userAnswer ? userAnswer.selectedScore : null,
                correct_answer: userAnswer?.correctAnswer || null,
                maxScore: subQuestion.maxScore,
              };
            });
        } else if (orAnswer) {
          category.questions.or.sub_question =
            category.questions.or.sub_question.map((subQuestion) => {
              const userAnswer = answers.find(
                (answer) =>
                  answer.questionId === category.questions.or.id &&
                  answer.subQuestionId === subQuestion.id
              );

              return {
                ...subQuestion,
                user_answer: userAnswer ? userAnswer.selectedValue : null,
                user_score: userAnswer ? userAnswer.selectedScore : null,
                correct_answer: userAnswer?.correctAnswer || null,
                maxScore: subQuestion.maxScore,
              };
            });
        }
      } else {
        category.questions.sub_questions = category.questions.sub_questions.map(
          (subQuestion) => {
            const userAnswer = answers.find(
              (answer) =>
                answer.questionId === category.questions.id &&
                answer.subQuestionId === subQuestion.id
            );

            return {
              ...subQuestion,
              user_answer: userAnswer ? userAnswer.selectedValue : null,
              user_score: userAnswer ? userAnswer.selectedScore : null,
              correct_answer: userAnswer?.correctAnswer || null,
              maxScore: subQuestion.maxScore,
            };
          }
        );
      }
      return category;
    });
  };

  const createDocument = async (data) => {
    try {
      setIsLoading(true);

      // Saves the data to Appwrite's database.
      const result = await databases.createDocument(
        database_id,
        uceStudentMarksTable_id,
        "unique()",
        data
      );

      console.log("Document created successfully:", result);
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Set loading state to true to show spinners
    setIsLoading(true);

    try {
      // Filter answers by examID and subjectName
      const filteredAnswers = answers.filter(
        (answer) =>
          answer.examID === examID && answer.subjectName === subjectName
      );

      // console.log("filteredAnswers :", filteredAnswers);

      // Calculate total marks for the filtered answers
      let totalMarks = 0;
      filteredAnswers.forEach((answer) => {
        totalMarks += answer.selectedScore || 0;
      });

      const totalPossibleMarks = totalMarksMap[subjectName.toLowerCase()] || 0;
      const updatedQuestions = formattedSelectedQuestions(
        selectedQuestions,
        answers
      );
      // console.log("updatedQuestions:", updatedQuestions);

      const resultsString = JSON.stringify(updatedQuestions);

      // Prepare userResultsData for submission
      const userResultsData = {
        studID: studentID,
        marks: totalMarks,
        subject: subjectName,
        results: resultsString,
        totalPossibleMarks: totalPossibleMarks,
        dateTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      };

      // console.log("User Results Data:", userResultsData);

      // Send `userResultsData` to Appwrite
      await createDocument(userResultsData);

      if (userInfo.kinEmail) {
        await sendEmailToNextOfKin(
          userInfo,
          subjectName,
          totalMarks,
          formatDate(new Date())
        );
      }

      await updateUserPoints(1, userInfo.userId);
      await uceFetchAndUpdateResults(userInfo.userId);

      let attemptDate = formatDate(new Date());

      const questionsData = updatedQuestions;
      navigate("/view-results", {
        state: {
          filteredAnswers,
          questionsData,
          subjectName,
          totalMarks,
          totalPossibleMarks,
          attemptDate,
        },
      });

      // if (subjectName === "english" || subjectName === "mathematics") {
      //   const questionsData = updatedQuestions;
      //   navigate("/view-results", {
      //     state: {
      //       filteredAnswers,
      //       questionsData,
      //       subjectName,
      //       totalMarks,
      //       totalPossibleMarks,
      //       attemptDate,
      //     },
      //   });
      // } else {
      //   const questionsData = selectedQuestions;
      //   navigate("/uce-answers", {
      //     state: {
      //       filteredAnswers,
      //       questionsData,
      //       subjectName,
      //       totalMarks,
      //       totalPossibleMarks,
      //       attemptDate,
      //     },
      //   });
      // }

      // Navigate after all async tasks are completed

      onSubmit();
    } catch (e) {
      console.error("Error saving ANSWERS to cloud db");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isLoading ? (
        <Button
          onClick={handleSubmit}
          disabled={disabled}
          variant="primary"
          style={{
            backgroundColor: "blue",
            color: "white",
            fontSize: "20px",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          <FontAwesomeIcon icon={faSave} /> Submit Exam
        </Button>
      ) : (
        <>
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
        </>
      )}
    </>
  );
};

export default UceSaveButton;