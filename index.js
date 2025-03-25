let readLineSync = require("readline-sync");

const { allShipsSunk, getShipCoordinates } = require("./helpers/shipHelpers");
const {
  getBoardSize,
  makeBoard,
  printBoard,
} = require("./helpers/boardHelpers");
const {
  gameInfoSetup,
  initValidPoints,
  isDuplicate,
  getPlayerGuess,
  handleGuess,
  handleGuessResult,
  winnerMessage,
  endGameMessage,
  welcomeMessage,
  noThanks,
} = require("./helpers/gameHelpers");
let gameInfo = {
  numShips: [],
  boardSize: 0,
  sunkShips: 0,
  gameBoard: [],
};

const gameSetUp = (gameInfo) => {
  let sizeString = getBoardSize();

  gameInfoSetup(sizeString, gameInfo);

  makeBoard(gameInfo);

  for (let i = 0; i < gameInfo.numShips.length; i++) {
    let shipId = i + 1;
    let shiplength = gameInfo.numShips[i];

    getShipCoordinates(shipId, shiplength, gameInfo);
  }

  console.clear();
};

const round = (gameInfo) => {
  let playerGuess, guessCoords;
  let validPoints = initValidPoints(gameInfo);

  do {
    playerGuess = getPlayerGuess(validPoints).toUpperCase();
    guessCoords = handleGuess(playerGuess);
  } while (isDuplicate(guessCoords.x, guessCoords.y, gameInfo.gameBoard));

  handleGuessResult(guessCoords.x, guessCoords.y, gameInfo);

  if (!allShipsSunk(gameInfo)) {
    setTimeout(() => {
      console.clear();

      printBoard(gameInfo, false);

      round(gameInfo, validPoints);
    }, 1500);
  } else {
    console.clear();

    printBoard(gameInfo, false);

    setTimeout(() => {
      winnerMessage();

      readLineSync.keyInYNStrict("Would you like to play again?")
        ? reset()
        : endGameMessage();
    }, 1000);
  }
};

const reset = () => {
  return (gameInfo = {
    numShips: [],
    boardSize: 0,
    sunkShips: 0,
    gameBoard: [],
  });
};

const initGame = () => {
  console.clear();
  welcomeMessage();
  console.log("\n");
  console.log("\n");
  readLineSync.keyInYNStrict("Would you like to play?")
    ? (gameSetUp(gameInfo), printBoard(gameInfo, false), round(gameInfo))
    : noThanks();
};

initGame();
