'use strict';
console.log("Starting express server...");
console.log("Process: " + process.env.ROOT_URL)

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)

const path = require('path');
app.use(express.static(path.join(__dirname, '/pub')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/index.html'))
})

io.on('connection', (socket) => {
    console.log('[>] New Connection from ' + socket.id);
})


const port = process.env.PORT || 5000
// app.listen(port, () => {
//     console.log(`Listening on port ${port}...`)
// })

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });