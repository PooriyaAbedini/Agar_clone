
// player.locX = Math.floor(500 * Math.random() + 10);
// player.locY = Math.floor(500 * Math.random() + 10);


//===========================
//============DRAW===========
//===========================

function draw() {

  context.setTransform(1,0,0,1,0,0);

  //Cleaning the canvas so every time this function,
  //is going to be recuse by the requestAnimationFrame,
  //we'll have a new clean frame/draw()
  context.clearRect(0,0,canvas.width, canvas.height);

  //clamp the screen/vp to the players location(x, y)
  const camX = -player.locX + canvas.width/2;
  const camY = -player.locY + canvas.height/2;
  //translate moves the canvas/context to where the player is at
  context.translate(camX, camY);

  //Drawing all the orbs
  orbs.forEach(orb => {
    context.beginPath();
    context.fillStyle = orb.color;
    context.arc(orb.locX, orb.locY, orb.radius, 0, 2 * Math.PI);
    context.fill();
  })


  
  //Drawing the arc/circle 
  //arg1 and arg2 are the center x and center y
  //arg3 is the radius
  //arg4 is starting angle and 0 is 3 oclock on the circle
  //arg5 is the ending angle and for a full circle it should be 2 * Math.PI
  players.forEach( p => {
    
    if(!p.playerData) {
      //if this data doesn't exist, it's a absorbed player and we should not draw it!!
      return
    }

    context.beginPath();
    context.fillStyle = p.playerData.color;
    context.arc(p.playerData.locX, p.playerData.locY, p.playerData.radius, 0, 2 * Math.PI);
    // context.arc(200, 200, 10, 0, 2 * Math.PI);
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = 'rgb(0, 255, 0)';
    context.stroke();
  })

  //requestAnimationFrame() is like a controled loop 
  //it runs recursively, every paint/frame, if the frame rate is 35fps,
  //then this function will be run 35 times a second.
  //so every time it runs we should change player.locY and player.locX
  //to move the circle
  requestAnimationFrame(draw);
}


canvas.addEventListener('mousemove',(event)=>{
  const mousePosition = {
      x: event.clientX,
      y: event.clientY
  };
  const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
  if(angleDeg >= 0 && angleDeg < 90){
      xVector = 1 - (angleDeg/90);
      yVector = -(angleDeg/90);
      // console.log("Mouse is in the lower right quardrant")
  }else if(angleDeg >= 90 && angleDeg <= 180){
      xVector = -(angleDeg-90)/90;
      yVector = -(1 - ((angleDeg-90)/90));
      // console.log("Mouse is in the lower left quardrant")
  }else if(angleDeg >= -180 && angleDeg < -90){
      xVector = (angleDeg+90)/90;
      yVector = (1 + ((angleDeg+90)/90));
      // console.log("Mouse is in the top left quardrant")
  }else if(angleDeg < 0 && angleDeg >= -90){
      xVector = (angleDeg+90)/90;
      yVector = (1 - ((angleDeg+90)/90));
      // console.log("Mouse is in the top right quardrant")
  }

  player.xVector = xVector ? xVector : .1;
  player.yVector = yVector ? yVector : .1;

})