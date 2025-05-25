import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Alert } from 'react-bootstrap';
import AnswerCard from './AnswerCard';
import DOMPurify from "dompurify";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import katex from "katex";
import "katex/dist/katex.min.css";


const AnswerContainer = ({ questionsData, subjectName, totalMarks, totalPossibleMarks, attemptDate }) => {
    let subject_Name = subjectName === "sst_ple" ? "Social Studies" : (subjectName === "math_ple" ? "Mathematics" : (subjectName === "sci_ple" ? "Science" : subjectName));

    const [percentageScore, setPercentageScore] = useState('');

    const processMarkedHTML = (htmlContent) => {
        // Create a DOM parser and parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Process radio inputs to show user selections
        const radioInputs = doc.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            // Disable all inputs
            input.setAttribute('disabled', 'true');
            
            // Create a span to visually indicate if this was the user's answer
            const userChoiceIndicator = doc.createElement('span');
            userChoiceIndicator.style.marginLeft = '10px';
            userChoiceIndicator.style.fontWeight = 'bold';
            
            const parentLabel = input.closest('label');
            
            // If this was the user's answer (either explicitly checked or inferred from value)
            if (input.checked || input.getAttribute('checked') === 'checked') {
                // Mark as user's choice
                userChoiceIndicator.textContent = '← YOUR ANSWER';
                userChoiceIndicator.style.color = '#ff6b6b';
                
                if (parentLabel) {
                    parentLabel.style.fontWeight = 'bold';
                    parentLabel.style.backgroundColor = '#ffeeee';
                    parentLabel.style.padding = '5px 8px';
                    parentLabel.style.borderRadius = '5px';
                    parentLabel.style.display = 'block';
                    parentLabel.style.margin = '5px 0';
                    parentLabel.style.borderLeft = '5px solid #ff6b6b';
                    
                    // Add the indicator to the label
                    parentLabel.appendChild(userChoiceIndicator);
                }
            }
        });
        
        // Process text inputs to show user answers
        const textInputs = doc.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            // Find the user's answer from the paragraph with class "user-answer"
            const userAnswerParagraph = input.parentElement.querySelector('.user-answer');
            
            if (userAnswerParagraph) {
                const userAnswer = userAnswerParagraph.textContent.replace('Student Answer: ', '').trim();
                
                // Create a visible display for the user's answer
                const userAnswerDisplay = doc.createElement('div');
                userAnswerDisplay.style.margin = '5px 0';
                userAnswerDisplay.style.padding = '8px';
                userAnswerDisplay.style.backgroundColor = '#ffeeee';
                userAnswerDisplay.style.borderLeft = '5px solid #ff6b6b';
                userAnswerDisplay.style.borderRadius = '5px';
                userAnswerDisplay.style.fontWeight = 'bold';
                
                // Add the user's answer to the display
                if (userAnswer) {
                    userAnswerDisplay.innerHTML = `<span style="color: #ff6b6b;">YOUR ANSWER:</span> "${userAnswer}"`;
                    
                    // Replace the input with the user answer display
                    input.parentNode.insertBefore(userAnswerDisplay, input.nextSibling);
                }
            }
            
            // Hide the original input
            input.style.display = 'none';
        });
        
        // Convert back to string
        return new XMLSerializer().serializeToString(doc.body);
    };

    const renderMathHtml = (response) => {
        // First process the HTML to handle user selections
        let processedHTML = response;
        if (response && response.includes('<input')) {
            processedHTML = processMarkedHTML(response);
        }
        
        // Then handle math expressions
        const formattedResponse = processedHTML?.replace(/\$(.*?)\$/g, (match, p1) => {
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

    useEffect(() => {
        const calculatePercentageScore = () => {
            console.log('Answers: ', questionsData)
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
            return `${roundedPercentage} %`;
        };

        if (totalMarks && totalPossibleMarks) {
            setPercentageScore(calculatePercentageScore());
        }
    }, [totalMarks, totalPossibleMarks]); // Dependency array to re-calculate when marks change

    return (
        <Container>
            <Card className="my-4">
                <Card.Header>Exam Results</Card.Header>
                <Card.Body>
                    <Card.Subtitle>
                        <ListGroup as="ol">
                            {subject_Name && (
                                <ListGroup.Item as="li">Subject: <span>{subject_Name}</span></ListGroup.Item>
                            )}
                            {percentageScore && (
                                <ListGroup.Item as="li">Score: <span>{percentageScore}</span></ListGroup.Item>
                            )}
                            {attemptDate && (
                                <ListGroup.Item as="li">Date of Exam Submission: <span>{attemptDate}</span></ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card.Subtitle>
                </Card.Body>
            </Card>
                {questionsData.map((category, index) => (
                    <Card key={index} style={{ margin: "5px" }}>
                        {/* Handle normal categories (1 to 50) */}
                        {subjectName === "English-Language" && category.category >= 51 && category.category <= 55 ? (
                            // Special case for English-Language categories 51-55
                            <div>  
                                <div>{category.category}</div>
                                <div style={{
                                    backgroundColor: "white",
                                    padding: "15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    marginBottom: "20px",
                                }}>
                                    <div dangerouslySetInnerHTML={renderMathHtml(category.markedHTML)} />
                                </div>
                                <p role='alert' className='fade ms-2 alert alert-primary show' style={{width: 'fit-content'}}><strong>score:</strong> {category.mark} / 10</p>
                            </div>
                        ) : (
                            // Normal rendering for categories 1-50 and all other subjects
                            <>
                                <p style={{
                                     backgroundColor: "#f5f5f5",
                                     padding: "10px",
                                     marginBottom: "20px",
                                     borderLeft: "4px solid #4285f4",
                                }}>{renderHTML(category.instructions)}</p>
                                {category.questions.length === 0 ? (
                                    <Alert>No questions attempted</Alert>
                                ) : (
                                    category.questions.map((question, questionIndex) => (
                                        <React.Fragment key={questionIndex}>
                                            <div>{category.category + questionIndex}</div>
                                            <AnswerCard
                                                key={question.id || `${category.$id}_${questionIndex}`}
                                                category_Id={category.category}
                                                questionIndex={questionIndex}
                                                resultsData={question}
                                            />
                                        </React.Fragment>
                                    ))
                                )}
                            </>
                        )}
                    </Card>
            ))}
            
            {/* Add some global styling */}
            <style jsx global>{`
                .user-answer-highlight {
                    background-color: #ffeeee !important;
                    border-left: 5px solid #ff6b6b !important;
                    padding: 8px !important;
                    margin: 5px 0 !important;
                    border-radius: 5px !important;
                    font-weight: bold !important;
                }
            `}</style>
        </Container>
    );
};

export default AnswerContainer;