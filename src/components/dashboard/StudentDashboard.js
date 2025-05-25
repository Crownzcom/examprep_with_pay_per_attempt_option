import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faEdit } from "@fortawesome/free-solid-svg-icons";
import RecentResults from "../RecentResults";
import UceRecentResults from "../UceRecentResults";
import { useNavigate } from "react-router-dom";
import { getTransformedResults } from "../../utilities/resultsUtil";
import { useAuth } from "../../context/AuthContext";
import ViewUcePractialResults from "../renderAnswer/ViewUcePracticalResults";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [results, setResults] = useState([]);

  const isUce = userInfo.educationLevel === "UCE";

  // To view student results
  function viewResults(
    subjectName,
    totalMarks,
    totalPossibleMarks,
    attemptDate,
    qtnId
  ) {
    const isPractical = [
      "chemistry-practical",
      "biology-practical",
      "physics-practical",
    ].includes(subjectName.toLowerCase());

    if (isPractical) {
      navigate("practical-results", {
        state: {
          questionsData: undefined,
          subjectName,
          totalMarks,
          totalPossibleMarks,
          attemptDate,
          qtnId,
        },
      });
    } else if (isUce && !isPractical) {
      navigate("/view-results", {
        state: {
          questionsData: undefined,
          subjectName,
          totalMarks,
          totalPossibleMarks,
          attemptDate,
          qtnId,
        },
      });
    } else if (subjectName === "English Language") {
      navigate("/exam-results", { state: { qtnId } });
    } else {
      navigate("/answers", {
        state: {
          questionsData: undefined,
          subjectName,
          totalMarks,
          totalPossibleMarks,
          attemptDate,
          qtnId,
        },
      });
    }
  }

  useEffect(() => {
    const userId = userInfo?.userId;
    if (userId) {
      const transformedData = getTransformedResults(userId);
      if (JSON.stringify(transformedData) !== JSON.stringify(results)) {
        setResults(transformedData);
      }
    }
  }, [userInfo, results]);

  const attemptExam = () => {
    navigate("/exam-page");
  };

  return (
    <Row>
      {isUce ? (
        results.some((res) =>
          [
            "chemistry-practical",
            "biology-practical",
            "physics-practical",
          ].includes(res.subjectName?.toLowerCase())
        ) ? (
          <ViewUcePractialResults
            results={results}
            onViewResults={viewResults}
          />
        ) : (
          <UceRecentResults results={results} onViewResults={viewResults} />
        )
      ) : (
        <RecentResults results={results} onViewResults={viewResults} />
      )}
      <Col lg={6}>
        <Card className="mb-4 shadow">
          <Card.Body>
            <Card.Title>Actions</Card.Title>
            <Button
              variant="success"
              className="me-2"
              onClick={() => navigate("/all-results")}
            >
              <FontAwesomeIcon icon={faChartLine} /> View All Results
            </Button>
            <Button variant="warning" onClick={attemptExam}>
              <FontAwesomeIcon icon={faEdit} /> Attempt Exam
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default StudentDashboard;
