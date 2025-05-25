import React, { useState, useEffect, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetAnswers } from "./redux/actions";
import { Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import {
  databases,
  database_id,
  studentMarksTable_id,
} from "../../appwriteConfig.js";
import useNetworkStatus from "../../hooks/useNetworkStatus.js";
import { fetchAndUpdateResults, formatDate } from "../../utilities/resultsUtil";
import { sendEmailToNextOfKin } from "../../utilities/otherUtils.js";
import { useAuth } from "../../context/AuthContext";
import { useSectionB } from "../../context/pleSectionBContext.js"; 
import db from "../../db.js";
import { object } from "prop-types";

const SaveButton = forwardRef(function UceSaveButton(
  {
    selectedQuestions,
    onSubmit,
    disabled,
    buttonDisplay,
    subject_Name,
    sendBooleanValue,
    data,
  },
  ref
) {
  const [modifiedSelectedQuestions, setModifiedSelectedQuestions] =
    useState(selectedQuestions);
  const isOffline = !useNetworkStatus();
  const dispatch = useDispatch();
  const { userInfo, updateUserPoints, fetchUserPoints } = useAuth();
  let studentID = userInfo.userId;
  const { sectionBAnswers } = useSectionB()

  console.log(`section B Answers:` , sectionBAnswers);
  

  let subjectName;
  if (userInfo.educationLevel === "PLE") {
    subjectName =
      subject_Name === "sst_ple"
        ? "Social Studies"
        : subject_Name === "math_ple"
        ? "Mathematics"
        : subject_Name === "sci_ple"
        ? "Science"
        : "English-Language";
  } else {
    subjectName = subject_Name;
  }

  const navigate = useNavigate();
  const reduxState = useSelector((state) => state.answers);
  // console.log(reduxState);

  // console.log('transformed results:', reduxState)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const assignIds = async () => {
      await assignSubQuestionIds(selectedQuestions);
      setModifiedSelectedQuestions(selectedQuestions);
    };

    assignIds();
  }, [selectedQuestions]);

  const assignSubQuestionIds = async (questions) => {
    questions.forEach((question) => {
      if (question.questions) {
        question.questions.forEach((mainQuestion) => {
          if (
            mainQuestion.sub_questions &&
            !mainQuestion.either &&
            !mainQuestion.or
          ) {
            mainQuestion.sub_questions.forEach((subQuestion, subIndex) => {
              if (!subQuestion.id) {
                subQuestion.id = `${mainQuestion.id}_sub_${subIndex + 1}`;
              }
            });
          }
        });
      }
    });
  };

  const createDocument = async (data) => {
    try {
      setIsLoading(true);
      const result = await databases.createDocument(
        database_id,
        studentMarksTable_id,
        "unique()",
        data
      );
    } catch (error) {
      console.error("Error creating document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMarks = (question, userAnswer) => {
    const { type, answer, mark, sub_questions } = question;
    const correctAnswer = Array.isArray(answer) ? answer : [answer];
    const normalizeGeneral = (value) => String(value).trim().toLowerCase();

    const normalizeText = (value) =>
      String(value)
        .replace(/[\s\.,\-_!@#$%^&*()=+{}[\]\\;:'"<>/?|`~]+/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    let score = 0;
    let maxScore = 0;

    switch (type) {
      case "multipleChoice":
        maxScore = mark || 1;
        if (
          userAnswer &&
          correctAnswer
            .map(normalizeGeneral)
            .includes(normalizeGeneral(userAnswer))
        ) {
          score = mark || 1;
        }
        break;
      case "text":
        maxScore = mark || 1;
        if (
          userAnswer &&
          correctAnswer.map(normalizeText).includes(normalizeText(userAnswer))
        ) {
          score = mark || 1;
        }
        break;
      case "check_box":
        maxScore = mark || correctAnswer.length;
        if (userAnswer && userAnswer.length <= maxScore) {
          userAnswer.forEach((userOption) => {
            if (
              correctAnswer
                .map(normalizeGeneral)
                .includes(normalizeGeneral(userOption))
            ) {
              score += 1;
            }
          });
        }
        break;
      case "dragAndDrop":
        maxScore = mark || 1;
        if (
          Array.isArray(userAnswer) &&
          Array.isArray(correctAnswer) &&
          userAnswer.length === correctAnswer.length
        ) {
          let isCorrect = true;
          for (let i = 0; i < correctAnswer.length; i++) {
            if (
              normalizeGeneral(userAnswer[i]) !==
              normalizeGeneral(correctAnswer[i])
            ) {
              isCorrect = false;
              break;
            }
          }
          if (isCorrect) {
            score = maxScore;
          }
        }
        break;
      default:
        break;
    }

    if (sub_questions) {
      sub_questions.forEach((subQ) => {
        const subResult = calculateMarks(subQ, subQ.user_answer);
        score += subResult.score;
        maxScore += subResult.maxScore;
      });
    }

    return { score, maxScore };
  };

  const findUserAnswer = (questionId, categoryId, questionType) => {

    if(questionType === "iframe") {
      return getIframeAnswer(questionId)
    }

    const reduxAnswers = reduxState.filter(
      (answer) => answer.id === questionId && answer.category === categoryId
    );
    if (reduxAnswers.length === 0) return null;

    switch (questionType) {
      case "multipleChoice":
      case "text":
        return reduxAnswers[reduxAnswers.length - 1].user_answer;
      case "check_box":
        const userAnswer = reduxAnswers[reduxAnswers.length - 1].user_answer;
        const checkedOptions = Object.keys(userAnswer).filter(
          (option) => userAnswer[option]
        );
        return checkedOptions;
      case "dragAndDrop":
        return reduxAnswers[reduxAnswers.length - 1].user_answer;
      default:
        return null;
    }
  };

  const getIframeAnswer = (questionId) => {
    const iframe = document.querySelector(`iframe[data-question-id="${questionId}"]`);
    if (iframe && iframe.contentDocument) {
      return iframe.contentDocument.documentElement.outerHTML; // Save marked HTML
    }
    return null;
  };


  const appendUserAnswersToSubQuestions = (subQuestions, categoryId) => {
    return subQuestions.map((subQ) => ({
      ...subQ,
      user_answer: findUserAnswer(subQ.id, categoryId, subQ.type),
    }));
  };

  const formatAnswersForEitherOrQuestion = (questionPart, categoryId) => {
    return {
      ...questionPart,
      user_answer: findUserAnswer(
        questionPart.id,
        categoryId,
        questionPart.type
      ),
      sub_questions: questionPart.sub_questions
        ? appendUserAnswersToSubQuestions(
            questionPart.sub_questions,
            categoryId
          )
        : [],
    };
  };

  const formatAnswersForSaving = () => {
    let totalMarks = 0;
    let totalPossibleMarks = 0;

    const formattedAnswers = modifiedSelectedQuestions.map((category) => ({
      ...category,
      questions: category.questions
        .flatMap((question) => {
          if (question.either && question.or) {
            const updatedEither = formatAnswersForEitherOrQuestion(
              question.either,
              category.category
            );
            const updatedOr = formatAnswersForEitherOrQuestion(
              question.or,
              category.category
            );

            const partsToInclude = [];
            if (updatedEither.user_answer !== null) {
              const eitherResult = calculateMarks(
                updatedEither,
                updatedEither.user_answer
              );
              partsToInclude.push(updatedEither);
              totalMarks += eitherResult.score;
              totalPossibleMarks += eitherResult.maxScore;
            }
            if (updatedOr.user_answer !== null) {
              const orResult = calculateMarks(updatedOr, updatedOr.user_answer);
              partsToInclude.push(updatedOr);
              totalMarks += orResult.score;
              totalPossibleMarks += orResult.maxScore;
            }
            return partsToInclude;
          } else {
            const updatedQuestion = {
              ...question,
              user_answer: findUserAnswer(
                question.id,
                category.category,
                question.type
              ),
              sub_questions: question.sub_questions
                ? appendUserAnswersToSubQuestions(
                    question.sub_questions,
                    category.category
                  )
                : [],
            };
            const result = calculateMarks(
              updatedQuestion,
              updatedQuestion.user_answer
            );
            totalMarks += result.score;
            totalPossibleMarks += result.maxScore;
            return [updatedQuestion];
          }
        })
        .flat(),
    }));

    console.log("Questions: ", formattedAnswers);

    return { formattedAnswers, totalMarks, totalPossibleMarks };
  };

  const triggerIframeEvaluation = () => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage("callEvaluateAllAnswers", "*");
      }
    });
  };  

  
  const handleSave = async () => {
    triggerIframeEvaluation();

    setTimeout(async () => {
        let { formattedAnswers, totalMarks: sectionAMarks, totalPossibleMarks } = formatAnswersForSaving();

        let finalResults = formattedAnswers;
        let sectionBTotalMarks = 0;

        if (subjectName === "English-Language") {
            // Get Section A (First 50 questions)
            const sectionAResults = formattedAnswers.filter(category => category.category < 51);

            // Process Section B Answers (Iframe results)
            let sectionBResults = sectionBAnswers.map(({ category, story, mark }) => {
                sectionBTotalMarks += mark; // Sum up total marks
                return {
                    category,
                    type: "markedHTML",
                    markedHTML: story,
                    mark
                };
            });

            // Merge Section A and Section B
            finalResults = [...sectionAResults, ...sectionBResults];
        }

        // Calculate final total marks
        const finalTotalMarks = sectionAMarks + sectionBTotalMarks;

        // Prepare data for saving
        const userResultsData = {
            studID: studentID,
            marks: finalTotalMarks,
            subject: subjectName,
            results: JSON.stringify(finalResults),
            totalPossibleMarks: totalPossibleMarks,
            dateTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
        };

        // Handle offline/online saving
        if (isOffline) {
            try {
                let data = {
                    studID: userInfo.userId,
                    studInfo: {
                        firstName: userInfo.firstName,
                        lastName: userInfo.lastName,
                        otherName: userInfo.otherName,
                        educationLevel: userInfo.educationLevel,
                        kinFirstName: userInfo.kinFirstName,
                        kinLastName: userInfo.kinLastName,
                        kinEmail: userInfo.kinEmail,
                    },
                    subject: subjectName,
                    marks: finalTotalMarks,
                    results: JSON.stringify(finalResults),
                    totalPossibleMarks: totalPossibleMarks,
                    dateTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
                    kinEmail: userInfo.kinEmail || null,
                };

                await db.examAnswers.add(data);
            } catch (e) {
                console.error("Error saving ANSWERS to index db: ", e);
            }
        } else {
            try {
                await createDocument(userResultsData);

                if (userInfo.kinEmail) {
                    await sendEmailToNextOfKin(
                        userInfo,
                        subjectName,
                        finalTotalMarks,
                        formatDate(new Date())
                    );
                }

                await updateUserPoints(1, userInfo.userId);
                await fetchAndUpdateResults(userInfo.userId);
            } catch (e) {
                console.error("Error saving ANSWERS to cloud db:", e);
            }
        }

        // Reset answers in Redux store
        dispatch(resetAnswers());

        // Navigate to answers page
        let attemptDate = formatDate(new Date());

        navigate("/answers", {
            state: {
                questionsData: finalResults,
                subjectName,
                totalMarks: finalTotalMarks,
                totalPossibleMarks,
                attemptDate,
            },
        });
    }, 2000);
};

  
  
  return (
    <>
      {!disabled ? (
        <Button
          ref={ref}
          onClick={handleSave}
          disabled={disabled}
          variant="primary"
          style={{ display: buttonDisplay ? buttonDisplay : "false" }}
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
});

export default SaveButton;
