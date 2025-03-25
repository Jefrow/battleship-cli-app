let readLineSync = require("readline-sync");
const { isHit, isShipSunk } = require("./shipHelpers");

const gameInfoSetup = (string, gameInfo) => {
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

const initValidPoints = (gameInfo) => {
  const maxX = String.fromCharCode(
    "a".charCodeAt(0) + (gameInfo.boardSize - 1)
  );
  const maxY = `[1-${gameInfo.boardSize}]`;
  return new RegExp(`^[a-${maxX}A-${maxX.toUpperCase()}]${maxY}$`);
};

const getPlayerGuess = (validPoints) => {
  return readLineSync.question("Enter a location to strik... ie:'A1' :  ", {
    limit: validPoints,
    limitMessage: "Not a valid point on the map, please try again. ",
  });
};

const isDuplicate = (x, y, board) => {
  if (board[y][x].hit) {
    console.log("Location already Hit, Guess another location");
    return true;
  }
  return false;
};

const handleGuess = (guess) => {
  const rowLabels = ["A", "B", "C", "D", "E", "F"];
  let y = rowLabels.indexOf(guess.slice(0, 1));
  let x = guess.slice(1) - 1;

  return { x, y };
};

const handleGuessResult = (x, y, gameInfo) => {
  if (isHit(x, y, gameInfo.gameBoard)) {
    console.log("Hit");
    let shipId = gameInfo.gameBoard[y][x].id;
    gameInfo.gameBoard[y][x].hit = true;
    if (isShipSunk(shipId, gameInfo.gameBoard)) {
      gameInfo.sunkShips += 1;
      console.log(`Ship ${shipId} has been sunk`);
    }
  } else {
    console.log("MISS");
    gameInfo.gameBoard[y][x].hit = true;
  }
};

const winnerMessage = () => {
  console.clear();
  return console.log(`
    ____    ____  ______    __    __     ____    __    ____  __  .__   __. 
    \\   \\  /   / /  __  \\  |  |  |  |    \\   \\  /  \\  /   / |  | |  \\ |  | 
     \\   \\/   / |  |  |  | |  |  |  |     \\   \\/    \\/   /  |  | |   \\|  | 
      \\_    _/  |  |  |  | |  |  |  |      \\            /   |  | |  . \`  | 
        |  |    |  \`--'  | |  \`--'  |       \\    /\\    /    |  | |  |\\   | 
        |__|     \\______/   \\______/         \\__/  \\__/     |__| |__| \\__| 
  `);
};

const endGameMessage = () => {
  console.clear();
  return console.log(`
    .___________. __    __       ___      .__   __.  __  ___    ____    ____  ______    __    __              
    |           ||  |  |  |     /   \\     |  \\ |  | |  |/  /    \\   \\  /   / /  __  \\  |  |  |  |             
    \\---|  |----\\|  |__|  |    /  ^  \\    |   \\|  | |  '  /      \\   \\/   / |  |  |  | |  |  |  |             
        |  |     |   __   |   /  /_\\  \\   |  . \`  | |    <        \\_    _/  |  |  |  | |  |  |  |             
        |  |     |  |  |  |  /  _____  \\  |  |\\   | |  .  \\         |  |    |  \`--'  | |  \`--'  |             
        |__|     |__|  |__| /__/     \\__\\ |__| \\__| |__|\\__\\        |__|     \\______/   \\______/              
                                                                                                             
    _______   ______   .______         .______    __          ___   ____    ____  __  .__   __.   _______    
   |   ____| /  __  \\  |   _  \\        |   _  \\  |  |        /   \\  \\   \\  /   / |  | |  \\ |  |  /  _____|   
   |  |__   |  |  |  | |  |_)  |       |  |_)  | |  |       /  ^  \\  \\   \\/   /  |  | |   \\|  | |  |  __     
   |   __|  |  |  |  | |      /        |   ___/  |  |      /  /_\\  \\  \\_    _/   |  | |  . \`  | |  | |_ |    
   |  |     |  \`--'  | |  |\\  \\----.   |  |      |  \`----./  _____  \\   |  |     |  | |  |\\   | |  |__| |    
   |__|      \\______/  | _| \`._____|   | _|      |_______/__/     \\__\\  |__|     |__| |__| \\__|  \\______|    
                                                                                                             
   `);
};

const welcomeMessage = () => {
  return console.log(`
____    __    ____  _______  __        ______   ______   .___  ___.  _______    .___________.  ______   
\\   \\  /  \\  /   / |   ____||  |      /      | /  __  \\  |   \\/   | |   ____|   |           | /  __  \\  
 \\   \\/    \\/   /  |  |__   |  |     |  ,----'|  |  |  | |  \\  /  | |  |__      \`---|  |----\`|  |  |  | 
  \\            /   |   __|  |  |     |  |     |  |  |  | |  |\\/|  | |   __|         |  |     |  |  |  | 
   \\    /\\    /    |  |____ |  \`----.|  \`----.|  \`--'  | |  |  |  | |  |____        |  |     |  \`--'  | 
    \\__/  \\__/     |_______||_______| \\______| \\______/  |__|  |__| |_______|       |__|      \\______/  
                                                                                                        
.______        ___   .___________.___________. __       _______     _______. __    __   __  .______     
|   _  \\      /   \\  |           |           ||  |     |   ____|   /       ||  |  |  | |  | |   _  \\    
|  |_)  |    /  ^  \\ \`---|  |----\`---|  |----\`|  |     |  |__     |   (----\`|  |__|  | |  | |  |_)  |   
|   _  <    /  /_\\  \\    |  |        |  |     |  |     |   __|     \\   \\    |   __   | |  | |   ___/    
|  |_)  |  /  _____  \\   |  |        |  |     |  \`----.|  |____.----)   |   |  |  |  | |  | |  |        
|______/  /__/     \\__\\  |__|        |__|     |_______||_______|_______/    |__|  |__| |__| | _|        
                                                                                                        
  `);
};

const noThanks = () => {
  console.clear();
  return console.log("Have a nice Day =)");
};

module.exports = {
  gameInfoSetup,
  initValidPoints,
  getPlayerGuess,
  isDuplicate,
  handleGuess,
  handleGuessResult,
  winnerMessage,
  endGameMessage,
  welcomeMessage,
  noThanks,
};
