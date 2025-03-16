//The Game Board it will acutally house all of our ship objects.
let readlinesync = require("readline-sync");
let boardSize = 4; //will need to be dynamically chosen
let numShips = [2, 3]; //will need ot be dynamically made
let enemyShips = []; //don't know if I need it
let board = [];

//Function to print the board
const printBoard = (board, debug) => {
  let gameBoard = {};
  const rowLabels = ["A", "B", "C", "D", "E", "F"];

  for (let i = 0; i < board.length; i++) {
    gameBoard[rowLabels[i]] = [];

    for (let j = 0; j < board[i].length; j++) {
      let shipSection = board[i][j];

      if (debug) {
        if (shipSection.type === "small") {
          gameBoard[rowLabels[i]][j] = "🟠";
        } else if (shipSection.type === "large") {
          gameBoard[rowLabels[i]][j] = "🔵";
        } else {
          gameBoard[rowLabels[i]][j] = "~~";
        }
      } else {
        if (shipSection.hit) {
          if (shipSection.type === "small") {
            gameBoard[rowLabels[i]][j] = "🟠";
          } else if (shipSection.type === "large") {
            gameBoard[rowLabels[i]][j] = "🔵";
          } else {
            gameBoard[rowLabels[i]][j] = "❗️";
          }
        } else {
          gameBoard[rowLabels[i]][j] = "~~";
        }
      }
    }
  }
  return gameBoard;
};

const makeBoard = (size, board) => {
  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      let cell = board[i][j];
      cell = { type: "empty", hit: false };
      board[i].push(cell);
    }
  }
  return board;
};

const randomStartCoordinates = () => {
  let x = Math.floor(Math.random() * boardSize);
  let y = Math.floor(Math.random() * boardSize);
  let direction = Math.random() < 0.5 ? "horizontal" : "vertical";

  return { x, y, direction };
};

const getShipCoordinates = (id, length) => {
  let startingCoordinates;
  do {
    startingCoordinates = randomStartCoordinates();
  } while (
    !isValid(
      startingCoordinates.x,
      startingCoordinates.y,
      startingCoordinates.direction,
      length
    )
  );
  placeShips(
    id,
    startingCoordinates.x,
    startingCoordinates.y,
    startingCoordinates.direction,
    length
  );
};

const isValid = (x, y, direction, length) => {
  //Checks for out of Bounds
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
    console.log("out of bounds");
    return false;
  }

  //Check to make sure the Ships do not overlap (let's try to refactor this later to see if we really understand what is going on. )
  for (let i = 0; i < length; i++) {
    let checkX = x + (direction === "vertical" ? i : 0);
    let checkY = y + (direction === "horizontal" ? i : 0);

    // Check if accessing an undefined cell
    if (!board[checkX] || !board[checkX][checkY]) {
      console.log(
        `Invalid placement at (${checkX}, ${checkY}) - Cell is undefined`
      );
      return false;
    }

    console.log(
      `Checking (${checkX}, ${checkY}) - Type: ${board[checkX][checkY].type}`
    );

    if (board[checkX][checkY].type !== "empty") {
      console.log(
        `Cell (${checkX}, ${checkY}) is occupied by ${board[checkX][checkY].type}`
      );
      return false;
    }
  }

  return true;
};

const placeShips = (id, x, y, direction, length) => {
  let type = length === 2 ? "small" : "large";

  for (let i = 0; i < length; i++) {
    if (direction === "horizontal") {
      board[x][y + i] = { type: type, id, hit: false };
    } else {
      board[x + i][y] = { type: type, id, hit: false };
    }
  }
};

//===============================================================
//Let's test theses functions to see how they would handling things

makeBoard(boardSize, board);

for (let i = 0; i < numShips.length; i++) {
  let id = i + 1;
  getShipCoordinates(id, numShips[i]);
}

console.table(board.map((row) => row.map((cell) => JSON.stringify(cell))));
console.table(printBoard(board, true));

/*
Specifications for the game.
  []Funtion to get the board size from the user.
  []Function to get random points for ships. 
    -Should check for vertical or horizonal placement, 
    -Ships cannot overlap
    -Ships cannot be placed diagonaly
  []Function to get a players guess
  []Function to process the guess   
  []Function to check if the ships are sunk
How many ships/board szie
  4x4:
    [] 1 large (3unit)
    [] 1 small (2nunit)
  5x5: 
    [] 1 large (3unit)
    [] 2 small (unit)
  6x6: 
    [] 2 large (3unit)
    [] 2 small (2unit)


Game Logic
*/
