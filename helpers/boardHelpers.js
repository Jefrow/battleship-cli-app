let readLineSync = require("readline-sync");

const getBoardSize = () => {
  let boardSize = ["4x4", "5x5", "6x6"];
  let index = readLineSync.keyInSelect(boardSize, "Pick a board size : ");
  return boardSize[index];
};

const printBoard = (gameInfo, debug) => {
  const rowLabels = ["A", "B", "C", "D", "E", "F"];
  const columnLabels = [1, 2, 3, 4, 5, 6];
  let playBoard = {};

  for (let i = 0; i < gameInfo.gameBoard.length; i++) {
    let row = rowLabels[i];
    playBoard[row] = [];

    for (let j = 0; j < gameInfo.gameBoard[i].length; j++) {
      let col = columnLabels[j];
      let shipSection = gameInfo.gameBoard[i][j];

      if (debug) {
        if (shipSection.type === "small") {
          playBoard[row][col] = "🟠";
        } else if (shipSection.type === "large") {
          playBoard[row][col] = "🔵";
        } else {
          playBoard[row][col] = "~~";
        }
      } else {
        if (shipSection.hit) {
          if (shipSection.type === "small") {
            playBoard[row][col] = "🟠";
          } else if (shipSection.type === "large") {
            playBoard[row][col] = "🔵";
          } else {
            playBoard[row][col] = "❗️";
          }
        } else {
          playBoard[row][col] = "~~";
        }
      }
    }
  }
  console.table(playBoard);
};

const makeBoard = ({ boardSize, gameBoard }) => {
  for (let i = 0; i < boardSize; i++) {
    gameBoard[i] = [];
    for (let j = 0; j < boardSize; j++) {
      let cell = gameBoard[i][j];
      cell = { type: "empty", hit: false };
      gameBoard[i].push(cell);
    }
  }
  return gameBoard;
};

module.exports = { printBoard, makeBoard, getBoardSize };
