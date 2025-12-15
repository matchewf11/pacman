async function downloadAssets(assetPaths) {
  const cache = {};

  const promises = assetPaths.map((path) => {
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

async function main() {
  const { cache, failed } = await downloadAssets([
    "./assets/pacman.png",
    "./assets/foo.png",
  ]);
  console.log(cache);
  console.log(failed);
}

main();
