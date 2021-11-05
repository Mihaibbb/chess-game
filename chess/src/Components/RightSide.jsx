import React from "react";
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import ResetButton from './ResetButton';
import PreviousButton from "./PreviousButton";

import '../styles/right-side.css';

export default function RightSide() {

    return (
        <div className="right-side">
            <ResetButton />
            <div className="prev-next">
                <PreviousButton icon={faArrowLeft} />
                <PreviousButton icon={faArrowRight} />
            </div>
        </div>
    );
};
