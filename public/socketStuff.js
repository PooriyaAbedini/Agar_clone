const socket = io('http://localhost:9000');

//It's called in the uiStuff in the start click listener!
async function init() {
  const initData = await socket.emitWithAck('init', {
    playerName: player.name
  });

  //Our awayit has resolved so we can start 'tocking'
  setInterval(async() => {
    socket.emit('tock', {
      xVector: player.xVector ? player.xVector : .1,
      yVector: player.yVector ? player.yVector : .1,
    })
  }, 33)

  // console.log(initData.orbs);
  orbs = initData.orbs;
  player.indexInPlayers = initData.indexInPlayers;
  draw();
}

//server sends out the players location/data 30 times per second
socket.on('tick', playersArray => {
  // console.log(playersArray);
  players = playersArray;

  if(players[player.indexInPlayers].playerData) {
    player.locX = players[player.indexInPlayers].playerData.locX;
    player.locY = players[player.indexInPlayers].playerData.locY;
  }
});

socket.on('orbSwitch', orbData => {
  //The server just told us that an orb has absorbed, update the orbs array;
  orbs.splice(orbData.capturedOrbI, 1, orbData.newOrb)
});

socket.on('playerAbsorbed', absorbData => {
  document.querySelector('#game-message').innerHTML = `${absorbData.absorbed} was absorbed by ${absorbData.absorbedBy} `;
  document.querySelector('#game-message').style.opacity = 1;
  window.setTimeout(() => {
    document.querySelector('#game-message').style.opacity = 0;
  }, 2000)
})

socket.on('updateLeaderBoard', leaderBoardArray => {
  // console.log(leaderBoardArray);
  leaderBoardArray.sort((a,b) => {
    return b.score - a.score
  })
  document.querySelector('.leader-board').innerHTML ="";
  leaderBoardArray.forEach(p => {
    if(!p.name){
      return;
    }

    document.querySelector('.leader-board').innerHTML += `
      <li class="leaderboard-player">${p.name}: ${p.score}</li>
    `
  })
});

socket.on('playerScore', score => {
  document.querySelector('.player-score').innerHTML = score;
})
