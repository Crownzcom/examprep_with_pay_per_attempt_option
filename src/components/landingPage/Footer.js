import React from "react";
import { Icon } from "@iconify/react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="col-md-4">
        <div className="single-address">
          <div className="media">
            <div className="media-left">
              <i className="icon-phone">
                <Icon icon="line-md:phone-call-loop" width="40" height="40" />
              </i>
            </div>
            <div className="media-body text-center">
              <p style={{ margin: "0px" }}>
                +256 702 838167
                <br />
                +256 760 366538
              </p>
            </div>
          </div>
          <div className="media">
            <div className="media-left">
              <i className="icon-phone">
                <Icon icon="mdi:internet" width="40" height="40" />{" "}
              </i>
            </div>
            <div className="media-body text-center">
              <p style={{ margin: "0px" }}>
                exampreptutor.com
                <br />
                crownzcom@gmail.com
              </p>
            </div>
          </div>
          <div className="media">
            <div className="media-left">
              <i className="icon-phone">
                <Icon
                  icon="gridicons:location"
                  width="40"
                  height="40"
                  style={{ color: "#fff" }}
                />{" "}
              </i>
            </div>
            <div className="media-body text-center">
              <p style={{ margin: "0px" }}>
                Swan Residence
                <br />
                9J5X+2H8, Heritage Rd, Kampala
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="copyright-area text-center">
          <div className="contact-social text-center pt-70 pb-35">
            <ul className="d-flex">
              <li>
                <a href="#">
                  <Icon icon="ri:facebook-fill" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Icon icon="jam:pinterest" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Icon icon="line-md:twitter-x-alt" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Icon icon="mdi:vimeo" width="24" height="24" />
                </a>
              </li>
              <li>
                <a href="#">
                  <Icon icon="mdi:google-plus" width="24" height="24" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
