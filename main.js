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

const PacmanMode = {
  Middle1: 0,
  Open: 1,
  Middle2: 2,
  Closed: 3,
};

function updatePacmanMode(pacman) {
  switch (pacman.mode) {
    case PacmanMode.Middle1:
      pacman.mode = PacmanMode.Open;
      break;
    case PacmanMode.Open:
      pacman.mode = PacmanMode.Middle2;
      break;
    case PacmanMode.Middle2:
      pacman.mode = PacmanMode.Closed;
      break;
    case PacmanMode.Closed:
      pacman.mode = PacmanMode.Middle1;
      break;
  }
}

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
    pacman: { x: 1, y: 1, dir: Dir.RIGHT, mode: PacmanMode.Closed },
  };
}

function updateGame(gameState, input, update) {
  const { grid, pacman } = gameState;
  const { left, right, up, down } = input;

  const pacmanNewLocations = {
    [Dir.LEFT]: { x: pacman.x - 1, y: pacman.y },
    [Dir.RIGHT]: { x: pacman.x + 1, y: pacman.y },
    [Dir.UP]: { x: pacman.x, y: pacman.y - 1 },
    [Dir.DOWN]: { x: pacman.x, y: pacman.y + 1 },
  };

  const leftTile = grid[pacman.y][pacman.x - 1];
  const rightTile = grid[pacman.y][pacman.x + 1];
  const upTile = grid[pacman.y - 1][pacman.x];
  const downTile = grid[pacman.y + 1][pacman.x];

  const isHallway =
    (leftTile === Tile.WALL &&
      rightTile === Tile.WALL &&
      upTile !== Tile.WALL &&
      downTile !== Tile.WALL) ||
    (upTile === Tile.WALL &&
      downTile === Tile.WALL &&
      leftTile !== Tile.WALL &&
      rightTile !== Tile.WALL);

  if (isHallway) {
    // only allow 180's
    if (left && pacman.dir === Dir.RIGHT) {
      pacman.dir = Dir.LEFT;
    } else if (right && pacman.dir === Dir.LEFT) {
      pacman.dir = Dir.RIGHT;
    } else if (up && pacman.dir === Dir.DOWN) {
      pacman.dir = Dir.UP;
    } else if (down && pacman.dir === Dir.UP) {
      pacman.dir = Dir.DOWN;
    }
  } else {
    // allow valid directions only (not a wall)
    if (left && leftTile !== Tile.WALL) {
      pacman.dir = Dir.LEFT;
    } else if (right && rightTile !== Tile.WALL) {
      pacman.dir = Dir.RIGHT;
    } else if (up && upTile !== Tile.WALL) {
      pacman.dir = Dir.UP;
    } else if (down && downTile !== Tile.WALL) {
      pacman.dir = Dir.DOWN;
    }
  }

  // do not let it move into wall
  // pick up everything else and turn it into floor
  if (update) {
    const { x, y } = pacmanNewLocations[pacman.dir];
    if (grid[y][x] !== Tile.WALL) {
      updatePacmanMode(pacman);
      pacman.x = x;
      pacman.y = y;
      grid[pacman.y][pacman.x] = Tile.FLOOR;
    }
  }
}

function drawGame(gameState, ctx, cache) {
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

  const drawPacman = (mode) => {
    const dx = pacman.x * tileWidth;
    const dy = pacman.y * tileHeight;
    let sx = 0;
    let sy = 0;
    let sw = 0;
    let sh = 0;
    switch (mode) {
      case PacmanMode.Closed:
        sx = 12;
        sy = 3;
        sw = 63;
        sh = 63;
        break;
      case PacmanMode.Middle1:
      case PacmanMode.Middle2:
        sx = 85;
        sy = 3;
        sw = 60;
        sh = 62;
        break;
      case PacmanMode.Open:
        sx = 144;
        sy = 3;
        sw = 60;
        sh = 63;
        break;
    }
    ctx.drawImage(
      cache["./assets/pacman.png"],
      sx,
      sy,
      sw,
      sh,
      dx,
      dy,
      tileWidth,
      tileHeight,
    );
  };

  drawPacman(pacman.mode);
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

function startGame(ctx, cache) {
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

  const speed = 200; // increase to slow down game
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
    drawGame(gameState, ctx, cache);

    // loop
    requestAnimationFrame(loop);
  };

  // start the game
  requestAnimationFrame(loop);
}

async function main() {
  const { cache, failed } = await downloadAssets(["./assets/pacman.png"]);
  failed.forEach((p) => console.log("Could not load: " + p));
  const ctx = document.getElementById("gameWorld").getContext("2d");
  startGame(ctx, cache);
}

main();

// fill, stroke (for filling vs outlining)
//
// rect
// ctx.fillStyle = "White";
// ctx.strokeStyle = "White";
// ctx.fillRect();
// ctx.beginPath();
//
// circle
// ctx.arc();
// ctx.stroke();
//
// line
// ctx.beingPath();
//ctx.moveTo();
//ctx.lineTo();
//ctx.stroke();
//
// image
// ctx.drawImage()
//
// translation -> move it over
// reflection -> flop it
// rotation -> rotate on axis
//
// <https://sounddino.com/en/effects/pac-man/>
//
// function drawFlippedImage(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
//   ctx.save();
//
//   // move origin to the right edge of the image
//   ctx.translate(dx + dw, dy);
//
//   // flip horizontally
//   ctx.scale(-1, 1);
//
//   // draw at (0, 0) because we translated
//   ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
//
//   ctx.restore();
// }
