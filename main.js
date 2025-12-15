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
  const surfaceWidth = ctx.canvas.width;
  const surfaceHeight = ctx.canvas.height;

  const left = false;
  const right = false;
  const up = false;
  const down = false;
  const A = false;
  const B = false;

  const gamepad = null;
  const mouse = null;
  const keyboardActive = false;
  const wheel = null;

  const mousemove = null;
  const leftclick = null;
  const wheelscroll = null;
  const keydown = null;
  const keyup = null;
  const click = null;
  const camera = null;

  startInput();

  const start = () => {
    const gameLoop = () => {
      loop();
      requestAnimationFrame(gameLoop, ctx.canvas);
    };
    gameLoop();
  };

  const startInput = () => {
    const getXandY = (e) => {
      const x = e.clientX - ctx.canvas.getBoundingClientRect().left;
      const y = e.clientY - ctx.canvas.getBoundingClientRect().top;
      return { x: x, y: y, radius: 0 };
    };

    const mouseListener = (e) => {
      mouse = getXandY(e);
    };

    const mouseClickListener = (e) => {
      click = getXandY(e);
    };

    const wheelListener = (e) => {
      e.preventDefault(); // no scrolling
      wheel = e.deltaY;
    };

    const keydownListener = (e) => {
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

    const keyUpListener = (e) => {
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

    mousemove = mouseListener;
    leftclick = mouseClickListener;
    wheelscroll = wheelListener;
    keydown = keydownListener;
    keyup = keyUpListener;

    ctx.canvas.addEventListener("mousemove", mousemove, false);
    ctx.canvas.addEventListener("click", leftclick, false);
    ctx.canvas.addEventListener("wheel", wheelscroll, false);
    ctx.canvas.addEventListener("keydown", keydown, false);
    ctx.canvas.addEventListener("keyup", keyup, false);
  };

  const disableInput = () => {
    ctx.canvas.removeEventListener("mousemove", mousemove);
    ctx.canvas.removeEventListener("click", leftclick);
    ctx.canvas.removeEventListener("wheel", wheelscroll);
    ctx.canvas.removeEventListener("keyup", keyup);
    ctx.canvas.removeEventListener("keydown", keydown);
    left = false;
    right = false;
    up = false;
    down = false;
    A = false;
    B = false;
  };

  const draw = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    entities.forEach((e) => e.draw(ctx));
    camera.draw(ctx);
  };

  const gamepadUpdate = () => {
    gamepad = navigator.getGamepads()[0];
    if (gamepad != null && !keyboardActive) {
      A = gamepad.buttons[0].pressed;
      B = gamepad.buttons[1].pressed;
      left = gamepad.buttons[14].pressed || gamepad.axes[0] < -0.3;
      right = gamepad.buttons[15].pressed || gamepad.axes[0] > 0.3;
      up = gamepad.buttons[12].pressed || gamepad.axes[1] < -0.3;
      down = gamepad.buttons[13].pressed || gamepad.axes[1] > 0.3;
    }
  };

  const update = () => {
    gamepadUpdate();
    entities.filter((e) => !e.removeFromWorld).forEach((e) => e.update());
    camera.update();
    entities = entities.filter((e) => !e.removeFromWorld);
    wheel = 0;
  };

  const loop = () => {
    update();
    draw();
    click = null;
  };
}

async function main() {
  const { cache, failed } = await downloadAssets([
    "./assets/pacman.png",
    "./assets/foo.png",
  ]);

  console.log(cache);
  console.log(failed);

  startGame();
}

main();
