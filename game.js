const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const cellSize = canvas.width / gridSize;

const EMPTY = 0, PLAYER1 = 1, PLAYER2 = 2;
const COLORS = ["#eee", "#4caf50", "#f44336"];

let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(EMPTY));

let players = {
  1: { x: 2, y: 2, color: PLAYER1 },
  2: { x: gridSize - 3, y: gridSize - 3, color: PLAYER2 }
};

grid[2][2] = PLAYER1;
grid[gridSize - 3][gridSize - 3] = PLAYER2;

function drawGrid() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      ctx.fillStyle = COLORS[grid[y][x]];
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function movePlayer(p, dx, dy) {
  let player = players[p];
  let newX = player.x + dx;
  let newY = player.y + dy;
  if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
    player.x = newX;
    player.y = newY;
  }
}

function claim(p) {
  let player = players[p];
  if (grid[player.y][player.x] === EMPTY) {
    grid[player.y][player.x] = p;
  }
}

document.addEventListener("keydown", (e) => {
  // Player 1 controls
  if (e.key === "w") movePlayer(1, 0, -1);
  if (e.key === "s") movePlayer(1, 0, 1);
  if (e.key === "a") movePlayer(1, -1, 0);
  if (e.key === "d") movePlayer(1, 1, 0);
  if (e.key === "e") claim(1);

  // Player 2 controls
  if (e.key === "ArrowUp") movePlayer(2, 0, -1);
  if (e.key === "ArrowDown") movePlayer(2, 0, 1);
  if (e.key === "ArrowLeft") movePlayer(2, -1, 0);
  if (e.key === "ArrowRight") movePlayer(2, 1, 0);
  if (e.key === "m") claim(2);
});

function countTerritory(p) {
  return grid.flat().filter(v => v === p).length;
}

function checkGameOver() {
  let empty = grid.flat().filter(v => v === EMPTY).length;
  if (empty === 0) {
    let score1 = countTerritory(1);
    let score2 = countTerritory(2);
    let status = document.getElementById("status");
    if (score1 > score2) status.textContent = "Gracz 1 wygrywa!";
    else if (score2 > score1) status.textContent = "Gracz 2 wygrywa!";
    else status.textContent = "Remis!";
    clearInterval(loop);
  }
}

function gameLoop() {
  drawGrid();
  checkGameOver();
}

let loop = setInterval(gameLoop, 100);
