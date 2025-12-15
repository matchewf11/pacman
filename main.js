// function newGamEngine() {
//   return {
//     entities: [],
//     ctx: null,
//     surfaceWidth: null,
//     surfaceHeight: null,
//     left: false,
//     right: false,
//     down: false,
//     up: false,
//     init(ctx) {
//       this.ctx = ctx;
//       this.surfaceWidth = this.ctx.canvas.width;
//       this.surfaceHeight = this.ctx.canvas.height;
//       this.startInput();
//       this.timer = new Timer();
//     },
//     start() {
//       const gameLoop = () => {
//         this.loop();
//         requestAnimationFrame(gameLoop); // requrestAnimFrame?
//       };
//       gameLoop();
//     },
//     startInput() {},
//     addEntity(entity) {
//       this.entities.push(entity);
//     },
//     loop() {
//       this.clockTick = this.timer.tick();
//       this.update();
//       this.draw();
//       // this.click = null; // keep this?
//     },
//     update() {
//       const entitiesCount = this.entities.length;
//
//       // this.gamepadUpdate();
//
//       for (let i = 0; i < entitiesCount; i++) {
//         const entity = this.entities[i];
//         if (!entity.removeFromWorld) {
//           entity.update();
//         }
//       }
//       // this.camera.update();
//       for (let i = this.entities.length - 1; i >= 0; --i) {
//         if (this.entities[i].removeFromWorld) {
//           this.entities.splice(i, 1);
//         }
//       }
//       // this.wheel = 0;
//     },
//     draw() {
//       this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
//       for (let i = 0; i < this.entities.length; i++) {
//         this.entities[i].draw(this.ctx);
//       }
//       this.camera.draw(this.ctx);
//     },
//   };
// }

//   startInput() {
//     this.keyboardActive = false;
//     var that = this;
//
//     var getXandY = function (e) {
//       var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
//       var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
//
//       return { x: x, y: y, radius: 0 };
//     };
//     function keydownListener(e) {
//       that.keyboardActive = true;
//       switch (e.code) {
//         case "ArrowLeft":
//         case "KeyA":
//           that.left = true;
//           break;
//         case "ArrowRight":
//         case "KeyD":
//           that.right = true;
//           break;
//         case "ArrowUp":
//         case "KeyW":
//           that.up = true;
//           break;
//         case "ArrowDown":
//         case "KeyS":
//           that.down = true;
//           break;
//         case "KeyZ":
//         case "Comma":
//           that.B = true;
//           break;
//         case "KeyX":
//         case "Period":
//           that.A = true;
//           break;
//       }
//     }
//     function keyUpListener(e) {
//       that.keyboardActive = false;
//       switch (e.code) {
//         case "ArrowLeft":
//         case "KeyA":
//           that.left = false;
//           break;
//         case "ArrowRight":
//         case "KeyD":
//           that.right = false;
//           break;
//         case "ArrowUp":
//         case "KeyW":
//           that.up = false;
//           break;
//         case "ArrowDown":
//         case "KeyS":
//           that.down = false;
//           break;
//         case "KeyZ":
//         case "Comma":
//           that.B = false;
//           break;
//         case "KeyX":
//         case "Period":
//           that.A = false;
//           break;
//       }
//     }
//
//     that.mousemove = mouseListener;
//     that.leftclick = mouseClickListener;
//     that.wheelscroll = wheelListener;
//     that.keydown = keydownListener;
//     that.keyup = keyUpListener;
//
//     this.ctx.canvas.addEventListener("mousemove", that.mousemove, false);
//
//     this.ctx.canvas.addEventListener("click", that.leftclick, false);
//
//     this.ctx.canvas.addEventListener("wheel", that.wheelscroll, false);
//
//     this.ctx.canvas.addEventListener("keydown", that.keydown, false);
//
//     this.ctx.canvas.addEventListener("keyup", that.keyup, false);
//   }
//
//   disableInput() {
//     var that = this;
//     that.ctx.canvas.removeEventListener("mousemove", that.mousemove);
//     that.ctx.canvas.removeEventListener("click", that.leftclick);
//     that.ctx.canvas.removeEventListener("wheel", that.wheelscroll);
//     that.ctx.canvas.removeEventListener("keyup", that.keyup);
//     that.ctx.canvas.removeEventListener("keydown", that.keydown);
//
//     that.left = false;
//     that.right = false;
//     that.up = false;
//     that.down = false;
//     that.A = false;
//     that.B = false;
//   }
//
//   gamepadUpdate() {
//     this.gamepad = navigator.getGamepads()[0];
//     let gamepad = this.gamepad;
//     if (gamepad != null && !this.keyboardActive) {
//       this.A = gamepad.buttons[0].pressed;
//       this.B = gamepad.buttons[1].pressed;
//       this.left = gamepad.buttons[14].pressed || gamepad.axes[0] < -0.3;
//       this.right = gamepad.buttons[15].pressed || gamepad.axes[0] > 0.3;
//       this.up = gamepad.buttons[12].pressed || gamepad.axes[1] < -0.3;
//       this.down = gamepad.buttons[13].pressed || gamepad.axes[1] > 0.3;
//     }
//   }
// }

// function newAssetManager() {
//   return {
//     successCount: 0,
//     errorCount: 0,
//     cache: [],
//     downloadQueue: [],
//     queueDownload(path) {
//       console.log("Queueing " + path);
//       this.downloadQueue.push(path);
//     },
//     isDone() {
//       return this.downloadQueue.length === this.successCount + this.errorCount;
//     },
//     downloadAll(callback) {
//       for (let i = 0; i < this.downloadQueue.length; i++) {
//         const img = new Image();
//         const path = this.downloadQueue[i];
//
//         console.log(path);
//
//         img.addEventListener("load", () => {
//           console.log("Loaded " + img.src);
//           this.successCount++;
//           if (this.isDone()) {
//             callback();
//           }
//         });
//
//         img.addEventListener("error", () => {
//           console.log("Error loading" + img.src);
//           this.errorCount++;
//           if (this.isDone()) {
//             callback();
//           }
//         });
//
//         img.src = path;
//         this.cache[path] = img;
//       }
//     },
//     getAsset(path) {
//       return this.cache[path];
//     },
//   };
// }

// const gameEngine = newGamEngine();
// const assetManager = newAssetManager();

// look at main for more
// assetManager.queueDownload("./assets/pacman.png");
// assetManager.downloadAll(() => {
  // PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;
  // const canvas = document.getElementById("gameWorld");
  // const ctx = canvas.getContext("2d");
  // PARAMS.CANVAS_WIDTH = canvas.width;
  // gameEngine.init(ctx);
  // gameEngine.addEntity({}); // new SceneManager(gameEngine));
  // gameEngine.start();
// });

// function newGhost() {
//   return {
//     update() {},
//     draw() {},
//     x: 0,
//     y: 0,
//   };
// }
//
// function newPacman() {
//   return {
//     update() {},
//     draw() {},
//     x: 0,
//     y: 0,
//   };
// }
//
// function gameLoop(entities) {
//   entities.forEach((e) => e.update());
//   entities.forEach((e) => e.draw());
//   // do this again?
// }
//
// downloadAll(callback) {
// for (let i = 0; i < this.downloadQueue.length; i++) {
//     var that = this;
//
//     var path = this.downloadQueue[i];
//     console.log(path);
//     var ext = path.substring(path.length - 3);
//
//     switch (ext) {
//       case "jpg":
//       case "png":
//         var img = new Image();
//         img.addEventListener("load", function () {
//           console.log("Loaded " + this.src);
//           that.successCount++;
//           if (that.isDone()) callback();
//         });
//
//         img.addEventListener("error", function () {
//           console.log("Error loading " + this.src);
//           that.errorCount++;
//           if (that.isDone()) callback();
//         });
//
//         img.src = path;
//         this.cache[path] = img;
//         break;
//       case "wav":
//       case "mp3":
//       case "mp4":
//         var aud = new Audio();
//         aud.addEventListener("loadeddata", function () {
//           console.log("Loaded " + this.src);
//           that.successCount++;
//           if (that.isDone()) callback();
//         });
//
//         aud.addEventListener("error", function () {
//           console.log("Error loading " + this.src);
//           that.errorCount++;
//           if (that.isDone()) callback();
//         });
//
//         aud.addEventListener("ended", function () {
//           aud.pause();
//           aud.currentTime = 0;
//         });
//
//         aud.src = path;
//         aud.load();
//
//         this.cache[path] = aud;
//         break;
//     }
// }
// },
//
//
// playAsset(path) {
//   let audio = this.cache[path];
//   if (audio.currentTime != 0) {
//     let bak = audio.cloneNode();
//     bak.currentTime = 0;
//     bak.volume = audio.volume;
//     bak.play();
//   } else {
//     audio.currentTime = 0;
//     audio.play();
//   }
// },
//
// muteAudio(mute) {
//   for (let key in this.cache) {
//     let asset = this.cache[key];
//     if (asset instanceof Audio) {
//       asset.muted = mute;
//     }
//   }
// },
//
// adjustVolume(volume) {
//   for (let key in this.cache) {
//     let asset = this.cache[key];
//     if (asset instanceof Audio) {
//       asset.volume = volume;
//     }
//   }
// },
//
// pauseBackgroundMusic() {
//   for (let key in this.cache) {
//     let asset = this.cache[key];
//     if (asset instanceof Audio) {
//       asset.pause();
//       asset.currentTime = 0;
//     }
//   }
// },
//
// autoRepeat(path) {
//   var aud = this.cache[path];
//   aud.addEventListener("ended", function () {
//     aud.play();
//   });
// },
