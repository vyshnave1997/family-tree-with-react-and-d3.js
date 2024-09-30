import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'; // Import the specific icon
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <h1>Family Tree</h1>
        <button className="add-button">Add</button>
      </div>

      <div className="header-right">
        <div className="search-container">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
      </div>
    </div>
  );
};

export default Header;
