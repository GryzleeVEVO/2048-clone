/**
 * @file Implementation of a 2048 clone
 * @author Dorian Wozniak <dorian.wozniak@gmail.com>
 *
 * This project implements a clone of the popular game 2048. The game consists
 * of a board with empty and numbered tiles. The player must match numbers of
 * the same value to add them up to 2048.
 *
 * The original game was created by Gabriele Cirulli, with itself being inspired
 * by other similar games. You can play the original at https://play2048.co/.
 */

"use strict";

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

const backgroundColor = "#bdac97";
const textColor = "#756452";
const textColorAlt = "#ffffff";

let game_container_tile = document.querySelectorAll(".game-tile");
let score_sum = document.querySelector("#score-sum");
let restart_button = document.querySelector("#restart-button");
let win_loss_msg = document.querySelector(".win-loss-msg");

/**
 * @param {number} min
 * @param {number} max
 * @returns {number} Integer between [min, max)
 */
function getRandomInt(min, max) {
  // Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

const GameState = {
  Playing: "Playing",
  Win: "Win",
  Loss: "Loss",
};

class Game {
  size = 4;
  numTiles = this.size * this.size;
  score = 0;

  #state = GameState.Playing;

  get state() {
    return this.#state;
  }

  // Chance for spawning a 4 instead of a 2. As in "1 out of x"
  #chanceForFour = 10;

  /**
   * Encoded directions for update function
   */
  #dir = {
    ArrowUp: {
      x_start: 0,
      y_start: 0,
      x_step: 1,
      y_step: 0,
    },
    ArrowDown: {
      x_start: this.size - 1,
      y_start: 0,
      x_step: -1,
      y_step: 0,
    },
    ArrowLeft: {
      x_start: 0,
      y_start: 0,
      x_step: 0,
      y_step: 1,
    },
    ArrowRight: {
      x_start: 0,
      y_start: this.size - 1,
      x_step: 0,
      y_step: -1,
    },
  };

  /** @type {number[][]} */
  data = Array.from({ length: this.size }, () => new Array(this.size).fill(0));

  constructor() {
    this.#setRandomTile();
    this.#setRandomTile();
  }

  /**
   * Update state of board after a move
   * @param {string} key
   */
  update(key) {
    if (this.#state !== GameState.Playing) return;

    if (!this.#isWin() && this.#isLoss()) {
      this.#state = GameState.Loss;
      return;
    }

    // @ts-ignore
    const { x_start, y_start, x_step, y_step } = this.#dir[key];
    let moved = false;

    // Avoid double mergers
    let merged = Array.from({ length: this.size }, () =>
      new Array(this.size).fill(false)
    );

    for (let i = x_start; 0 <= i && i < this.size; i += x_step || 1) {
      for (let j = y_start; 0 <= j && j < this.size; j += y_step || 1) {
        if (this.data[i][j] === 0) continue;

        let current = { x: i, y: j };
        let next = { x: i - x_step, y: j - y_step };

        while (
          0 <= next.x &&
          next.x < this.size &&
          0 <= next.y &&
          next.y < this.size
        ) {
          // Move to next empty space
          if (this.data[next.x][next.y] === 0) {
            this.data[next.x][next.y] = this.data[current.x][current.y];
            this.data[current.x][current.y] = 0;
            moved = true;
          }

          // Merge if possible
          if (
            !merged[current.x][current.y] &&
            !merged[next.x][next.y] &&
            this.data[next.x][next.y] === this.data[current.x][current.y]
          ) {
            this.score +=
              this.data[next.x][next.y] + this.data[current.x][current.y];
            this.data[next.x][next.y] += this.data[current.x][current.y];
            this.data[current.x][current.y] = 0;
            merged[next.x][next.y] = true;
            moved = true;
            break;
          }

          current = { ...next };
          next.x -= x_step;
          next.y -= y_step;
        }
      }
    }

    if (this.#isWin()) {
      this.#state = GameState.Win;
      return;
    }

    if (moved && this.#isEmptyTileAvailable()) this.#setRandomTile();
  }

  /**
   * Select a random empty tile and set its value to 2 or 4. There must be at
   * least one empty tile available
   */
  #setRandomTile() {
    let i = 0;
    let j = 0;

    do {
      i = getRandomInt(0, this.size);
      j = getRandomInt(0, this.size);
    } while (this.data[i][j] !== 0);

    this.data[i][j] = getRandomInt(0, this.#chanceForFour) === 0 ? 4 : 2;
  }

  /**
   * Check if 2048 is reached
   * @returns {boolean}
   */
  #isWin() {
    return this.data.find((row) => row.includes(2048)) !== undefined;
  }

  /**
   * Check if no more moves are available
   * @returns {boolean}
   */
  #isLoss() {
    return !this.#isEmptyTileAvailable() && !this.#areAddMovesAvailable();
  }

  /**
   * Check if there is an empty tile in the board
   * @returns {boolean}
   */
  #isEmptyTileAvailable() {
    return this.data.find((row) => row.includes(0)) !== undefined;
  }

  /**
   * Check if there are tiles that can be added up in any of the four directions
   * @returns {boolean}
   */
  #areAddMovesAvailable() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (
          (i - 1 >= 0 && this.data[i - 1][j] === this.data[i][j]) ||
          (i + 1 < this.size && this.data[i + 1][j] === this.data[i][j]) ||
          (j - 1 >= 0 && this.data[i][j - 1] === this.data[i][j]) ||
          (j + 1 < this.size && this.data[i][j + 1] === this.data[i][j])
        )
          return true;
      }
    }
    return false;
  }
}

/**
 * Update the view of the page
 * @param {Game} game
 */
function updateBoardView(game) {
  for (let i = 0; i < game.size; i++) {
    for (let j = 0; j < game.size; j++) {
      let tile = game_container_tile[j + game.size * i];
      let content = game.data[i][j] === 0 ? "" : game.data[i][j].toString();

      // Update inner text
      tile.innerHTML = content;

      // Update color
      // @ts-ignore
      tile.style.backgroundColor =
        content && palette.has(content)
          ? palette.get(content)
          : backgroundColor;

      // @ts-ignore
      tile.style.color =
        content && (content == "2" || content == "4")
          ? textColor
          : textColorAlt;
    }
  }

  score_sum.innerHTML = game.score.toString();

  switch (game.state) {
    case GameState.Win:
      win_loss_msg.innerHTML = "You won!!!";
      break;
    case GameState.Loss:
      win_loss_msg.innerHTML = "You lost :(((";
      break;
    case GameState.Playing:
    default:
      win_loss_msg.innerHTML = "";
      break;
  }
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      e.preventDefault();
      game.update(e.key);
      break;
    case "r":
      e.preventDefault();
      game = new Game();
      break;
    default:
      return;
  }

  updateBoardView(game);
});

restart_button.addEventListener("click", (_) => {
  game = new Game();
  updateBoardView(game);
});

document.addEventListener("DOMContentLoaded", (_) => {
  updateBoardView(game);
});

let game = new Game();
