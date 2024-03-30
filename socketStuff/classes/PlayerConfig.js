//This is where the player data is that no other player needs to know about this player

class PlayerConfig {
  constructor(settings) {
    this.xVector = 0;
    this.yVector = 0;
    this.speed = settings.defSpeed;
    this.zoom = settings.defZoom;
  }
}

module.exports = PlayerConfig;

