//This file is for socket.io stuff;
const io = require('../server').io;
const app = require('../server').app;

const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

//=================CLASSES============
const Orb = require('./classes/Orb');
const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
//====================================


//Creating an array for created orbs;
const orbs = [];

let settings = {
  defNumOfOrbs: 1000,
  defSize: 10,
  defGenericOrbSize: 5,
  defSpeed: 9,
  defZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000
}

const players = []; //For server use only
const playersForUsers = []; // 

initGame();
let tickTockInterval;

io.on('connect', socket => {
  let player = {};
  //Somebody is going to be added to players so start tick-tocking!!
  let playersSocketId = socket.id;
  socket.on('init', (playerObj, ackCallback) => {

    if(players.length === 0) { 
      //tick-tock - issue an event to EVERY connected socket, that is playing the game, 30 times per second or every 33 millisecondes!
      tickTockInterval = setInterval(() => {
        io.to('game').emit('tick', playersForUsers);
      }, 33)  
    }
    socket.join('game');
    //Make a playerConfig object - the specific data that only this player needs to know about
    //Make a playerData object - the data that every player needs to know about this player
    //Make a player object that contains these two objects
    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(playerObj.playerName, settings);
    player = new Player (socket.id, playerConfig, playerData);
    players.push(player);
    playersForUsers.push({playerData});
    //send the orbs array as an ack function!
    ackCallback({ orbs, indexInPlayers: playersForUsers.length - 1 })
  });

  //The client sent over a tock
  socket.on('tock', (data) => {
    if(!player.playerConfig) {
      return
    }
    else {
      speed = player.playerConfig.speed;
      const xV = player.playerConfig.xVector = data.xVector;
      const yV = player.playerConfig.yVector = data.yVector;
    
      //if player can move in the x then move
      if((player.playerData.locX > 5 && xV < 0) || (player.playerData.locX < settings.worldWidth) && (xV > 0)) {
        player.playerData.locX += speed * xV;
      } 
      //if player can move in the y then move
      if ((player.playerData.locY > 5 && yV > 0) || (player.playerData.locY < settings.worldHeight) && (yV < 0)) {
        player.playerData.locY -= speed * yV;
      }  
    }

    //check for the tocking player to hit orbs:
    const capturedOrbI = checkForOrbCollisions(player.playerData,player.playerConfig, orbs, settings);
    if(capturedOrbI !== null) { //Index could be 0, so check for not null
      //remove the orb that needs to be replaced && add a new orb
      orbs.splice(capturedOrbI, 1, new Orb(settings));

      //now update the clients with the new orb:
      const orbData = {
        capturedOrbI,
        newOrb: orbs[capturedOrbI]
      }
      //emit to all sockets playing the game, the orbSwitch event and so it can update orbs ... just the new orb
      io.to('game').emit('orbSwitch', orbData);
      //emit to all sockets playing the game, the updateLeaderBoard event, beacause someone just scored!
      io.to('game').emit('updateLeaderBoard', getLeaderBoard());
      io.to(playersSocketId).emit('playerScore', player.playerData.score);
    }

    //check for the tocking player to hit orbs:
    const absorbDdata = checkForPlayerCollisions(player.playerData,player.playerConfig,players,playersForUsers,socket.id);
    if(absorbDdata) {
      io.to('game').emit('playerAbsorbed' ,absorbDdata);
      io.to('game').emit('updateLeaderBoard', getLeaderBoard());
      io.to(playersSocketId).emit('playerScore', player.playerData.score);
    }
    
  })


  socket.on('disconnect', (reason) => {

    //loop through players and find the player with THIS players socket id.
    //and splice that player out
    for(let i = 0; i < players.length; i++) {
      if(players[i].socketId == player.socketId) {
        //splice that player out
        players.splice(i, 1, {});
        playersForUsers.splice(i, 1, {});
        break;
      }
    }
    //check if the players array is empty, if so then stop ticking
    if(players.length === 0) {
      clearInterval(tickTockInterval);
    }
  })
})
//The function that creates orbs on server start
function initGame () {
  for(i = 0; i < settings.defNumOfOrbs; i++) {
    orbs.push(new Orb(settings))
  }  
}

function getLeaderBoard() {
  const leaderBoardArray = players.map(curPlayer => {
    if(curPlayer.playerData) {
      return {
        name: curPlayer.playerData.name,
        score: curPlayer.playerData.score,
      }
    }
    else {
      return {}
    }

  });
  return leaderBoardArray
}

