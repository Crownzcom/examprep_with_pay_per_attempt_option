import React, { useState, useEffect } from "react";
import { useUceQuiz } from "../../context/uceQuizContext";
import { Card, Form, ButtonGroup, Button } from "react-bootstrap";
import DOMPurify from "dompurify";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import katex from "katex";
import "katex/dist/katex.min.css";

const UceQuizContainer = ({ selectedQuestions, subjectName, examID }) => {
  const [selectedOption, setSelectedOption] = useState("either");
  const [selectedOptionExtraQn, setSelectedOptionExtraQn] = useState("either");

  const [randomizedAnswers, setRandomizedAnswers] = useState({});
  const { saveUserAnswer } = useUceQuiz();

  useEffect(() => {
    const initialRandomAnswers = {};

    // Handle normal questions
    selectedQuestions.forEach((category, questionIndex) => {
      if (category.questions.sub_questions) {
        category.questions.sub_questions.forEach((subQuestion) => {
          if (subQuestion.answer) {
            const answers = subQuestion.answer.map((answer, answerIdx) => ({
              key: `normal_${category.questions.id}_${subQuestion.id}_${answerIdx}`,
              response: getRandomResponse(answer.response_criteria),
              score: answer.score,
            }));

            answers.sort((a, b) => b.score - a.score);

            const correctAnswer = answers[0].response;
            const shuffledAnswers = shuffleAnswers(answers);

            initialRandomAnswers[
              `normal_${category.questions.id}_${subQuestion.id}`
            ] = {
              correctAnswer,
              answers: shuffledAnswers,
            };
          }
        });
      }
    });

    // Handle English and Math "either/or" questions
    if (
      (subjectName.toLowerCase() === "english" ||
        subjectName.toLowerCase() === "mathematics" ||
        subjectName.toLowerCase() === "geography") &&
      selectedQuestions[2]?.questions
    ) {
      ["either", "or"].forEach((type) => {
        const question = selectedQuestions[2].questions[type];
        if (question?.sub_question) {
          question.sub_question.forEach((subQuestion) => {
            if (subQuestion.answer) {
              const answers = subQuestion.answer.map((answer, answerIdx) => ({
                key: `${type}_${question.id}_${subQuestion.id}_${answerIdx}`,
                response: getRandomResponse(answer.response_criteria),
                score: answer.score,
              }));

              answers.sort((a, b) => b.score - a.score);

              const correctAnswer = answers[0].response;
              const shuffledAnswers = shuffleAnswers(answers);

              initialRandomAnswers[`${type}_${question.id}_${subQuestion.id}`] =
                {
                  correctAnswer,
                  answers: shuffledAnswers,
                };
            }
          });
        }
      });
    }

    // Handle Math-specific "either/or" questions in the fourth question
    if (
      (subjectName.toLowerCase() === "mathematics" ||
        subjectName.toLowerCase() === "geography") &&
      selectedQuestions[3]?.questions
    ) {
      ["either", "or"].forEach((type) => {
        const question = selectedQuestions[3].questions[type];
        if (question?.sub_question) {
          question.sub_question.forEach((subQuestion) => {
            if (subQuestion.answer) {
              const answers = subQuestion.answer.map((answer, answerIdx) => ({
                key: `${type}_${question.id}_${subQuestion.id}_${answerIdx}`,
                response: getRandomResponse(answer.response_criteria),
                score: answer.score,
              }));

              answers.sort((a, b) => b.score - a.score);

              const correctAnswer = answers[0].response;
              const shuffledAnswers = shuffleAnswers(answers);

              initialRandomAnswers[`${type}_${question.id}_${subQuestion.id}`] =
                {
                  correctAnswer,
                  answers: shuffledAnswers,
                };
            }
          });
        }
      });
    }

    // Handle Biology-specific "either/or" questions in the fourth and fifth questions
    if (
      subjectName.toLowerCase() === "biology" ||
      subjectName.toLowerCase() === "physics"
    ) {
      // Loop through both questions 4 (index 3) and 5 (index 4)
      [3, 4].forEach((index) => {
        if (selectedQuestions[index]?.questions) {
          ["either", "or"].forEach((type) => {
            const question = selectedQuestions[index].questions[type];
            if (question?.sub_question) {
              question.sub_question.forEach((subQuestion) => {
                if (subQuestion.answer) {
                  const answers = subQuestion.answer.map(
                    (answer, answerIdx) => ({
                      key: `${type}_${question.id}_${subQuestion.id}_${answerIdx}`,
                      response: getRandomResponse(answer.response_criteria),
                      score: answer.score,
                    })
                  );

                  answers.sort((a, b) => b.score - a.score);

                  const correctAnswer = answers[0].response;
                  const shuffledAnswers = shuffleAnswers(answers);

                  initialRandomAnswers[
                    `${type}_${question.id}_${subQuestion.id}`
                  ] = {
                    correctAnswer,
                    answers: shuffledAnswers,
                  };
                }
              });
            }
          });
        }
      });
    }

    setRandomizedAnswers(initialRandomAnswers);
  }, [selectedQuestions, subjectName]);

  const handleOptionChange = (
    e,
    questionId,
    subQuestionId,
    categoryId,
    selectedScore,
    examID,
    subjectName
  ) => {
    const selectedValue = e.target.value;

    const storedAnswers =
      randomizedAnswers[`normal_${questionId}_${subQuestionId}`] ||
      randomizedAnswers[`either_${questionId}_${subQuestionId}`] ||
      randomizedAnswers[`or_${questionId}_${subQuestionId}`];

    const correctAnswer = storedAnswers ? storedAnswers.correctAnswer : null;

    // console.log({
    //   selectedValue,
    //   correctAnswer,
    // });

    saveUserAnswer(
      examID,
      subjectName,
      questionId,
      subQuestionId,
      selectedValue,
      categoryId,
      selectedScore,
      correctAnswer
    );
  };

  const renderMathHtml = (response) => {
    const formattedResponse = response?.replace(/\$(.*?)\$/g, (match, p1) => {
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

  const getRandomResponse = (responseCriteria) => {
    const randomIndex = Math.floor(Math.random() * responseCriteria.length);
    return responseCriteria[randomIndex].response;
  };

  // Function to shuffle answers and ensure the top-scoring one is always included
  const shuffleAnswers = (answers) => {
    const highestScoringAnswer = answers[0];
    const remainingAnswers = answers.slice(1);

    // Randomly select 3 other answers from the remaining answers
    const randomAnswers = remainingAnswers
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Combine the highest-scoring answer with the randomly selected ones
    const topAnswers = [highestScoringAnswer, ...randomAnswers];

    // Shuffle the final answers so the highest-scoring one isn't always first
    return topAnswers.sort(() => Math.random() - 0.5);
  };

  const renderEitherOrQuestion = (
    question,
    questionNumb,
    categoryId,
    selectedState
  ) => (
    <div>
      <Card.Title
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "white",
          display: "grid",
          gridTemplateColumns: "auto auto",
          gap: "21px",
        }}
      >
        Item {questionNumb}. {renderHTML(question.question)}
      </Card.Title>
      {Array.isArray(question.sub_question) &&
        question.sub_question.map((subQuestion, subIdx) => {
          const key = `${selectedState}_${question.id}_${subQuestion.id}`;
          const storedAnswers = randomizedAnswers[key];

          if (!storedAnswers) return null;

          return (
            <div
              key={subIdx}
              style={{
                backgroundColor: "white",
                padding: "20px",
                gap: "21px",
                paddingLeft: "4rem",
                border: "1px solid lightgray",
                borderRadius: "5px",
              }}
            >
              <Card.Subtitle
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  backgroundColor: "white",
                  gap: "21px",
                  width: "fit-content",
                }}
              >
                <span>{String.fromCharCode(97 + subIdx)})&nbsp;</span>
                {renderHTML(subQuestion.question)}
              </Card.Subtitle>

              {storedAnswers?.answers?.map((answer, answerIdx) => (
                <div
                  key={answerIdx}
                  style={{
                    padding: "5px",
                    marginTop: "10px",
                    paddingLeft: "2rem",
                    background: "#f8f9fa",
                    border: "1px solid lightgray",
                    borderRadius: "5px",
                  }}
                >
                  <Form.Check
                    className="custom-radio"
                    type="radio"
                    onChange={(e) =>
                      handleOptionChange(
                        e,
                        question.id,
                        subQuestion.id,
                        categoryId,
                        answer.score,
                        examID,
                        subjectName
                      )
                    }
                    // name={`sub_${subIdx}`}
                    // label={renderHTML(answer.response)}
                    // id={`sub_${subIdx}_answer_${answerIdx}`}
                    // value={answer.response}
                    name={`qn${questionNumb}_sub_${subIdx}`} // Unique name for each question
                    label={renderHTML(answer.response)}
                    id={`qn${questionNumb}_sub_${subIdx}_answer_${answerIdx}`} // Unique id for each option
                    value={answer.response}
                  />
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );

  const renderQuestion = (category, questionIndex, categoryId) => (
    <div key={questionIndex}>
      {category.instruction && (
        <Card.Title
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "white",
            display: "grid",
            gridTemplateColumns: "auto auto",
            gap: "21px",
          }}
        >
          {renderHTML(category.instruction)}
        </Card.Title>
      )}

      <Card.Title
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "white",
          display: "grid",
          gridTemplateColumns: "auto auto",
          gap: "21px",
        }}
      >
        Item {questionIndex + 1}.{" "}
        {category.question && renderHTML(category.question)}
      </Card.Title>

      {Array.isArray(category.sub_questions) &&
        category.sub_questions.map((subQuestion, subIdx) => {
          const key = `normal_${category.id}_${subQuestion.id}`;
          const storedAnswers = randomizedAnswers[key];

          if (!storedAnswers) return null;

          return (
            <div
              key={subIdx}
              style={{
                backgroundColor: "white",
                padding: "20px",
                gap: "21px",
                paddingLeft: "4rem",
                border: "1px solid lightgray",
                borderRadius: "5px",
              }}
            >
              <Card.Subtitle
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  backgroundColor: "white",
                  gap: "21px",
                  width: "fit-content",
                }}
              >
                <span>{String.fromCharCode(97 + subIdx)})&nbsp;</span>
                <span>{renderHTML(subQuestion.question)}</span>
              </Card.Subtitle>

              {storedAnswers?.answers?.map((answer, answerIdx) => (
                <div
                  key={answerIdx}
                  style={{
                    padding: "5px",
                    marginTop: "10px",
                    paddingLeft: "2rem",
                    background: "#f8f9fa",
                    border: "1px solid lightgray",
                    borderRadius: "5px",
                  }}
                >
                  <Form.Check
                    className="custom-radio"
                    type="radio"
                    onChange={(e) =>
                      handleOptionChange(
                        e,
                        category.id,
                        subQuestion.id,
                        categoryId,
                        answer.score,
                        examID,
                        subjectName
                      )
                    }
                    name={`question_${questionIndex}_sub_${subIdx}`}
                    label={renderHTML(answer.response)}
                    id={`question_${questionIndex}_sub_${subIdx}_answer_${answerIdx}`}
                    value={answer.response}
                  />
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );

  const isEnglish = subjectName.toLowerCase() === "english";
  const isMath = subjectName.toLowerCase() === "mathematics";
  const isGeo = subjectName.toLowerCase() === "geography";
  const isBio = subjectName.toLowerCase() === "biology";
  const isPhy = subjectName.toLowerCase() === "physics";
  const isPractical = [
    "chemistry-practical",
    "biology-practical",
    "physics-practical",
  ].includes(subjectName.toLowerCase());

  return (
    <MathJaxContext>
      {isEnglish || isMath || isGeo
        ? selectedQuestions
            .slice(0, 2)
            .map((category, index) =>
              renderQuestion(category.questions, index, category.category)
            )
        : !isBio &&
          !isPhy &&
          selectedQuestions.map((category, index) =>
            renderQuestion(category.questions, index, category.category)
          )}

      {(isBio || isPhy) &&
        selectedQuestions
          .slice(0, 3)
          .map((category, index) =>
            renderQuestion(category.questions, index, category.category)
          )}

      {(isEnglish || isMath || isGeo) &&
        selectedQuestions[2]?.questions?.either &&
        selectedQuestions[2]?.questions?.or && (
          <div style={{ marginTop: "20px" }}>
            <Card.Title
              style={{ display: "flex", alignItems: "center", gap: "10%" }}
            >
              <ButtonGroup>
                <Button
                  variant={
                    selectedOption === "either" ? "success" : "secondary"
                  }
                  onClick={() => setSelectedOption("either")}
                >
                  Item 3
                </Button>
                <Button
                  variant={selectedOption === "or" ? "warning" : "secondary"}
                  onClick={() => setSelectedOption("or")}
                >
                  Item 4
                </Button>
              </ButtonGroup>
              <div>
                <strong>
                  section B --Writing (Attempt only one question from this part)
                </strong>
              </div>
            </Card.Title>

            {selectedOption === "either"
              ? renderEitherOrQuestion(
                  selectedQuestions[2].questions.either,
                  3,
                  selectedQuestions[2].category,
                  "either"
                )
              : renderEitherOrQuestion(
                  selectedQuestions[2].questions.or,
                  4,
                  selectedQuestions[2].category,
                  "or"
                )}
          </div>
        )}

      {(isBio || isPhy) &&
        selectedQuestions[3]?.questions?.either &&
        selectedQuestions[3]?.questions?.or && (
          <div style={{ marginTop: "20px" }}>
            <Card.Title
              style={{ display: "flex", alignItems: "center", gap: "10%" }}
            >
              <ButtonGroup>
                <Button
                  variant={
                    selectedOption === "either" ? "success" : "secondary"
                  }
                  onClick={() => setSelectedOption("either")}
                >
                  Item 4
                </Button>
                <Button
                  variant={selectedOption === "or" ? "warning" : "secondary"}
                  onClick={() => setSelectedOption("or")}
                >
                  Item 5
                </Button>
              </ButtonGroup>
              <div>
                <strong>
                  section B --Writing (Attempt only one question from this part)
                </strong>
              </div>
            </Card.Title>

            {selectedOption === "either"
              ? renderEitherOrQuestion(
                  selectedQuestions[3].questions.either,
                  4,
                  selectedQuestions[3].category,
                  "either"
                )
              : renderEitherOrQuestion(
                  selectedQuestions[3].questions.or,
                  5,
                  selectedQuestions[3].category,
                  "or"
                )}
          </div>
        )}

      {(isBio || isPhy) &&
        selectedQuestions[4]?.questions?.either &&
        selectedQuestions[4]?.questions?.or && (
          <div style={{ marginTop: "20px" }}>
            <Card.Title
              style={{ display: "flex", alignItems: "center", gap: "10%" }}
            >
              <ButtonGroup>
                <Button
                  variant={
                    selectedOptionExtraQn === "either" ? "success" : "secondary"
                  }
                  onClick={() => setSelectedOptionExtraQn("either")}
                >
                  Item 6
                </Button>
                <Button
                  variant={
                    selectedOptionExtraQn === "or" ? "warning" : "secondary"
                  }
                  onClick={() => setSelectedOptionExtraQn("or")}
                >
                  Item 7
                </Button>
              </ButtonGroup>
              <div>
                <strong>
                  section B --Writing (Attempt only one question from this part)
                </strong>
              </div>
            </Card.Title>

            {selectedOptionExtraQn === "either"
              ? renderEitherOrQuestion(
                  selectedQuestions[4].questions.either,
                  6,
                  selectedQuestions[4].category,
                  "either"
                )
              : renderEitherOrQuestion(
                  selectedQuestions[4].questions.or,
                  7,
                  selectedQuestions[4].category,
                  "or"
                )}
          </div>
        )}

      {(isMath || isGeo) &&
        selectedQuestions[3]?.questions?.either &&
        selectedQuestions[3]?.questions?.or && (
          <div style={{ marginTop: "20px" }}>
            <Card.Title
              style={{ display: "flex", alignItems: "center", gap: "10%" }}
            >
              <ButtonGroup>
                <Button
                  variant={
                    selectedOptionExtraQn === "either" ? "success" : "secondary"
                  }
                  onClick={() => setSelectedOptionExtraQn("either")}
                >
                  Item 5
                </Button>
                <Button
                  variant={
                    selectedOptionExtraQn === "or" ? "warning" : "secondary"
                  }
                  onClick={() => setSelectedOptionExtraQn("or")}
                >
                  Item 6
                </Button>
              </ButtonGroup>
              <div>
                <strong>
                  section B --part 2 (Attempt only one question from this part)
                </strong>
              </div>
            </Card.Title>

            {selectedOptionExtraQn === "either"
              ? renderEitherOrQuestion(
                  selectedQuestions[3].questions.either,
                  5,
                  selectedQuestions[3].category,
                  "either"
                )
              : renderEitherOrQuestion(
                  selectedQuestions[3].questions.or,
                  6,
                  selectedQuestions[3].category,
                  "or"
                )}
          </div>
        )}
    </MathJaxContext>
  );
};

export default UceQuizContainer;
