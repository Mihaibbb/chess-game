import React, { useState, useEffect, useRef } from "react";

import Board from './Board';
import RightSide from "./RightSide";
import LeftSide from "./LeftSide";


import '../styles/home.css';

export default function Home() {
    
    return (
        <div className="game">
            <LeftSide />
            <Board color={1} />
            <RightSide />
        </div>
    );
};