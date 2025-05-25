import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "./LandingNavBar.css";

const LandingNavbar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar expand="lg" className="px-3 bg-white">
      <div className="d-flex w-100 justify-content-between align-items-center">
        <Navbar.Brand onClick={() => setExpanded(false)}>
          <img src="/img/main-logo.png" alt="Logo" className="logo-img" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded((expanded) => !expanded)}
        />
      </div>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={NavLink} to="#" onClick={() => setExpanded(false)}>
            Pricing Plan
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/sign-in"
            onClick={() => setExpanded(false)}
          >
            Login
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/sign-up"
            onClick={() => setExpanded(false)}
          >
            Sign up
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default LandingNavbar;
