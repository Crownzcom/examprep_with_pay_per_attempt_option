import React, { useState, useEffect } from "react";
import { useUceQuiz } from "../../context/uceQuizContext";
import { Card, Form, ButtonGroup, Button } from "react-bootstrap";
import DOMPurify from "dompurify";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import katex from "katex";
import "katex/dist/katex.min.css";
import TableCreator from "./TableCreator";
import GraphCanvas from "./GraphCanvas";
import { useUcePracticals } from "./../../context/ucePracticalContext";

const UcePracticals = ({ selectedQuestions, subjectName, examID }) => {
  const { savePracticalAnswer } = useUcePracticals();

  const handleOptionChange = (
    e,
    questionId,
    subQuestionId,
    categoryId,
    subjectName,
    examID
  ) => {
    const selectedValue = e.target.value;

    savePracticalAnswer(
      examID,
      subjectName,
      questionId,
      subQuestionId,
      selectedValue,
      categoryId
    );
  };

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

  const renderQuestion = (category, questionIndex, categoryId) => (
    <div key={questionIndex}>
      {category.instructions && (
        <Card.Title style={{ marginTop: "20px", gap: "10px", display: "flex" }}>
          Instructions --{renderHTML(category.instructions)}
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

      <iframe
        src="/animate/sample/chem.html"
        title="Adobe Animate Simulation"
        width="100%"
        height="600px"
        overflow="hidden"
        frameBorder="0"
        allowFullScreen
      ></iframe>

      {Array.isArray(category.sub_questions) &&
        category.sub_questions.map((subQuestion, subIdx) => (
          <div
            key={subQuestion.id}
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
              <span>{renderHTML(subQuestion.examQuestion)}</span>
            </Card.Subtitle>

            {/* Check if the subquestion is of type "Data Table" */}
            {subQuestion.type === "Data Table:" ? (
              <>
                {/* Render the TableCreator component */}
                <TableCreator
                  onChange={(tableData) =>
                    handleOptionChange(
                      { target: { value: tableData } },
                      category.id,
                      subQuestion.id,
                      categoryId,
                      subjectName,
                      examID
                    )
                  }
                />
                {/* Render the GraphCanvas component */}
                <GraphCanvas
                  onGraphDataChange={(graphData) =>
                    handleOptionChange(
                      { target: { value: graphData } },
                      category.id,
                      subQuestion.id,
                      categoryId,
                      subjectName,
                      examID
                    )
                  }
                />
              </>
            ) : (
              // Render the textarea input for other types of subquestions
              <Form.Control
                as="textarea"
                autoComplete="off"
                spellCheck="false"
                // inputMode="none"
                data-gramm="false"
                rows={3}
                onChange={(e) =>
                  handleOptionChange(
                    e,
                    category.id,
                    subQuestion.id,
                    categoryId,
                    subjectName,
                    examID
                  )
                }
                name={`question_${questionIndex}_sub_${subIdx}`}
                style={{ marginTop: "10px" }}
              />
            )}
          </div>
        ))}
    </div>
  );

  return (
    <MathJaxContext>
      {selectedQuestions?.map((category, index) =>
        renderQuestion(category.questions, index, category.category)
      )}
    </MathJaxContext>
  );
};

export default UcePracticals;
