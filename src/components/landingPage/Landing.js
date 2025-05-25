import React from "react";
import LandingNavbar from "./LandingNavbar";
import EntryContent from "./EntryContent";
import Footer from "./Footer";
import Pricing from "./Pricing";
import AboutUs from "./AboutUs";
import EducationalLevels from "./EducationalLevels";
import Partners from "./Partners";

const Landing = () => {
  return (
    <div>
      <div className="Landing-Page-container">
        <LandingNavbar />
        <EntryContent />
      </div>
      <EducationalLevels />
      <Pricing />
      <Partners />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default Landing;
