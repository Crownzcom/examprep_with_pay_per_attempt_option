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
import db from "../../db.js";
import { useSectionB } from "../../context/pleSectionBContext.js";

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
  const { sectionBAnswers } = useSectionB();
  const [isProcessing, setIsProcessing] = useState(false)

  console.log(`section B Answers:`, sectionBAnswers);
  
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
      console.log("Document created successfully:", result);
      return result;
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
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
    // if(questionType === "iframe") {
    //   return getIframeAnswer(questionId);
    // }

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

  // const getIframeAnswer = (questionId) => {
  //   const iframe = document.querySelector(`iframe[data-question-id="${questionId}"]`);
  //   if (iframe && iframe.contentDocument) {
  //     return iframe.contentDocument.documentElement.outerHTML; // Save marked HTML
  //   }
  //   return null;
  // };

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

  const processSectionBAnswers = () => {
    // Check if we have section B answers
    if (!sectionBAnswers || sectionBAnswers.length === 0) {
      console.log("No section B answers found");
      return { sectionBResults: [], sectionBMarks: 0 };
    }
    console.log("Processing section B answers:", sectionBAnswers);
    
    // Calculate section B total marks
    let sectionBMarks = 0;
    
    // Process section B answers to the correct format
    const sectionBResults = sectionBAnswers.map(({ category, story, mark }) => {
      // Ensure mark is a number
      const numericMark = parseFloat(mark) || 0;
      sectionBMarks += numericMark;
      
      return {
        category,
        type: "markedHTML", 
        markedHTML: story,
        mark: numericMark
      };
    });

    console.log({"sectionBResults": sectionBAnswers, "sectionBMarks": sectionBMarks});
    
    
    
    return { sectionBResults, sectionBMarks };
  };

  const handleSave = async () => {

    if(isProcessing) {
      console.log("saving is currently going on");
      return
    }

    setIsProcessing(true);

    try {
      console.log("Save button clicked");
      
      // Use Promise to handle the timeout more reliably
      await new Promise(resolve => setTimeout(resolve, 4000));

      
      let attempts = 0;
      while (sectionBAnswers.length === 0 && attempts < 5) {
        console.warn(`⚠️ Waiting for Section B answers... attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec delay
        attempts++;
      }
      
      
      // Format section A answers and get marks
      // Ensure only categories 1-50 are included in formatted answers
      let { formattedAnswers, totalMarks: sectionAMarks, totalPossibleMarks } = formatAnswersForSaving();
      
      // Filter to include only categories 1-50 for English-Language
      if (subjectName === "English-Language") {
        formattedAnswers = formattedAnswers.filter(answer => {
          // Extract category ID from the answer object
          const categoryId = answer.category_Id || answer.category || 0;
          return categoryId <= 50;
        });
        
        console.log("Filtered Section A to include only categories 1-50:", { 
          formattedAnswers: formattedAnswers.length, 
          sectionAMarks 
        });
      }
      
      // const { sectionBResults, sectionBMarks } = processSectionBAnswers();


       let sectionBResults = [];
    let sectionBMarks = 0;

      if (sectionBAnswers.length === 5) {
        
        console.log("Processing Section B answers...");
        ({ sectionBResults, sectionBMarks } = processSectionBAnswers());
      } else {
        console.warn(`⚠️ Skipping Section B processing. Current length: ${sectionBAnswers.length}`);
      }

      
      let finalResults = [...formattedAnswers];
      let finalTotalMarks = sectionAMarks;

      // Always check for and process section B for English-Language
      if (subjectName === "English-Language") {
        console.log("This is English-Language exam, checking for section B");
        // Process section B answers
        console.log(`Section B processing complete: ${sectionBResults.length} answers, ${sectionBMarks} marks`);
        
        if (sectionBResults.length > 0) {
          // Add section B marks to total
          finalTotalMarks += sectionBMarks;
          
          // Add section B results to finalResults
          // Keep the original format that works for your application
          finalResults = [...formattedAnswers, ...sectionBResults];
          
        } else {
          console.log("No section B results to merge");
        }
      }

      console.log("Final results and marks:", { 
        resultsLength: finalResults.length, 
        finalTotalMarks 
      });

      // Prepare data for saving
      const userResultsData = {
        studID: studentID,
        marks: finalTotalMarks,
        subject: subjectName,
        results: JSON.stringify(finalResults),
        totalPossibleMarks: totalPossibleMarks,
        dateTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      };

      console.log("Preparing to save data:", {
        subject: subjectName,
        marks: finalTotalMarks,
        resultObjects: finalResults.length
      });

      // Handle offline/online saving
      if (isOffline) {
        try {
          console.log("Saving to IndexedDB (offline mode)");
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
          console.log("Successfully saved to IndexedDB");
        } catch (e) {
          console.error("Error saving ANSWERS to index db: ", e);
        }
      } else {
        try {
          console.log("Saving to Appwrite (online mode)");
          const result = await createDocument(userResultsData);
          console.log("Save to Appwrite successful:", result);

          if (userInfo.kinEmail) {
            console.log("Sending email to next of kin");
            await sendEmailToNextOfKin(
              userInfo,
              subjectName,
              finalTotalMarks,
              formatDate(new Date())
            );
          }

          console.log("Updating user points");
          await updateUserPoints(1, userInfo.userId);
          await fetchAndUpdateResults(userInfo.userId);
        } catch (e) {
          console.error("Error saving ANSWERS to cloud db:", e);
        }
      }

      // Reset answers in Redux store
      console.log("Resetting answers in Redux store");
      dispatch(resetAnswers());

      // Navigate to answers page
      let attemptDate = formatDate(new Date());
      console.log("Navigating to answers page");
      navigate("/answers", {
        state: {
          questionsData: finalResults,
          subjectName,
          totalMarks: finalTotalMarks,
          totalPossibleMarks,
          attemptDate,
        },
      });
    } catch (error) {
      console.error("Error in handleSave:", error);
    } finally {
      setIsProcessing(false)
    }
};
  
  return (
    <>
          {!disabled ? (
            <Button
              ref={ref}
              onClick={handleSave}
              disabled={disabled || isProcessing}
              variant="primary"
              style={{ display: buttonDisplay ? buttonDisplay : "false" }}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} /> Submit Exam
                </>
              )}
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