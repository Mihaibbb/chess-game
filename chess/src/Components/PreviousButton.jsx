import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../styles/prev-button.css';

export default function PreviousButton({icon}) {
    return (
        <div className="prev-button">
            <FontAwesomeIcon 
                color="#fff" 
                icon={icon}
                className="prev-icon"
            />
        </div>
    );
};