import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser, faRobot, faDesktop, faCheck, faChessPawn, faChessQueen } from '@fortawesome/free-solid-svg-icons';
import '../styles/game-modes.css';

import selectS from "../sounds/select.mp3";
import clickS from "../sounds/click.mp3";

export default function Home({id, getColor, getDifficulty}) {

    console.log(id);
    if (localStorage.length !== 0) {
        for (let i = 0, len = localStorage.length; i < len; i++) {
            const key = localStorage.key(i);
            if (key === null) continue;
            if (key.search("computer-") === -1) localStorage.removeItem(key);
        }
    }

    const [stop, setStop] = useState(false);
    const [clickStop, setClickStop] = useState(false);
    const [computerColor, setComputerColor] = useState(null);
    const [computerDifficulty, setComputerDifficulty] = useState("easy");

    const inputLinkRef = useRef(null);
    const copyButtonRef = useRef(null);
    const copyIconRef = useRef(null);
    const colorButtons = useRef([]);

    const selectSound = new Audio(selectS);
    const pointSound = new Audio(clickS);

    const hoverSound = () => {
        selectSound.pause();
        selectSound.currentTime = 0;
        selectSound.play();
    };

    const copyLink = (e) => {
        setClickStop(false);
        inputLinkRef?.current.select();
        inputLinkRef?.current.setSelectionRange(0, 1000);

        navigator.clipboard.writeText(inputLinkRef?.current.value);
        copyButtonRef?.current.classList.add("sent");
        setTimeout(() => copyButtonRef?.current.firstChild.classList.add('rotate'), 400);
        // copyButtonRef?.current.addEventListener('transitionend', () => {
        //     copyButtonRef?.current.classList.add('rotate');
        // });

        setTimeout(() => {
            inputLinkRef?.current.blur();
            setClickStop(true);
        }, 150);
    };

    const clickSound = (path) => {
        if (path === `/${id}` && (stop || !clickStop)) return;
        pointSound.pause();
        pointSound.currentTime = 0;
        pointSound.play();
        pointSound.addEventListener('ended', () => {
            if (path === `/${id}`) {
                localStorage.removeItem("board");
                localStorage.removeItem("current-move")
            }
            window.location.href = path;
        });
    
    };  

    const playComputer = (e, color) => {
        let newTarget = e.target;

        while (!newTarget.classList.contains('piece-button')) {
            newTarget = newTarget.parentElement;
        }

        setComputerColor(color);
        getColor(color);
        // window.location.href = `${window.location.href}computer`;
        [...newTarget.parentElement.childNodes].forEach(childNode => {
            childNode.classList.remove('clicked');
        });
        newTarget.classList.add('clicked');
    };

    const startComputerGame = () => {
        console.log(computerColor);
        // window.location.href = `${window.location.href}computer`;
    };

    const changeDifficulty = (e) => {
        const difficulty = e.target.innerText.toLowerCase();
        setComputerDifficulty(difficulty);
        e.target.parentElement.childNodes.forEach(child => child.classList.remove('active'));
        e.target.classList.add('active');
        getDifficulty(difficulty);
    };

    return (
       
        <div className="home-content">
             
            <div className="classic-mode game-mode" onMouseEnter={() => hoverSound()} onClick={() => clickSound("/classic")}>
                <div className="title">
                    <h2>Classic</h2>

                    <div className="icon">
                        <FontAwesomeIcon icon={faUser} 
                            color="#fff"
                            className="mode-icon"
                        />
                    </div>
                </div>
                
            </div>
           
            <div className="online-mode game-mode" onMouseEnter={() => hoverSound()} onClick={() => clickSound(`/${id}`)}>
                
                <div className="title">
                    <h2>Online</h2>

                    <div className="icon">
                        <FontAwesomeIcon 
                            icon={faUsers} 
                            color="#fff"
                            className="mode-icon"
                        />
                    </div>

                    
                </div>      
               
                <div className="link-container">
                    <p className="link-text">Link with your friend: </p>
                    <div className="link">
                        <label htmlFor="link-input">
                            <input type="text" className="link-input" value={`${window.location.href}${id}`} ref={inputLinkRef} onFocus={e => setStop(true)} onBlur={e => setStop(false)} readOnly/>
                        </label>

                        <div className="copy-button" onClick={(e) => copyLink(e)} ref={copyButtonRef}>
                            <FontAwesomeIcon 
                                icon={faCheck}
                                className="fa copy-icon"
                                ref={copyIconRef}
                            />
                        </div>
                    </div>
                    
                </div>

                <div className="icon">
                    
                </div>

                <div className="icon">
                    
                </div>
               
            </div>

            <div className="computer-mode game-mode" onMouseEnter={() => hoverSound()}>
                <div className="title">
                        <h2>Computer</h2>

                        <div className="icon">
                            <FontAwesomeIcon icon={faDesktop} 
                                color="#fff"
                                className="mode-icon"
                            />
                        </div>
                </div>

                <div className="colors">
                    <div className="white piece-button clicked" onClick={(e) => playComputer(e, 1)}>
                        <FontAwesomeIcon 
                            icon={faChessQueen}
                            color="#fff"
                            className="choose-piece"
                        />
                    </div>
                    <div className="black piece-button" onClick={(e) => playComputer(e, -1)} >
                        <FontAwesomeIcon 
                            icon={faChessQueen}
                            color="#000"
                            className="choose-piece"
                        />
                    </div>
                    <div className="random piece-button">
                        <div className="child" onClick={(e) => playComputer(e, Math.random() < 0.5 ? 1 : -1)}>
                            <FontAwesomeIcon 
                                icon={faChessQueen}
                                color="#fff"
                                className="choose-piece"
                            />
                        </div>

                        <div className="child">
                            <FontAwesomeIcon 
                                icon={faChessQueen}
                                color="#000"
                                className="choose-piece"
                            />
                        </div>
                    </div>
                </div>

                <div className="difficulties">
                    <div className="difficulty active" onClick={(e) => changeDifficulty(e)}>Easy</div>
                    <div className="difficulty" onClick={(e) => changeDifficulty(e)}>Medium</div>
                    <div className="difficulty" onClick={(e) => changeDifficulty(e)}>Hard</div>
                    <div className="difficulty" onClick={(e) => changeDifficulty(e)}>Very Hard</div>
                </div>

                <div className="start">
                    <Link to="/computer">
                        <button className="start-button" onClick={() => startComputerGame()}>Start game!</button>
                    </Link>
                    
                </div>
                <div className="icon"></div>
                <div className="icon"></div>
                </div>

        </div>
    );
};