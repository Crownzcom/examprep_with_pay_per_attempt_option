// AnswerContainer.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import { useAuth } from "../../context/AuthContext";
import AnswerContainer from './AnswerContainer';
import {
    databases,
    database_id,
    studentMarksTable_id,
    Query,
} from "../../appwriteConfig";

const Answers = () => {
    const location = useLocation();
    const { userInfo } = useAuth();
    const navigate = useNavigate();
    const isStudent = userInfo.labels.includes("student");

    const { questionsData, subjectName, totalMarks, attemptDate, totalPossibleMarks, qtnId } = location.state || { questionsData: [], subjectName: '', totalMarks: 0, totalPossibleMarks: null, attemptDate: '', qtnId: null };

    const [questionData, setQuestionData] = useState(questionsData || []);

    // console.log('Questions data:', questionsData);
    console.log(`qtnID: ${qtnId}\ntotalMarks: ${totalMarks}\ntotalPossibleMarks: ${totalPossibleMarks}\nattemptDate: ${attemptDate}`);

    useEffect(() => {
        if (!questionsData && qtnId) {
            const resultData = async (id) => {
                try {
                    const response = await databases.listDocuments(
                        database_id,
                        studentMarksTable_id,
                        [Query.equal("$id", id)]
                    );
                    const fetchedData = JSON.parse(response.documents[0].results);
                    setQuestionData(fetchedData);
                } catch (error) {
                    console.error("Failed to retrieve student results:", error);
                }
            };

            resultData(qtnId);
        }
    }, [qtnId, questionsData]);

    return (
        <Container fluid>
            <AnswerContainer
                questionsData={questionData}
                subjectName={subjectName}
                totalMarks={totalMarks}
                attemptDate={attemptDate}
                totalPossibleMarks={totalPossibleMarks}
            />
            <Row>
                <Col xs={12} className="" style={{ marginBottom: '1.8rem' }}>
                    <div className="d-flex justify-content-center">
                        {isStudent ? (
                            <ButtonGroup className="w-75">
                                <Button
                                    variant="success"
                                    onClick={() => navigate('/exam-page')}
                                >
                                    Attempt another Exam
                                </Button>
                                <Button
                                    variant="info"
                                    onClick={() => navigate('/')}
                                >
                                    Back to Dashboard
                                </Button>
                            </ButtonGroup>
                        ) : (
                            <ButtonGroup className="w-75">
                                <Button
                                    variant="success"
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="info"
                                    onClick={() => navigate('/')}
                                >
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

export default Answers;
