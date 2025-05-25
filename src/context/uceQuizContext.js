import React, { createContext, useState, useContext } from "react";

// Create the UCE Quiz Context
const UceQuizContext = createContext();

// Custom hook to use the UCE Quiz context
export const useUceQuiz = () => {
  return useContext(UceQuizContext);
};

// Provider component for the UCE Quiz context
export const UceQuizProvider = ({ children }) => {
  const [answers, setAnswers] = useState([]);

  // console.log("current answers", answers);

  // Function to save/update user's answer in the answers array
  const saveUserAnswer = (
    examID,
    subjectName,
    questionId,
    subQuestionId,
    selectedValue,
    categoryId,
    selectedScore,
    correctAnswer
  ) => {
    const newAnswer = {
      examID,
      subjectName,
      questionId,
      subQuestionId,
      selectedValue,
      categoryId,
      selectedScore,
      correctAnswer,
    };

    setAnswers((prevAnswers) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        (ans) =>
          ans.examID === examID &&
          ans.subjectName === subjectName &&
          ans.questionId === questionId &&
          ans.subQuestionId === subQuestionId
      );

      if (existingAnswerIndex !== -1) {
        // Update existing answer
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = newAnswer;
        return updatedAnswers;
      }

      // Add new answer to the array
      return [...prevAnswers, newAnswer];
    });
  };

  return (
    <UceQuizContext.Provider value={{ answers, saveUserAnswer }}>
      {children}
    </UceQuizContext.Provider>
  );
};
