// Colors have been ripped from the classic version of 2048's CSS style
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

// class Board {}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function getRandomInt(min, max) {
  // Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

/**
 * @param {number} size
 */
function pickAndSetRandomCell(size) {
  let tiles = document.querySelectorAll(".game-tile");
  let tile;

  do {
    tile = tiles[getRandomInt(0, size)];
  } while (tile.innerHTML);

  // TODO: Chance as parameter
  tile.innerHTML = getRandomInt(0, 15) === 0 ? "4" : "2";
}

function colorTiles() {
  // TODO: Maybe use CSS classes for switching styles
  for (let tile of document.querySelectorAll(".game-tile")) {
    let tileNumber = tile.innerHTML;

    tile.style.backgroundColor =
      tileNumber && palette.has(tileNumber)
        ? palette.get(tileNumber)
        : "#bdac97";
    tile.style.color =
      tileNumber && (tileNumber == "2" || tileNumber == "4")
        ? "#756452"
        : "#ffffff";
  }
}

/**
 * @param {string} key
 */
function update(key) {
  let tiles = document.querySelectorAll(".game-tile");
  const size = 4;

  // TODO: Let's just do one direction and with no adding
  // For now, down-to-up
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let tile = tiles[j + size * i];

      // Nothing to do for first row/column
      if (i === 0) continue;

      // Nothing to do if empty
      if (!tile.innerHTML) continue;

      // Find first empty square
      let next_i = i;
      let next_j = j;

      for (i2 = i - 1; i2 >= 0; i2--) {
        if (tiles[j + size * i2].innerHTML) break;
        next_i = i2;
      }

      // Check if next square has a number
      if (next_i - 1 >= 0) {
        let nextTile = tiles[j + size * (next_i - 1)];

        if (nextTile.innerHTML && nextTile.innerHTML == tile.innerHTML) {
          let total = (
            parseInt(nextTile.innerHTML) + parseInt(tile.innerHTML)
          ).toString();

          nextTile.innerHTML = total;
          tile.innerHTML = "";
          continue;
        }
      }

      // Don´t move if not necessary
      if (next_i === i && next_j === j) continue;

      // Else, just swap the squares
      let empty = tiles[next_j + size * next_i];
      empty.innerHTML = tile.innerHTML;
      tile.innerHTML = "";
    }
  }

  // Color tiles accordingly
  colorTiles();
}

/**
 * @param {KeyboardEvent} e
 */
function keyDownHandler(e) {
  switch (e.key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      e.preventDefault();
      break;
    default:
      return;
  }

  update(e.key);
}

function init() {
  window.addEventListener("keydown", keyDownHandler);

  pickAndSetRandomCell(16);
  pickAndSetRandomCell(16);
  colorTiles();
}

init();
