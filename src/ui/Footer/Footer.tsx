import React from "react";
import { Link } from "react-router-dom";

import "./Footer.css";
import {
  FacebookIcon,
  TwitterIcon,
  ExternalLink,
  Wrapper
} from "../../components";

export const Footer = () => {
  return (
    <footer className="Footer">
      <Wrapper>
        <div className="Footer__content">
          <h2 className="visually-hidden">Footer</h2>
          <nav>
            <h3 className="visually-hidden">Legal Navigation Menu</h3>
            <ul className="Footer__more-links">
              <li className="Footer__link">
                <Link
                  to="/terms-and-conditions"
                  data-testid="[footer] terms-and-conditions"
                >
                  Terms and Conditions
                </Link>
              </li>
              <li className="Footer__link">
                <Link
                  to="/privacy-policy"
                  data-testid="[footer] privacy-policy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="Footer__link">
                <Link to="/contact-us" data-testid="[footer] contact-us">
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          <nav className="Footer__social-media-nav">
            <h3 className="visually-hidden">Social Media</h3>

            <p className="Footer__follow-us">Follow us</p>

            <ul className="Footer__social-media-list">
              <li>
                <ExternalLink href="https://www.facebook.com/rule-of-thumb">
                  <FacebookIcon className="Footer__facebook-icon" />
                </ExternalLink>
              </li>
              <li>
                <ExternalLink href="https://www.twitter.com/rule-of-thumb">
                  <TwitterIcon className="Footer__twitter-icon" />
                </ExternalLink>
              </li>
            </ul>
          </nav>
        </div>
      </Wrapper>
    </footer>
  );
};
