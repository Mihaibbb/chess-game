import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "../styles/header.css";
import en from "../image/en.png";
import ro from "../image/ro.webp";
import hu from "../image/hu.png";


export default function Header({languageCallback}) {

    const langRef = useRef();
    const [lang, setLang] = useState(localStorage.getItem("language") ? JSON.parse(localStorage.getItem("language")) : "en");

    return (
        <header>
            <ul className="items">
                <li className="item">
                    <Link to="/">
                        <p>{lang === "en" ? "Home" : lang === "ro" ? "Acasa" : "Itthon"}</p>
                    </Link>
                </li>
                <li className="item">
                    <Link to="/tutorial">
                        <p>{lang === "en" ? "Tutorial" : lang === "ro" ? "Tutorial" : "Oktatóanyag"}</p>
                    </Link>
                </li>
                <li className="item">
                    <Link to="/lessons">
                        <p>{lang === "en" ? "Lessons" : lang === "ro" ? "Lecţii" : "Leckék"}</p>
                    </Link>
                </li>

                <li className="item">
                    <Link to="/practice">
                        <p>{lang === "en" ? "Practice" : lang === "ro" ? "Practică" : "Gyakorlat"}</p>
                    </Link>
                </li>

                <li className="item">
                    <FontAwesomeIcon 
                        icon={faGlobe}
                        className="globe-icon"
                        onClick={() => langRef.current.classList.toggle("show")}
                    />
                    <ul className="options_lang" ref={langRef}>
                        <li className="lang" onClick={() => {
                            languageCallback("en");
                            setLang("en");
                            langRef.current.classList.remove("show");
                        }}>
                           
                            <img src={en} alt="Great Britain's flag" />
                        </li>
                        <li className="lang" onClick={() => {
                            languageCallback("ro");
                            setLang("ro");
                            langRef.current.classList.remove("show");
                        }}>
                            
                            <img src={ro} alt="Romania's flag" />
                        </li>
                        <li className="lang last" onClick={() => {
                            languageCallback("hu");
                            setLang("hu");
                            langRef.current.classList.remove("show");
                        }}>
                         
                            <img src={hu} alt="Hungary's flag" />
                        </li>
                    </ul>
                </li>
               
            </ul>
        </header>
    );
}