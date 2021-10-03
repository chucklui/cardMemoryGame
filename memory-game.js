"use strict";
/** Memory game: find matching pairs of cards and flip both of them. */
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = true;
let points = document.createElement('h2');
let guesses = document.createElement('p');
points.innerHTML = 0;
guesses.innerHTML = 0;
const FOUND_MATCH_WAIT_MSECS = 1000;
const gameBoard = document.getElementById("game");
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];
const colors = shuffle(COLORS);
createCards(colors);
/** Shuffle array items in-place and return shuffled array. */
function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
//start button
const start = document.getElementById('start');
start.addEventListener('click', () => {
  lockBoard = false;
});
//reset button
const reset = document.getElementById('reset');
reset.addEventListener('click', () => {
  let x = document.getElementsByTagName('div');
  points.innerHTML = 0;
  guesses.innerHTML = 0;
  shuffle(COLORS);
  resetBoard();
  for (let i = 3; i < x.length; i++) {
    x[i].setAttribute('class', `${colors[i - 3]}`);
    x[i].setAttribute('style', '');
    //need to add event listerner back after the cards have been flipped
    x[i].addEventListener('click', handleCardClick);
  }
});
//generate cards and add class & click to each div
function createCards(colors) {
  gameBoard.appendChild(points);
  gameBoard.appendChild(guesses);
  for (let color of colors) {
    // missing code here ...
    let card = document.createElement('div');
    card.classList.add(`${color}`);
    card.addEventListener('click', handleCardClick);
    gameBoard.appendChild(card);
  }
}
/** Handle clicking on a card: this could be first-card or second-card. */
function handleCardClick() {
  if (this === firstCard) return;
  if (lockBoard) return;
  this.classList.add('flip');
  this.style.backgroundColor = this.classList[0];
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return
  }
  guesses.innerHTML++;
  secondCard = this;
  let isMatch = firstCard.classList[0] === secondCard.classList[0];
  isMatch ? flipCard() : unFlipCard();
}
/** Flip a card to face-up. */
function flipCard() {
  firstCard.removeEventListener('click', handleCardClick);
  secondCard.removeEventListener('click', handleCardClick);
  points.innerHTML++;
  if (points.innerHTML > 4) updateTable(points, guesses);
  if (points.innerHTML > 4) guesses.innerHTML = `You have guessed ${guesses.innerHTML} times.`;
  if (points.innerHTML > 4) points.innerHTML = 'You finish the game!';
  resetBoard();
}
/** Flip a card to face-down. */
function unFlipCard() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    firstCard.style.backgroundColor = '';
    secondCard.style.backgroundColor = '';
    resetBoard();
  }, 1000);
}
function resetBoard() {
  firstCard = null;
  secondCard = null;
  hasFlippedCard = false;
  lockBoard = false;
}
function updateTable(pt, gus) {
  const tableBody = document.getElementById('rankData');
  let newRow = tableBody.insertRow(-1);
  for (let i = 0; i < 2; i++) {
    let newCell = newRow.insertCell(i);
    if (i === 1) {
      let newText = document.createTextNode(`${pt.innerHTML}`);
      newCell.appendChild(newText);
    }else {
    let newText = document.createTextNode(`${gus.innerHTML}`);
    newCell.appendChild(newText);
    }
  }
}