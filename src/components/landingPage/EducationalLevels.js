import React from "react";
import "./EducationalLevels.css";

const EducationalLevels = () => {
  return (
    <div>
      <div className="edu-main-title">
        <h2>Educational Levels available at ExamPrepTutor</h2>
        <p className="edu-main-intro">
          A single application with a load of all educational level examination,
          both theory and practical tailored <br />
          to satisfy a students needs
        </p>
      </div>
      <section className="mt-tabs">
        <div>
          <nav>
            <ul>
              <li>
                <a href="#">
                  <img src="" alt="Primary-level-icon" />
                  <h5 className="tab-title">Primary Level</h5>
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="" alt="Secondary-level-icon" />
                  <h5 className="tab-title">Secondary Level</h5>
                </a>
              </li>
              <li>
                <a href="#">
                  <img src="" alt="Advanced-level-icon" />
                  <h5 className="tab-title">Advanced Level</h5>
                </a>
              </li>
            </ul>
          </nav>
          <div>
            <section id="section-1">
              <div className="row">
                <div>
                  <img src="" alt="image" />
                </div>
                <div>
                  <h2 className="tab-title">Primary</h2>
                  <p>content about the level</p>
                  <a href="#">Read More</a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EducationalLevels;
