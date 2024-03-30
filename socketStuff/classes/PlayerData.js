//This where player data is that other players need to about that.

class PlayerData {
  constructor(playerName, settings) {
    this.name = playerName,
    this.color = this.getRandomColor();
    this.locX = Math.floor(settings.worldWidth * Math.random() + 10);
    this.locY = Math.floor(settings.worldHeight * Math.random() + 10);
    this.radius = settings.defSize;
    this.score = 0;
    this.playersAbsorbed = 0;
    this.orbsAbsorbed = 0;
  }

  getRandomColor() {
    const r = Math.floor((Math.random() * 200) + 50);
    const g = Math.floor((Math.random() * 200) + 50);
    const b = Math.floor((Math.random() * 200) + 50);
    return `rgb(${r}, ${g}, ${b})`
  }
}

module.exports = PlayerData;