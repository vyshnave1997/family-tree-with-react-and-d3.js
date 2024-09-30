import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

const Toggle = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  return (
    <div className="tool" onClick={handleToggle} style={{ cursor: 'pointer', fontSize: '20px' }}>
      <FontAwesomeIcon
        icon={isToggled ? faToggleOn : faToggleOff}
        className="tool-icon"
      />
      <p className="tool-para">{isToggled ? 'Hide inheritance' : 'Show inheritance'}</p>
    </div>
  );
};

export default Toggle;
