// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   ListGroup,
//   Row,
//   Col,
//   Button,
//   ButtonGroup,
//   Badge,
// } from "react-bootstrap";
// import {
//   databases,
//   database_id,
//   uceStudentMarksTable_id,
//   Query,
// } from "../../appwriteConfig";
// import { useLocation, useNavigate } from "react-router-dom";
// import DOMPurify from "dompurify";
// import { useAuth } from "../../context/AuthContext";
// import { MathJax, MathJaxContext } from "better-react-mathjax";
// import katex from "katex";
// import "katex/dist/katex.min.css";

// const ViewUceResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { userInfo } = useAuth();

//   const isStudent = userInfo.labels.includes("student");
//   const {
//     questionsData = [],
//     subjectName = "",
//     totalMarks = 0,
//     attemptDate = "",
//     totalPossibleMarks = null,
//     qtnId = null,
//   } = location.state || {};

//   const [questionData, setQuestionData] = useState(questionsData);

//   const renderMathHtml = (response) => {
//     const formattedResponse = response.replace(/\$(.*?)\$/g, (match, p1) => {
//       try {
//         return katex.renderToString(p1, { displayMode: true });
//       } catch (e) {
//         return match;
//       }
//     });

//     return { __html: DOMPurify.sanitize(formattedResponse) };
//   };

//   const renderHTML = (html) => (
//     <div dangerouslySetInnerHTML={renderMathHtml(html)} />
//   );

//   useEffect(() => {
//     if (!questionsData || questionsData.length === 0) {
//       const fetchData = async (id) => {
//         try {
//           const response = await databases.listDocuments(
//             database_id,
//             uceStudentMarksTable_id,
//             [Query.equal("$id", id)]
//           );
//           const fetchedData = JSON.parse(response.documents[0].results);
//           setQuestionData(fetchedData);
//         } catch (error) {
//           console.error("Failed to retrieve student results:", error);
//         }
//       };

//       if (qtnId) {
//         fetchData(qtnId);
//       }
//     }
//   }, [qtnId]);

//   console.log("Questions data:", questionData);

//   const isEnglish = subjectName.toLowerCase() === "english";
//   const isMath = subjectName.toLowerCase() === "mathematics";
//   const isGeo = subjectName.toLowerCase() === "geography";
//   const isBio = subjectName.toLowerCase() === "biology";

//   return (
//     <Container>
//       <Card className="my-4">
//         <Card.Header>Exam Results</Card.Header>
//         <Card.Body>
//           <Card.Subtitle>
//             <ListGroup as="ol">
//               {subjectName && (
//                 <ListGroup.Item as="li">
//                   Subject: <span>{subjectName}</span>
//                 </ListGroup.Item>
//               )}
//               {attemptDate && (
//                 <ListGroup.Item as="li">
//                   Date of Exam Submission: <span>{attemptDate}</span>
//                 </ListGroup.Item>
//               )}
//             </ListGroup>
//           </Card.Subtitle>
//         </Card.Body>
//       </Card>
//       <Card className="my-4">
//         {(isEnglish || isMath || isGeo
//           ? questionData.slice(0, 2)
//           : questionData
//         ).map((category, idx) => (
//           <div
//             key={idx}
//             style={{
//               marginTop: "20px",
//               padding: "20px",
//               backgroundColor: "white",
//             }}
//           >
//             {category?.questions?.question && ( // Ensure question exists before rendering
//               <h3
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "auto auto",
//                   gap: "21px",
//                   backgroundColor: "white",
//                   padding: "20px",
//                   gap: "21px",
//                   paddingLeft: "20px",
//                   border: "1px solid lightgray",
//                   borderRadius: "5px",
//                   margin: "0",
//                   fontSize: "1.2rem",
//                 }}
//               >
//                 Qn {idx + 1}: {renderHTML(category.questions.question)}
//               </h3>
//             )}
//             {category?.questions?.sub_questions?.length > 0 &&
//               category.questions.sub_questions.map((subQuestion, subIdx) => {
//                 const isScoreEqual =
//                   subQuestion?.user_score === subQuestion?.maxScore;
//                 const userScore = subQuestion?.user_score || 0;
//                 const maxScore = subQuestion?.maxScore || 0;

//                 // Find the comment associated with the user answer
//                 const matchedAnswer = subQuestion.answer.find((answerItem) => {
//                   return answerItem.response_criteria.some((criteria) => {
//                     return (
//                       criteria.response === subQuestion.user_answer &&
//                       subQuestion.user_score === answerItem.score
//                     );
//                   });
//                 });

//                 const matchedCriteria = matchedAnswer
//                   ? matchedAnswer.response_criteria.find(
//                       (criteria) =>
//                         criteria.response === subQuestion.user_answer
//                     )
//                   : null;

//                 const comment = matchedCriteria
//                   ? matchedCriteria.comment
//                   : "No comment available";

//                 return (
//                   <div key={subIdx}>
//                     <div
//                       style={{
//                         backgroundColor: "white",
//                         padding: "20px",
//                         gap: "21px",
//                         paddingLeft: "20px",
//                         border: "1px solid lightgray",
//                         borderRadius: "5px",
//                         display: "flex",
//                         margin: "0",
//                       }}
//                     >
//                       <strong>{String.fromCharCode(97 + subIdx)})</strong>{" "}
//                       <strong>{renderHTML(subQuestion.question)}</strong>
//                     </div>

//                     <div
//                       style={{
//                         backgroundColor: "white",
//                         padding: "20px",
//                         paddingLeft: "20px",
//                         border: "1px solid lightgray",
//                         borderRadius: "5px",
//                         margin: "0",
//                       }}
//                     >
//                       <strong>Your response: </strong>{" "}
//                       <div
//                         style={{
//                           padding: "20px",
//                           border: "1px solid rgb(249, 249, 249)",
//                           borderColor: "1px solid rgb(249, 249, 249)",
//                           backgroundColor: "#F9F9F9",
//                           borderRadius: "5px",
//                           margin: "10px",
//                         }}
//                       >
//                         {renderHTML(
//                           subQuestion?.user_answer || "No option selected"
//                         )}
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           margin: "0 10px",
//                         }}
//                       >
//                         <div
//                           role="alert"
//                           className="fade alert alert-primary show"
//                           style={{
//                             display: "flex",
//                             gap: "10px",
//                             width: "fit-content",
//                             margin: "0",
//                           }}
//                         >
//                           <strong>Score:</strong>{" "}
//                           {renderHTML(
//                             `${subQuestion?.user_score || 0} / ${
//                               subQuestion.maxScore || 0
//                             }`
//                           )}
//                         </div>
//                         {userScore === maxScore ? (
//                           <Badge pill bg="success">
//                             Correct
//                           </Badge>
//                         ) : userScore >= maxScore * 0.8 ? (
//                           <Badge pill bg="info">
//                             Almost There
//                           </Badge>
//                         ) : userScore >= maxScore * 0.5 ? (
//                           <Badge pill bg="warning">
//                             Partial
//                           </Badge>
//                         ) : userScore > 0 ? (
//                           <Badge pill bg="secondary">
//                             Needs Improvement
//                           </Badge>
//                         ) : (
//                           <Badge pill bg="danger">
//                             Incorrect
//                           </Badge>
//                         )}
//                       </div>
//                       <div
//                         style={{
//                           backgroundColor: "#6c757d",
//                           padding: "10px",
//                           marginTop: "10px",
//                           borderRadius: "5px",
//                           color: "#fff",
//                         }}
//                       >
//                         <strong>Comment:</strong> {comment}
//                       </div>
//                     </div>

//                     {!isScoreEqual && (
//                       <ul
//                         style={{
//                           backgroundColor: "white",
//                           paddingTop: "20px",
//                           gap: "21px",
//                           border: "1px solid lightgray",
//                           borderRadius: "5px",
//                           listStyle: "none",
//                         }}
//                       >
//                         <strong>Better response:</strong>

//                         <li
//                           key={idx}
//                           style={{
//                             padding: "20px",
//                             paddingLeft: "20px",
//                             border: "1px solid #F9F9F9",
//                             borderRadius: "5px",
//                             margin: "10px",
//                             backgroundColor: "#F9F9F9",
//                           }}
//                         >
//                           {renderHTML(
//                             subQuestion.correct_answer || "Not available"
//                           )}
//                         </li>
//                       </ul>
//                     )}
//                   </div>
//                 );
//               })}
//           </div>
//         ))}
//         {(subjectName.toLowerCase() === "english" ||
//           subjectName.toLowerCase() === "mathematics" ||
//           subjectName.toLowerCase() === "geography") &&
//           questionData.slice(2, 3).map((category, idx) => {
//             // Check if the user answered either or or
//             const eitherAnswered = category.questions.either?.sub_question.some(
//               (subQuestion) => subQuestion.user_answer
//             );
//             const orAnswered = category.questions.or?.sub_question.some(
//               (subQuestion) => subQuestion.user_answer
//             );

//             // Determine if the answered question is from either or or
//             const answeredQuestions = eitherAnswered
//               ? category.questions.either.sub_question
//               : category.questions.or.sub_question;

//             return (
//               <div
//                 key={idx}
//                 style={{
//                   marginTop: "20px",
//                   padding: "20px",
//                   backgroundColor: "white",
//                 }}
//               >
//                 {/* Render the correct main question based on which was answered */}
//                 <h3
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "auto auto",
//                     gap: "21px",
//                     backgroundColor: "white",
//                     padding: "20px",
//                     paddingLeft: "20px",
//                     border: "1px solid lightgray",
//                     borderRadius: "5px",
//                     margin: "0",
//                     fontSize: "1.2rem",
//                   }}
//                 >
//                   Qn {eitherAnswered ? idx + 3 : idx + 4}:{" "}
//                   {eitherAnswered
//                     ? renderHTML(category.questions.either.question)
//                     : renderHTML(category.questions.or.question)}
//                 </h3>

//                 {/* Render only the answered sub-question */}
//                 {answeredQuestions.map((subQuestion, subIdx) => {
//                   if (subQuestion.user_answer) {
//                     const userAnswer =
//                       subQuestion.user_answer || "No option selected";
//                     const userScore = subQuestion.user_score || 0;
//                     const maxScore = subQuestion.maxScore || 11;

//                     const isScoreEqual = userScore === maxScore;

//                     const matchedAnswer = subQuestion.answer.find(
//                       (answerItem) =>
//                         answerItem.response_criteria.some(
//                           (criteria) =>
//                             criteria.response === subQuestion.user_answer &&
//                             subQuestion.user_score === answerItem.score
//                         )
//                     );

//                     const matchedCriteria = matchedAnswer
//                       ? matchedAnswer.response_criteria.find(
//                           (criteria) =>
//                             criteria.response === subQuestion.user_answer
//                         )
//                       : null;

//                     const comment = matchedCriteria
//                       ? matchedCriteria.comment
//                       : "No comment available";

//                     return (
//                       <div key={subIdx}>
//                         <div
//                           style={{
//                             backgroundColor: "white",
//                             padding: "20px",
//                             paddingLeft: "20px",
//                             border: "1px solid lightgray",
//                             borderRadius: "5px",
//                             margin: "0",
//                             display: "flex",
//                             gap: "21px",
//                           }}
//                         >
//                           <strong>{String.fromCharCode(97 + subIdx)})</strong>{" "}
//                           <strong>{renderHTML(subQuestion.question)}</strong>
//                         </div>

//                         <div
//                           style={{
//                             backgroundColor: "white",
//                             padding: "20px",
//                             paddingLeft: "20px",
//                             border: "1px solid lightgray",
//                             borderRadius: "5px",
//                             margin: "0",
//                           }}
//                         >
//                           <strong>Your response: </strong>{" "}
//                           <div
//                             style={{
//                               padding: "20px",
//                               border: "1px solid rgb(249, 249, 249)",
//                               backgroundColor: "#F9F9F9",
//                               borderRadius: "5px",
//                               margin: "10px",
//                             }}
//                           >
//                             {renderHTML(userAnswer)}
//                           </div>
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               margin: "0 10px",
//                             }}
//                           >
//                             <div
//                               role="alert"
//                               className="fade alert alert-primary show"
//                               style={{
//                                 display: "flex",
//                                 gap: "10px",
//                                 width: "fit-content",
//                                 margin: "0",
//                               }}
//                             >
//                               <strong>Score:</strong>{" "}
//                               {renderHTML(`${userScore} / ${maxScore}`)}
//                             </div>
//                             {userScore === maxScore ? (
//                               <Badge pill bg="success">
//                                 Correct
//                               </Badge>
//                             ) : userScore >= maxScore * 0.8 ? (
//                               <Badge pill bg="info">
//                                 Almost There
//                               </Badge>
//                             ) : userScore >= maxScore * 0.5 ? (
//                               <Badge pill bg="warning">
//                                 Partial
//                               </Badge>
//                             ) : userScore > 0 ? (
//                               <Badge pill bg="secondary">
//                                 Needs Improvement
//                               </Badge>
//                             ) : (
//                               <Badge pill bg="danger">
//                                 Incorrect
//                               </Badge>
//                             )}
//                           </div>
//                           {/* Comment Section */}
//                           <div
//                             style={{
//                               backgroundColor: "#6c757d",
//                               padding: "10px",
//                               marginTop: "10px",
//                               borderRadius: "5px",
//                               color: "#fff",
//                             }}
//                           >
//                             <strong>Comment:</strong> {comment}
//                           </div>
//                         </div>

//                         {/* Better Responses Section */}
//                         {!isScoreEqual && (
//                           <ul
//                             style={{
//                               backgroundColor: "white",
//                               paddingTop: "20px",
//                               gap: "21px",
//                               border: "1px solid lightgray",
//                               borderRadius: "5px",
//                               listStyle: "none",
//                             }}
//                           >
//                             <li
//                               key={idx}
//                               style={{
//                                 padding: "20px",
//                                 paddingLeft: "20px",
//                                 border: "1px solid #F9F9F9",
//                                 borderRadius: "5px",
//                                 margin: "10px",
//                                 backgroundColor: "#F9F9F9",
//                               }}
//                             >
//                               {renderHTML(
//                                 subQuestion.correct_answer || "Not available"
//                               )}
//                             </li>
//                           </ul>
//                         )}
//                       </div>
//                     );
//                   }
//                 })}
//               </div>
//             );
//           })}
//         {(subjectName.toLowerCase() === "mathematics" ||
//           subjectName.toLowerCase() === "geography") &&
//           questionData.slice(3, 4).map((category, idx) => {
//             // Check if the user answered either or or
//             const eitherAnswered = category.questions.either?.sub_question.some(
//               (subQuestion) => subQuestion.user_answer
//             );
//             const orAnswered = category.questions.or?.sub_question.some(
//               (subQuestion) => subQuestion.user_answer
//             );

//             // Determine if the answered question is from either or or
//             const answeredQuestions = eitherAnswered
//               ? category.questions.either.sub_question
//               : category.questions.or.sub_question;

//             return (
//               <div
//                 key={idx}
//                 style={{
//                   marginTop: "20px",
//                   padding: "20px",
//                   backgroundColor: "white",
//                 }}
//               >
//                 {/* Render the correct main question based on which was answered */}
//                 <h3
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "auto auto",
//                     gap: "21px",
//                     backgroundColor: "white",
//                     padding: "20px",
//                     paddingLeft: "20px",
//                     border: "1px solid lightgray",
//                     borderRadius: "5px",
//                     margin: "0",
//                     fontSize: "1.2rem",
//                   }}
//                 >
//                   Qn {eitherAnswered ? idx + 5 : idx + 6}:{" "}
//                   {eitherAnswered
//                     ? renderHTML(category.questions.either.question)
//                     : renderHTML(category.questions.or.question)}
//                 </h3>

//                 {/* Render only the answered sub-question */}
//                 {answeredQuestions.map((subQuestion, subIdx) => {
//                   if (subQuestion.user_answer) {
//                     const userAnswer =
//                       subQuestion.user_answer || "No option selected";
//                     const userScore = subQuestion.user_score || 0;
//                     const maxScore = subQuestion.maxScore || 11;

//                     const isScoreEqual = userScore === maxScore;

//                     const matchedAnswer = subQuestion.answer.find(
//                       (answerItem) =>
//                         answerItem.response_criteria.some(
//                           (criteria) =>
//                             criteria.response === subQuestion.user_answer &&
//                             subQuestion.user_score === answerItem.score
//                         )
//                     );

//                     const matchedCriteria = matchedAnswer
//                       ? matchedAnswer.response_criteria.find(
//                           (criteria) =>
//                             criteria.response === subQuestion.user_answer
//                         )
//                       : null;

//                     const comment = matchedCriteria
//                       ? matchedCriteria.comment
//                       : "No comment available";

//                     return (
//                       <div key={subIdx}>
//                         <div
//                           style={{
//                             backgroundColor: "white",
//                             padding: "20px",
//                             paddingLeft: "20px",
//                             border: "1px solid lightgray",
//                             borderRadius: "5px",
//                             margin: "0",
//                             display: "flex",
//                             gap: "21px",
//                           }}
//                         >
//                           <strong>{String.fromCharCode(97 + subIdx)})</strong>{" "}
//                           <strong>{renderHTML(subQuestion.question)}</strong>
//                         </div>

//                         <div
//                           style={{
//                             backgroundColor: "white",
//                             padding: "20px",
//                             paddingLeft: "20px",
//                             border: "1px solid lightgray",
//                             borderRadius: "5px",
//                             margin: "0",
//                           }}
//                         >
//                           <strong>Your response: </strong>{" "}
//                           <div
//                             style={{
//                               padding: "20px",
//                               border: "1px solid rgb(249, 249, 249)",
//                               backgroundColor: "#F9F9F9",
//                               borderRadius: "5px",
//                               margin: "10px",
//                             }}
//                           >
//                             {renderHTML(userAnswer)}
//                           </div>
//                           <div
//                             style={{
//                               display: "flex",
//                               justifyContent: "space-between",
//                               alignItems: "center",
//                               margin: "0 10px",
//                             }}
//                           >
//                             <div
//                               role="alert"
//                               className="fade alert alert-primary show"
//                               style={{
//                                 display: "flex",
//                                 gap: "10px",
//                                 width: "fit-content",
//                                 margin: "0",
//                               }}
//                             >
//                               <strong>Score:</strong>{" "}
//                               {renderHTML(`${userScore} / ${maxScore}`)}
//                             </div>
//                             {userScore === maxScore ? (
//                               <Badge pill bg="success">
//                                 Correct
//                               </Badge>
//                             ) : userScore >= maxScore * 0.8 ? (
//                               <Badge pill bg="info">
//                                 Almost There
//                               </Badge>
//                             ) : userScore >= maxScore * 0.5 ? (
//                               <Badge pill bg="warning">
//                                 Partial
//                               </Badge>
//                             ) : userScore > 0 ? (
//                               <Badge pill bg="secondary">
//                                 Needs Improvement
//                               </Badge>
//                             ) : (
//                               <Badge pill bg="danger">
//                                 Incorrect
//                               </Badge>
//                             )}
//                           </div>
//                           {/* Comment Section */}
//                           <div
//                             style={{
//                               backgroundColor: "#6c757d",
//                               padding: "10px",
//                               marginTop: "10px",
//                               borderRadius: "5px",
//                               color: "#fff",
//                             }}
//                           >
//                             <strong>Comment:</strong> {comment}
//                           </div>
//                         </div>

//                         {/* Better Responses Section */}
//                         {!isScoreEqual && (
//                           <ul
//                             style={{
//                               backgroundColor: "white",
//                               paddingTop: "20px",
//                               gap: "21px",
//                               border: "1px solid lightgray",
//                               borderRadius: "5px",
//                               listStyle: "none",
//                             }}
//                           >
//                             <li
//                               key={idx}
//                               style={{
//                                 padding: "20px",
//                                 paddingLeft: "20px",
//                                 border: "1px solid #F9F9F9",
//                                 borderRadius: "5px",
//                                 margin: "10px",
//                                 backgroundColor: "#F9F9F9",
//                               }}
//                             >
//                               {renderHTML(
//                                 subQuestion.correct_answer || "Not available"
//                               )}
//                             </li>
//                           </ul>
//                         )}
//                       </div>
//                     );
//                   }
//                 })}
//               </div>
//             );
//           })}
//       </Card>
//       <Row>
//         <Col xs={12} className="" style={{ marginBottom: "1.8rem" }}>
//           <div className="d-flex justify-content-center">
//             {isStudent ? (
//               <ButtonGroup className="w-75">
//                 <Button
//                   variant="success"
//                   onClick={() => navigate("/exam-page")}
//                 >
//                   Attempt another Exam
//                 </Button>
//                 <Button variant="info" onClick={() => navigate("/")}>
//                   Back to Dashboard
//                 </Button>
//               </ButtonGroup>
//             ) : (
//               <ButtonGroup className="w-75">
//                 <Button variant="success" onClick={() => navigate(-1)}>
//                   Back
//                 </Button>
//                 <Button variant="info" onClick={() => navigate("/")}>
//                   Dashboard
//                 </Button>
//               </ButtonGroup>
//             )}
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ViewUceResults;
