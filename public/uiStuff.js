//Setting window hight and width for canvas:

//canvas element needs to be in a variable
const canvas = document.querySelector('#the-canvas');

//context is the way we draw, and we draw in "2d"
const context = canvas.getContext('2d');
let wHeight = window.innerHeight;
let wWidth = window.innerWidth;
canvas.height = wHeight;
canvas.width = wWidth;

//all player stuff
const player = {};

//This is a global array for all the non-player orbs
let orbs = [];

//All players array
let players = [];

//Putting our modals in variavles so we can interact with them easier
const loginModal = new bootstrap.Modal(document.querySelector('#loginModal'));
const spawnModal = new bootstrap.Modal(document.querySelector('#spawnModal'));

//Shoing login modal on page load
window.addEventListener('load', () => {
  loginModal.show();
});

document.querySelector('.name-form').addEventListener('submit', (e) => {
  e.preventDefault();
  player.name = document.querySelector('#name-input').value;
  document.querySelector('.player-name').innerHTML = player.name;
  loginModal.hide();
  spawnModal.show();
  console.log(player);
});

document.querySelector('.start-game').addEventListener('click', (e) => {
  //Hiding spawnModal
  spawnModal.hide();
  //showing hiddenOnStart elements
  const hiddenOnStartElems = document.querySelectorAll('.hiddenOnStart'); 
  hiddenOnStartElems[0].removeAttribute('hidden');
  hiddenOnStartElems[1].removeAttribute('hidden');
  init(); //"init" is defined inside of socketStuff.js 
})