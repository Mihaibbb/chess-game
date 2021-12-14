import React, { useState, useEffect, useRef } from "react";

import Board from './Board';
import RightSide from "./RightSide";
import LeftSide from "./LeftSide";

import '../styles/home.css';

export default function Classic() {

    const [buttonsTarget, setButtonsTarget] = useState(null);
    const [random, setRandom] = useState(null);

    const returnButtonsClick = (e) => {

        let newTarget = e.target;

        while (!newTarget.classList.contains('button')) {
            newTarget = newTarget.parentElement;
        }

        setButtonsTarget(newTarget);
        setRandom(Math.random());
    };
    
    return (
        <div className="content">
            <div className="game">
                <LeftSide />
                <Board color={1} prevButtons={buttonsTarget} random={random}/>
                <RightSide clickButton={returnButtonsClick} computerGame={false}/>
            </div>
        </div>
        
    );
};