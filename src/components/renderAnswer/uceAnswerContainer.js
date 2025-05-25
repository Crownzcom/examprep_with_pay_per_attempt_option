import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Badge } from "react-bootstrap";
import DOMPurify from "dompurify";

const UceAnswerContainer = ({
  filteredAnswers,
  questionsData,
  subjectName,
  totalMarks,
  totalPossibleMarks,
  attemptDate,
}) => {
  const [percentageScore, setPercentageScore] = useState("");

  useEffect(() => {
    const calculatePercentageScore = () => {
      let totalScore = parseFloat(totalMarks);
      let totalPossibleScore = parseFloat(totalPossibleMarks);
      if (
        isNaN(totalScore) ||
        isNaN(totalPossibleScore) ||
        totalPossibleScore === 0
      ) {
        return totalScore;
      }
      let percentage = (totalScore / totalPossibleScore) * 100;
      return `${Math.round(percentage * 10) / 10} %`;
    };

    if (totalMarks && totalPossibleMarks) {
      setPercentageScore(calculatePercentageScore());
    }
  }, [totalMarks, totalPossibleMarks]);

  const renderHTML = (html) => (
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
  );

  const renderSubQuestions = (subQuestions, answers, questionId) => {
    return subQuestions.map((subQuestion, subIdx) => {
      const userAnswer = answers.find(
        (answer) =>
          answer.questionId === questionId && answer.subQuestionId === subIdx
      );

      const userScore = userAnswer ? userAnswer.selectedScore : 0;
      const maxScore = subQuestion.maxScore || 0;
      const isScoreEqual = userScore === maxScore;

      // Find the comment associated with the user answer
      const matchedAnswer = subQuestion.answer.find((answerItem) => {
        return answerItem.response_criteria.some((criteria) => {
          return (
            criteria.response === userAnswer?.selectedValue &&
            userScore === answerItem.score
          );
        });
      });

      const matchedCriteria = matchedAnswer
        ? matchedAnswer.response_criteria.find(
            (criteria) => criteria.response === userAnswer?.selectedValue
          )
        : null;

      const comment = matchedCriteria
        ? matchedCriteria.comment
        : "No comment available";

      return (
        <div key={subIdx} style={{ marginBottom: "20px" }}>
          <div
            style={{
              backgroundColor: "white",
              gap: "21px",
              borderRadius: "5px",
            }}
          >
            <p
              style={{
                backgroundColor: "white",
                padding: "20px",
                gap: "21px",
                paddingLeft: "20px",
                border: "1px solid lightgray",
                borderRadius: "5px",
                display: "flex",
                margin: "0",
              }}
            >
              <strong>{String.fromCharCode(97 + subIdx)})</strong>{" "}
              {renderHTML(subQuestion.question)}
            </p>
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                gap: "21px",
                paddingLeft: "20px",
                border: "1px solid lightgray",
                borderRadius: "5px",
                margin: "0",
              }}
            >
              <strong>Your response:</strong>{" "}
              <div
                style={{
                  padding: "20px",
                  border: "1px solid rgb(249, 249, 249)",
                  borderColor: "1px solid rgb(249, 249, 249)",
                  backgroundColor: "#F9F9F9",
                  borderRadius: "5px",
                  margin: "10px",
                }}
              >
                {renderHTML(userAnswer?.selectedValue || "No option selected")}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: "0 10px",
                }}
              >
                <div
                  role="alert"
                  className="fade alert alert-primary show"
                  style={{
                    display: "flex",
                    gap: "10px",
                    margin: "0",
                  }}
                >
                  <strong>Score:</strong> {userScore} / {maxScore}
                </div>
                <div>
                  {isScoreEqual ? (
                    <Badge pill bg="success">
                      Correct
                    </Badge>
                  ) : userScore >= maxScore * 0.8 ? (
                    <Badge pill bg="info">
                      Almost There
                    </Badge>
                  ) : userScore >= maxScore * 0.5 ? (
                    <Badge pill bg="warning">
                      Partial
                    </Badge>
                  ) : userScore > 0 ? (
                    <Badge pill bg="secondary">
                      Needs Improvement
                    </Badge>
                  ) : (
                    <Badge pill bg="danger">
                      Incorrect
                    </Badge>
                  )}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#6c757d",
                  padding: "10px",
                  marginTop: "10px",
                  borderRadius: "5px",
                  color: "#fff",
                }}
              >
                <strong>Comment:</strong> {comment}
              </div>
            </div>

            {userScore < maxScore && (
              <ul
                style={{
                  backgroundColor: "white",
                  paddingTop: "20px",
                  gap: "21px",
                  border: "1px solid lightgray",
                  borderRadius: "5px",
                  listStyle: "none",
                }}
              >
                <h5>
                  <strong>Better Responses:</strong>
                </h5>
                {subQuestion.answer[0].response_criteria.map(
                  (criteria, idx) => (
                    <li
                      key={idx}
                      style={{
                        padding: "20px",
                        paddingLeft: "20px",
                        border: "1px solid #F9F9F9",
                        borderRadius: "5px",
                        margin: "10px",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      {renderHTML(criteria.response)}
                    </li>
                  )
                )}
                {/* <h5>
                  <strong>Better Response:</strong>
                </h5>
                {subQuestion.answer[0].response_criteria
                  .filter((criteria) => criteria.isCorrect)
                  .map((criteria, idx) => (
                    <li
                      key={idx}
                      style={{
                        padding: "20px",
                        paddingLeft: "20px",
                        border: "1px solid #F9F9F9",
                        borderRadius: "5px",
                        margin: "10px",
                        backgroundColor: "#F9F9F9",
                      }}
                    >
                      {renderHTML(criteria.response)}
                    </li>
                  ))} */}
              </ul>
            )}
          </div>
        </div>
      );
    });
  };

  const isEnglish = subjectName.toLowerCase() === "english";

  return (
    <Container>
      <Card className="my-4">
        <Card.Header>Exam Results</Card.Header>
        <Card.Body>
          <Card.Subtitle>
            <ListGroup as="ol">
              {subjectName && (
                <ListGroup.Item as="li">
                  Subject: <span>{subjectName}</span>
                </ListGroup.Item>
              )}
              {percentageScore && (
                <ListGroup.Item as="li">
                  Score: <span>{percentageScore}</span>
                </ListGroup.Item>
              )}
              {attemptDate && (
                <ListGroup.Item as="li">
                  Date of Exam Submission: <span>{attemptDate}</span>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Subtitle>
        </Card.Body>
      </Card>

      <Card className="my-4">
        {(isEnglish ? questionsData.slice(0, 2) : questionsData).map(
          (category, idx) => (
            <div
              key={idx}
              style={{
                marginTop: "20px",
                padding: "20px",
                backgroundColor: "white",
              }}
            >
              <h3
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  gap: "21px",
                  backgroundColor: "white",
                  padding: "20px",
                  paddingLeft: "20px",
                  border: "1px solid lightgray",
                  borderRadius: "5px",
                  margin: "0",
                }}
              >
                Item {idx + 1}: {renderHTML(category.questions.question)}
              </h3>
              {renderSubQuestions(
                category.questions.sub_questions,
                filteredAnswers,
                category.questions.id
              )}
            </div>
          )
        )}
        {/* Render the third English question if applicable */}
        {isEnglish && questionsData.length > 2 && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "white",
            }}
          >
            <h3
              style={{
                display: "flex",
                gap: "21px",
                backgroundColor: "white",
                padding: "20px",
                paddingLeft: "20px",
                border: "1px solid lightgray",
                borderRadius: "5px",
                margin: "0",
              }}
            >
              Item 3:{" "}
              {renderHTML(
                questionsData[2].questions.either?.question ||
                  questionsData[2].questions.or?.question
              )}
            </h3>
            {questionsData[2].questions.either?.sub_question.some(
              (subQuestion) => subQuestion.user_answer
            ) &&
              renderSubQuestions(
                questionsData[2].questions.either.sub_question,
                filteredAnswers,
                questionsData[2].questions.id
              )}
            {questionsData[2].questions.or?.sub_question.some(
              (subQuestion) => subQuestion.user_answer
            ) &&
              renderSubQuestions(
                questionsData[2].questions.or.sub_question,
                filteredAnswers,
                questionsData[2].questions.id
              )}
          </div>
        )}
      </Card>
    </Container>
  );
};

export default UceAnswerContainer;
