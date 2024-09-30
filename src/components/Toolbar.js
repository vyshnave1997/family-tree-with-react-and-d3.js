import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faClock, faCircleNotch, faNetworkWired, faListUl } from '@fortawesome/free-solid-svg-icons'; // Correct import of the toggle-on icon
import "./Toolbar.css";
import Toggle from "./Toggle";

const Toolbar = () => {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="tool-icons">
         <Toggle />
          
        </div>
        <div className="tool">
        <FontAwesomeIcon icon={faClock} className="tool-icon" /> {/* Use the imported icon */}
        <p className="tool-para">Update your position</p>
        </div>   
      </div>

      <div className="toolbar-right">
        <div className="tool-icon-right">  <FontAwesomeIcon icon={faNetworkWired} /> {/* Home icon */}
        </div>
        <div className="tool-icon-right">  <FontAwesomeIcon icon={faListUl} /> {/* Home icon */}
        </div>
        <div className="tool-icon-right">  <FontAwesomeIcon icon={faCircleNotch} /> {/* Home icon */}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
