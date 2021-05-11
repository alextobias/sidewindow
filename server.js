'use strict';
console.log("Starting express server...");
console.log("Process: " + process.env.ROOT_URL)

let rooms = []

const express = require('express');
// app is actually a function, passed to http.createServer as a callback to handle requests
const app = express();

const http = require('http');
const server = http.createServer(app);
// creates a http server using the node http server interface

const { Server: SocketIOServer } = require("socket.io"); // exposes the socketio server as Server
const server_options = {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
}
const io_server = new SocketIOServer(server)
// now io is the Server instance of socketio

const path = require('path');
app.use(express.static(path.join(__dirname, '/pub')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/index.html'))
})

io_server.on('connection', (socket) => {
    console.log('[> io] New Connection from ' + socket.id);
    console.log('[> io] Handshake params:')
    io_server.emit("server-ack", "hello, new client!")
    console.log(socket.handshake.query)
    io_server.emit("server-msg", "Sending this server-msg to ya")

    socket.on('client-msg', (msg) => {
        console.log("[> io] received client message: " + msg)
        socket.emit("server-msg", "I got your message '" + msg + "'")
    })
})

const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });