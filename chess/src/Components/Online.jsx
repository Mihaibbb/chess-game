import React, {useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

import Board from './Board';
import OnlineBoard from "./OnlineBoard";
import RightSide from "./RightSide";
import LeftSide from "./LeftSide";

import '../styles/home.css';

export default function Online({ socket }) {

    const { id } = useParams();

    const [color, setColor] = useState(null);
    const [buttonsTarget, setButtonsTarget] = useState(null);
    const [random, setRandom] = useState(null);
    const [done, setDone] = useState(true);
    const [numberOfPlayers, setNumberOfPlayers] = useState(null);

    let players;

    socket.on("rooms", rooms => {
        const isThisRoom = [...Object.keys(rooms)].filter(room => room == id);
        if (isThisRoom === undefined) return null;
    });

    socket.emit("create-room", id);

    socket.emit("get-players");

    socket.on("players", player => {
        console.log(player, id, socket.id, JSON.parse(localStorage.getItem("socket")));
        const ownColor = localStorage.getItem("player") !== null ? localStorage.getItem("player") : player === 1 ? 1 : -1;
        setColor(ownColor);
        if (parseInt(ownColor) === -1) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                console.log(key);
                if (key.includes('online-')) localStorage.removeItem(key);
            }
        }
        
        if (localStorage.getItem("player") === null) localStorage.setItem("player", player === 1 ? player : -1);
        setNumberOfPlayers(player);
        // if (localStorage.getItem("id") === null) localStorage.setItem("id", parseInt(id));
        // else if (localStorage.getItem("id") !== parseInt(id) && localStorage.length !== 0) {
        //     localStorage.removeItem("id");
        //     localStorage.clear();
        //     // window.location.reload();
        // }
    });
   
    // if (id != JSON.parse(localStorage.getItem("socket"))) return null;
    // Request for room's players

    const returnButtonsClick = (e) => {

        let newTarget = e.target;

        while (!newTarget.classList.contains('button')) {
            newTarget = newTarget.parentElement;
        }

        setButtonsTarget(newTarget);
        setRandom(Math.random());
    };

    useEffect(() => {
        if (numberOfPlayers === null) return null;

        return (
            <div className="content">
                <div className="game">
                    <LeftSide />
                    <OnlineBoard color={color} prevButtons={buttonsTarget} random={random} socket={socket} oppId="ij3YC-_VZmKbEahoAABH" players={numberOfPlayers} />
                    <RightSide clickButton={returnButtonsClick}/>
                </div>
            </div>
        );

    }, [numberOfPlayers])

    
    return color && (
        <div className="content">
            <div className="game">
                <LeftSide />
                <OnlineBoard color={color} prevButtons={buttonsTarget} random={random} socket={socket} oppId="ij3YC-_VZmKbEahoAABH" players={numberOfPlayers} />
                <RightSide clickButton={returnButtonsClick} empty={true}/>
            </div>
        </div>
    );
};