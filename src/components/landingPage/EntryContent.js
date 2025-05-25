import React from "react";
import "./EntryContent.css";

const EntryContent = () => {
  return (
    <div className="entry-content">
      {/* <img
        src="./img/home-background-image.png"
        alt="home-background-image"
        className="background-img"
      /> */}
      <div className="entry-info">
        <h2 className="entry-heading">Welcome to Exam Prep Tutor </h2>
        <p className="entry-p">Your personalized exam prep companion!</p>
        <p className="entry-p">
          Get expert guidance, tailored examination plans, and interactive tools
          to ace your exams. Whether you're tackling math, science, or any other
          subject, we make learning simple, effective, and fun. Start your
          journey to success today!
        </p>
        <div>
          <button
            className="btn btn-sm btn-primary"
            type="button"
            style={{
              borderRadius: "30px",
              padding: "10px, 1rem",
              margin: "10px",
            }}
          >
            Sign Up
          </button>
        </div>
        <div>
          {" "}
          <button
            type="button"
            className="btn btn-outline-dark"
            style={{
              borderRadius: "30px",
              margin: "10px",
              padding: "10px, 1rem",
            }}
          >
            contact us
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryContent;
