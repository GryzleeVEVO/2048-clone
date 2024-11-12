// Colors have been ripped from the classic version of 2048
const palette = new Map([
  ["2", "#EEE4DA"],
  ["4", "#eee1c9"],
  ["8", "#f3b27a"],
  ["16", "#f69664"],
  ["32", "#f77c5f"],
  ["64", "#f75f3b"],
  ["128", "#edd073"],
  ["256", "#edcc62"],
  ["512", "#edc950"],
  ["1024", "#edc53f"],
  ["2048", "#edc22e"],
]);

let tiles = document.querySelectorAll(".game-tile");

for (let tile of tiles) {
  let tileNumber = tile.innerHTML;
  tile.style.backgroundColor =
    tileNumber && palette.has(tileNumber) ? palette.get(tileNumber) : "#bdac97";
  tile.style.color =
    tileNumber && (tileNumber == "2" || tileNumber == "4")
      ? "#756452"
      : "#ffffff";
}
