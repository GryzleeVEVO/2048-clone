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

const size = 4;

// REVIEW : Move the actual game logic to a separate file?
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
 * @param {Element} orig
 * @param {Element} dest
 */
function swapTiles(orig, dest) {
  dest.innerHTML = orig.innerHTML;
  orig.innerHTML = "";
}

/**
 * @param {Element} orig
 * @param {Element} dest
 */
function addTiles(orig, dest) {
  let total = (parseInt(dest.innerHTML) + parseInt(orig.innerHTML)).toString();
  dest.innerHTML = total;
  orig.innerHTML = "";
}

function upCheck() {
  let tiles = document.querySelectorAll(".game-tile");

  for (let i = 1; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let tile = tiles[j + size * i];
      if (!tile.innerHTML) continue; // Square is empty

      // Find first empty square
      let next_i = i;
      let next_j = j;

      for (let i2 = i - 1; i2 >= 0; i2--) {
        if (tiles[j + size * i2].innerHTML) break;
        next_i = i2;
      }

      // Check if next square has a number
      if (next_i - 1 >= 0) {
        let nextTile = tiles[next_j + size * (next_i - 1)];

        // If equal, add them up
        if (nextTile.innerHTML === tile.innerHTML) {
          addTiles(tile, nextTile);
          continue;
        }
      }

      // Don´t move if not necessary
      if (next_i === i && next_j === j) continue;

      swapTiles(tile, tiles[next_j + size * next_i]);
    }
  }
}

function downCheck() {
  let tiles = document.querySelectorAll(".game-tile");

  for (let i = 2; i >= 0; i--) {
    for (let j = 3; j >= 0; j--) {
      let tile = tiles[j + size * i];
      if (!tile.innerHTML) continue; // Square is empty

      // Find first empty square
      let next_i = i;
      let next_j = j;

      for (let i2 = i + 1; i2 < size; i2++) {
        if (tiles[j + size * i2].innerHTML) break;
        next_i = i2;
      }

      // Check if next square has a number
      if (next_i + 1 < size) {
        let nextTile = tiles[next_j + size * (next_i + 1)];

        // If equal, add them up
        if (nextTile.innerHTML === tile.innerHTML) {
          addTiles(tile, nextTile);
          continue;
        }
      }

      // Don´t move if not necessary
      if (next_i === i && next_j === j) continue;

      swapTiles(tile, tiles[next_j + size * next_i]);
    }
  }
}

function leftCheck() {
  let tiles = document.querySelectorAll(".game-tile");

  for (let j = 1; j < size; j++) {
    for (let i = 0; i < size; i++) {
      let tile = tiles[j + size * i];
      if (!tile.innerHTML) continue; // Square is empty

      // Find first empty square
      let next_i = i;
      let next_j = j;

      for (let j2 = j - 1; j2 >= 0; j2--) {
        if (tiles[j2 + size * i].innerHTML) break;
        next_j = j2;
      }

      // Check if next square has a number
      if (next_j - 1 >= 0) {
        let nextTile = tiles[next_j - 1 + size * next_i];

        // If equal, add them up
        if (nextTile.innerHTML === tile.innerHTML) {
          addTiles(tile, nextTile);
          continue;
        }
      }

      // Don´t move if not necessary
      if (next_i === i && next_j === j) continue;

      swapTiles(tile, tiles[next_j + size * next_i]);
    }
  }
}

function rightCheck() {
  let tiles = document.querySelectorAll(".game-tile");

  for (let j = 2; j >= 0; j--) {
    for (let i = 3; i >= 0; i--) {
      let tile = tiles[j + size * i];
      if (!tile.innerHTML) continue; // Square is empty

      // Find first empty square
      let next_i = i;
      let next_j = j;

      for (let j2 = j + 1; j2 < size; j2++) {
        if (tiles[j2 + size * i].innerHTML) break;
        next_j = j2;
      }

      // Check if next square has a number
      if (next_j + 1 < size) {
        let nextTile = tiles[next_j + 1 + size * next_i];

        // If equal, add them up
        if (nextTile.innerHTML === tile.innerHTML) {
          addTiles(tile, nextTile);
          continue;
        }
      }

      // Don´t move if not necessary
      if (next_i === i && next_j === j) continue;

      swapTiles(tile, tiles[next_j + size * next_i]);
    }
  }
}

/**
 * @param {string} key
 */
function update(key) {
  // TODO: Now, make it work in all directions
  // Each direction must be somewhat handled separately, since processing which
  // tiles go where must be done in reverse direction
  switch (key) {
    case "ArrowUp":
      upCheck();
      break;
    case "ArrowDown":
      downCheck();
      break;
    case "ArrowLeft":
      leftCheck();
      break;
    case "ArrowRight":
      rightCheck();
      break;
  }

  // Generate new tile
  pickAndSetRandomCell(16);

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
