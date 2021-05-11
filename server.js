'use strict';
console.log("Starting express server...");
console.log("Process: " + process.env.ROOT_URL)

let rooms = []
let sockets = []

const express = require('express');
// app is actually a function, passed to http.createServer as a callback to handle requests
const app = express();

const http = require('http');
const http_server = http.createServer(app);
// creates a http server using the node http server interface

const { Server: SocketIOServer } = require("socket.io"); // exposes the socketio server as Server
const socketio_server_options = {
    cors: {
        origin: true,
        methods: ["GET", "POST"]
    }
}
const io_server = new SocketIOServer(http_server, socketio_server_options)
// now io is the Server instance of socketio

const path = require('path');
app.use(express.static(path.join(__dirname, '/pub')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/index.html'))
})

app.get('/debug', (req, res) => {
    // res.send(JSON.stringify(rooms.map( r => r.id)))
    res.send(JSON.stringify(rooms.map(r => r.id)))
})

io_server.on('connection', (socket) => {

    sockets.push(socket)
    console.log('> New Connection from ' + socket.id);
    console.log('> Handshake params:')
    io_server.emit("server-ack", "hello, new client!")
    console.log(socket.handshake.query)
    io_server.emit("server-msg", "Sending this server-msg to ya")

    if(socket.handshake.query.type == "extension") {
        console.log("> received connection from extension")
        console.log("> extension socket id is: " + socket.id)
        console.log("> creating room " + socket.id)
        let room = {
            "id":socket.id,
            "extension": socket
        }
        rooms.push(room)
    } else if (socket.handshake.query.type == "browser") {
        console.log("> received connection from browser")
        console.log("> browser socket id is : " + socket.id)
        console.log("> checking if any rooms match id")
        // take this functionality out, only for testing
        let room = {
            "id": socket.id,
            "extension": socket
        }
        rooms.push(room)
    }


    socket.on('client-msg', (msg) => {
        console.log("[> io] received client message: " + msg)
        socket.emit("server-msg", "I got your message '" + msg + "'")
    })
})

const port = process.env.PORT || 5000

http_server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });