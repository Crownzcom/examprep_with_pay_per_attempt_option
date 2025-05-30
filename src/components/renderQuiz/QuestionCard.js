// QuestionCard.js
import React, { useEffect, useRef, useState } from "react";
import { Card, ButtonGroup, Button, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import AnswerInput from "./AnswerInput";
import { setUserAnswer, setSelectedOption } from "./redux/actions";
import { isImageUrl } from "./utils";
import { useSectionB } from "../../context/pleSectionBContext";

const QuestionCard = ({
  questionIndex,
  question,
  isEitherOr,
  categoryId,
  setUserAnswer,
  setSelectedOption,
  answers,
}) => {
  // console.log(answers);

  const [selectedOption, setSelectedOptionState] = useState("");
  const iframeRef = useRef(null)
  const { updateSectionBAnswer } = useSectionB();

  // Helper function to convert index to roman numeral
  function indexToRoman(index) {
    const roman = [
      "i",
      "ii",
      "iii",
      "iv",
      "v",
      "vi",
      "vii",
      "viii",
      "ix",
      "x",
      "xi",
      "xii",
      "xiii",
      "xiv",
      "xv",
      "xvi",
      "xvii",
      "xviii",
      "xix",
      "xx",
    ].map((numeral) => `(${numeral})`);
    return roman[index];
  }

  const getUserAnswer = (questionId) => {
    const key = `${categoryId}-${questionId}`;
    return answers[key];
  };

  
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (
        event.origin === window.location.origin ||
        event.origin === "http://localhost:5173" ||
        event.origin === "http://localhost:5500" ||
        event.origin === "http://app.exampreptutor.com"
      ) {
        if(event.data && event.data.userAnswers) {
          const { userAnswers } = event.data;
  
          // Only save answers for categories 51-55
          if (question?.type === "iframe" && categoryId >= 51 && categoryId <= 55 && userAnswers.length > 0) {
            const iframeAnswerData = userAnswers[0]   
            const iframeAnswerData2 = userAnswers       
  
            if(iframeAnswerData) {
              const { story, totalMarks, category } = iframeAnswerData
              const mark = totalMarks
              // Save the complete answer data from the iframe
              updateSectionBAnswer(category,  story, mark 
              );    
              console.log(`Saved Section B answer for category ${categoryId}, question ${question.id}`);
              // console.log("iframeAnswerData", iframeAnswerData);
              console.log("userAnswers", iframeAnswerData2);
              
            }
          }
        }
      }
    }
  
    window.addEventListener("message", handleIframeMessage);
  
    // Clean up on component unmount
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  
  }, [categoryId, question?.id])

  

  const handleAnswerChange = (
    questionId,
    answer,
    questionType,
    subQuestionIndex = null
  ) => {
    let uniqueId =
      subQuestionIndex !== null
        ? `${questionId}_sub_${subQuestionIndex}`
        : questionId;
    setUserAnswer(uniqueId, answer, categoryId, isEitherOr, questionType);
  };

  const handleOptionSelection = (option) => {
    setSelectedOptionState(option);

    let id;
    if (isEitherOr) {
      id = option === "either" ? question.either.id : question.or.id;
      // For either/or questions, update the selected option with the isEitherOr flag
      setSelectedOption(`${id}-selectedOption`, option, categoryId, true);
    } else {
      id = question.id; // For standard questions
      setSelectedOption(`${id}-selectedOption`, option, categoryId, false);
    }
  };

  const renderQuestionText = (questionText, questionImage, questionType) => (
    <>
      <p>
        {questionType === "dragAndDrop" ? (
          <>
            {questionIndex + categoryId}. <span>{questionText.join(" ")}</span>
          </>
        ) : (
          <>
            {questionIndex + categoryId}.{" "}
            <span dangerouslySetInnerHTML={{ __html: questionText }}></span>
          </>
        )}
      </p>
      {questionImage && isImageUrl(questionImage) && (
        <Card
          style={{
            alignItems: "flex-start",
            textAlign: "center",
            margin: "10px 0",
          }}
        >
          <Card.Img
            src={questionImage}
            alt="Question"
            style={{ maxWidth: "20rem", height: "auto" }}
          />
        </Card>
      )}
    </>
  );

  const renderQuestion = (currentQuestion, disabled) => {
    // currentQuestion.sub_questions && console.log('subQ', currentQuestion.sub_questions);
    return (
      <>
        {renderQuestionText(
          currentQuestion.question,
          currentQuestion.image,
          currentQuestion.type
        )}
        <AnswerInput
          question={currentQuestion}
          onChange={(answer) =>
            handleAnswerChange(currentQuestion.id, answer, currentQuestion.type)
          }
          getUserAnswer={getUserAnswer}
          disabled={disabled}
          displayQuestionText={false}
        />
        {currentQuestion.sub_questions &&
          currentQuestion.sub_questions.map((subQ, index) => (
            <AnswerInput
              key={subQ.id ? subQ.id : `${currentQuestion.id}_sub_${index}`}
              question={subQ}
              onChange={(answer) =>
                handleAnswerChange(
                  subQ.id ? subQ.id : currentQuestion.id,
                  answer,
                  subQ.type,
                  subQ.id ? null : index
                )
              } //if subquestion has id assigned, pass it, or else pass the main question id and the subquestion index itself
              getUserAnswer={() =>
                getUserAnswer(
                  subQ.id ? subQ.id : `${currentQuestion.id}_sub_${index}`
                )
              }
              disabled={false}
              displayQuestionText={true}
              questionNumber={indexToRoman(index)}
            />
          ))}
      </>
    );
    // }
  };

  return (
    <ListGroup>
      <ListGroup.Item>
        {isEitherOr ? (
          <>
            <ButtonGroup>
              <Button
                variant={selectedOption === "either" ? "success" : "secondary"}
                onClick={() => handleOptionSelection("either")}
              >
                Either
              </Button>
              <Button
                variant={selectedOption === "or" ? "warning" : "secondary"}
                onClick={() => handleOptionSelection("or")}
              >
                Or
              </Button>
            </ButtonGroup>
            {selectedOption === "either"
              ? renderQuestion(question.either, selectedOption !== "either")
              : renderQuestion(question.or, selectedOption !== "or")}
          </>
        ) : (
          renderQuestion(question, false) // Non either/or question
        )}
      </ListGroup.Item>
    </ListGroup>
  );
};

const mapStateToProps = (state) => ({
  answers: state.answers,
});

const mapDispatchToProps = {
  setUserAnswer,
  setSelectedOption,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionCard);
