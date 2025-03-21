//The Game Board it will acutally house all of our ship objects.
let readLineSync = require("readline-sync");
let gameInfo = {
  numShips: [],
  boardSize: 0,
  sunkShips: 0,
};
let board = [];
const rowLabels = ["A", "B", "C", "D", "E", "F"];

//Function to print the board
const printBoard = (board, debug) => {
  let gameBoard = {};

  for (let i = 0; i < board.length; i++) {
    gameBoard[rowLabels[i]] = [];

    for (let j = 0; j < board[i].length; j++) {
      let shipSection = board[i][j];

      //Maybe use switch statements instead of if else something to think about.
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
  console.table(gameBoard);
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

const randomStartCoordinates = (size) => {
  let x = Math.floor(Math.random() * size);
  let y = Math.floor(Math.random() * size);
  let direction = Math.random() < 0.5 ? "horizontal" : "vertical";

  return { x, y, direction };
};

const getShipCoordinates = (id, length, size) => {
  let startingCoordinates;
  do {
    startingCoordinates = randomStartCoordinates(size);
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

const isValid = (x, y, direction, length, size) => {
  if (x < 0 || x >= size || y < 0 || y >= size) {
    console.log("out of bounds");
    return false;
  }
  for (let i = 0; i < length; i++) {
    let checkX = x + (direction === "vertical" ? i : 0);
    let checkY = y + (direction === "horizontal" ? i : 0);

    if (!board[checkX] || !board[checkX][checkY]) {
      return false;
    }
    if (board[checkX][checkY].type !== "empty") {
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

const getBoardSize = () => {
  let boardSize = ["4x4", "5x5", "6x6"];
  let index = readLineSync.keyInSelect(boardSize, "Pick a board size : ");
  return boardSize[index];
};

const gameInfoSetup = (string) => {
  if (string === "6x6") {
    gameInfo.numShips = [2, 2, 3, 3];
    gameInfo.boardSize = 6;
  } else if (string === "5x5") {
    gameInfo.numShips = [2, 2, 3];
    gameInfo.boardSize = 5;
  } else if (string === "4x4") {
    gameInfo.numShips = [2, 3];
    gameInfo.boardSize = 4;
  }
};

const initValidPoints = (size) => {
  const maxX = String.fromCharCode("a".charCodeAt(0) + (gridSize - 1));
  const maxY = getMaxValue(size);

  return new RegExp(`^[a-${maxX}A-${maxX.toUpperCase()}]${maxY}$`);
};

const getPlayerGuess = (validPoints) => {
  return readLineSync.question("Enter a location to strik... ie:'A1' :  ", {
    limit: validPoints,
    limitMessage: "Not a valid point on the map, please try again. ",
  });
};

const isDuplicate = (x, y) => {
  return board[x][y].hit;
};

const handleGuess = (guess) => {
  gameInfo.prevLocation.push(guess);

  let x = rowLabels.indexOf(guess.slice(0, 1));
  let y = guess.slice(1) - 1;

  return { x, y };
};

const handleGuessResult = (x, y) => {
  if (board[x][y].type !== "empty" && !board[x][y].hit) {
    console.log("Hit");
    board[x][y].hit = true;
    let shipId = board[x][y];
    if (isShipSunk(board, shipId)) {
      console.log(`Ship ${shipId} has been sunk!`);
    }
  } else {
    console.log("MISS");
    board[x][y].hit = true;
  }
};

const isShipSunk = (board, shipId) => {
  for (let i = 0; i < board.length; i++) {
    let row = board[i];
    for (let j = 0; j < row.length; j++) {
      let cell = board[i][j];
      if (cell.id === shipId && !cell.hit) {
        return false;
      }
    }
  }
  return true;
};

const gameSetUp = () => {
  let sizeString = getBoardSize();

  gameInfoSetup(sizeString);

  let numShips = gameInfo.numShips;
  let boardSize = gameInfo.boardSize;

  makeBoard(boardSize, board);

  for (let i = 0; i < numShips.length; i++) {
    let shipId = i + 1;
    let shiplength = numShips[i];

    getShipCoordinates(shipId, shiplength, boardSize);
  }
  console.clear();
};

gameSetUp();
printBoard(board, true);

//===============================================================//
//Let's test theses functions to see how they would handling things

/*
  [x]]Test the functions to make sure they are working properly
  [ ]Getting the grid size from the user and actually using that gridsize 
  [ ]creating the numbers of ships per gridsize
  [ ]placing the right ammount of ships in the right orientation
*/

/*
I. Specifications for the game.
  [ ]Funtion to get the board size from the user.
  [x]Function to get random points for ships. 
    -Should check for vertical or horizonal placement, 
    -Ships cannot overlap
    -Ships cannot be placed diagonaly
  [ ]Function to get a players guess
  [ ]Function to process the guess   
  [ ]Function to check if the ships are sunk
II. How many ships/board szie
  4x4:
    [ ] 1 large (3unit)
    [ ] 1 small (2nunit)
  5x5: 
    [ ] 1 large (3unit)
    [ ] 2 small (2unit)
  6x6: 
    [ ] 2 large (3unit)
    [ ] 2 small (2unit)

III. Edge cases For the game.
  -Things that would dynamically need to change. 
    [ ]Grid Sizse
    [ ]Number of ships(depending on the grid size...See III.)
      if(size === "6x6"){
        gridSize = 6;
        numShips = [2,2,3,3];
      } else if (size = 5X5) {
        gridSize = 5; 
        numShips = [2,2,3];
      } else {
        gridSize = 4; 
        numShips = [2,3]; 
      }
*/
