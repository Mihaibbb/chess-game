import React, { useEffect, useState } from "react";
import Home from "./Components/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import io from "socket.io-client";
import Classic from "./Components/Classic";
import Online from "./Components/Online";
import Computer from "./Components/Computer";
import Practice from "./Components/Practice";
import Tutorial from "./Components/Tutorial";
import Lessons from "./Components/Lessons";

import "./styles/scroll.css";

export default function App() {

    const [userSocket, setUserSocket] = useState(null);
    const [playerColor, setPlayerColor] = useState(localStorage.getItem("computer-player-color") ? localStorage.getItem("computer-player-color") : null);
    const [playerDifficulty, setPlayerDifficulty] = useState(localStorage.getItem("computer-player-difficulty") ? JSON.parse(localStorage.getItem("computer-player-difficulty")) : null);
    
    const [id, setId] = useState(null);

    useEffect(() => {
       
        const socket = io("http://localhost:8000");
        
        socket.on('connect', () => {
            
            console.log('connected', socket.id, socket);
            setUserSocket(socket);
            if (JSON.parse(localStorage.getItem("socket")) == null) localStorage.setItem("socket", JSON.stringify(socket.id));
            setId(socket.id);
        });

        socket.on("ok", data => console.log(data));

    }, []);

    const getColor = (color, mode) => {
        setPlayerColor(color);
        
        if (localStorage.length !== 0) {
            for (let i = 0, len = localStorage.length; i < len; i++) {
                const key = localStorage.key(i);
                console.log(key);
                if (key === null) continue;
                if (key.search(mode) !== -1) localStorage.removeItem(key);
            }
        }

        localStorage.setItem(`${mode}player-color`, color);
        // window.location.href = `${window.location.href}computer`;
    };


    const getDifficulty = (difficulty) => {
        setPlayerDifficulty(difficulty);
        console.log(difficulty);
        
        if (localStorage.length !== 0) {
            for (let i = 0, len = localStorage.length; i < len; i++) {
                const key = localStorage.key(i);
                if (key === null) continue;
                if (key.search("computer-") !== -1) localStorage.removeItem(key);
            }
        }

        localStorage.setItem("computer-player-difficulty", JSON.stringify(difficulty));
    };

    useEffect(() => {
        console.log(playerColor);
        if (playerColor === null || playerDifficulty === null || id === null || userSocket === null) return;
        return (
            <Router>
                <Switch>
    
                    <Route exact path="/">
                        <Home id={id} getColor={getColor} getDifficulty={getDifficulty}/>
                    </Route>
    
                    <Route path="/classic">
                        <Classic />
                    </Route>
    
                    <Route path="/computer">
                        <Computer color={playerColor} difficulty={playerDifficulty}/>
                    </Route>

                    <Route exact path="/practice">
                        <Practice />
                    </Route>

                    <Route exact path="/tutorial">
                        <Tutorial />
                    </Route>

                    <Route exact path="/lessons">
                        <Lessons />
                    </Route>
    
                    <Route path={`/:id`}>
                        <Online socket={userSocket}/>
                    </Route>
            
                </Switch>
            </Router>
            
        );
        
    }, [playerColor, playerDifficulty, id, userSocket]);

    

 
 
    return userSocket && userSocket.connected && userSocket.id !== undefined && (
        <Router>
            <Switch>

                <Route exact path="/">
                    <Home id={id} getColor={getColor} getDifficulty={getDifficulty}/>
                </Route>

                <Route exact path="/classic">
                    <Classic />
                </Route>

                <Route exact path="/computer">
                    <Computer color={playerColor} difficulty={playerDifficulty}/>
                </Route>

                <Route exact path="/practice">
                    <Practice />
                </Route>

                <Route exact path="/tutorial">
                    <Tutorial />
                </Route>

                <Route exact path="/lessons">
                    <Lessons />
                </Route>

                <Route path={`/:id`}>
                    <Online socket={userSocket}/>
                </Route>

            </Switch>
        </Router>
        
    );
  
};
