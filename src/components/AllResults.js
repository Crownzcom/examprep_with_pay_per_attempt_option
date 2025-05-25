import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faBan,
  faGraduationCap,
  faChartLine,
  faBookOpen,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import "./AllResults.css";
import storageUtil from "../utilities/storageUtil";
import { useAuth } from "../../src/context/AuthContext";
import {
  fetchAndUpdateResults,
  uceFetchAndUpdateResults,
  getTransformedResults,
} from "../utilities/resultsUtil";
import SelectExam from "./SelectExam";
import HeroHeader from "./HeroHeader";

const AllResults = () => {
  const [openSubjects, setOpenSubjects] = useState({}); // State to track the open state of each subject
  const [results, setResults] = useState([]);
  const [refreshResults, setRefreshResults] = useState(false);
  const [currentPage, setCurrentPage] = useState({});

  const itemsPerPage = 5; // Number of results per page
  const userInfo = storageUtil.getItem("userInfo");
  const { educationLevel } = userInfo;
  const navigate = useNavigate();

  const viewResults = (
    subjectName,
    totalMarks,
    attemptDate,
    totalPossibleMarks,
    qtnId
  ) => {
    const isPractical = [
      "chemistry-practical",
      "biology-practical",
      "physics-practical",
    ].includes(subjectName.toLowerCase());

    if (isPractical) {
      navigate("/practical-results", {
        state: {
          subjectName,
          totalMarks,
          totalPossibleMarks,
          attemptDate,
          qtnId,
        },
      });
    } else if (subjectName === "English Language") {
      navigate("/exam-results", { state: { qtnId } });
    } else if (educationLevel === "UCE" && !isPractical) {
      navigate("/view-results", {
        state: {
          subjectName,
          totalMarks,
          totalPossibleMarks,
          attemptDate,
          qtnId,
        },
      });
    } else {
      navigate("/answers", {
        state: {
          subjectName,
          totalMarks,
          totalPossibleMarks,
          attemptDate,
          qtnId,
        },
      });
    }
  };

  const calculatePercentageScore = (totalMarks, totalPossibleMarks) => {
    let totalScore = parseFloat(totalMarks);
    let totalPossibleScore = parseFloat(totalPossibleMarks);
    // console.log(`Total Score: ${totalScore}, Possible Score: ${totalPossibleScore}`);

    if (isNaN(totalScore)) {
      // console.log('Invalid score values');
      return null;
    }

    if (totalPossibleScore === 0 || isNaN(totalPossibleScore)) {
      // console.log('Total possible score is 0, cannot calculate percentage');
      return totalScore;
    }

    let percentage = (totalScore / totalPossibleScore) * 100;
    let roundedPercentage = Math.round(percentage * 10) / 10;
    // console.log('Percentage calculated: ' + roundedPercentage + '%');
    return `${roundedPercentage}`;
  };

  useEffect(() => {
    const userId = userInfo?.userId;
    if (userId) {
      const transformedData = getTransformedResults(userId);
      if (JSON.stringify(transformedData) !== JSON.stringify(results)) {
        setResults(transformedData);
      }
    }
  }, [userInfo, results]); // Only re-run the effect if userInfo or results change

  // Toggle the open state of a subject and reset its pagination
  const toggleSubject = (subject) => {
    setOpenSubjects((prevOpenSubjects) => ({
      ...prevOpenSubjects,
      [subject]: !prevOpenSubjects[subject],
    }));
    setCurrentPage((prevCurrentPage) => ({
      ...prevCurrentPage,
      [subject]: 1, // Reset to first page
    }));
  };

  // Pagination for a specific subject
  const paginate = (subject, pageNumber) => {
    setCurrentPage((prevCurrentPage) => ({
      ...prevCurrentPage,
      [subject]: pageNumber,
    }));
  };

  // Render pagination for a specific subject
  const renderPagination = (subject, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage[subject]}
          onClick={() => paginate(subject, number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  async function updateResults() {
    setRefreshResults(true);
    if (userInfo.educationLevel === "PLE") {
      await fetchAndUpdateResults(userInfo.userId);
    } else {
      await uceFetchAndUpdateResults(userInfo.userId);
    }
    setRefreshResults(false);
    navigate("/all-results");
  }

  //Function to render the Hero-Header
  const renderHeroHeader = () => (
    <HeroHeader>
      <h1 className="display-4">
        <FontAwesomeIcon icon={faGraduationCap} className="me-2" /> Your Exam
        Dashboard
      </h1>
      <p className="lead">
        Ready to ace your exams? Track your progress and take on new challenges!
      </p>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button variant="light" onClick={() => navigate("/exam-page")}>
            <FontAwesomeIcon icon={faBookOpen} className="me-2" />
            Attempt an Exam
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="secondary"
            hidden
            // onClick={() => navigate("/exam-page")} //Navigate to chart page
          >
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            View Statistics
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            variant="dark"
            onClick={updateResults}
            disabled={refreshResults === true}
          >
            {refreshResults ? (
              <Spinner animation="grow" variant="light" />
            ) : (
              "Refresh Results"
            )}
          </Button>
        </Col>
      </Row>
    </HeroHeader>
  );

  // Function to render results for each subject
  const renderResultsForSubject = (subjectResults) => {
    console.log(subjectResults);

    // console.log(JSON.stringify(subjectResults));
    const totalResults = subjectResults.attempts.length;
    const indexOfLastResult =
      (currentPage[subjectResults.subject] || 1) * itemsPerPage;
    const indexOfFirstResult = indexOfLastResult - itemsPerPage;
    const currentSubjectResults = subjectResults.attempts.slice(
      indexOfFirstResult,
      indexOfLastResult
    );

    return (
      <Card className="mb-4" key={subjectResults.subject}>
        <Card.Header
          onClick={() => toggleSubject(subjectResults.subject)}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            {subjectResults.subject === "sst_ple"
              ? "Social Studies"
              : subjectResults.subject === "math_ple"
              ? "Mathematics"
              : subjectResults.subject === "sci_ple"
              ? "Science"
              : subjectResults.subject}
          </span>
          <span>
            {openSubjects[subjectResults.subject] ? (
              <FontAwesomeIcon icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} />
            )}
          </span>
        </Card.Header>
        {openSubjects[subjectResults.subject] && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>Score (%)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentSubjectResults.map((attempt, idx) => {
                  // Calculate the absolute number based on the current page and items per page
                  const absoluteNumber = indexOfFirstResult + idx + 1;
                  return (
                    <tr key={idx}>
                      <td>{absoluteNumber}</td>
                      <td>{attempt.dateTime}</td>
                      <td>
                        {calculatePercentageScore(
                          attempt.score,
                          attempt.totalPossibleMarks
                        )}
                      </td>
                      <td>
                        {attempt.resultDetails ? (
                          <Button
                            // className='btn-cancel'
                            variant="dark"
                            onClick={() =>
                              viewResults(
                                subjectResults.subject,
                                attempt.score,
                                attempt.dateTime,
                                attempt.totalPossibleMarks,
                                attempt.qtnId
                              )
                            } //subjectName, totalMarks, attemptDate, totalPossibleMarks, qtnId
                          >
                            <FontAwesomeIcon icon={faEye} className="me-2" />
                            Exam Results
                          </Button>
                        ) : (
                          <span className="text-muted">
                            <FontAwesomeIcon icon={faBan} className="me-2" />
                            No data
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {renderPagination(subjectResults.subject, totalResults)}
          </>
        )}
      </Card>
    );
  };

  // Check if there are no results
  const noResultsAvailable = results.length === 0;

  return (
    <>
      {renderHeroHeader()}
      <Container fluid>
        <Row>
          {noResultsAvailable ? (
            <>
              <Alert variant="info">
                <Alert.Heading>No Results Available</Alert.Heading>
                <p>
                  It looks like you haven't completed any exams yet.Select any
                  of the exams below to seat for.
                </p>
                <hr />
                <div className="d-flex justify-content-center"></div>
              </Alert>
              <Card>
                <SelectExam />
              </Card>
            </>
          ) : (
            <>
              <Col>
                {
                  results
                    .filter((_, index) => index % 2 === 0)
                    .map(renderResultsForSubject) // Render even indexed items
                }
              </Col>
              <Col lg={6} md={12}>
                {" "}
                {/* Right Column for larger screens, full width for smaller screens */}
                {
                  !noResultsAvailable &&
                    results
                      .filter((_, index) => index % 2 !== 0)
                      .map(renderResultsForSubject) // Render odd indexed items
                }
              </Col>
            </>
          )}
        </Row>
      </Container>
    </>
  );
};

export default AllResults;
