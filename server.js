const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8000;
const colors = require('colors');
const socketio = require('socket.io');

const app = express();
app.use(express.static(__dirname + '/public'));


const expressServer = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`.cyan)
})

const io = socketio(expressServer);

//The server.js file is not our entery point
//it's just for creating and exporting servers

module.exports = {
  app,
  io
}
