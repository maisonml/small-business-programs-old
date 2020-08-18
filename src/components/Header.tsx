// @ts-ignore

import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Menu, Box } from "grommet";
import { useSelectLanguage } from "~/contexts/language";

import "./header.scss";

const StyledMenu = styled(Menu)`
  text-decoration: underline;
  color: black;
`;

interface Props {
  links?: Array<JSX.Element>;
  showLanguageSelect?: Boolean;
}

const Header: React.FC<Props> = ({ links = [], showLanguageSelect }) => {
  const [language, setLanguage, languageOpts] = useSelectLanguage();
  return (
    <div className="container">
      <nav className="navbar">
        <Link className="navbar-brand" to="/">
          <img src="/usdr_logo_black.svg" alt="USDR Logo" />
        </Link>
        {showLanguageSelect && (
          <div>
          {languageOpts.map(lang => {
            if (lang.value !== language) {
              return <span className="language-option" onClick={() => {setLanguage(lang.value)}}>{lang.title}</span>
            }
          })}
          </div>
          
        )}
        {links.length > 0 && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ml-auto">
                {links.map((link) => (
                  <li className="nav-item">{link}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default Header;