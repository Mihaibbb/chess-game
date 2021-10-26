import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessPawn, faChessKnight, faChessRook, faChessBishop, faChessKing, faChessQueen } from '@fortawesome/free-solid-svg-icons';
import cloneDeep from 'lodash/cloneDeep';

import '../styles/home.css';

const HEIGHT = 85 * window.innerHeight / 100;
const SQUARES = 64;

export default function Home() {

    const createVirtualBoard = () => {
        let board = [];
        for (let i = 0; i < 8; i++) {
            let row = [];

            for (let j = 0; j < 8; j++)
                if (i === 1) row.push(-1);
                else if (i === 6) row.push(1);
                else if (i !== 7 && i !== 0) row.push(0);

            if (i === 0) row.push(-2, -3, -4, -5, -6, -4, -3, -2);
            else if (i === 7) row.push(2, 3, 4, 5, 6, 4, 3, 2);

            board.push(row);
        }

        return board;
    };

    const boardRef = useRef(null);
    const squareRef = useRef(null);
    
    const [currentMove, setCurrentMove] = useState(1);
    const [currentTotalCoords, setCurrentTotalCoords] = useState(null);
    const [oldIdx, setOldIdx] = useState(null);
    const [possibleMoves, setPossibleMoves] = useState(null);
    const [activePiece, setActivePiece] = useState(null);
    const [dropPiecer, setActiveDrop] = useState(null);
    const [virtualBoard, setVirtualBoard] = useState(createVirtualBoard());
    const [newVirtualBoard, setNewVirtualBoard] = useState(virtualBoard);
    const previewVirtualBoard = useRef(virtualBoard);
    const squareElements = useRef(null);
    const currSquareElement = useRef([]);
    const kingsMoved = useRef({"6": false, "-6": false});
    const rookMoved = useRef({
        "2": {
            "left": false,
            "right": false
        },

        "-2": {
            "left": false,
            "right": false
        }
    });

    const piecesCode = {
        1: faChessPawn,
        2: faChessRook,
        3: faChessKnight,
        4: faChessBishop,
        5: faChessQueen,
        6: faChessKing
    };

    console.log(boardRef.current);

    const minX = boardRef.current?.offsetLeft;
    const maxX = boardRef.current?.offsetLeft + boardRef.current?.offsetWidth - 25;

    const minY = boardRef.current?.offsetTop;
    const maxY = boardRef.current?.offsetTop + boardRef.current?.offsetHeight - 50;

    const squareWidth = parseInt(boardRef.current?.style.width) / 8;
    const squareHeight = parseInt(boardRef.current?.style.height) / 8;

    console.log(squareWidth, squareHeight);


    const player2Color = virtualBoard[0][0] > 0 ? "white" : "black";
    const player1Color = player2Color === "white" ? "black" : "white";

    // Function for checking the check 

    const getPossibleMoves = (pieceCode, coords, board) => {
        const piece = Math.abs(pieceCode);
        let possibleMoves = [];

        // Current coordonates
        const currentX = parseInt(coords / 8);
        const currentY = coords % 8; 

        console.log(currentX, currentY);

        // Code for pawn
        if (piece === 1) {

            // Coordonates for possible moves
            const newDiagX = currentX - pieceCode;
            const newDiagY = currentY + pieceCode;
            const newDiagY2 = currentY - pieceCode;
            
            const newCoords = newDiagX * 8 + newDiagY;
            const newCoords2 = newDiagX * 8 + newDiagY2;
            const newFrontCoords = newDiagX * 8 + currentY;
            const frontElement = board[newDiagX] &&
                                 board[newDiagX][currentY] &&
                                 board[newDiagX][currentY];

            console.log(frontElement);

            if (frontElement === 0) possibleMoves.push(newFrontCoords);

            console.log(possibleMoves);
            
            const diagonalElement = board[newDiagX] &&
                                    board[newDiagX][newDiagY] &&
                                    board[newDiagX][newDiagY];

            const diagonalElement2 = board[newDiagX] &&
                                     board[newDiagX][newDiagY2] &&
                                     board[newDiagX][newDiagY2];
            
            if ((pieceCode < 0 && currentX === 1) || (pieceCode > 0 && currentX === 6)) {
                const newFrontX = currentX - (pieceCode * 2);
                console.log(newFrontX);
                const newFrontCoords = newFrontX * 8 + currentY;

                const newCoordsSquare = board[newFrontX][currentY];
                if (newCoordsSquare === 0) possibleMoves.push(newFrontCoords);
                
            }

            if (diagonalElement2 !== 0) {
                if (checkOppositeColor(pieceCode, diagonalElement2)) possibleMoves.push(newCoords2);
            }
           
            if (diagonalElement === 0) return possibleMoves;
            
            if (checkOppositeColor(pieceCode, diagonalElement)) possibleMoves.push(newCoords);

        } else if (piece === 2) {

            if (currentY > 1) {
                for (let i = currentY - 1; i >= 0; i--) {
                    const newCoords = currentX * 8 + i;
                    
                    const newX = parseInt(newCoords / 8);
                    const newY = parseInt(newCoords % 8);

                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];

                    if (newSquare !== undefined) {
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);    
 
                        console.log('empty text just for fun', newSquare);
                    }
                }
            }

            if (currentY < 7) {
                for (let i = currentY + 1; i < 8; i++) {
                    const newCoords = currentX * 8 + i;
                    const newX = parseInt(newCoords / 8);
                    const newY = parseInt(newCoords % 8);
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];

                    if (newSquare !== undefined) {
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                             break;
                        } else possibleMoves.push(newCoords);    

                        console.log('empty text just for fun', newSquare);
                    }
                }
            } 

            if (currentX > 1) {
                for (let i = currentX - 1; i >= 0; i--) {
                    const newCoords = i * 8 + currentY;
                    const newX = parseInt(newCoords / 8);
                    const newY = parseInt(newCoords % 8);
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];

                    if (newSquare !== undefined) {
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);

                                           
                        console.log('empty text just for fun', newSquare);
                    }
                }
            }

            if (currentX < 7) {
                for (let i = currentX + 1; i < 8; i++) {
                    const newCoords = i * 8 + currentY;
                    const newX = parseInt(newCoords / 8);
                    const newY = parseInt(newCoords % 8);
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];

                    if (newSquare !== undefined) {
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);
                        
                        console.log('empty text just for fun', newSquare);
                    }

                }
            } 
        } else if (piece === 3) {

            const pieceMoves = [
                {
                    x: currentX - 2,
                    y: currentY - 1
                },
                
                {
                    x: currentX - 2,
                    y: currentY + 1
                },

                {
                    x: currentX + 2,
                    y: currentY - 1
                },

                {
                    x: currentX + 2,
                    y: currentY + 1
                },

                {
                    x: currentX - 1,
                    y: currentY - 2
                },

                {
                    x: currentX - 1,
                    y: currentY + 2
                },

                {
                    x: currentX + 1,
                    y: currentY - 2
                },

                {
                    x: currentX + 1,
                    y: currentY + 2
                }
            ];

            pieceMoves.forEach(pieceMove => {
                const newCoords = pieceMove.x * 8 + pieceMove.y;
                const newSquare = board[pieceMove.x] &&
                                  board[pieceMove.x][pieceMove.y] &&
                                  board[pieceMove.x][pieceMove.y];

                if (newSquare !== undefined && pieceMove.x >= 0 && pieceMove.y >= 0 && pieceMove.x < 8 && pieceMove.y < 8) {
                    if (newSquare !== 0) {
                        if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                    }
                    else possibleMoves.push(newCoords);

                    console.log(newSquare, pieceMove.x, pieceMove.y)
                }
            });
        } else if (piece === 4) {
            if (currentX >= 1 && currentY >= 1) {
                for (let i = 1; i < 8; i++) {
                    const newX = currentX - i;
                    const newY = currentY - i;
                    const newCoords = newX * 8 + newY;
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];
                    
                    if (newSquare !== undefined && newX >= 0 && newY >= 0 && newX < 8 && newY < 8) {
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            console.log(possibleMoves);
                            break;
                        } else possibleMoves.push(newCoords);

                        console.log('empty text just for fun', newSquare, newCoords);
                    }
                }
            }

            if (currentX >= 1 && currentY <= 7) {
                for (let i = 1; i < 8; i++) {
                    const newX = currentX - i;
                    const newY = currentY + i;
                    const newCoords = newX * 8 + newY;
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];
                    
                    if (newSquare !== undefined && newX >= 0 && newY >= 0 && newX < 8 && newY < 8) {
                        
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            console.log(possibleMoves);
                            break;
                        } else possibleMoves.push(newCoords);

                        console.log('empty text just for fun', newSquare, newCoords);
                    }

                }
            } 

            if (currentX <= 7 && currentY >= 0) {
                for (let i = 1; i < 8; i++) {
                    const newX = currentX + i;
                    const newY = currentY - i;
                    const newCoords = newX * 8 + newY;
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];
  
                    if (newSquare !== undefined && newX >= 0 && newY >= 0 && newX < 8 && newY < 8) {
                        
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            console.log(possibleMoves);
                            break;
                        } else possibleMoves.push(newCoords);

                        console.log('empty text just for fun', newSquare, newCoords);
                    }
                }
            }

            if (currentX <= 7 && currentY <= 7) {
                for (let i = 1; i < 8; i++) {
                    const newX = currentX + i;
                    const newY = currentY + i;
                    const newCoords = newX * 8 + newY;
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];

                    if (newSquare !== undefined && newX >= 0 && newY >= 0 && newX < 8 && newY < 8) {
                       
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            console.log(possibleMoves, newSquare, board, newX, newY);
                            break;
                        } else possibleMoves.push(newCoords);

                        console.log('empty text just for fun', newSquare, newCoords);
                    }

                }
            } 
        } else if (piece === 5) {
            console.log(board);

            if (currentY > 1) {
                for (let i = currentY - 1; i >= 0; i--) {
                    const newCoords = currentX * 8 + i;
                    const newX = parseInt(newCoords / 8);
                    const newY = parseInt(newCoords % 8);
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];

                    if (newSquare !== undefined) {
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);   
                                         
                        console.log('empty text just for fun', newSquare);
                    }
                }
            }

            if (currentY < 7) {
                for (let i = currentY + 1; i < 8; i++) {
                    const newCoords = currentX * 8 + i;
                    const newX = parseInt(newCoords / 8);
                    const newY = parseInt(newCoords % 8);
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];

                    if (newSquare !== undefined) {   

                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);
        
                        console.log('empty text just for fun', possibleMoves);
                    }
                }
            } 

            if (currentX > 1) {
                for (let i = currentX - 1; i >= 0; i--) {
                    const newCoords = i * 8 + currentY;
                    const newX = parseInt(newCoords / 8);
                    const newY = parseInt(newCoords % 8);
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];

                    if (newSquare !== undefined) {
                        if (newSquare !== 0) {
                            console.log(board, board[newX][newY], pieceCode, newCoords);
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);

                        console.log('empty text just for fun', newCoords, possibleMoves);
                    }   
                }
            }

            if (currentX < 7) {
                for (let i = currentX + 1; i < 8; i++) {
                    const newCoords = i * 8 + currentY;
                    const newX = parseInt(newCoords / 8);
                    const newY = parseInt(newCoords % 8);
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];
                    
                    if (newSquare !== undefined) {
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);
        
                        console.log('empty text just for fun', newSquare, possibleMoves);
                    }

                }
            }
            
            if (currentX >= 1 && currentY >= 1) {
                for (let i = 1; i < 8; i++) {
                    const newX = currentX - i;
                    const newY = currentY - i;
                    const newCoords = newX * 8 + newY;
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];
                    console.log(newSquare, newX, newY, pieceCode);
                    if (newSquare !== undefined) {
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);

                        console.log('empty text just for fun', newSquare, possibleMoves);
                    }
                }
            }

            if (currentX >= 1 && currentY <= 7) {
                for (let i = 1; i < 8; i++) {
                    const newX = currentX - i;
                    const newY = currentY + i;
                    const newCoords = newX * 8 + newY;
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];
                    console.log(newSquare, newX, newY);
                    if (newSquare !== undefined) {
                        
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);

                        console.log('empty text just for fun', newSquare, possibleMoves);
                    }
                }
            } 

            if (currentX <= 7 && currentY >= 0) {
                for (let i = 1; i < 8; i++) {
                    const newX = currentX + i;
                    const newY = currentY - i;
                    const newCoords = newX * 8 + newY;
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];
        
                    if (newSquare !== undefined) {
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);

                        console.log('empty text just for fun', newSquare, possibleMoves);
                    }
                }
            }

            if (currentX <= 7 && currentY <= 7) {
                for (let i = 1; i < 8; i++) {
                    const newX = currentX + i;
                    const newY = currentY + i;
                    const newCoords = newX * 8 + newY;
                    const newSquare = board[newX] &&
                                      board[newX][newY] &&
                                      board[newX][newY];
                   
                    if (newSquare !== undefined) {
                        console.log(newX, newY);
                        if (newSquare !== 0) {
                            if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                            break;
                        } else possibleMoves.push(newCoords);

                        console.log('empty text just for fun', newSquare, possibleMoves);
                    }

                }
            } 
        } else if (piece === 6) {
            const pieceMoves = [
                {
                    x: currentX,
                    y: currentY - 1
                },
                
                {
                    x: currentX,
                    y: currentY + 1
                },

                {
                    x: currentX - 1,
                    y: currentY
                },

                {
                    x: currentX + 1,
                    y: currentY 
                },

                {
                    x: currentX - 1,
                    y: currentY - 1
                },

                {
                    x: currentX - 1,
                    y: currentY + 1
                },

                {
                    x: currentX + 1,
                    y: currentY - 1
                },

                {
                    x: currentX + 1,
                    y: currentY + 1
                }
            ];

            pieceMoves.forEach(pieceMove => {
                const newCoords = pieceMove.x * 8 + pieceMove.y;
                const newSquare = board[pieceMove.x] &&
                                  board[pieceMove.x][pieceMove.y] &&
                                  board[pieceMove.x][pieceMove.y];
                if (newSquare !== undefined && pieceMove.x >= 0 && pieceMove.y >= 0 && pieceMove.x < 8 && pieceMove.y < 8) {
                    if (newSquare !== 0) {
                        if (checkOppositeColor(pieceCode, newSquare)) possibleMoves.push(newCoords);
                    } else possibleMoves.push(newCoords);

                    console.log(newSquare, pieceMove.x, pieceMove.y)
                }
            });

            // Movement for rocade
            console.log(kingsMoved.current[pieceCode]);
            if (!kingsMoved.current[pieceCode]) {
                console.log('rocade', rookMoved);
                const smallRocadeCoords = currentX * 8 + currentY + 2;
                const bigRocadeCoords = currentX * 8 + currentY - 3;
                const smallRocadeRookCoords = pieceCode < 0 ? 5 : 61;
                const bigRocadeRookCoords = pieceCode < 0 ? 2 : 58;

                const smallRocadeSquare = board[currentX] &&
                                          board[currentX][currentY + 2] &&
                                          board[currentX][currentY + 2];

                const bigRocadeSquare = board[currentX] &&
                                        board[currentX][currentY - 3] &&
                                        board[currentX][currentY - 3];

                let smallRocadeEmpty = true, bigRocadeEmpty = true;

                // Checking if the squares between king and rook are empty 
                for (let i = coords + 1; i <= smallRocadeCoords; i++) {
                    const rocadeX = parseInt(i / 8);
                    const rocadeY = i % 8;
                    console.log(i, board[rocadeX][rocadeY]);
                    if (board[rocadeX][rocadeY] !== 0) smallRocadeEmpty = false;
                } 

                for (let i = bigRocadeCoords; i < coords; i++) {
                    const rocadeX = parseInt(i / 8);
                    const rocadeY = i % 8;
                    console.log('gdjigdfjhh');
                    if (board[rocadeX][rocadeY] !== 0) bigRocadeEmpty = false;
                } 

                console.log(smallRocadeEmpty, bigRocadeEmpty)

                if (smallRocadeSquare !== undefined && smallRocadeEmpty && !rookMoved.current[pieceCode < 0 ? "-2" : "2"]["right"]) {
                    possibleMoves.push({
                        king: smallRocadeCoords,
                        rook: smallRocadeRookCoords,
                        rocade: "s"
                    });
                } 

                if (bigRocadeSquare !== undefined && bigRocadeEmpty && !rookMoved.current[pieceCode < 0 ? "-2" : "2"]["left"]) {
                    possibleMoves.push({
                        king: bigRocadeCoords,
                        rook: bigRocadeRookCoords,
                        rocade: "b"
                    });
                }

                

                // possibleMoves.push(smallRocade);
                // possibleMoves.push(bigRocade);
            }
        }
      
        return possibleMoves;
    };

    const dragPiece = (e, square) => {
    
        const element = e.target.classList.contains('piece') ? e.target : e.target.parentElement;
        const containerElement = element.parentElement;
        console.log(containerElement);
        
        console.log(minX, maxX);
        
        const x = e.clientX - 20;
        const y = e.clientY - 20;
    
        containerElement.style.position = 'absolute';
        containerElement.style.left = `${x}px`;
        containerElement.style.top = `${y}px`;
    
        setActivePiece(containerElement);
        setActiveDrop(parseInt(containerElement.classList[2]));
        let newTotalCoords;
        currSquareElement.current.forEach((square, idx) => {
            if (square === containerElement.parentElement) newTotalCoords = idx;
        });

        setOldIdx(newTotalCoords);

        const currPossibleMoves = getPossibleMoves(square, newTotalCoords, newVirtualBoard);
        console.log(currPossibleMoves, square, currentMove, newTotalCoords);
        if (checkOppositeColor(square, currentMove)) setPossibleMoves([]);
        else setPossibleMoves(currPossibleMoves);
       
    };
    
    const movePiece = e => {
        if (!activePiece) return;
        const x = e.clientX - 20;
        const y = e.clientY - 20;
        activePiece.style.position = 'absolute';
        activePiece.style.left = `${x > maxX ? maxX : x < minX ? minX : x}px`;
        activePiece.style.top = `${y > maxY ? maxY : y < minY ? minY : y}px`;
        activePiece.style.zIndex = 3;

        const ySquare = (parseInt(activePiece.style.left) - boardRef.current?.offsetLeft) / squareWidth;
        const xSquare = (parseInt(activePiece.style.top) - boardRef.current?.offsetTop) / squareHeight;
        
        squareRef.current = {x: Math.round(xSquare), y: Math.round(ySquare)};
        console.log(squareRef.current);
    };
    
    const dropPiece = (e, pieceCode) => {
        console.log(oldIdx);
        if (!activePiece || !squareRef.current || oldIdx === null) return;
        if (!possibleMoves) return;
        setActivePiece(null);
        console.log(squareRef.current?.x, squareRef.current?.y)
        const currentX = squareRef.current?.x;
        const currentY = squareRef.current?.y;
        const idx = currentX * 8 + currentY;
        const oldX = parseInt(oldIdx / 8);
        const oldY = oldIdx % 8;
        console.log(oldIdx);

        const sameIndex = possibleMoves.find(move => {
            return idx === move;
        });

        console.log(possibleMoves);

        activePiece.style.left = 'initial';
        activePiece.style.top= 'initial';
        activePiece.position = 'relative';
        activePiece.style.zIndex = 'initial';

        console.log(previewVirtualBoard.current);

        const oldBoard = cloneDeep(previewVirtualBoard.current);

        const otherBoard = cloneDeep(previewVirtualBoard.current);
        console.log(oldX, oldY);
        otherBoard[oldX][oldY] = 0;
        console.log(pieceCode, otherBoard);
        otherBoard[currentX][currentY] = pieceCode;
       
        previewVirtualBoard.current = otherBoard;
        console.log('afdsokogjfdjjhihijhpjhijhipfghjpifjhpgjhpijhpfgjh', previewVirtualBoard.current);

        let squaresVirtualBoard = [];

        previewVirtualBoard.current.forEach(row => {
            row.forEach(square => squaresVirtualBoard.push(square));
        });
        
        let kingSquare;

        squaresVirtualBoard.forEach((square, totalIdx) => {
            const iconColor = square && square < 0 ? -1 : 1;

            const x = parseInt(totalIdx / 8);
            const y = parseInt(totalIdx % 8);

            if (square === currentMove * 6 && !checkOppositeColor(iconColor, currentMove)) kingSquare = totalIdx;
        });  

        console.log(kingSquare, currentMove);

        const check = checkCheck(kingSquare, currentMove * 6);
        console.log(check);
        if (sameIndex !== undefined && !check) {
            console.log('hjhgjghjjpgihpjigfhjiphhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
            const squareDOM = currSquareElement.current[idx];
            const squarePiece = squareDOM && squareDOM.querySelector('[code]');
            const dropPieceCode = squarePiece && squarePiece.getAttribute('code');
            squareRef.current = null;
        
            if (dropPieceCode && !checkOppositeColor(pieceCode, dropPieceCode)) return;
            else if (dropPieceCode && checkOppositeColor(pieceCode, dropPieceCode)) {
                squareDOM.innerHTML = '';
            }

            console.log(dropPiecer);
            
            squareDOM && squareDOM.appendChild(activePiece);
            if (Math.abs(dropPiecer) === 6) {
                kingsMoved.current[dropPiecer] = true;
                console.log(kingsMoved.current[dropPiecer])
            } else if (dropPiecer === 2) {
                rookMoved.current[dropPiecer][oldIdx === 56 ? "left" : oldIdx === 63 ? "right" : null] = true;
                console.log(rookMoved.current[2]["right"]);
            } else if (dropPiecer === -2) {
                rookMoved.current[dropPiecer][oldIdx === 0 ? "left" : oldIdx === 7 ? "right" : null] = true;
            }
   
            let cloneVirtualBoard = cloneDeep(newVirtualBoard);

            console.log(oldX, oldY, currentX, currentY);

            cloneVirtualBoard[oldX][oldY] = 0;
            cloneVirtualBoard[currentX][currentY] = pieceCode;
            
            // Checking if it's giving checkmate to the opponent
            let oppositeKingSquare, newBoard = [];

            cloneVirtualBoard.forEach(row => {
                row.forEach(square => newBoard.push(square));
            });

            newBoard.forEach((square, totalIdx) => {
                if (square === -currentMove * 6 && checkOppositeColor(square, currentMove)) oppositeKingSquare = totalIdx;
            });

            console.log(oppositeKingSquare);
            
            const checkMateOpponent = checkCheckmate(-currentMove * 6, cloneVirtualBoard);
            console.log(checkMateOpponent);
            setCurrentMove(-currentMove);

            setNewVirtualBoard(cloneVirtualBoard);
            console.log(cloneVirtualBoard);

            // console.log(checkMateOpponent);
            
        } else if (sameIndex === undefined) {
            console.log('inside else if');
            previewVirtualBoard.current = oldBoard;
        }
        
    };

    const checkOppositeColor = (piece1, piece2) => {
        if (piece1 < 0 && piece2 > 0) return true;
        else if (piece1 > 0 && piece2 < 0) return true;
        return false;
    }

    const checkCheck = (kingSquare, kCode, isFromCheckMate = false) => {
        console.log('lalalalaalaallapgdkkdfpgogjodjfgjdp', previewVirtualBoard.current, kingSquare);
        console.log(kingSquare);
        let currBoard = [];

        previewVirtualBoard.current.forEach(row => {
            row.forEach(square => {
                currBoard.push(square);
            });
        });

        const oppositeSquaresClone = currBoard.map((square, idx) => {
    
            if (checkOppositeColor(kCode, square)) return {
                pieceCode: square,
                coords: idx
            };
        });

        console.log(oppositeSquaresClone);

        const oppositeSquares = oppositeSquaresClone.filter(square => square !== undefined);

        console.log(oppositeSquares, kingSquare);

        // Checking if king is attacked

        const check = oppositeSquares.some(square => {
            console.log(square.pieceCode);
            const possibleMovesCheck = getPossibleMoves(square.pieceCode, square.coords, previewVirtualBoard.current);
            console.log(possibleMoves);
            return possibleMovesCheck.some(currSquare => {
                
                console.log(currSquare, kingSquare);
                return currSquare === kingSquare;
            });
        });

        const oldBoard = cloneDeep(previewVirtualBoard.current);

        if (check && !isFromCheckMate) checkCheckmate(kCode, newVirtualBoard);

        previewVirtualBoard.current = oldBoard;

        return check;
    };

    // Checking the check-mate

    const checkCheckmate = (kCode, board) => {

        console.log(board);
        const constantBoard = board;
        let currBoard = [];

        board.forEach(row => {
            row.forEach(square => currBoard.push(square));
        });

        const mySquaresClone = currBoard.map((square, idx) => {
            if (!checkOppositeColor(square, kCode) && square !== 0) return {
                pieceCode: square,
                coords: idx
            }
        });

        const mySquares = mySquaresClone.filter(square => square !== undefined);
        console.log(mySquares);
        let checkMate = true;
        mySquares.forEach(square => {

            // Next possible moves to check if it's checkmate
            const possibleMovesCheckmate = getPossibleMoves(square.pieceCode, square.coords, previewVirtualBoard.current);
            console.log(possibleMoves);

            possibleMovesCheckmate.forEach(move => {
                const currX = parseInt(square.coords / 8);
                const currY = square.coords % 8;
                const newX = parseInt(move / 8);
                const newY = move % 8;
                const newBoard = cloneDeep(constantBoard);

                if (newBoard[currX][currY] !== kCode) {
                    newBoard[currX][currY] = 0;

                    if (newBoard[newX][newY] !== 0) {
                        const enemyPieceNumber = newBoard[newX][newY];
                        if (checkOppositeColor(enemyPieceNumber, square.pieceCode)) newBoard[newX][newY] = square.pieceCode;
                    } else newBoard[newX][newY] = square.pieceCode;

                    previewVirtualBoard.current = cloneDeep(newBoard);

                    let allInOneBoard = [];

                    previewVirtualBoard.current.forEach(row => {
                        row.forEach(square => allInOneBoard.push(square));
                    });

                    console.log(previewVirtualBoard.current, kCode);

                    console.log(allInOneBoard);

                    let kingSquare = [];

                    allInOneBoard.forEach((square, idx) => {
                        if (square === kCode) kingSquare = idx;
                    });

                    console.log(kingSquare);
                    
                    const newBoardCheck = checkCheck(kingSquare, kCode, true);
                    console.log(newBoardCheck, kingSquare, kCode);
                    if (!newBoardCheck) checkMate = false;
                } 
            });
        });

       console.log(checkMate);
       return checkMate;
        
    };


    const addSquares = () => {
        let squareComponents = [];
        console.log(virtualBoard);
        const board = virtualBoard.map((row, rowIdx) => {
            
            const rows = row.map((square, squareIdx) => {
                const totalIdx = rowIdx * 8 + squareIdx + (rowIdx % 2 !== 0 ? 1 : 0);
                const realIdx = rowIdx * 8 + squareIdx;
                const squareComponent = 
                    <div className={`square ${totalIdx % 2 !== 0 ? "even" : ""}`} key={squareIdx} ref={ref => { 
                        currSquareElement.current[realIdx] = ref;
                    }}>
                        {square !== 0 && (
                            <div 
                                className={`icon-container ${square < 0 ? -1 : 1} ${square}`}
                                onMouseDown={e => dragPiece(e, square, totalIdx)}
                                onMouseMove={e => movePiece(e)}
                                onMouseUp={e => dropPiece(e, square)} 
                            >
                                <FontAwesomeIcon 
                                    icon={piecesCode[Math.abs(square).toString()]} 
                                    className='piece' 
                                    color={square > 0 ? "#fff" : "initial"} 
                                    style={{stroke: square < 0 ? "#fff" : "#000"}} 
                                    code={square}
                                />
                            </div>
                        )}
                    </div>;

                return squareComponent;
            });
            return (
                <div className="row" key={rowIdx} style={{height: `${100 / rows.length}%`}}>
                    {rows}
                </div>
            );
        });

        squareElements.current = squareComponents;

        return board;
    };

    return (
        <div className="board" style={{width: `${HEIGHT}px`, height: `${HEIGHT}px`}} ref={boardRef}>
            {addSquares()}
        </div>
    );
};