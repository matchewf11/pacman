const Tile = {
  WALL: 0,
  FLOOR: 1,
  PELLET: 2,
  POWER: 3,
  CHERRY: 4,
};

const Dir = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

function newGameState() {
  return {
    grid: [
      [
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
      ],
      [
        Tile.WALL,
        Tile.FLOOR,
        Tile.PELLET,
        Tile.PELLET,
        Tile.PELLET,
        Tile.PELLET,
        Tile.CHERRY,
        Tile.WALL,
      ],
      [
        Tile.WALL,
        Tile.PELLET,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.PELLET,
        Tile.WALL,
      ],
      [
        Tile.WALL,
        Tile.PELLET,
        Tile.PELLET,
        Tile.POWER,
        Tile.PELLET,
        Tile.PELLET,
        Tile.PELLET,
        Tile.WALL,
      ],
      [
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
        Tile.WALL,
      ],
    ],
    pacman: { x: 1, y: 1, dir: Dir.RIGHT },
  };
}

function updateGame(gameState, input, update) {
  // if no update only update pacman direction

  const { grid, pacman } = gameState;
  const { left, right, up, down } = input;

  if (left) {
    pacman.dir = Dir.LEFT;
  } else if (right) {
    pacman.dir = Dir.RIGHT;
  } else if (up) {
    pacman.dir = Dir.UP;
  } else if (down) {
    pacman.dir = Dir.DOWN;
  }

  // do not let it move into wall
  // pick up everything else and turn it into floor
  if (update) {
    switch (pacman.dir) {
      case Dir.LEFT:
        if (grid[pacman.y][pacman.x - 1] !== Tile.WALL) {
          pacman.x -= 1;
        }
        break;
      case Dir.RIGHT:
        if (grid[pacman.y][pacman.x + 1] !== Tile.WALL) {
          pacman.x += 1;
        }
        break;
      case Dir.UP:
        if (grid[pacman.y - 1][pacman.x] !== Tile.WALL) {
          pacman.y -= 1;
        }
        break;
      case Dir.DOWN:
        if (grid[pacman.y + 1][pacman.x] !== Tile.WALL) {
          pacman.y += 1;
        }
        break;
    }
  }

  // if pacman is on a (pellet, cherry, or powerup) pick it up
  grid[pacman.y][pacman.x] = Tile.FLOOR;
}

function drawGame(gameState, ctx) {
  const { grid, pacman } = gameState;

  // draw maze
  const tileWidth = ctx.canvas.width / grid[0].length;
  const tileHeight = ctx.canvas.height / grid.length;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      switch (grid[y][x]) {
        case Tile.WALL:
          ctx.fillStyle = "navy";
          ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
          break;
        case Tile.CHERRY:
          ctx.fillStyle = "red";
          ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
          break;
        case Tile.FLOOR:
          ctx.fillStyle = "black";
          ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
          break;
        case Tile.PELLET:
          ctx.fillStyle = "yellow";
          ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
          break;
        case Tile.POWER:
          ctx.fillStyle = "green";
          ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
          break;
      }
    }
  }

  ctx.fillStyle = "yellow";
  ctx.fillRect(
    pacman.x * tileWidth,
    pacman.y * tileHeight,
    tileWidth / 2,
    tileHeight / 2,
  );
}

async function downloadAssets(paths) {
  const cache = {};

  const promises = paths.map((path) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => {
        cache[path] = img;
        resolve(path);
      });
      img.addEventListener("error", () => {
        reject(path);
      });
      img.src = path;
    });
  });

  const results = await Promise.allSettled(promises);
  const failed = results
    .filter((r) => r.status === "rejected")
    .map((r) => r.reason);

  return { cache, failed };
}

function startGame(ctx) {
  const gameState = newGameState();
  const input = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  // set up input
  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyA") input.left = true;
    if (e.code === "KeyD") input.right = true;
    if (e.code === "KeyW") input.up = true;
    if (e.code === "KeyS") input.down = true;
  });
  window.addEventListener("keyup", (e) => {
    if (e.code === "KeyA") input.left = false;
    if (e.code === "KeyD") input.right = false;
    if (e.code === "KeyW") input.up = false;
    if (e.code === "KeyS") input.down = false;
  });

  const speed = 500; // increase to slow down game
  let lastUpdate = performance.now();

  const loop = (currentTime) => {
    // update game
    if (currentTime - lastUpdate >= speed) {
      updateGame(gameState, input, true);
      lastUpdate = currentTime;
    } else {
      updateGame(gameState, input, false);
    }

    // draw game
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawGame(gameState, ctx);

    // loop
    requestAnimationFrame(loop);
  };

  // start the game
  requestAnimationFrame(loop);
}

async function main() {
  const { cache, failed } = await downloadAssets(["./assets/pacman.png"]);
  const ctx = document.getElementById("gameWorld").getContext("2d");
  startGame(ctx);
}

main();
