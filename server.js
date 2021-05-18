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
// now io_server is the Server instance of socketio

const path = require('path');
app.use(express.static(path.join(__dirname, '/pub')))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/index.html'))
})

app.get('/debug', (req, res) => {
    // res.send(JSON.stringify(rooms.map( r => r.id)))
    res.send(JSON.stringify(rooms))
})

io_server.on('connection', (socket) => {
    sockets.push(socket)
    console.log('> New Connection from ' + socket.id);
    console.log('> Handshake params:')
    // io_server.emit("server-ack", "hello, new client!")
    console.log(socket.handshake.query)

    if(socket.handshake.query.type == "extension") {
        let extension_socket = socket;
        console.log("> received connection from extension")
        console.log("> extension socket id is: " + extension_socket.id)
        console.log("> creating room " + extension_socket.id)
        extension_socket.emit("server-ack", "hello, new extension!")
        const room_id = extension_socket.id.slice(0,4)

        // use extension id for debug messages
        const extension_id = room_id

        console.log(">>>> ROOM ID: " + room_id)
        rooms.push(room_id)
        // force it to join this room
        extension_socket.join(room_id)
        console.log(`> This extension socket is in rooms ${Array.from(extension_socket.rooms)}`)

        extension_socket.on("extension:msg", (msg) => {
            console.log(`> [extension:edits] ${extension_id} -> "${room_id}": "${msg}"`);
            extension_socket.to(room_id).emit("extension:msg", msg)
        })

        extension_socket.on("extension:edits", (content) => {
            console.log(`> [extension:edits] ${extension_id} -> "${room_id}": ${content}`);
            extension_socket.to(room_id).emit("extension:edits", content)
        })

        extension_socket.on("disconnect", (msg) => {
            // also disconnect all browsers connected to this room
            console.log(`> [extension:disconnect] now disconnecting sockets in room ${room_id}`)
            io_server.in(room_id).disconnectSockets(true)
            // remove the room from the list of rooms
            console.log(`> [extension:disconnect] now removing room ${room_id}`)
            rooms = rooms.filter( (r) => r !== room_id)
            console.log(`> [extension:disconnect] rooms are now: ${rooms}`)
        })

    } else if (socket.handshake.query.type == "browser") {

        let browser_socket = socket;
        console.log("> received connection from browser");
        console.log("> browser socket id is : " + browser_socket.id);
        console.log("> checking if any rooms match id");

        const room_id  = browser_socket.handshake.query.room;
        const browser_id = browser_socket.id.slice(0,4)

        // TODO: remove 'debug' room for production
        if (!rooms.includes(room_id) && room_id !== "debug") {
            console.log(`> No room ${room_id} found.`);
            browser_socket.emit("server-ack", "No room");
            console.log(`> Disconnecting browser socket ${browser_socket.id}.`);
            socket.disconnect()
        } else {
            console.log(`> Room ${room_id} match!`)
            browser_socket.emit("server-ack", `Room ${room_id} exists!`);
            // join the room with this room_id
            browser_socket.join(room_id)
            console.log(`> This browser socket is in rooms ${Array.from(browser_socket.rooms)}`)

            // new standard will use "browser:msg" format to refer to a browser client
            browser_socket.on("browser:msg", (msg) => {
                console.log(`> [browser:msg] ${browser_id} -> "${room_id}": "${msg}"`)
                browser_socket.to(room_id).emit("browser:msg", msg)
            })

            browser_socket.on("browser:edits", (content) => {
                console.log(`> [browser:edits] ${browser_id} -> "${room_id}": ${content}`)
                browser_socket.to(room_id).emit("browser:edits", content)
            })
        } 
    }
})

const port = process.env.PORT || 5000

http_server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });