// AnswerContainer.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import UceAnswerContainer from "./uceAnswerContainer";

const UceAnswers = () => {
  const location = useLocation();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const isStudent = userInfo.labels.includes("student");

  const {
    filteredAnswers,
    questionsData,
    subjectName,
    totalMarks,
    attemptDate,
    totalPossibleMarks,
    qtnId,
  } = location.state || {
    filteredAnswers: [],
    questionsData: [],
    subjectName: "",
    totalMarks: 0,
    totalPossibleMarks: null,
    attemptDate: "",
    qtnId: null,
  };

  const [questionData, setQuestionData] = useState(questionsData || []);

  return (
    <Container fluid>
      <UceAnswerContainer
        filteredAnswers={filteredAnswers}
        questionsData={questionData}
        subjectName={subjectName}
        totalMarks={totalMarks}
        attemptDate={attemptDate}
        totalPossibleMarks={totalPossibleMarks}
      />
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

export default UceAnswers;
