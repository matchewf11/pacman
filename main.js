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

function startGame(ctx, entities) {
  let left = false;
  let right = false;
  let up = false;
  let down = false;

  let keyboardActive = false;

  let gamepad = null;
  let mouse = null;
  let wheel = null;
  let click = null;

  const mousemove = (e) => {
    mouse = getXandY(e);
  };

  const leftclick = (e) => {
    click = getXandY(e);
  };

  const keydown = (e) => {
    keyboardActive = true;
    switch (e.code) {
      case "KeyA":
        left = true;
        break;
      case "KeyD":
        right = true;
        break;
      case "KeyW":
        up = true;
        break;
      case "KeyS":
        down = true;
        break;
    }
  };

  const keyup = (e) => {
    keyboardActive = false;
    switch (e.code) {
      case "KeyA":
        left = false;
        break;
      case "KeyD":
        right = false;
        break;
      case "KeyW":
        up = false;
        break;
      case "KeyS":
        down = false;
        break;
    }
  };

  const getXandY = (e) => {
    const x = e.clientX - ctx.canvas.getBoundingClientRect().left;
    const y = e.clientY - ctx.canvas.getBoundingClientRect().top;
    return { x: x, y: y, radius: 0 };
  };

  ctx.canvas.addEventListener("mousemove", mousemove, false);
  ctx.canvas.addEventListener("click", leftclick, false);
  ctx.canvas.addEventListener("keydown", keydown, false);
  ctx.canvas.addEventListener("keyup", keyup, false);

  const gameLoop = () => {
    // update
    gamepad = navigator.getGamepads()[0];
    if (gamepad != null && !keyboardActive) {
      left = gamepad.buttons[14].pressed || gamepad.axes[0] < -0.3;
      right = gamepad.buttons[15].pressed || gamepad.axes[0] > 0.3;
      up = gamepad.buttons[12].pressed || gamepad.axes[1] < -0.3;
      down = gamepad.buttons[13].pressed || gamepad.axes[1] > 0.3;
    }
    entities.filter((e) => !e.removeFromWorld).forEach((e) => e.update());
    entities = entities.filter((e) => !e.removeFromWorld);
    wheel = 0;

    // draw
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    entities.forEach((e) => e.draw(ctx));
    click = null;

    requestAnimationFrame(gameLoop, ctx.canvas);
  };

  gameLoop();
}

async function main() {
  const { cache, failed } = await downloadAssets([
    "./assets/pacman.png",
    "./assets/foo.png",
  ]);

  console.log(cache);
  console.log(failed);

  startGame(document.getElementById("gameWorld").getContext("2d"), []);
}

main();
