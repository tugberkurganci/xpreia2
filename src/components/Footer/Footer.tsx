import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="sticky-bottom bg-dark text-light text-center ">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-3 mb-3">
            <h5>About Us</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-light">
                  Our Story
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-light">
                  Team
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-light">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-3 mb-3">
            <h5>Services</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-light">
                  Consulting
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-light">
                  Sales
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-light">
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-3 mb-3">
            <h5>Contact</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-light">
                  Contact Us
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="#" className="nav-link p-0 text-light">
                  Locations
                </a>
              
              </li>
            </ul>
          </div>
        </div>

        <div className="social-media mt-4">
          <ul className="list-unstyled d-flex justify-content-center">
            <li className="ms-3">
              <a className="link-body-emphasis" href="#">
                <FaTwitter color="white" />
              </a>
            </li>
            <li className="ms-3">
              <a className="link-body-emphasis" href="#">
                <FaInstagram color="white" />
              </a>
            </li>
            <li className="ms-3">
              <a className="link-body-emphasis" href="#">
                <FaFacebook color="white" />
              </a>
            </li>
            <li className="ms-3">
              <a className="link-body-emphasis" href="#">
                <FaLinkedin color="white" />
              </a>
            </li>
            <li className="ms-3">
              <a className="link-body-emphasis" href="#">
                <FaGithub color="white" />
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-bottom mt-4">
          <p>&copy; 2024 Company, Inc. All rights reserved.</p>
          <div>
            <a
              className="text-light"
              href="https://www.flaticon.com/free-icons/minivan"
              title="minivan icons"
            >
              Minivan icons created by kerismaker - Flaticon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
