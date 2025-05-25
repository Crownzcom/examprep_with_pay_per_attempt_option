import { Children, createContext, useContext, useState } from "react";

// create the practicals context
const UcePracticalsContext = createContext();

// custom hook to use the context
export const useUcePracticals = () => {
  return useContext(UcePracticalsContext);
};

// provider component for the Practicals context
export const UcePracticalsProvider = ({ children }) => {
  const [answers, setPracticalAnswers] = useState([]);

  // Function to save/update user's answer in the answers array
  const savePracticalAnswer = (
    examID,
    subjectName,
    questionId,
    subQuestionId,
    selectedValue,
    categoryId
  ) => {
    const newAnswer = {
      examID,
      subjectName,
      questionId,
      subQuestionId,
      selectedValue,
      categoryId,
    };

    setPracticalAnswers((prevAnswers) => {
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
    <UcePracticalsContext.Provider value={{ answers, savePracticalAnswer }}>
      {children}
    </UcePracticalsContext.Provider>
  );
};
