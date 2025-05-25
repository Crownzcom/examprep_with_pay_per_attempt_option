import React, { useState } from "react";
import { useUcePracticals } from "../../context/ucePracticalContext.js";
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
import { REACT_APP_GROQ_API_KEY } from "../../config.js";

const UcePracticalSaveButton = ({
  selectedQuestions,
  onSubmit,
  disabled,
  subjectName,
  // studentID,
  examID,
}) => {
  const { answers } = useUcePracticals();
  const { userInfo, updateUserPoints } = useAuth();
  // console.log("updateUserPoints: ", updateUserPoints);

  console.log("practical-answers", answers);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const GROQ_API_KEY = REACT_APP_GROQ_API_KEY;

  let studentID = userInfo.userId;

  const totalMarksMap = {
    "chemistry-practical": 24,
    biology: 0,
    physics: 0,
  };

  // function to add user_answer/selected value and the score to the selectedQuestions json file
  const formattedSelectedQuestions = (selectedQuestions, answers) => {
    return selectedQuestions.map((category) => {
      const hasEitherOr = category.questions.either || category.questions.or;

      const filteredAnswers = answers.filter(
        (answer) =>
          answer.examID === examID && answer.subjectName === subjectName
      );

      if (hasEitherOr) {
        const eitherAnswer = filteredAnswers.find(
          (answer) => answer.questionId === category.questions.either?.id
        );
        const orAnswer = filteredAnswers.find(
          (answer) => answer.questionId === category.questions.or?.id
        );

        if (eitherAnswer) {
          category.questions.either.sub_question =
            category.questions.either.sub_question.map((subQuestion) => {
              const userAnswer = filteredAnswers.find(
                (answer) =>
                  answer.questionId === category.questions.either.id &&
                  answer.subQuestionId === subQuestion.id
              );

              return {
                ...subQuestion,
                user_answer: userAnswer ? userAnswer.selectedValue : null,
                user_score: userAnswer ? userAnswer.selectedScore : null,
                maxScore: subQuestion.maxScore,
              };
            });
        } else if (orAnswer) {
          category.questions.or.sub_question =
            category.questions.or.sub_question.map((subQuestion) => {
              const userAnswer = filteredAnswers.find(
                (answer) =>
                  answer.questionId === category.questions.or.id &&
                  answer.subQuestionId === subQuestion.id
              );

              return {
                ...subQuestion,
                user_answer: userAnswer ? userAnswer.selectedValue : null,
                user_score: userAnswer ? userAnswer.selectedScore : null,
                maxScore: subQuestion.maxScore,
              };
            });
        }
      } else {
        category.questions.sub_questions = category.questions.sub_questions.map(
          (subQuestion) => {
            const userAnswer = filteredAnswers.find(
              (answer) =>
                answer.questionId === category.questions.id &&
                answer.subQuestionId === subQuestion.id
            );

            return {
              ...subQuestion,
              user_answer: userAnswer ? userAnswer.selectedValue : null,
              user_score: userAnswer ? userAnswer.selectedScore : null,
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

    if (!GROQ_API_KEY) {
      setError("API key is missing. Please check your environment variables.");
      console.log(error);

      setIsLoading(false);
      return;
    }

    try {
      // Filter answers by examID and subjectName
      const filteredAnswers = answers.filter(
        (answer) =>
          answer.examID === examID && answer.subjectName === subjectName
      );

      // console.log("filteredAnswers :", filteredAnswers);

      const totalPossibleMarks = totalMarksMap[subjectName.toLowerCase()] || 0;
      const updatedQuestions = formattedSelectedQuestions(
        selectedQuestions,
        answers
      );

      const updatedData = await Promise.all(
        updatedQuestions.map(async (section) => {
          const subQuestions = await Promise.all(
            section.questions.sub_questions.map(async (subQuestion) => {
              const { user_answer, correctAnswers, scoreCriteria, maxScore } =
                subQuestion;

              if (!user_answer) {
                return {
                  ...subQuestion,
                  user_score: 0,
                  comment: "No answer provided",
                };
              }

              try {
                const response = await fetch(
                  "https://api.groq.com/openai/v1/chat/completions",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${GROQ_API_KEY}`,
                    },
                    body: JSON.stringify({
                      model: "llama3-8b-8192",
                      messages: [
                        {
                          role: "system",
                          content:
                            "You are an exam evaluator. Evaluate answers for correctness and similarity to the provided correct answers. Always respond in this format: 'Score: X\nBadge: Y\nComment: Z' where X is a number, Y is one of: Fail, Tried, Need Improvement, Correct, and Z is a brief comment/explanation of why (I) the leaner received that score based on the scoring criteria and correct Answer. Award full marks if the user's answer conveys the same meaning as the correct answer, even if phrased differently. Award partial marks  if the answer is close but lacks a key element. Provide constructive feedback on how the user can improve.",
                        },
                        {
                          role: "user",
                          content: `
                          Main Question: "${section.questions.question}"
                          Sub-Question: "${subQuestion.examQuestion}"
                          Correct Answers: ${correctAnswers.join(", ")}
                          User's Answer: "${user_answer}"
                          Scoring Criteria: ${scoreCriteria.join(", ")}
                          Maximum Score: ${maxScore}
                          
                          Instructions: Evaluate the user's answer based on its semantic similarity to the correct answers and adherence to the scoring criteria. Consider phrasing and correctness. Always respond in this format:
                          
                          "Score: X
                          Badge: Y
                          Comment: Z"
                          
                          Where X is the awarded score, Y is one of (Fail, Tried, Need Improvement, Correct), and Z is a brief explanation of why the score was awarded based on my answer, the correct answers, and the scoring criteria(use second person phrasing for-example: "your answer ......, your response ....., you ....., you stated").
                          `,
                        },
                      ],
                      temperature: 0.1,
                    }),
                  }
                );

                if (!response.ok)
                  throw new Error(`API error: ${response.status}`);

                const result = await response.json();
                // console.log("result:", result);

                const gptResponse = result.choices?.[0]?.message?.content;
                if (!gptResponse) throw new Error("Invalid API response");

                const score = parseInt(
                  gptResponse.match(/Score:\s*(\d+)/i)?.[1] || 0,
                  10
                );
                const badge =
                  gptResponse.match(
                    /Badge:\s*(Fail|Tried|Need Improvement|Correct)/i
                  )?.[1] || "Error parsing response";

                const comment =
                  gptResponse.match(/Comment:\s*(.*?)$/i)?.[1] ||
                  "No comment provided";

                return {
                  ...subQuestion,
                  user_score: score,
                  badge,
                  comment,
                };
              } catch (error) {
                console.error("Error processing answer:", error);
                return {
                  ...subQuestion,
                  user_score: 0,
                  badge: `Error: ${error.message}`,
                  comment: `Error: ${error.message}`,
                };
              }
            })
          );

          return {
            ...section,
            questions: { ...section.questions, sub_questions: subQuestions },
          };
        })
      );

      // console.log("updated Data:", updatedData);

      // Calculate total marks for the filtered answers
      const totalMarks = updatedData.reduce((total, item) => {
        // Extract sub_questions
        const subQuestions = item.questions.sub_questions;

        // Sum up user_score for each sub_question
        const subQuestionsScore = subQuestions.reduce(
          (subTotal, subQuestion) => subTotal + subQuestion.user_score,
          0
        );

        return total + subQuestionsScore;
      }, 0);

      const resultsString = JSON.stringify(updatedData);

      // Prepare userResultsData for submission
      const userResultsData = {
        studID: studentID,
        marks: totalMarks,
        subject: subjectName,
        results: resultsString,
        totalPossibleMarks: totalPossibleMarks,
        dateTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      };

      console.log("User Results Data:", userResultsData);

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

      const questionsData = updatedData;
      navigate("/practical-results", {
        state: {
          filteredAnswers,
          questionsData,
          subjectName,
          totalMarks,
          totalPossibleMarks,
          attemptDate,
        },
      });

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
          <FontAwesomeIcon icon={faSave} /> Submit Practical Exam
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

export default UcePracticalSaveButton;
