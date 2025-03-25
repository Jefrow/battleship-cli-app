const randomStartCoordinates = (size) => {
  let x = Math.floor(Math.random() * size);
  let y = Math.floor(Math.random() * size);
  let direction = Math.random() < 0.5 ? "horizontal" : "vertical";

  return { x, y, direction };
};

const getShipCoordinates = (id, length, { boardSize, gameBoard }) => {
  let startingCoordinates;
  do {
    startingCoordinates = randomStartCoordinates(boardSize);
  } while (
    !isValid(
      startingCoordinates.x,
      startingCoordinates.y,
      startingCoordinates.direction,
      length,
      boardSize,
      gameBoard
    )
  );
  placeShips(
    id,
    startingCoordinates.x,
    startingCoordinates.y,
    startingCoordinates.direction,
    length,
    gameBoard
  );
};

const isValid = (x, y, direction, length, size, board) => {
  if (x < 0 || x >= size || y < 0 || y >= size) {
    console.log("out of bounds");
    return false;
  }
  for (let i = 0; i < length; i++) {
    let checkY = y + (direction === "vertical" ? i : 0);
    let checkX = x + (direction === "horizontal" ? i : 0);

    if (!board[checkY] || !board[checkY][checkX]) {
      return false;
    }
    if (board[checkY][checkX].type !== "empty") {
      return false;
    }
  }
  return true;
};

const placeShips = (id, x, y, direction, length, board) => {
  let type = length === 2 ? "small" : "large";

  for (let i = 0; i < length; i++) {
    if (direction === "horizontal") {
      board[y][x + i] = { type: type, id, hit: false };
    } else {
      board[y + i][x] = { type: type, id, hit: false };
    }
  }
};

const allShipsSunk = ({ sunkShips, numShips }) => {
  return sunkShips === numShips.length;
};

const isHit = (x, y, board) => {
  return board[y][x].type !== "empty" && !board[y][x].hit;
};

const isShipSunk = (shipId, board) => {
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
module.exports = { getShipCoordinates, allShipsSunk, isHit, isShipSunk };
