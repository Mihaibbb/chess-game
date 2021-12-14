import React, { useState, useEffect, useRef } from "react";
import ComputerBoard from "./ComputerBoard";
import LeftSide from "./LeftSide";
import RightSide from "./RightSide";

import '../styles/home.css';

export default function Computer({ color, difficulty }) {

    console.log(difficulty);

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
                <ComputerBoard color={!color ? 1 : color} prevButtons={buttonsTarget} random={random} difficulty={!difficulty ? "easy" : difficulty} />
                <RightSide clickButton={returnButtonsClick} computerGame={true}/>
            </div>
        </div>
    );
};