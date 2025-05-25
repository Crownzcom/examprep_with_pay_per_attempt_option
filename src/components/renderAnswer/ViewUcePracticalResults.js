import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  ListGroup,
  Row,
  Col,
  Button,
  ButtonGroup,
  Badge,
} from "react-bootstrap";
import {
  databases,
  database_id,
  uceStudentMarksTable_id,
  Query,
} from "../../appwriteConfig";
import { useLocation, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useAuth } from "../../context/AuthContext";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import katex from "katex";
import "katex/dist/katex.min.css";

const ViewUcePracticalResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const isStudent = userInfo.labels.includes("student");
  const {
    questionsData = [],
    subjectName = "",
    totalMarks = 0,
    attemptDate = "",
    totalPossibleMarks = null,
    qtnId = null,
  } = location.state || {};

  const [questionData, setQuestionData] = useState(questionsData);
  const [percentageScore, setPercentageScore] = useState("");

  const renderMathHtml = (response) => {
    const formattedResponse = response.replace(/\$(.*?)\$/g, (match, p1) => {
      try {
        return katex.renderToString(p1, { displayMode: true });
      } catch (e) {
        return match;
      }
    });

    return { __html: DOMPurify.sanitize(formattedResponse) };
  };

  const renderHTML = (html) => (
    <div dangerouslySetInnerHTML={renderMathHtml(html)} />
  );

  const calculatePercentageScore = (totalMarks, totalPossibleMarks) => {
    if (!totalPossibleMarks || totalPossibleMarks === 0) return "N/A";
    const percentage = (totalMarks / totalPossibleMarks) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  useEffect(() => {
    if (!questionsData || questionsData.length === 0) {
      const fetchData = async (id) => {
        try {
          const response = await databases.listDocuments(
            database_id,
            uceStudentMarksTable_id,
            [Query.equal("$id", id)]
          );
          const fetchedData = JSON.parse(response.documents[0].results);
          setQuestionData(fetchedData);
        } catch (error) {
          console.error("Failed to retrieve student results:", error);
        }
      };

      if (qtnId) {
        fetchData(qtnId);
      }
    }
  }, [qtnId]);

  useEffect(() => {
    setPercentageScore(
      calculatePercentageScore(totalMarks, totalPossibleMarks)
    );
  }, [totalMarks, totalPossibleMarks]);

  console.log("Questions data:", questionData);

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
        {questionData.map((category, idx) => (
          <div
            key={idx}
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "white",
            }}
          >
            {category?.questions?.question && ( // Ensure question exists before rendering
              <h3
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  gap: "21px",
                  backgroundColor: "white",
                  padding: "20px",
                  gap: "21px",
                  paddingLeft: "20px",
                  border: "1px solid lightgray",
                  borderRadius: "5px",
                  margin: "0",
                  fontSize: "1.2rem",
                }}
              >
                Item {idx + 1}: {renderHTML(category.questions.question)}
              </h3>
            )}
            {category?.questions?.sub_questions?.length > 0 &&
              category.questions.sub_questions.map((subQuestion, subIdx) => {
                return (
                  <div key={subIdx}>
                    <div
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
                      <strong>{renderHTML(subQuestion.examQuestion)}</strong>
                    </div>

                    <div
                      style={{
                        backgroundColor: "white",
                        padding: "20px",
                        paddingLeft: "20px",
                        border: "1px solid lightgray",
                        borderRadius: "5px",
                        margin: "0",
                      }}
                    >
                      <strong>Your response: </strong>{" "}
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
                        {renderHTML(subQuestion?.user_answer || "Not answered")}
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
                            width: "fit-content",
                            margin: "0",
                          }}
                        >
                          <strong>Score:</strong>{" "}
                          {renderHTML(
                            `${subQuestion?.user_score || 0} / ${
                              subQuestion.maxScore || 0
                            }`
                          )}
                        </div>
                        {subQuestion.badge === "Correct" ? (
                          <Badge pill bg="success">
                            Correct
                          </Badge>
                        ) : subQuestion.badge === "Tried" ? (
                          <Badge pill bg="info">
                            Tried
                          </Badge>
                        ) : subQuestion.user_answer >=
                          subQuestion.maxScore * 0.5 ? (
                          <Badge pill bg="warning">
                            Partial
                          </Badge>
                        ) : subQuestion.badge === "Need Improvement" ? (
                          <Badge pill bg="secondary">
                            Needs Improvement
                          </Badge>
                        ) : (
                          <Badge pill bg="danger">
                            Incorrect
                          </Badge>
                        )}
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
                        <strong>Comment:</strong> {subQuestion.comment}
                      </div>
                    </div>

                    {subQuestion.user_score !== subQuestion.maxScore && (
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
                        <strong>Better response:</strong>

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
                          {subQuestion.correctAnswers.map((answer) =>
                            renderHTML(answer)
                          ) || "Not available"}
                        </li>
                      </ul>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </Card>
      <Row>
        <Col xs={12} className="" style={{ marginBottom: "1.8rem" }}>
          <div className="d-flex justify-content-center">
            {isStudent ? (
              <ButtonGroup className="w-75">
                <Button
                  variant="success"
                  onClick={() => navigate("/exam-page")}
                >
                  Attempt another Exam
                </Button>
                <Button variant="info" onClick={() => navigate("/")}>
                  Back to Dashboard
                </Button>
              </ButtonGroup>
            ) : (
              <ButtonGroup className="w-75">
                <Button variant="success" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button variant="info" onClick={() => navigate("/")}>
                  Dashboard
                </Button>
              </ButtonGroup>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ViewUcePracticalResults;
