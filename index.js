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
    }, 1000);
  } else {
    console.clear();

    printBoard(gameInfo, false);

    setTimeout(() => {
      winnerMessage();
    }, 1000);

    readLineSync.keyInYNStrict("Would you like to play again?")
      ? reset()
      : endGameMessage();
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
  console.log("Welcometo BattleShip");
  console.log("\n");
  console.log("\n");
  readLineSync.keyInYNStrict("Would you like to play?")
    ? (gameSetUp(gameInfo), printBoard(gameInfo, false), round(gameInfo))
    : console.log("Have a nice day =)");
};

initGame();
