function newGameState() {
  return {};
}

function updateGame(input, gameState) {
  console.log("update state");
  // function newMaze() {
  //   const Tile = {
  //     WALL: 0,
  //     FLOOR: 1,
  //     PELLET: 2,
  //     POWER: 3,
  //     CHERRY: 4,
  //   };
  //
  //   const grid = [
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 1, 2, 2, 2, 2, 4, 0],
  //     [0, 2, 0, 0, 0, 0, 2, 0],
  //     [0, 2, 2, 3, 2, 2, 2, 0],
  //     [0, 0, 0, 0, 0, 0, 0, 0],
  //   ];
  //
  //   return {
  //     Tile,
  //     grid,
  //     draw: (ctx) => {
  //       const tileWidth = ctx.canvas.width / grid[0].length;
  //       const tileHeight = ctx.canvas.height / grid.length;
  //       for (let y = 0; y < grid.length; y++) {
  //         for (let x = 0; x < grid[y].length; x++) {
  //           switch (grid[y][x]) {
  //             case Tile.WALL:
  //               ctx.fillStyle = "navy";
  //               ctx.fillRect(
  //                 x * tileWidth,
  //                 y * tileHeight,
  //                 tileWidth,
  //                 tileHeight,
  //               );
  //               break;
  //             case Tile.CHERRY:
  //               ctx.fillStyle = "red";
  //               ctx.fillRect(
  //                 x * tileWidth,
  //                 y * tileHeight,
  //                 tileWidth,
  //                 tileHeight,
  //               );
  //               break;
  //             case Tile.FLOOR:
  //               ctx.fillStyle = "black";
  //               ctx.fillRect(
  //                 x * tileWidth,
  //                 y * tileHeight,
  //                 tileWidth,
  //                 tileHeight,
  //               );
  //               break;
  //             case Tile.PELLET:
  //               ctx.fillStyle = "yellow";
  //               ctx.fillRect(
  //                 x * tileWidth,
  //                 y * tileHeight,
  //                 tileWidth,
  //                 tileHeight,
  //               );
  //               break;
  //             case Tile.POWER:
  //               ctx.fillStyle = "green";
  //               ctx.fillRect(
  //                 x * tileWidth,
  //                 y * tileHeight,
  //                 tileWidth,
  //                 tileHeight,
  //               );
  //               break;
  //           }
  //         }
  //       }
  //     },
  //     update: (_) => {},
  //   };
  // }
}

function drawGame(gameState) {
  console.log("draw state");
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
  const input = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  const gameState = newGameState();

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

  const loop = () => {
    // update game
    updateGame(input, gameState);

    // draw game
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawGame(gameState);

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
