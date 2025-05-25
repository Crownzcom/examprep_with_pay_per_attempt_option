import React, { useState } from "react";
import { faBookReader } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import HeroHeader from "./HeroHeader";
import "./ExamPage.css";
import SelectExam from "./SelectExam";
import PracticalExam from "./PracticalExam";
import { useAuth } from "../context/AuthContext";

function ExamPage() {
  const [activeTab, setActiveTab] = useState("theory");
  const { userInfo } = useAuth();

  const educationLevel = userInfo.educationLevel;

  const ExamPageHeroHeader = () => (
    <HeroHeader>
      <h1 className="display-4">
        <FontAwesomeIcon icon={faBookReader} className="me-2" /> Discover Your
        Subjects
      </h1>
      <p className="lead">
        Embark on a journey of knowledge. Choose your subject and challenge
        yourself!
      </p>
    </HeroHeader>
  );

  return (
    <>
      <ExamPageHeroHeader />
      <div className="exam-page">
        {educationLevel !== "PLE" && (
          <div className="tab-navigation">
            <div
              className={`tab ${activeTab === "theory" ? "active" : ""}`}
              onClick={() => setActiveTab("theory")}
            >
              Theory Exam
            </div>
            <div
              className={`tab ${activeTab === "practical" ? "active" : ""}`}
              onClick={() => setActiveTab("practical")}
            >
              Practical Exam
            </div>
          </div>
        )}
        <div className="tab-content">
          {activeTab === "theory" || educationLevel === "PLE" ? (
            <SelectExam />
          ) : (
            <PracticalExam />
          )}
        </div>
      </div>
    </>
  );
}

export default ExamPage;
