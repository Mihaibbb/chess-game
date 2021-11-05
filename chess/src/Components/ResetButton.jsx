import React, { Component } from "react";

export default class ResetButton extends React.Component {

    resetGame() {
        localStorage.clear();
        window.location.reload();
    }

    render() {
        return (
            <div className="reset-button" onClick={() => this.resetGame()}>
                <h2>Reset Game</h2>
            </div>
        );
    }
 
};